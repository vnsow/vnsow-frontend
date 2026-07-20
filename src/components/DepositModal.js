import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { DollarSign, AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DepositModal = ({ open, onOpenChange, onSuccess }) => {
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: 'bank_transfer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handlePaymentMethodChange = (value) => {
    setFormData({ ...formData, payment_method: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    // Validaciones
    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount) || amount <= 0) {
      setError('Por favor ingresa un monto válido');
      setLoading(false);
      return;
    }

    if (amount < 10) {
      setError('El monto mínimo de depósito es $10');
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/user/deposit`,
        {
          amount: amount,
          payment_method: formData.payment_method,
        },
        {
          withCredentials: true,
          timeout: 30000,
        }
      );

      setSuccess(true);

      // Después de 2 segundos, cerrar modal y refrescar datos
      setTimeout(() => {
        setSuccess(false);
        resetForm();
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      const isTimeout = err.code === 'ECONNABORTED' || /timeout/i.test(err.message || '');
      const errorMessage = isTimeout
        ? 'La operación tardó demasiado. Verifica tu conexión e intenta de nuevo.'
        : (err.response?.data?.detail || 'Error al solicitar depósito');
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      payment_method: 'bank_transfer',
    });
    setError('');
    setSuccess(false);
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl p-0 max-h-[90vh] overflow-hidden">
        <div
          className="overflow-y-auto max-h-[90vh] px-4 sm:px-6 py-4 sm:py-6 custom-scrollbar"
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

          <DialogHeader className="mb-4 sm:mb-6">
            <DialogTitle className="text-lg sm:text-2xl font-bold text-center flex items-center justify-center gap-2">
              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-brand-600" />
              Solicitar Depósito
            </DialogTitle>
            <DialogDescription className="text-center text-xs sm:text-sm">
              Ingresa el monto que deseas depositar en tu billetera
            </DialogDescription>
          </DialogHeader>

          {success ? (
            <div className="py-6 sm:py-8 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-base sm:text-xl font-semibold text-slate-900 mb-2">¡Solicitud enviada!</h3>
              <p className="text-sm sm:text-base text-slate-600">Tu depósito será verificado por un administrador</p>
            </div>
          ) : (
            <>
            {/* Información importante */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-blue-700">
                  <p className="font-semibold mb-1">Instrucciones de depósito:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Ingresa el monto que deseas depositar</li>
                    <li>Selecciona el método de pago</li>
                    <li>Un administrador revisará tu solicitud</li>
                    <li>Una vez aprobada, el saldo aparecerá en tu billetera</li>
                  </ol>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm mb-3 sm:mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-4">
              {/* Monto */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-xs sm:text-sm">Monto a depositar ($USD) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="10"
                    placeholder="100.00"
                    value={formData.amount}
                    onChange={handleChange}
                    className="pl-9 sm:pl-10 text-sm sm:text-base"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500">Mínimo: $10</p>
              </div>

              {/* Método de pago */}
              <div className="space-y-2">
                <Label htmlFor="payment_method" className="text-xs sm:text-sm">Método de pago *</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={handlePaymentMethodChange}
                >
                  <SelectTrigger className="w-full text-sm sm:text-base">
                    <SelectValue placeholder="Selecciona un método" />
                  </SelectTrigger>
                  <SelectContent position="popper" sideOffset={4}>
                    <SelectItem value="bank_transfer">Transferencia Bancaria</SelectItem>
                    <SelectItem value="cripto">Criptomoneda</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="zelle">Zelle</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Información adicional */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-slate-600">
                  <strong className="text-slate-900">Nota:</strong> Después de enviar esta solicitud,
                  un administrador revisará tu depósito. Te notificaremos cuando sea aprobado y el
                  saldo estará disponible en tu billetera.
                </p>
              </div>

              {/* Botón de envío */}
              <Button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-sm sm:text-base"
                disabled={loading}
              >
                <span translate="no" className="notranslate">
                  {loading ? 'Enviando solicitud...' : 'Solicitar depósito'}
                </span>
              </Button>
            </form>
          </>
        )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
