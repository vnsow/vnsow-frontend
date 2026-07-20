import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  ArrowUpRight,
  Building2,
  CreditCard,
  DollarSign,
  Loader2,
  AlertCircle,
  Wallet,
  Info,
  Settings,
  Phone,
  MessageCircle
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WithdrawalModal = ({ isOpen, onClose, walletBalance = 0, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [withdrawalConfig, setWithdrawalConfig] = useState({
    min_amount: 0,
    max_amount: 0,
    commission_type: 'percentage',
    commission_value: 0,
    admin_contact: ''
  });
  const [formData, setFormData] = useState({
    amount: '',
    payment_method_id: '',
    notes: ''
  });

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
      fetchWithdrawalConfig();
      // Resetear formulario
      setFormData({
        amount: '',
        payment_method_id: '',
        notes: ''
      });
    }
  }, [isOpen]);

  const fetchPaymentMethods = async () => {
    setLoadingMethods(true);
    try {
      const response = await axios.get(`${API}/user/payment-methods`, {
        withCredentials: true
      });
      setPaymentMethods(response.data || []);
    } catch (error) {
      console.error('Error loading payment methods:', error);
      toast.error('Error al cargar métodos de pago');
    } finally {
      setLoadingMethods(false);
    }
  };

  const fetchWithdrawalConfig = async () => {
    setLoadingConfig(true);
    try {
      const response = await axios.get(`${API}/config/withdrawals`, {
        withCredentials: true
      });
      setWithdrawalConfig(response.data);
    } catch (error) {
      console.error('Error loading withdrawal config:', error);
    } finally {
      setLoadingConfig(false);
    }
  };

  const getMethodIcon = (type) => {
    if (!type) return <CreditCard className="h-4 w-4" />;
    switch (type) {
      case 'bank_transfer':
        return <Building2 className="h-4 w-4" />;
      case 'zelle':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getMethodLabel = (method) => {
    if (!method) return '';
    if (method.payment_type === 'bank_transfer') {
      const bankName = method.bank_name || 'Banco';
      const lastDigits = method.account_number?.slice(-4) || '****';
      return `${bankName} - ****${lastDigits}`;
    }
    return method.email || '';
  };

  const getMethodTypeLabel = (type) => {
    if (!type) return 'Método de pago';
    const labels = {
      'bank_transfer': 'Transferencia Bancaria',
      'zelle': 'Zelle',
      'paypal': 'PayPal',
      'binance': 'Binance',
      'stripe': 'Stripe'
    };
    return labels[type] || type;
  };

  // Función para obtener el texto completo del método (para el Select)
  const getMethodFullText = (method) => {
    try {
      if (!method) return 'Método no disponible';
      const typeLabel = getMethodTypeLabel(method.payment_type) || 'Tipo desconocido';
      const details = getMethodLabel(method) || '';
      const primary = method.is_primary ? ' (Principal)' : '';
      return `${typeLabel}${details ? ` - ${details}` : ''}${primary}`;
    } catch {
      return 'Método de pago';
    }
  };

  // Obtener el método seleccionado
  const selectedMethod = paymentMethods.find(m => m._id === formData.payment_method_id);

  // Calcular comisión
  const calculateCommission = (amount) => {
    if (!amount || amount <= 0 || withdrawalConfig.commission_type === 'none' || withdrawalConfig.commission_value <= 0) {
      return 0;
    }
    if (withdrawalConfig.commission_type === 'percentage') {
      return Math.round((amount * withdrawalConfig.commission_value) / 100 * 100) / 100;
    }
    return withdrawalConfig.commission_value;
  };

  const amount = parseFloat(formData.amount) || 0;
  const commission = calculateCommission(amount);
  const netAmount = Math.round((amount - commission) * 100) / 100;

  // Validar máximo permitido
  const getMaxAmount = () => {
    if (withdrawalConfig.max_amount > 0) {
      return Math.min(walletBalance, withdrawalConfig.max_amount);
    }
    return walletBalance;
  };

  // Validaciones
  const getAmountError = () => {
    if (!formData.amount) return null;
    if (amount <= 0) return 'El monto debe ser mayor a 0';
    if (amount > walletBalance) return 'Saldo insuficiente';
    if (withdrawalConfig.min_amount > 0 && amount < withdrawalConfig.min_amount) {
      return `El monto mínimo es $${withdrawalConfig.min_amount}`;
    }
    if (withdrawalConfig.max_amount > 0 && amount > withdrawalConfig.max_amount) {
      return `El monto máximo es $${withdrawalConfig.max_amount}`;
    }
    return null;
  };

  const canSubmit = () => {
    return (
      amount > 0 &&
      amount <= walletBalance &&
      formData.payment_method_id &&
      !getAmountError() &&
      !loading
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit()) return;

    setLoading(true);
    try {
      await axios.post(
        `${API}/withdrawals`,
        {
          amount: amount,
          payment_method_id: formData.payment_method_id,
          notes: formData.notes || null
        },
        { withCredentials: true }
      );

      toast.success('Solicitud de retiro enviada exitosamente');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error creating withdrawal:', error);
      toast.error(error.response?.data?.detail || 'Error al crear la solicitud de retiro');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToSettings = () => {
    onClose();
    navigate('/profile?tab=payment&action=add');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[500px] max-h-[90vh] rounded-2xl p-0 overflow-hidden flex flex-col">
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

          <DialogHeader className="flex-shrink-0 mb-4">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <ArrowUpRight className="h-5 w-5 text-brand-600" />
              Solicitar Retiro
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Retira fondos de tu billetera a tu método de pago registrado
            </DialogDescription>
          </DialogHeader>

          {/* Saldo Disponible */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 text-brand-100 text-sm">
            <Wallet className="h-4 w-4" />
            Saldo Disponible
          </div>
          <div className="text-3xl font-bold mt-1">
            ${walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Configuración de retiros */}
        {!loadingConfig && (withdrawalConfig.min_amount > 0 || withdrawalConfig.max_amount > 0 || (withdrawalConfig.commission_type !== 'none' && withdrawalConfig.commission_value > 0)) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-[5px]">
            <div className="flex items-center gap-2 text-blue-700 text-sm font-medium mb-2">
              <Info className="h-4 w-4" />
              Condiciones de retiro
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {withdrawalConfig.min_amount > 0 && (
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-slate-500">Mínimo</div>
                  <div className="font-semibold text-slate-900">${withdrawalConfig.min_amount}</div>
                </div>
              )}
              {withdrawalConfig.max_amount > 0 && (
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-slate-500">Máximo</div>
                  <div className="font-semibold text-slate-900">${withdrawalConfig.max_amount}</div>
                </div>
              )}
              {withdrawalConfig.commission_type !== 'none' && withdrawalConfig.commission_value > 0 && (
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-slate-500">Comisión</div>
                  <div className="font-semibold text-slate-900">
                    {withdrawalConfig.commission_type === 'percentage'
                      ? `${withdrawalConfig.commission_value}%`
                      : `$${withdrawalConfig.commission_value}`
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contacto del Administrador */}
        {!loadingConfig && withdrawalConfig.admin_contact && (
          <div className="bg-brand-50 border border-brand-200 rounded-lg p-3 mt-[5px]">
            <div className="flex items-center gap-2 text-brand-700 text-sm font-medium mb-2">
              <MessageCircle className="h-4 w-4" />
              ¿Necesitas ayuda con tu retiro?
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 flex-1">
                <Phone className="h-4 w-4 text-brand-600" />
                <span className="font-medium text-slate-900">{withdrawalConfig.admin_contact}</span>
              </div>
              <a
                href={`https://wa.me/${withdrawalConfig.admin_contact.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        )}

        {loadingMethods ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
          </div>
        ) : paymentMethods.length === 0 ? (
          /* Sin métodos de pago */
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">
              No tienes métodos de pago configurados
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Para solicitar un retiro, primero debes agregar un método de pago donde puedas recibir los fondos.
            </p>
            <Button
              onClick={handleGoToSettings}
              className="bg-brand-600 hover:bg-brand-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Ir a Configuración
            </Button>

            {/* Opción de contactar admin si no tiene métodos de pago */}
            {withdrawalConfig.admin_contact && (
              <div className="mt-6 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-3">
                  O puedes contactar directamente al administrador:
                </p>
                <a
                  href={`https://wa.me/${withdrawalConfig.admin_contact.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  Contactar por WhatsApp
                </a>
                <p className="text-xs text-slate-500 mt-2">
                  {withdrawalConfig.admin_contact}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Formulario de retiro */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Monto */}
            <div className="space-y-2">
              <Label htmlFor="amount">Monto a retirar *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  max={getMaxAmount()}
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className={`pl-9 ${getAmountError() ? 'border-red-500' : ''}`}
                />
              </div>
              {getAmountError() && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {getAmountError()}
                </p>
              )}
            </div>

            {/* Resumen de comisión */}
            {amount > 0 && !getAmountError() && (
              <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Monto solicitado:</span>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </div>
                {commission > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      Comisión ({withdrawalConfig.commission_type === 'percentage' ? `${withdrawalConfig.commission_value}%` : 'fija'}):
                    </span>
                    <span className="font-medium text-red-600">-${commission.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-medium text-slate-900">Recibirás:</span>
                  <span className="font-bold text-brand-600 text-lg">${netAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Método de pago */}
            <div className="space-y-2">
              <Label>Método de pago para recibir *</Label>
              <Select
                value={formData.payment_method_id}
                onValueChange={(value) => setFormData({ ...formData, payment_method_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un método de pago" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method._id} value={method._id}>
                      {getMethodFullText(method)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Mostrar detalles del método seleccionado */}
              {selectedMethod && selectedMethod.payment_type && (
                <div className="flex items-center gap-2 p-2 bg-brand-50 rounded-lg border border-brand-200">
                  {getMethodIcon(selectedMethod.payment_type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {getMethodTypeLabel(selectedMethod.payment_type) || 'Método de pago'}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {getMethodLabel(selectedMethod) || 'Sin detalles'}
                    </div>
                  </div>
                  {selectedMethod.is_primary && (
                    <span className="text-xs bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded flex-shrink-0">
                      Principal
                    </span>
                  )}
                </div>
              )}

              <p className="text-xs text-slate-500">
                ¿No encuentras tu método de pago?{' '}
                <button
                  type="button"
                  onClick={handleGoToSettings}
                  className="text-brand-600 hover:underline"
                >
                  Agregar nuevo
                </button>
              </p>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Información adicional para el administrador..."
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-brand-600 hover:bg-brand-700"
                disabled={!canSubmit()}
              >
                {loading ? (
                  <span translate="no" className="notranslate inline-flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Procesando...
                  </span>
                ) : (
                  <span translate="no" className="notranslate inline-flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Solicitar Retiro
                  </span>
                )}
              </Button>
            </div>
          </form>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalModal;
