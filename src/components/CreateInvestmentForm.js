import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Plus, TrendingUp, Wallet, AlertCircle, CreditCard, ChevronLeft, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import PaymentModal from './PaymentModal';
import PlansCarousel from './PlansCarousel';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CreateInvestmentForm = ({ onSuccess, preselectedPlan, onPlanChange }) => {
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState('');
  const [paymentSource, setPaymentSource] = useState('external'); // 'wallet' o 'external'
  const [wallet, setWallet] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [investmentDataForPayment, setInvestmentDataForPayment] = useState(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Ref to the amount input section, used for auto-scroll on mobile when
  // arriving here via the dashboard's "Crear Inversión con este Plan" CTA.
  const amountSectionRef = useRef(null);

  // Cargar planes desde el backend
  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const response = await axios.get(`${API}/investment-plans`);
        setPlans(response.data);
        if (response.data.length > 0 && !preselectedPlan) {
          setSelectedPlan(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        toast.error('Error al cargar los planes de inversión');
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, [preselectedPlan]);

  // Usar plan preseleccionado si está disponible
  useEffect(() => {
    if (preselectedPlan) {
      setSelectedPlan(preselectedPlan);
    }
  }, [preselectedPlan]);

  // Auto-scroll to the amount input on mobile when arriving here with a
  // preselected plan (i.e. the user clicked "Crear Inversión con este Plan"
  // from the dashboard carousel). On mobile the flexbox `order-*` classes
  // place the plan carousel above the amount input, so without this scroll
  // the user lands at the top of an already-chosen carousel. On desktop the
  // natural reading flow is already correct, so we skip the scroll there.
  //
  // IMPORTANT: we must wait until `loadingPlans === false`. If we scroll
  // while plans are still being fetched, the PlansCarousel only shows a
  // small spinner (~120px tall); after the API responds the carousel
  // expands to its full height (~600px) and pushes the amount input down,
  // landing the user mid-page instead of at the top.
  useEffect(() => {
    if (!preselectedPlan || loadingPlans || !amountSectionRef.current) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (!isMobile) return;

    // Double requestAnimationFrame: the first frame paints the carousel
    // with the full plan list, the second frame is guaranteed to see the
    // post-layout DOM (includes Embla Carousel's async measurements).
    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        amountSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      if (raf2) window.cancelAnimationFrame(raf2);
    };
  }, [preselectedPlan, loadingPlans]);

  // Cargar billetera al montar el componente
  useEffect(() => {
    const fetchWallet = async () => {
      setLoadingWallet(true);
      try {
        const response = await axios.get(`${API}/user/wallet`, { withCredentials: true });
        setWallet(response.data);
      } catch (error) {
        console.error('Error fetching wallet:', error);
      } finally {
        setLoadingWallet(false);
      }
    };
    fetchWallet();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setAttemptedSubmit(true);

    if (!selectedPlan) {
      toast.error('Por favor selecciona un plan de inversión');
      return;
    }

    const investmentAmount = parseFloat(amount);
    if (isNaN(investmentAmount) || investmentAmount <= 0) {
      toast.error('Por favor ingresa un monto válido');
      return;
    }

    if (investmentAmount < selectedPlan.min_amount) {
      toast.error(`El monto mínimo es $${selectedPlan.min_amount.toLocaleString()}`);
      return;
    }

    if (selectedPlan.max_amount && investmentAmount > selectedPlan.max_amount) {
      toast.error(`El monto máximo es $${selectedPlan.max_amount}`);
      return;
    }

    // Validar saldo si el pago es desde billetera
    if (paymentSource === 'wallet') {
      if (!wallet || wallet.balance < investmentAmount) {
        toast.error('Saldo insuficiente en tu billetera');
        return;
      }
    }

    // Si es pago externo, abrir modal de pago
    if (paymentSource === 'external') {
      // Preparar datos de inversión para el PaymentModal
      setInvestmentDataForPayment({
        plan_name: selectedPlan.name,
        plan_rate: selectedPlan.return_rate,
        market: selectedPlan.market,
        duration_days: selectedPlan.duration_days || null,
        amount: investmentAmount
      });
      setShowPaymentModal(true);
      return;
    }

    // Si es pago desde billetera, crear inversión directamente
    setLoading(true);

    try {
      const response = await axios.post(
        `${API}/user/investments`,
        {
          amount: investmentAmount,
          plan_name: selectedPlan.name,
          plan_rate: selectedPlan.return_rate,
          market: selectedPlan.market,
          payment_source: paymentSource // 'wallet'
        },
        { withCredentials: true, timeout: 30000 }
      );

      toast.success('¡Inversión creada y pagada desde tu billetera!');

      setAmount('');
      setPaymentSource('external');

      // Recargar billetera
      const walletRes = await axios.get(`${API}/user/wallet`, { withCredentials: true });
      setWallet(walletRes.data);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating investment:', error);
      const isTimeout = error.code === 'ECONNABORTED' || /timeout/i.test(error.message || '');
      const errorMessage = isTimeout
        ? 'La operación tardó demasiado. Verifica tu conexión e intenta de nuevo.'
        : (error.response?.data?.detail || 'Error al crear inversión');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-brand-600" />
          <CardTitle>Crear Nueva Inversión</CardTitle>
        </div>
        <CardDescription>Selecciona un plan y comienza a invertir</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          {/* Monto a Invertir
              Mobile order: placed AFTER "Resumen" and BEFORE the submit button.
              Desktop keeps natural DOM order via md:order-none. */}
          <div ref={amountSectionRef} className="order-4 md:order-none scroll-mt-20">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Monto a invertir (USD) <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                // Reset error cuando el usuario empieza a escribir
                if (attemptedSubmit && e.target.value) {
                  setAttemptedSubmit(false);
                }
              }}
              placeholder="Ej: 1000"
              min={selectedPlan?.min_amount || 0}
              max={selectedPlan?.max_amount || undefined}
              step="0.01"
              className={`w-full p-3 border-2 rounded-lg focus:outline-none text-lg transition-colors ${
                attemptedSubmit && (!amount || parseFloat(amount) <= 0)
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50'
                  : attemptedSubmit && selectedPlan && parseFloat(amount) < selectedPlan.min_amount
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50'
                  : attemptedSubmit && selectedPlan?.max_amount && parseFloat(amount) > selectedPlan.max_amount
                  ? 'border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50'
                  : 'border-slate-300 focus:ring-2 focus:ring-brand-600'
              }`}
              required
            />

            {/* Mensaje de error */}
            {attemptedSubmit && (!amount || parseFloat(amount) <= 0) && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                <span>Por favor ingresa un monto válido</span>
              </div>
            )}

            {/* Error: Menor al mínimo */}
            {attemptedSubmit && amount && parseFloat(amount) > 0 && selectedPlan && parseFloat(amount) < selectedPlan.min_amount && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                <span>El monto mínimo es ${selectedPlan.min_amount.toLocaleString()}</span>
              </div>
            )}

            {/* Error: Mayor al máximo */}
            {attemptedSubmit && amount && parseFloat(amount) > 0 && selectedPlan?.max_amount && parseFloat(amount) > selectedPlan.max_amount && (
              <div className="flex items-center gap-2 mt-2 text-red-600 text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                <span>El monto máximo es ${selectedPlan.max_amount.toLocaleString()}</span>
              </div>
            )}

            {/* Información del rango (cuando NO hay error) */}
            {selectedPlan && !(attemptedSubmit && (!amount || parseFloat(amount) <= 0 || parseFloat(amount) < selectedPlan.min_amount || (selectedPlan.max_amount && parseFloat(amount) > selectedPlan.max_amount))) && (
              <p className="text-sm text-slate-600 mt-1">
                Mínimo: ${selectedPlan.min_amount.toLocaleString()}
                {selectedPlan.max_amount && ` - Máximo: $${selectedPlan.max_amount.toLocaleString()}`}
              </p>
            )}
          </div>

          {/* Método de pago
              Mobile order: placed AFTER the plan carousel (order-1) and BEFORE the amount input.
              Desktop keeps natural DOM order via md:order-none. */}
          <div className="order-2 md:order-none">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Método de pago
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pago desde billetera */}
              <button
                type="button"
                onClick={() => setPaymentSource('wallet')}
                className={`border-2 rounded-lg p-4 text-left transition-all ${
                  paymentSource === 'wallet'
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    paymentSource === 'wallet' ? 'bg-brand-100' : 'bg-slate-100'
                  }`}>
                    <Wallet className={`h-5 w-5 ${
                      paymentSource === 'wallet' ? 'text-brand-600' : 'text-slate-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-semibold">Mi Billetera</div>
                    <div className="text-xs text-slate-500">Pago instantáneo</div>
                  </div>
                </div>
                {loadingWallet ? (
                  <div className="text-sm text-slate-600">Cargando...</div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Saldo disponible:</span>
                    <Badge className={wallet?.balance > 0 ? 'bg-brand-600' : 'bg-slate-400'}>
                      ${wallet?.balance?.toLocaleString() || '0'}
                    </Badge>
                  </div>
                )}
              </button>

              {/* Pago externo */}
              <button
                type="button"
                onClick={() => setPaymentSource('external')}
                className={`border-2 rounded-lg p-4 text-left transition-all ${
                  paymentSource === 'external'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    paymentSource === 'external' ? 'bg-blue-100' : 'bg-slate-100'
                  }`}>
                    <CreditCard className={`h-5 w-5 ${
                      paymentSource === 'external' ? 'text-blue-600' : 'text-slate-600'
                    }`} />
                  </div>
                  <div>
                    <div className="font-semibold">Pago Externo</div>
                    <div className="text-xs text-slate-500">Requiere aprobación</div>
                  </div>
                </div>
                <div className="text-sm text-slate-600">
                  Transferencia, cripto, PayPal, etc.
                </div>
              </button>
            </div>

            {/* Advertencia si el saldo es insuficiente */}
            {paymentSource === 'wallet' && wallet && parseFloat(amount) > wallet.balance && amount !== '' && (
              <div className="mt-3 flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
                <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-700">
                  <strong>Saldo insuficiente.</strong> Necesitas depositar ${(parseFloat(amount) - wallet.balance).toLocaleString()} adicionales
                  o selecciona el método de pago externo.
                </div>
              </div>
            )}
          </div>

          {/* Selección de Plan con Cartas Visuales */}
          <div className="order-1 md:order-none">
            <label className="block text-sm font-semibold text-slate-700 mb-4">
              Selecciona un plan de inversión
            </label>

            {loadingPlans ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando planes...</p>
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed">
                <p className="text-slate-600">No hay planes disponibles en este momento</p>
              </div>
            ) : (
              <PlansCarousel
                plans={plans}
                selectedPlan={selectedPlan}
                onPlanSelect={(plan) => {
                  setSelectedPlan(plan);
                  if (onPlanChange) onPlanChange();
                }}
                showButton={false}
              />
            )}
          </div>

          {/* Resumen */}
          {selectedPlan && (
            <div className="bg-slate-50 p-4 rounded-lg border-2 order-3 md:order-none">
              <h4 className="font-semibold text-slate-900 mb-2">Resumen</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Plan:</span>
                  <span className="font-semibold">{selectedPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Retorno:</span>
                  <span className="font-semibold text-brand-600">{selectedPlan.return_rate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Mercado:</span>
                  <span className="font-semibold">{selectedPlan.market}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Retiros:</span>
                  <span className="font-semibold">{selectedPlan.withdrawal_period}</span>
                </div>
                {amount && parseFloat(amount) > 0 && (
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="text-slate-600">Monto a invertir:</span>
                    <span className="font-bold text-lg">${parseFloat(amount).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !selectedPlan}
            className="w-full bg-brand-600 hover:bg-brand-700 text-lg py-6 order-5 md:order-none"
          >
            {loading ? (
              <span translate="no" className="notranslate inline-flex items-center">
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Procesando...
              </span>
            ) : (
              <span translate="no" className="notranslate">Crear Inversión</span>
            )}
          </Button>
        </form>
      </CardContent>

      {/* Modal de Pago para Inversión Externa */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setInvestmentDataForPayment(null);
        }}
        type="investment"
        investmentData={investmentDataForPayment}
        onSuccess={() => {
          // Limpiar formulario
          setAmount('');
          setPaymentSource('external');
          setInvestmentDataForPayment(null);

          // Llamar callback de éxito
          if (onSuccess) onSuccess();
        }}
      />
    </Card>
  );
};

export default CreateInvestmentForm;
