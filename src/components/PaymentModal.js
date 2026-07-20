import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import {
  Building2,
  CreditCard,
  DollarSign,
  Hash,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  MessageCircle
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PaymentModal = ({ isOpen, onClose, type = 'wallet', investmentData = null, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    payment_method_id: '',
    payment_reference: '',
    proof_file: null
  });
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Cargar métodos de pago activos
  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
    }
  }, [isOpen]);

  // Pre-llenar monto cuando es para inversión
  useEffect(() => {
    if (isOpen && type === 'investment' && investmentData?.amount) {
      setFormData(prev => ({
        ...prev,
        amount: investmentData.amount.toString()
      }));
    }
  }, [isOpen, type, investmentData]);

  const fetchPaymentMethods = async () => {
    setLoadingMethods(true);
    try {
      const response = await axios.get(`${API}/payment-methods`, {
        withCredentials: true
      });
      setPaymentMethods(response.data.payment_methods || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error('Error al cargar métodos de pago');
    } finally {
      setLoadingMethods(false);
    }
  };

  const handleMethodChange = (methodId) => {
    const method = paymentMethods.find(m => m._id === methodId);
    setSelectedMethod(method);
    setFormData({
      ...formData,
      payment_method_id: methodId,
      payment_reference: ''
    });
  };

  const getMethodIcon = (type) => {
    switch (type) {
      case 'bank':
        return <Building2 className="h-5 w-5" />;
      case 'paypal':
      case 'stripe':
        return <CreditCard className="h-5 w-5" />;
      case 'zelle':
        return <DollarSign className="h-5 w-5" />;
      case 'binance':
      case 'crypto':
        return <Hash className="h-5 w-5" />;
      case 'contact':
        return <MessageCircle className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getMethodIconColor = (type) => {
    switch (type) {
      case 'bank':
        return 'text-blue-600 bg-blue-100';
      case 'paypal':
        return 'text-purple-600 bg-purple-100';
      case 'zelle':
        return 'text-green-600 bg-green-100';
      case 'stripe':
        return 'text-indigo-600 bg-indigo-100';
      case 'binance':
        return 'text-yellow-600 bg-yellow-100';
      case 'crypto':
        return 'text-orange-600 bg-orange-100';
      case 'contact':
        return 'text-brand-600 bg-brand-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  const getReferenceLabel = (methodType) => {
    switch (methodType) {
      case 'bank':
        return 'Referencia de la transferencia';
      case 'crypto':
        return 'Hash de transacción (TxID)';
      default:
        return 'Referencia/ID de transacción';
    }
  };

  // Generar link de WhatsApp con mensaje precargado
  const generateWhatsAppLink = (method) => {
    if (!method || method.type !== 'contact') return '';

    const phoneNumber = method.details.phone_number?.replace(/[^0-9]/g, '') || '';
    const userName = user?.name || 'Usuario';
    const userEmail = user?.email || 'No disponible';
    let message = '';

    if (type === 'investment' && investmentData) {
      message = `Hola, me gustaría realizar una inversión y necesito asistencia para completar el proceso.

👤 *Datos del usuario:*
• Nombre: ${userName}
• Correo: ${userEmail}

📊 *Detalles de la inversión:*
• Plan: ${investmentData.plan_name || 'N/A'}
• Mercado: ${investmentData.market || 'N/A'}
• Tasa de retorno: ${investmentData.plan_rate || 'N/A'}%
• Duración: ${investmentData.duration_days ? `${investmentData.duration_days} días` : 'Flexible'}
• Monto a invertir: $${parseFloat(formData.amount || 0).toFixed(2)} USD

Por favor, indíqueme los pasos a seguir para realizar esta inversión. Gracias.`;
    } else {
      message = `Hola, me gustaría realizar un depósito a mi billetera y necesito asistencia.

👤 *Datos del usuario:*
• Nombre: ${userName}
• Correo: ${userEmail}

💰 *Detalles del depósito:*
• Monto a depositar: $${parseFloat(formData.amount || 0).toFixed(2)} USD
• Tipo de operación: Depósito en billetera

Por favor, indíqueme los pasos a seguir para completar este depósito. Gracias.`;
    }

    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setAttemptedSubmit(true);

    // Validaciones
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error('Por favor ingresa un monto válido');
      return;
    }

    if (!formData.payment_method_id) {
      toast.error('Por favor selecciona un método de pago');
      return;
    }

    // No requerir referencia para método de contacto
    const isContactMethod = selectedMethod?.type === 'contact';
    if (!isContactMethod && (!formData.payment_reference || formData.payment_reference.trim() === '')) {
      toast.error('Por favor ingresa la referencia del pago');
      return;
    }

    setLoading(true);
    try {
      // Primero verificar si tiene pagos pendientes
      const checkResponse = await axios.get(`${API}/deposits/check-pending`, {
        withCredentials: true,
        timeout: 30000
      });

      if (checkResponse.data.has_pending) {
        toast.error('Ya tienes un pago pendiente. Espera a que sea aprobado antes de realizar otro.');
        setLoading(false);
        return;
      }

      // Subir comprobante si existe (no aplica para método contact)
      let proofUrl = '';
      if (formData.proof_file && !isContactMethod) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.proof_file);

        const uploadResponse = await axios.post(
          `${API}/upload-payment-proof`,
          uploadFormData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true,
            timeout: 90000
          }
        );

        proofUrl = uploadResponse.data.url;
      }

      // Crear depósito
      const depositData = {
        type: type === 'wallet' ? 'wallet_deposit' : 'investment_payment',
        amount: parseFloat(formData.amount),
        payment_method_id: formData.payment_method_id,
        payment_reference: isContactMethod ? 'Contacto vía WhatsApp' : formData.payment_reference.trim(),
        proof_url: proofUrl || null,
        investment_data: type === 'investment' ? investmentData : null
      };

      await axios.post(`${API}/deposits`, depositData, {
        withCredentials: true,
        timeout: 30000
      });

      toast.success('Depósito enviado exitosamente. Pendiente de aprobación.');

      // Reset form
      setFormData({
        amount: '',
        payment_method_id: '',
        payment_reference: '',
        proof_file: null
      });
      setSelectedMethod(null);

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating deposit:', error);
      const isTimeout = error.code === 'ECONNABORTED' || /timeout/i.test(error.message || '');
      const message = isTimeout
        ? 'La operación tardó demasiado. Verifica tu conexión e intenta de nuevo.'
        : (error.response?.data?.detail || 'Error al crear el depósito');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getDescription = () => {
    if (type === 'wallet') {
      return 'Ingresa el monto que deseas depositar en tu billetera';
    }
    return 'Ingrese el monto del depósito';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] rounded-2xl p-0 overflow-hidden flex flex-col">
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 transparent',
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
              margin: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 10px;
              border: 2px solid transparent;
              background-clip: padding-box;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
              background-clip: padding-box;
            }
          `}} />

          <DialogHeader className="flex-shrink-0 mb-4 sm:mb-6">
            <DialogTitle className="text-lg sm:text-xl">Realizar depósito</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">{getDescription()}</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4 sm:space-y-6">
            {/* Monto */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Monto a depositar ($USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                disabled={type === 'investment'}
                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  type === 'investment' ? 'bg-slate-100 cursor-not-allowed text-slate-700' : ''
                }`}
                placeholder="0.00"
                required
              />
              {type === 'investment' && (
                <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-slate-400"></span>
                  El monto está determinado por la inversión que creaste
                </p>
              )}
            </div>

            {/* Método de pago */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Método de depósito *
              </label>
              {loadingMethods ? (
                <div className="flex items-center justify-center py-3 sm:py-4">
                  <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-blue-600" />
                </div>
              ) : (
                <select
                  value={formData.payment_method_id}
                  onChange={(e) => handleMethodChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="" disabled>Seleccionar método de depósito</option>
                  {paymentMethods.map((method) => (
                    <option key={method._id} value={method._id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Datos del método seleccionado */}
            {selectedMethod && (
              <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getMethodIconColor(selectedMethod.type)}`}>
                    {getMethodIcon(selectedMethod.type)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm sm:text-base text-slate-900 truncate">{selectedMethod.name}</h4>
                    <p className="text-xs sm:text-sm text-slate-600">Datos para realizar el pago</p>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {/* Transferencia Bancaria */}
                  {selectedMethod.type === 'bank' && (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div>
                          <span className="text-slate-600">Banco:</span>
                          <p className="font-semibold">{selectedMethod.details.bank_name}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Titular:</span>
                          <p className="font-semibold truncate">{selectedMethod.details.account_holder}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Tipo de cuenta:</span>
                          <p className="font-semibold">{selectedMethod.details.account_type}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">ID:</span>
                          <p className="font-semibold">{selectedMethod.details.identification}</p>
                        </div>
                      </div>
                      <div className="text-xs sm:text-sm">
                        <span className="text-slate-600">Número de cuenta:</span>
                        <p className="font-mono text-xs bg-white p-2 rounded border mt-1 break-all">
                          {selectedMethod.details.account_number}
                        </p>
                      </div>
                    </>
                  )}

                  {/* PayPal, Zelle, Stripe, Binance */}
                  {(selectedMethod.type === 'paypal' || selectedMethod.type === 'zelle' ||
                    selectedMethod.type === 'stripe' || selectedMethod.type === 'binance') && (
                    <div className="text-xs sm:text-sm">
                      <span className="text-slate-600">Correo electrónico:</span>
                      <p className="font-mono text-xs bg-white p-2 rounded border mt-1 break-all">
                        {selectedMethod.details.email}
                      </p>
                    </div>
                  )}

                  {/* Criptomonedas */}
                  {selectedMethod.type === 'crypto' && (
                    <>
                      <div className="text-xs sm:text-sm">
                        <span className="text-slate-600">Red:</span>
                        <p className="font-semibold">TRC20</p>
                      </div>
                      <div className="text-xs sm:text-sm">
                        <span className="text-slate-600">Dirección de billetera:</span>
                        <p className="font-mono text-xs bg-white p-2 rounded border mt-1 break-all">
                          {selectedMethod.details.wallet_address}
                        </p>
                      </div>
                      {selectedMethod.details.qr_code_url && (
                        <div className="text-xs sm:text-sm">
                          <span className="text-slate-600 block mb-2">Código QR:</span>
                          <div className="bg-white p-2 sm:p-3 rounded border flex justify-center">
                            <img
                              src={selectedMethod.details.qr_code_url}
                              alt="QR Code"
                              className="w-24 h-24 sm:w-32 sm:h-32 object-contain"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Contactar con el administrador */}
                  {selectedMethod.type === 'contact' && (
                    <>
                      <div className="text-xs sm:text-sm">
                        <span className="text-slate-600">Método de contacto:</span>
                        <p className="font-semibold">{selectedMethod.details.contact_method}</p>
                      </div>
                      <div className="text-xs sm:text-sm">
                        <span className="text-slate-600">Teléfono:</span>
                        <p className="font-semibold">{selectedMethod.details.phone_number}</p>
                      </div>
                      <div className="pt-3 mt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-600 mb-3">
                          Haz clic en el botón para contactar al administrador por WhatsApp.
                          Se abrirá una conversación con la información de tu {type === 'investment' ? 'inversión' : 'depósito'} precargada.
                        </p>
                        <a
                          href={generateWhatsAppLink(selectedMethod)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors w-full justify-center"
                        >
                          <MessageCircle className="h-5 w-5" />
                          Contactar por WhatsApp
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Referencia del pago - Ocultar para método contact */}
            {selectedMethod && selectedMethod.type !== 'contact' && (
              <>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    {getReferenceLabel(selectedMethod.type)} *
                  </label>
                  <input
                    type="text"
                    value={formData.payment_reference}
                    onChange={(e) => setFormData({ ...formData, payment_reference: e.target.value })}
                    className="w-full px-3 py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder={`Ingresa la ${getReferenceLabel(selectedMethod.type).toLowerCase()}`}
                    required
                  />
                </div>

                {/* Comprobante de pago (opcional) */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Comprobante de pago (Opcional)
                  </label>

                  {!formData.proof_file ? (
                    <div
                      className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all cursor-pointer border-slate-300 hover:border-blue-500 hover:bg-blue-50"
                      onClick={() => document.getElementById('proof-file-input').click()}
                    >
                      <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400 mx-auto mb-2 sm:mb-3" />
                      <p className="text-xs sm:text-sm text-slate-700 font-semibold mb-1">
                        Arrastra tu comprobante aquí o haz clic para seleccionar
                      </p>
                      <p className="text-xs text-slate-500">
                        Formatos: JPG, PNG, PDF (máx. 5MB)
                      </p>
                      <input
                        id="proof-file-input"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error('El archivo es demasiado grande. Máximo 5MB.');
                              return;
                            }
                            setFormData({ ...formData, proof_file: file });
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-blue-600 bg-blue-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                              {formData.proof_file.name}
                            </p>
                            <p className="text-xs text-slate-600">
                              {(formData.proof_file.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setFormData({ ...formData, proof_file: null })}
                          className="text-slate-500 hover:text-slate-700 flex-shrink-0"
                          type="button"
                        >
                          <X className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                      </div>

                      {/* Vista previa de imagen */}
                      {formData.proof_file.type.startsWith('image/') && (
                        <div className="mt-2 sm:mt-3">
                          <img
                            src={URL.createObjectURL(formData.proof_file)}
                            alt="Vista previa del comprobante"
                            className="w-full h-40 sm:h-48 object-contain bg-white rounded border"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Footer con botones */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto text-sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading || !selectedMethod}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm"
              >
                {loading ? (
                  <span translate="no" className="notranslate inline-flex items-center">
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  <span translate="no" className="notranslate">
                    {selectedMethod?.type === 'contact'
                      ? (type === 'investment' ? 'Crear inversión' : 'Crear depósito')
                      : 'Enviar depósito'}
                  </span>
                )}
              </Button>
            </div>
          </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
