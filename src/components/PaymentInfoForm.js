import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';
import { CreditCard, Wallet } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PaymentInfoForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    payment_type: 'banco',
    account_details: '',
    account_holder: ''
  });
  const [hasExisting, setHasExisting] = useState(false);

  useEffect(() => {
    fetchPaymentInfo();
  }, []);

  const fetchPaymentInfo = async () => {
    try {
      const response = await axios.get(`${API}/user/payment-info`, { withCredentials: true });
      if (response.data) {
        setFormData({
          payment_type: response.data.payment_type,
          account_details: response.data.account_details,
          account_holder: response.data.account_holder
        });
        setHasExisting(true);
      }
    } catch (error) {
      console.error('Error fetching payment info:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/user/payment-info`, formData, { withCredentials: true });
      toast.success(hasExisting ? 'Información de pago actualizada' : 'Información de pago guardada');
      setHasExisting(true);
    } catch (error) {
      console.error('Error saving payment info:', error);
      toast.error('Error al guardar información de pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-brand-600" />
          <CardTitle>Información de Pago</CardTitle>
        </div>
        <CardDescription>
          Agrega tu información para recibir pagos de tus inversiones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Tipo de Pago
            </label>
            <select
              value={formData.payment_type}
              onChange={(e) => setFormData({ ...formData, payment_type: e.target.value })}
              className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              required
            >
              <option value="banco">Transferencia Bancaria</option>
              <option value="cripto">Criptomoneda</option>
              <option value="paypal">PayPal</option>
              <option value="transferencia">Transferencia Internacional</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Titular de la Cuenta
            </label>
            <input
              type="text"
              value={formData.account_holder}
              onChange={(e) => setFormData({ ...formData, account_holder: e.target.value })}
              placeholder="Nombre completo"
              className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {formData.payment_type === 'banco' && 'Número de Cuenta / CLABE'}
              {formData.payment_type === 'cripto' && 'Dirección de Billetera'}
              {formData.payment_type === 'paypal' && 'Correo de PayPal'}
              {formData.payment_type === 'transferencia' && 'SWIFT / IBAN'}
              {formData.payment_type === 'otro' && 'Detalles de Cuenta'}
            </label>
            <textarea
              value={formData.account_details}
              onChange={(e) => setFormData({ ...formData, account_details: e.target.value })}
              placeholder="Ingresa los detalles de tu cuenta"
              className="w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 min-h-[100px]"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700"
            size="lg"
          >
            {loading ? 'Guardando...' : hasExisting ? 'Actualizar Información' : 'Guardar Información'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentInfoForm;
