import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, Upload, User, Mail, Phone, Calendar, MapPin, Globe, FileText, Camera, Plus, CreditCard, Edit, Trash2, Building2, Hash } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PAYMENT_METHODS = [
  { value: 'crypto', label: 'Wallet TRC20' },
  { value: 'binance', label: 'Binance Pay' },
  { value: 'bank_transfer', label: 'Transferencia Bancaria' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'paypal', label: 'PayPal' }
];

const ACCOUNT_TYPES = [
  { value: 'savings', label: 'Ahorros' },
  { value: 'checking', label: 'Corriente' },
  { value: 'business', label: 'Empresarial' }
];

const ProfileSettings = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    return tabParam === 'payment' ? 'payment' : 'personal';
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    birth_date: '',
    address: '',
    country: '',
    bio: ''
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados para métodos de pago
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [methodToDelete, setMethodToDelete] = useState(null);

  // Abrir modal automáticamente si viene con action=add
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add' && searchParams.get('tab') === 'payment') {
      setShowPaymentModal(true);
      // Limpiar el parámetro action de la URL
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        birth_date: user.birth_date || '',
        address: user.address || '',
        country: user.country || '',
        bio: user.bio || ''
      });
      // Usar custom_picture si existe, sino usar la de Google
      setPreviewUrl(user.custom_picture || user.picture);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'payment') {
      fetchPaymentMethods();
    }
  }, [activeTab]);

  const fetchPaymentMethods = async () => {
    setLoadingPaymentMethods(true);
    try {
      const response = await axios.get(`${API}/user/payment-methods`, { withCredentials: true });
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Error al cargar métodos de pago');
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Solo se permiten imágenes JPG o PNG');
        return;
      }

      // Validar tamaño (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('La imagen es demasiado grande. Máximo 5MB');
        return;
      }

      setProfilePicture(file);

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPicture = async () => {
    if (!profilePicture) {
      toast.error('Selecciona una imagen primero');
      return;
    }

    setUploading(true);

    try {
      const formDataImg = new FormData();
      formDataImg.append('profile_picture', profilePicture);

      const response = await axios.post(
        `${API}/user/upload-profile-picture`,
        formDataImg,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Foto de perfil actualizada exitosamente');
      setProfilePicture(null);
      await refreshUser();
    } catch (error) {
      console.error('Error uploading picture:', error);
      toast.error(error.response?.data?.detail || 'Error al subir la foto');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    // Validaciones básicas
    if (!formData.name.trim()) {
      toast.error('El nombre es obligatorio');
      return;
    }

    setSaving(true);

    try {
      await axios.put(
        `${API}/user/profile`,
        formData,
        { withCredentials: true }
      );

      toast.success('Perfil actualizado exitosamente');
      await refreshUser();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.detail || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleOpenPaymentModal = (payment = null) => {
    setEditingPayment(payment);
    setShowPaymentModal(true);
  };

  const handleDeleteClick = (method) => {
    setMethodToDelete(method);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!methodToDelete) return;

    try {
      await axios.delete(`${API}/user/payment-methods/${methodToDelete._id}`, { withCredentials: true });
      toast.success('Método de pago eliminado');
      fetchPaymentMethods();
      setDeleteConfirmOpen(false);
      setMethodToDelete(null);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Error al eliminar el método de pago');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button onClick={() => navigate('/dashboard')} variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Configuración de Perfil</h1>
            <p className="text-sm text-slate-500">Gestiona tu información personal y de pago</p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Foto de Perfil */}
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
              <CardDescription>Tu imagen personal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Preview */}
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={previewUrl || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-32 h-32 rounded-full object-cover border-4 border-brand-200"
                    />
                    <label
                      htmlFor="profile-pic-upload"
                      className="absolute bottom-0 right-0 bg-brand-600 text-white p-2 rounded-full cursor-pointer hover:bg-brand-700 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      <input
                        id="profile-pic-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    JPG o PNG, máximo 5MB
                  </p>
                </div>

                {/* Botón subir */}
                {profilePicture && (
                  <Button
                    onClick={handleUploadPicture}
                    disabled={uploading}
                    className="w-full bg-brand-600 hover:bg-brand-700"
                  >
                    {uploading ? 'Subiendo...' : 'Subir Foto'}
                  </Button>
                )}
              </div>
            </CardContent>

            {/* Tabs - Debajo de la foto (Verticales) */}
            <div className="px-6 pb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex flex-col w-full h-auto p-1 gap-1">
                  <TabsTrigger value="personal" className="w-full justify-start">
                    Información Personal
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="w-full justify-start">
                    Información de Pago
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </Card>

          {/* Contenido de las Tabs */}
          <div className="md:col-span-2">
            {activeTab === 'personal' && (
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                  <CardDescription>Actualiza tus datos básicos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Email (solo lectura) */}
                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Correo Electrónico
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        autoComplete="email"
                        className="bg-slate-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        El correo no se puede modificar
                      </p>
                    </div>

                    {/* Nombre */}
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nombre Completo <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        autoComplete="name"
                        placeholder="Ej: John Smith"
                      />
                    </div>

                    {/* Teléfono */}
                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        autoComplete="tel"
                        placeholder="Ej: +1 555 123 4567"
                      />
                    </div>

                    {/* Fecha de Nacimiento */}
                    <div>
                      <Label htmlFor="birth_date" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Fecha de Nacimiento
                      </Label>
                      <Input
                        id="birth_date"
                        name="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={handleInputChange}
                        autoComplete="bday"
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {/* Dirección */}
                    <div>
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Dirección
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleInputChange}
                        autoComplete="street-address"
                        placeholder="Ej: Calle 123, Apartamento 4B"
                      />
                    </div>

                    {/* País */}
                    <div>
                      <Label htmlFor="country" className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        País
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        type="text"
                        value={formData.country}
                        onChange={handleInputChange}
                        autoComplete="country-name"
                        placeholder="Ej: United States"
                      />
                    </div>

                    {/* Biografía */}
                    <div>
                      <Label htmlFor="bio" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Biografía
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Cuéntanos sobre ti..."
                        rows={4}
                        className="resize-none"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {formData.bio.length}/500 caracteres
                      </p>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 bg-brand-600 hover:bg-brand-700"
                      >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'payment' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Métodos de Pago</CardTitle>
                      <CardDescription>Gestiona tus métodos de pago para recibir fondos</CardDescription>
                    </div>
                    <Button
                      onClick={() => handleOpenPaymentModal()}
                      className="bg-brand-600 hover:bg-brand-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingPaymentMethods ? (
                    <div className="text-center py-12">
                      <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-slate-600">Cargando métodos de pago...</p>
                    </div>
                  ) : paymentMethods.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 mb-4">No tienes métodos de pago configurados</p>
                      <Button
                        onClick={() => handleOpenPaymentModal()}
                        variant="outline"
                        className="border-brand-600 text-brand-600 hover:bg-brand-50"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar tu primer método
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentMethods.map((method) => (
                        <PaymentMethodCard
                          key={method._id}
                          method={method}
                          onEdit={() => handleOpenPaymentModal(method)}
                          onDelete={() => handleDeleteClick(method)}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Agregar/Editar Método de Pago */}
      <PaymentMethodModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
        payment={editingPayment}
        onSuccess={() => {
          fetchPaymentMethods();
          setShowPaymentModal(false);
          setEditingPayment(null);
        }}
      />

      {/* Dialog de Confirmación para Eliminar */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Eliminar Método de Pago
            </DialogTitle>
            <DialogDescription className="pt-3">
              ¿Estás seguro de que deseas eliminar este método de pago?
              {methodToDelete && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-900">
                    {PAYMENT_METHODS.find(m => m.value === methodToDelete.payment_type)?.label}
                  </p>
                  {methodToDelete.payment_type === 'bank_transfer' ? (
                    <p className="text-sm text-slate-600 mt-1">
                      {methodToDelete.bank_name} - ****{methodToDelete.account_number?.slice(-4)}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-600 mt-1">
                      {methodToDelete.email}
                    </p>
                  )}
                </div>
              )}
              <p className="mt-3 text-sm text-slate-600">
                Esta acción no se puede deshacer.
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setMethodToDelete(null);
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente de tarjeta de método de pago
const PaymentMethodCard = ({ method, onEdit, onDelete }) => {
  const getMethodLabel = (type) => {
    const found = PAYMENT_METHODS.find(m => m.value === type);
    return found ? found.label : type;
  };

  return (
    <Card className="border-2 hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{getMethodLabel(method.payment_type)}</h3>
                <Badge className="bg-brand-100 text-brand-700 text-xs">
                  {method.is_primary ? 'Principal' : 'Secundario'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {method.payment_type === 'bank_transfer' ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-600">Banco:</span>
                      <span className="ml-2 font-semibold text-slate-900">{method.bank_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Tipo:</span>
                      <span className="ml-2 font-semibold text-slate-900">
                        {method.account_type === 'savings' ? 'Ahorros' : method.account_type === 'checking' ? 'Corriente' : 'Empresarial'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600">Cuenta:</span>
                      <span className="ml-2 font-mono text-slate-900">****{method.account_number?.slice(-4)}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">Documento:</span>
                      <span className="ml-2 font-mono text-slate-900">{method.document_id}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <span className="text-slate-600">Email:</span>
                  <span className="ml-2 font-semibold text-slate-900">{method.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onEdit}
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              onClick={onDelete}
              variant="ghost"
              size="icon"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Modal para agregar/editar método de pago
const PaymentMethodModal = ({ open, onOpenChange, payment, onSuccess }) => {
  const [formData, setFormData] = useState({
    payment_type: '',
    bank_name: '',
    account_number: '',
    account_type: '',
    document_id: '',
    email: '',
    wallet_address: '',
    is_primary: false
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (payment) {
      setFormData({
        payment_type: payment.payment_type || '',
        bank_name: payment.bank_name || '',
        account_number: payment.account_number || '',
        account_type: payment.account_type || '',
        document_id: payment.document_id || '',
        email: payment.email || '',
        wallet_address: payment.wallet_address || '',
        is_primary: payment.is_primary || false
      });
    } else {
      setFormData({
        payment_type: '',
        bank_name: '',
        account_number: '',
        account_type: '',
        document_id: '',
        email: '',
        wallet_address: '',
        is_primary: false
      });
    }
  }, [payment, open]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.payment_type) {
      toast.error('Selecciona un tipo de método de pago');
      return;
    }

    if (formData.payment_type === 'bank_transfer') {
      if (!formData.bank_name || !formData.account_number || !formData.account_type || !formData.document_id) {
        toast.error('Completa todos los campos para transferencia bancaria');
        return;
      }
    } else if (formData.payment_type === 'crypto') {
      if (!formData.wallet_address) {
        toast.error('Ingresa la dirección de tu wallet TRC20');
        return;
      }
    } else {
      if (!formData.email) {
        toast.error('Ingresa el correo electrónico');
        return;
      }
    }

    setSaving(true);

    try {
      if (payment) {
        // Editar
        await axios.put(
          `${API}/user/payment-methods/${payment._id}`,
          formData,
          { withCredentials: true }
        );
        toast.success('Método de pago actualizado');
      } else {
        // Crear
        await axios.post(
          `${API}/user/payment-methods`,
          formData,
          { withCredentials: true }
        );
        toast.success('Método de pago agregado');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error(error.response?.data?.detail || 'Error al guardar el método de pago');
    } finally {
      setSaving(false);
    }
  };

  const isBankTransfer = formData.payment_type === 'bank_transfer';
  const isCrypto = formData.payment_type === 'crypto';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[550px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            <span translate="no" className="notranslate">
              {payment ? 'Editar Método de Pago' : 'Agregar Método de Pago'}
            </span>
          </DialogTitle>
          <DialogDescription>
            <span translate="no" className="notranslate">
              {payment ? 'Actualiza la información de tu método de pago' : 'Agrega un nuevo método para recibir pagos'}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Tipo de método de pago */}
          <div className="space-y-2">
            <Label htmlFor="payment_type">Tipo de Método de Pago *</Label>
            <Select
              value={formData.payment_type}
              onValueChange={(value) => handleChange('payment_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un método" />
              </SelectTrigger>
              <SelectContent position="popper" sideOffset={4}>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campos para Transferencia Bancaria */}
          {isBankTransfer && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bank_name">
                  <Building2 className="h-4 w-4 inline mr-2" />
                  Nombre del Banco *
                </Label>
                <Input
                  id="bank_name"
                  value={formData.bank_name}
                  onChange={(e) => handleChange('bank_name', e.target.value)}
                  placeholder="Ej: Bank of America"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_type">Tipo de Cuenta *</Label>
                <Select
                  value={formData.account_type}
                  onValueChange={(value) => handleChange('account_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={4}>
                    {ACCOUNT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account_number">
                  <Hash className="h-4 w-4 inline mr-2" />
                  Número de Cuenta *
                </Label>
                <Input
                  id="account_number"
                  value={formData.account_number}
                  onChange={(e) => handleChange('account_number', e.target.value)}
                  placeholder="Ej: 0102-1234-5678-9012"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_id">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Número de Documento de Identidad *
                </Label>
                <Input
                  id="document_id"
                  value={formData.document_id}
                  onChange={(e) => handleChange('document_id', e.target.value)}
                  placeholder="Ej: 123-45-6789"
                />
              </div>
            </>
          )}

          {/* Campo para Wallet TRC20 */}
          {isCrypto && (
            <div className="space-y-2">
              <Label htmlFor="wallet_address">
                <Hash className="h-4 w-4 inline mr-2" />
                Dirección de Wallet TRC20 *
              </Label>
              <Input
                id="wallet_address"
                type="text"
                value={formData.wallet_address}
                onChange={(e) => handleChange('wallet_address', e.target.value)}
                placeholder="Ej: TXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500">
                Ingresa tu dirección de billetera TRON (TRC20) para recibir pagos en USDT
              </p>
            </div>
          )}

          {/* Campos para otros métodos (email) */}
          {!isBankTransfer && !isCrypto && formData.payment_type && (
            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="h-4 w-4 inline mr-2" />
                Correo Electrónico *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                autoComplete="email"
                placeholder="Ej: user@example.com"
              />
            </div>
          )}

          {/* Checkbox Principal */}
          <div className="flex items-center gap-2 pt-2">
            <input
              id="is_primary"
              type="checkbox"
              checked={formData.is_primary}
              onChange={(e) => handleChange('is_primary', e.target.checked)}
              className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
            />
            <label htmlFor="is_primary" className="text-sm font-medium text-slate-700">
              Establecer como método principal
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-brand-600 hover:bg-brand-700"
            >
              <span translate="no" className="notranslate">
                {saving ? 'Guardando...' : payment ? 'Actualizar' : 'Guardar'}
              </span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettings;
