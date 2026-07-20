import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CreateInvestmentForm from './CreateInvestmentForm';
import DepositModal from './DepositModal';
import PaymentProofModal from './PaymentProofModal';
import PaymentModal from './PaymentModal';
import EditDepositModal from './EditDepositModal';
import NotificationBell from './NotificationBell';
import ReferralConfirmationModal from './ReferralConfirmationModal';
import PlansCarousel from './PlansCarousel';
import { TrendingUp, TrendingDown, Wallet, Users, ArrowUpRight, LogOut, Copy, Check, DollarSign, Plus, Clock, ArrowDownRight, AlertCircle, Upload, Settings, CreditCard, ChevronLeft, ChevronRight, CheckCircle2, Menu, X } from 'lucide-react';
import logoFull from '../assets/icons/vnsow-logo.svg';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Variables de URL base - comentar/descomentar según el entorno
// const BASE_URL = 'http://localhost:3000'; // Desarrollo
const BASE_URL = 'https://iastake.com'; // Producción

// Helper para formatear fechas en formato DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Componente Modal de Inversión Rápida
const QuickInvestModal = ({ open, onOpenChange, plan, wallet: walletProp, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [paymentSource, setPaymentSource] = useState('external');
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(walletProp);
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Cargar wallet cuando se abre el modal
  useEffect(() => {
    if (open) {
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
    }
  }, [open]);

  // Reset cuando cambia el plan
  useEffect(() => {
    if (plan) {
      setAmount('');
      setPaymentSource('external');
    }
  }, [plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!plan) return;

    const investmentAmount = parseFloat(amount);
    if (isNaN(investmentAmount) || investmentAmount < plan.min_amount) {
      toast.error(`El monto mínimo es $${plan.min_amount.toLocaleString()}`);
      return;
    }

    if (plan.max_amount && investmentAmount > plan.max_amount) {
      toast.error(`El monto máximo es $${plan.max_amount.toLocaleString()}`);
      return;
    }

    // Validar saldo si el pago es desde billetera
    if (paymentSource === 'wallet') {
      if (!wallet || wallet.balance < investmentAmount) {
        toast.error('Saldo insuficiente en tu billetera');
        return;
      }
    }

    setLoading(true);

    try {
      await axios.post(
        `${API}/user/investments`,
        {
          amount: investmentAmount,
          plan_name: plan.name,
          plan_rate: plan.return_rate,
          market: plan.market,
          payment_source: paymentSource
        },
        { withCredentials: true }
      );

      if (paymentSource === 'wallet') {
        toast.success('¡Inversión creada y pagada desde tu billetera!');
      } else {
        toast.success('Inversión creada. Ahora puedes subir el comprobante de pago.');
      }

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating investment:', error);
      const errorMessage = error.response?.data?.detail || 'Error al crear inversión';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl">Invertir en {plan.name}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {plan.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-6 py-3 sm:py-4">
          {/* Información del Plan */}
          <div className="bg-brand-50 p-3 sm:p-4 rounded-lg border-2 border-brand-200">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
              <div>
                <span className="text-slate-600">Retorno:</span>
                <span className="ml-1 sm:ml-2 font-bold text-brand-700">{plan.return_rate}</span>
              </div>
              <div>
                <span className="text-slate-600">Mercado:</span>
                <span className="ml-1 sm:ml-2 font-semibold text-slate-900">{plan.market}</span>
              </div>
              <div>
                <span className="text-slate-600">Mínimo:</span>
                <span className="ml-1 sm:ml-2 font-semibold text-slate-900">${plan.min_amount?.toLocaleString()}</span>
              </div>
              {plan.max_amount && (
                <div>
                  <span className="text-slate-600">Máximo:</span>
                  <span className="ml-1 sm:ml-2 font-semibold text-slate-900">${plan.max_amount?.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Monto a Invertir */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="amount" className="text-xs sm:text-sm">Monto a invertir (USD) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder={`Mínimo $${plan.min_amount?.toLocaleString()}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min={plan.min_amount}
              max={plan.max_amount || undefined}
              className="text-sm sm:text-base h-9 sm:h-10"
            />
          </div>

          {/* Método de Pago */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-xs sm:text-sm">Método de pago *</Label>

            <div className="space-y-2">
              {/* Opción: Billetera */}
              <div
                className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentSource === 'wallet'
                    ? 'border-brand-500 bg-brand-50'
                    : 'border-slate-200 hover:border-slate-300'
                  }`}
                onClick={() => setPaymentSource('wallet')}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center ${paymentSource === 'wallet' ? 'border-brand-500' : 'border-slate-300'
                    }`}>
                    {paymentSource === 'wallet' && (
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-brand-500"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600" />
                      <span className="font-semibold text-sm sm:text-base text-slate-900">Mi Billetera</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 mt-1">
                      Saldo disponible: {loadingWallet ? (
                        <span className="text-slate-400">Cargando...</span>
                      ) : (
                        <span className="font-bold text-brand-600">${wallet?.balance?.toLocaleString() || '0'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Opción: Pago Externo */}
              <div
                className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentSource === 'external'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                  }`}
                onClick={() => setPaymentSource('external')}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 flex items-center justify-center ${paymentSource === 'external' ? 'border-blue-500' : 'border-slate-300'
                    }`}>
                    {paymentSource === 'external' && (
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      <span className="font-semibold text-sm sm:text-base text-slate-900">Pago Externo</span>
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 mt-1">
                      Transferencia bancaria (requiere comprobante)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botón */}
          <Button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-sm sm:text-base h-9 sm:h-10"
            disabled={loading}
          >
            {loading ? 'Creando inversión...' : 'Crear Inversión'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(false);
  const [stats, setStats] = useState({ total_invested: 0, active_investments: 0, total_earnings: 0 });
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para billetera
  const [wallet, setWallet] = useState(null);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditDepositModal, setShowEditDepositModal] = useState(false);
  const [selectedDepositForEdit, setSelectedDepositForEdit] = useState(null);
  const [pendingDeposits, setPendingDeposits] = useState([]);

  // Estados para modal de comprobante de pago
  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [proofModalType, setProofModalType] = useState('investment'); // 'investment' o 'deposit'

  // Estados para sistema de referidos
  const [referralData, setReferralData] = useState(null);
  const [loadingReferrals, setLoadingReferrals] = useState(false);
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  // Estados para modal de confirmación de referido post-registro
  const [showReferralConfirmModal, setShowReferralConfirmModal] = useState(false);
  const [pendingReferralData, setPendingReferralData] = useState(null);
  const [confirmingReferral, setConfirmingReferral] = useState(false);
  const [showReferralAlreadySetModal, setShowReferralAlreadySetModal] = useState(false);
  const [showReferralErrorModal, setShowReferralErrorModal] = useState(false);
  const [referralErrorMessage, setReferralErrorMessage] = useState('');

  // Estado para diálogo de logout
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Estados para carrusel de planes en Mis Inversiones
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlanCard, setSelectedPlanCard] = useState(null);
  const [activeTab, setActiveTab] = useState('inversiones');
  const [preselectedPlan, setPreselectedPlan] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const [statsRes, investmentsRes] = await Promise.all([
        axios.get(`${API}/user/stats`, { withCredentials: true }),
        axios.get(`${API}/user/investments`, { withCredentials: true })
      ]);

      setStats(statsRes.data);
      setInvestments(investmentsRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchWalletData();
    fetchReferralData();
  }, [fetchUserData]);

  // Cargar planes desde el backend
  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true);
      try {
        const response = await axios.get(`${API}/investment-plans`);
        setPlans(response.data);
        if (response.data.length > 0) {
          setSelectedPlanCard(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  // Bloquear scroll del fondo cuando el menú lateral móvil esté abierto
  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  // Verificar si hay código de referido pendiente en localStorage
  useEffect(() => {
    const checkPendingReferral = async () => {
      // Solo ejecutar si el usuario está cargado
      if (!user) return;

      const pendingCode = localStorage.getItem('pending_referral_code');
      const pendingData = localStorage.getItem('pending_referral_data');

      if (pendingCode && pendingData) {
        try {
          const referrerInfo = JSON.parse(pendingData);

          // Verificar si el usuario ya tiene un referidor
          if (user.referred_by_code) {
            // Usuario ya tiene un referidor asignado
            setShowReferralAlreadySetModal(true);
            // Limpiar localStorage
            localStorage.removeItem('pending_referral_code');
            localStorage.removeItem('pending_referral_data');
            return;
          }

          // Verificar si el código es el propio código del usuario
          if (user.referral_code === pendingCode) {
            // Usuario intenta usar su propio código
            setReferralErrorMessage('No puedes usar tu propio código de referido.');
            setShowReferralErrorModal(true);
            // Limpiar localStorage
            localStorage.removeItem('pending_referral_code');
            localStorage.removeItem('pending_referral_data');
            return;
          }

          // Todo está correcto, mostrar modal de confirmación
          setPendingReferralData({
            ...referrerInfo,
            referral_code: pendingCode
          });
          setShowReferralConfirmModal(true);
        } catch (error) {
          console.error('Error parsing referral data:', error);
          // Limpiar localStorage si hay error
          localStorage.removeItem('pending_referral_code');
          localStorage.removeItem('pending_referral_data');
        }
      }
    };

    checkPendingReferral();

    // Listener para detectar cuando la ventana obtiene el foco (cambio de pestaña)
    const handleFocus = () => {
      checkPendingReferral();
    };

    // Listener para detectar cambios en localStorage desde otras pestañas
    const handleStorageChange = (e) => {
      if (e.key === 'pending_referral_code' || e.key === 'pending_referral_data') {
        checkPendingReferral();
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);

    // Cleanup
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  // Función para ir a Nueva Inversión con plan seleccionado
  const handleGoToNewInvestment = () => {
    if (selectedPlanCard) {
      setPreselectedPlan(selectedPlanCard);
      setActiveTab('nueva');
    }
  };

  // Función para cargar datos de billetera
  const fetchWalletData = async () => {
    setLoadingWallet(true);
    try {
      const [walletRes, transactionsRes, depositsRes] = await Promise.all([
        axios.get(`${API}/user/wallet`, { withCredentials: true }),
        axios.get(`${API}/user/wallet/transactions`, { withCredentials: true }),
        axios.get(`${API}/user/deposits`, { withCredentials: true })
      ]);

      setWallet(walletRes.data);
      setWalletTransactions(transactionsRes.data);
      setDeposits(depositsRes.data);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoadingWallet(false);
    }
  };

  // Función para manejar el éxito de crear inversión/depósito
  const handleInvestmentSuccess = async () => {
    // Cambiar automáticamente a la pestaña de transacciones (instantáneo)
    setActiveTab('transacciones');
    // Hacer scroll al inicio de la página (instantáneo)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Recargar datos del usuario y billetera en segundo plano
    await fetchUserData();
    await fetchWalletData();
  };

  // Función para cargar datos de referidos
  const fetchReferralData = async () => {
    setLoadingReferrals(true);
    try {
      const response = await axios.get(`${API}/user/referrals`, { withCredentials: true });
      setReferralData(response.data);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoadingReferrals(false);
    }
  };

  const handleCopyReferralCode = () => {
    const referralCode = user?.referral_code || user?.id?.slice(-10).toUpperCase() || 'USER2024';
    const referralLink = `${BASE_URL}/referred?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Función para retirar comisiones a billetera
  const handleWithdraw = async () => {
    setWithdrawing(true);

    try {
      const response = await axios.post(`${API}/user/referrals/withdraw`, {}, { withCredentials: true });

      toast.success(`¡${response.data.message}! +$${response.data.amount.toLocaleString()} a tu billetera`, {
        duration: 5000,
      });

      // Recargar datos
      await fetchReferralData();
      await fetchWalletData();

      setShowWithdrawModal(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al retirar comisiones');
    } finally {
      setWithdrawing(false);
    }
  };

  // Función para confirmar vinculación de referido post-registro
  const handleConfirmReferral = async () => {
    if (!pendingReferralData) return;

    setConfirmingReferral(true);

    try {
      const pendingCode = localStorage.getItem('pending_referral_code');

      await axios.post(
        `${API}/user/apply-referral`,
        { referral_code: pendingCode },
        { withCredentials: true }
      );

      // Limpiar localStorage
      localStorage.removeItem('pending_referral_code');
      localStorage.removeItem('pending_referral_data');

      // Cerrar modal
      setShowReferralConfirmModal(false);
      setPendingReferralData(null);

      // Recargar datos del usuario y referidos
      await fetchReferralData();

      toast.success(`¡Código aplicado! Ahora eres referido de ${pendingReferralData.name}`, {
        duration: 4000,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Error al vincular el código de referido';

      // Manejar casos especiales
      if (errorMessage.includes('propio código') || errorMessage.includes('mismo usuario')) {
        setReferralErrorMessage('No puedes usar tu propio código de referido.');
        setShowReferralErrorModal(true);
      } else if (errorMessage.includes('ya tienes') || errorMessage.includes('already has')) {
        setShowReferralAlreadySetModal(true);
      } else {
        setReferralErrorMessage(errorMessage);
        setShowReferralErrorModal(true);
      }

      // Limpiar localStorage
      localStorage.removeItem('pending_referral_code');
      localStorage.removeItem('pending_referral_data');

      // Cerrar modal de confirmación
      setShowReferralConfirmModal(false);
      setPendingReferralData(null);
    } finally {
      setConfirmingReferral(false);
    }
  };

  // Función para cancelar vinculación de referido post-registro
  const handleCancelReferral = () => {
    // Limpiar localStorage
    localStorage.removeItem('pending_referral_code');
    localStorage.removeItem('pending_referral_data');

    // Cerrar modal
    setShowReferralConfirmModal(false);
    setPendingReferralData(null);
  };

  // Función para manejar logout con confirmación
  const handleLogout = () => {
    setShowLogoutDialog(false);
    logout();
  };

  const handleInvestmentClick = (investment) => {
    // Solo permitir subir comprobantes si el pago está pendiente
    if (investment.payment_status === 'pending') {
      setSelectedInvestment(investment);
      setSelectedDeposit(null);
      setProofModalType('investment');
      setShowProofModal(true);
    }
  };

  const handleDepositClick = (deposit) => {
    // Solo permitir subir comprobantes si el depósito está pendiente
    if (deposit.status === 'pending') {
      setSelectedDeposit(deposit);
      setSelectedInvestment(null);
      setProofModalType('deposit');
      setShowProofModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 ${mobileMenuOpen ? 'overflow-hidden' : ''}`}>
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Botón hamburguesa - solo móvil */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-brand-500 transition-colors"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <img src={logoFull} alt="VNSOW" className="h-8" />
          </div>
          <div className="flex items-center gap-4">
            {/* Avatar y nombre de usuario - oculto en móviles, visible desde md */}
            <div className="hidden md:flex items-center gap-3">
              {(user?.custom_picture || user?.picture) ? (
                <img
                  src={user?.custom_picture || user?.picture}
                  alt="User"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
                  onError={(e) => {
                    e.target.onerror = null; // Prevenir loop infinito
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg border-2 border-slate-200"
                style={{ display: (user?.custom_picture || user?.picture) ? 'none' : 'flex' }}
              >
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-slate-900">{user?.name}</div>
                <div className="text-xs text-slate-500">{user?.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              {/* Botón de configuración: oculto en móviles, visible desde md */}
              <Button
                onClick={() => navigate('/profile')}
                variant="ghost"
                size="icon"
                title="Configuración de Perfil"
                className="hidden md:inline-flex"
              >
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => setShowLogoutDialog(true)}
                variant="ghost"
                size="icon"
                title="Cerrar Sesión"
                className="hidden md:inline-flex"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Menú lateral móvil del dashboard */}
      <div
        className={`fixed inset-x-0 top-[64px] h-[calc(100vh-64px)] z-40 md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        {/* Fondo oscuro clicable con transición */}
        <div
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Panel lateral con transición de deslizamiento */}
        <div
          className={`absolute left-0 top-0 h-full w-72 max-w-[80vw] bg-white shadow-xl border-r border-slate-200 flex flex-col transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
              {/* Contenido del menú: navegación de pestañas */}
              <div className="flex-1 p-4 overflow-y-auto">
                <nav className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('inversiones');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'inversiones'
                        ? 'bg-brand-50 text-brand-700 border border-brand-200'
                        : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>Mis Inversiones</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('nueva');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'nueva'
                        ? 'bg-brand-50 text-brand-700 border border-brand-200'
                        : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Nueva Inversión</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('transacciones');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'transacciones'
                        ? 'bg-brand-50 text-brand-700 border border-brand-200'
                        : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Transacciones</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('referidos');
                      setMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'referidos'
                        ? 'bg-brand-50 text-brand-700 border border-brand-200'
                        : 'text-slate-700 hover:bg-slate-50'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Referidos</span>
                    </span>
                  </button>

                  {/* Mi Billetera (solo en menú móvil) */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/my-wallet');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      <span>Mi Billetera</span>
                    </span>
                  </button>

                  {/* Configuración de perfil (solo en menú móvil) */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/profile');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Configuración de perfil</span>
                    </span>
                  </button>

                  {/* Cerrar sesión (solo en menú móvil) */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowLogoutDialog(true);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4 border-t pt-4 border-slate-100"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </span>
                  </button>
                </nav>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-8 md:py-8">
        {/* Stats Cards - en móvil solo se muestran en la pestaña "Mis Inversiones" */}
        <div
          className={`grid-cols-2 md:grid-cols-5 gap-3 md:gap-6 mt-4 md:mt-0 mb-6 md:mb-8 ${
            activeTab === 'inversiones' ? 'grid' : 'hidden md:grid'
          }`}
        >
          {/* Total Invertido */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-3 md:pt-6 md:px-4">
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <div className="text-[11px] md:text-sm text-slate-600">Total Invertido</div>
                <Wallet className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              </div>
              <div className="text-lg md:text-3xl font-bold text-slate-900 leading-tight">
                ${stats.total_invested.toLocaleString()}
              </div>
              <div className="text-[10px] md:text-xs text-slate-500 mt-1 truncate">
                {stats.active_investments} inversiones activas
              </div>
            </CardContent>
          </Card>

          {/* Ganancias Totales */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-3 md:pt-6 md:px-4">
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <div className="text-[11px] md:text-sm text-slate-600">Ganancias Totales</div>
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-brand-600" />
              </div>
              <div className="text-lg md:text-3xl font-bold text-brand-600 leading-tight">
                ${stats.total_earnings.toLocaleString()}
              </div>
              <div className="text-[10px] md:text-xs text-brand-600 mt-1 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {stats.total_invested > 0 ? `+${((stats.total_earnings / stats.total_invested) * 100).toFixed(1)}%` : '0%'}
              </div>
            </CardContent>
          </Card>

          {/* Bonos Referidos */}
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-3 md:pt-6 md:px-4">
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <div className="text-[11px] md:text-sm text-slate-600">Bonos Referidos</div>
                <Users className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              </div>
              <div className="text-lg md:text-3xl font-bold text-slate-900 leading-tight">
                ${(referralData?.total_earnings || 0).toLocaleString()}
              </div>
              <div className="text-[10px] md:text-xs text-slate-500 mt-1 truncate">
                {referralData?.total_referrals || 0} referidos activos
              </div>
            </CardContent>
          </Card>

          {/* Balance Total */}
          <Card className="border-2 bg-brand-50 border-brand-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-3 md:pt-6 md:px-4">
              <div className="flex justify-between items-start mb-1 md:mb-2">
                <div className="text-[11px] md:text-sm text-brand-700">Balance Total</div>
                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-brand-600" />
              </div>
              <div className="text-lg md:text-3xl font-bold text-brand-600 leading-tight">
                ${stats.total_earnings.toLocaleString()}
              </div>
              <div className="text-[10px] md:text-xs text-brand-700 mt-1 truncate">Ganancias acumuladas</div>
            </CardContent>
          </Card>

          {/* Mi Billetera - solo visible en desktop (en móvil se accede vía menú lateral) */}
          <Card
            className="relative hidden md:block md:col-span-1 border-2 bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 border-blue-300 hover:border-blue-500 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 cursor-pointer group"
            onClick={() => navigate('/my-wallet')}
          >
            <CardContent className="p-4 md:pt-6 md:px-4 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div className="text-xs md:text-sm font-semibold text-blue-700">Mi Billetera</div>
                <Wallet className="h-4 w-4 md:h-5 md:w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors leading-tight">
                ${wallet?.balance?.toLocaleString() || '0'}
              </div>
              <div className="text-[10px] md:text-xs text-blue-700 flex items-center justify-between mt-1">
                <span>Balance disponible para invertir</span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium">
                  <span>Ver detalles</span>
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-brand-500" />
                  <span>Usa tu saldo para nuevas inversiones</span>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white border hidden md:inline-flex">
            <TabsTrigger value="inversiones">Mis Inversiones</TabsTrigger>
            <TabsTrigger value="nueva">Nueva Inversión</TabsTrigger>
            <TabsTrigger value="transacciones">Transacciones</TabsTrigger>
            <TabsTrigger value="referidos" onClick={() => !referralData && fetchReferralData()}>
              Referidos
            </TabsTrigger>
          </TabsList>

          {/* Inversiones */}
          <TabsContent value="inversiones">
            <div className="grid grid-cols-1 gap-6">
              {(() => {
                // Filtrar solo inversiones con pago verificado/aprobado
                const approvedInvestments = investments.filter(inv => inv.payment_status === 'verified');

                if (approvedInvestments.length === 0) {
                  return (
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle className="text-2xl text-center">Comienza a Invertir</CardTitle>
                        <CardDescription className="text-center">Selecciona un plan y empieza a hacer crecer tu capital</CardDescription>
                      </CardHeader>
                      <CardContent>
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
                            selectedPlan={selectedPlanCard}
                            onPlanSelect={setSelectedPlanCard}
                            showButton={true}
                            buttonText="Crear Inversión con este Plan"
                            onButtonClick={handleGoToNewInvestment}
                            buttonDisabled={!selectedPlanCard}
                          />
                        )}
                      </CardContent>
                    </Card>
                  );
                }

                return approvedInvestments
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map(investment => (
                    <Card
                      key={investment.id}
                      className={`border border-slate-200 hover:shadow-md transition-all bg-white/60 ${investment.payment_status === 'pending' ? 'cursor-pointer hover:border-brand-600' : ''
                        }`}
                      onClick={() => handleInvestmentClick(investment)}
                    >
                      <CardHeader className="pb-2 md:pb-4">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <CardTitle className="text-sm md:text-xl">
                              {investment.plan_name || investment.plan}
                            </CardTitle>
                            <CardDescription className="text-xs md:text-sm">
                              Mercado: {investment.market}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-1 items-end">
                            <Badge
                              variant={investment.status === 'active' ? 'default' : 'secondary'}
                              className={`text-[11px] md:text-xs px-2 py-0.5 ${investment.status === 'active'
                                  ? 'bg-brand-600'
                                  : investment.status === 'cancelled'
                                    ? 'bg-red-600'
                                    : ''
                                }`}
                            >
                              {investment.status === 'active'
                                ? 'Activa'
                                : investment.status === 'cancelled'
                                  ? 'Cancelada'
                                  : 'Completada'}
                            </Badge>
                            {/* Badge de estado de pago */}
                            {investment.payment_status && (
                              <Badge
                                className={`text-[11px] md:text-xs px-2 py-0.5 ${investment.payment_status === 'verified'
                                    ? 'bg-brand-600'
                                    : investment.payment_status === 'rejected'
                                      ? 'bg-red-600'
                                      : 'bg-orange-500'
                                  }`}
                              >
                                {investment.payment_status === 'verified'
                                  ? '✓ Pago Verificado'
                                  : investment.payment_status === 'rejected'
                                    ? '✗ Pago Rechazado'
                                    : '⏳ Pago Pendiente'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 md:pt-2">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                          <div>
                            <div className="text-xs md:text-sm text-slate-600 mb-0.5 md:mb-1">Monto invertido</div>
                            <div className="text-base md:text-xl font-bold text-slate-900">
                              ${investment.amount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs md:text-sm text-slate-600 mb-0.5 md:mb-1">Tasa de retorno</div>
                            <div className="text-base md:text-xl font-bold text-brand-600">
                              {investment.plan_rate}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs md:text-sm text-slate-600 mb-0.5 md:mb-1">Creada</div>
                            <div className="text-sm md:text-lg font-semibold text-slate-900">
                              {formatDate(investment.created_at)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs md:text-sm text-slate-600 mb-0.5 md:mb-1">Método de pago</div>
                            <div className="flex items-center gap-1 md:gap-2">
                              {investment.payment_source === 'wallet' ? (
                                <>
                                  <Wallet className="h-3 w-3 md:h-4 md:w-4 text-brand-600" />
                                  <span className="text-xs md:text-sm font-semibold text-brand-600">Billetera</span>
                                </>
                              ) : (
                                <>
                                  <DollarSign className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                                  <span className="text-xs md:text-sm font-semibold text-blue-600">Externo</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Información adicional de pago verificado */}
                        {investment.payment_status === 'verified' && investment.payment_verified_by && (
                          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t text-[11px] md:text-xs text-slate-600">
                            Verificado por: <span className="font-semibold">{investment.payment_verified_by}</span>
                            {investment.payment_verified_at && <>
                              {' '}
                              el {formatDate(investment.payment_verified_at)}
                            </>}
                          </div>
                        )}

                        {/* Notas de rechazo */}
                        {investment.payment_status === 'rejected' && investment.payment_notes && (
                          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t bg-red-50 p-3 rounded-lg">
                            <div className="text-[11px] md:text-xs font-semibold text-red-700 mb-1">Motivo del rechazo:</div>
                            <div className="text-xs md:text-sm text-red-600">{investment.payment_notes}</div>
                          </div>
                        )}

                        {/* Instrucción para subir comprobante en pagos pendientes */}
                        {investment.payment_status === 'pending' && (
                          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-700">
                              <Upload className="h-3 w-3 md:h-4 md:w-4" />
                              <span className="text-xs md:text-sm font-semibold">
                                {investment.payment_proof
                                  ? 'Haz clic para actualizar tu comprobante de pago'
                                  : 'Haz clic aquí para subir tu comprobante de pago'}
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ));
              })()}
            </div>
          </TabsContent>

          {/* Nueva Inversión */}
          <TabsContent value="nueva">
            <CreateInvestmentForm
              onSuccess={handleInvestmentSuccess}
              preselectedPlan={preselectedPlan}
              onPlanChange={() => setPreselectedPlan(null)}
            />
          </TabsContent>

          {/* Transacciones */}
          <TabsContent value="transacciones">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Historial de Transacciones</CardTitle>
                <CardDescription className="text-xs md:text-sm">Todas tus inversiones y movimientos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5 md:space-y-4">
                  {(() => {
                    // Unificar inversiones y depósitos
                    const allTransactions = [
                      ...investments.map(inv => ({ ...inv, transactionType: 'investment' })),
                      ...deposits.map(dep => ({ ...dep, transactionType: 'deposit' }))
                    ];

                    // Separar pendientes y no pendientes
                    const pendingTransactions = allTransactions.filter(item => {
                      if (item.transactionType === 'deposit') {
                        return item.status === 'pending';
                      } else {
                        return item.payment_status === 'pending';
                      }
                    });

                    const nonPendingTransactions = allTransactions.filter(item => {
                      if (item.transactionType === 'deposit') {
                        return item.status !== 'pending';
                      } else {
                        return item.payment_status !== 'pending';
                      }
                    });

                    // Ordenar cada grupo por fecha (más reciente primero)
                    pendingTransactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    nonPendingTransactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

                    // Unir: pendientes primero, luego el resto
                    const sortedTransactions = [...pendingTransactions, ...nonPendingTransactions];

                    if (sortedTransactions.length === 0) {
                      return (
                        <div className="text-center py-10 md:py-12">
                          <TrendingDown className="h-10 w-10 md:h-12 md:w-12 text-slate-400 mx-auto mb-3 md:mb-4" />
                          <p className="text-sm md:text-base text-slate-600">No hay transacciones aún</p>
                        </div>
                      );
                    }

                    return sortedTransactions.map(item => {
                      const isDeposit = item.transactionType === 'deposit';
                      const isInvestment = item.transactionType === 'investment';

                      // Determinar estado y color
                      let statusText = '';
                      let statusColor = '';

                      if (isDeposit) {
                        if (item.status === 'approved') {
                          statusText = 'Aprobado';
                          statusColor = 'bg-brand-600';
                        } else if (item.status === 'rejected') {
                          statusText = 'Rechazado';
                          statusColor = 'bg-red-600';
                        } else {
                          statusText = 'Pendiente';
                          statusColor = 'bg-yellow-600';
                        }
                      } else {
                        if (item.payment_status === 'verified') {
                          statusText = item.status === 'active' ? 'Activa' :
                            item.status === 'cancelled' ? 'Cancelada' :
                              'Completada';
                          statusColor = item.status === 'cancelled' ? 'bg-red-600' : 'bg-brand-600';
                        } else if (item.payment_status === 'rejected') {
                          statusText = 'Cancelada';
                          statusColor = 'bg-red-600';
                        } else {
                          statusText = 'Pendiente de Pago';
                          statusColor = 'bg-yellow-600';
                        }
                      }

                      const isPending = (isDeposit && item.status === 'pending') ||
                        (isInvestment && item.payment_status === 'pending');

                      // Investments with deposit_id can be clicked to view deposit details
                      const isClickable = (isDeposit && isPending) || (isInvestment && item.deposit_id && isPending);

                      const handleClick = async () => {
                        if (isDeposit && isPending) {
                          setSelectedDepositForEdit(item);
                          setShowEditDepositModal(true);
                        } else if (isInvestment && item.deposit_id && isPending) {
                          // Fetch deposit for this investment
                          try {
                            const response = await axios.get(`${API}/deposits/${item.deposit_id}`, {
                              withCredentials: true
                            });
                            setSelectedDepositForEdit(response.data.deposit);
                            setShowEditDepositModal(true);
                          } catch (error) {
                            console.error('Error fetching deposit:', error);
                            toast.error('Error al cargar el depósito');
                          }
                        }
                      };

                      return (
                        <div
                          key={item._id}
                          className={`flex items-center justify-between px-3 py-3 md:p-4 border border-slate-200 rounded-lg transition-all bg-white/60 ${isClickable
                              ? 'border-yellow-200 bg-yellow-50 hover:shadow-md cursor-pointer'
                              : 'hover:shadow-md'
                            }`}
                          onClick={handleClick}
                        >
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center ${isPending
                                ? 'bg-yellow-100'
                                : isDeposit
                                  ? 'bg-blue-100'
                                  : 'bg-brand-100'
                              }`}>
                              {isPending ? (
                                <Clock className="h-4 w-4 md:h-5 md:w-5 text-yellow-600" />
                              ) : isDeposit ? (
                                <ArrowDownRight className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                              ) : (
                                <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-brand-600" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm md:text-base font-semibold text-slate-900">
                                {isDeposit ? (
                                  item.type === 'wallet_deposit'
                                    ? 'Depósito a Billetera'
                                    : 'Pago de Inversión'
                                ) : (
                                  `Inversión - ${item.plan_name}`
                                )}
                              </div>
                              <div className="text-xs md:text-sm text-slate-600">
                                {isDeposit && item.payment_method_name && `${item.payment_method_name} • `}
                                {isInvestment && item.market && `${item.market} • `}
                                {formatDate(item.created_at)}
                              </div>
                              {isClickable && (
                                <div className="text-[11px] md:text-xs text-yellow-700 mt-1">
                                  Click para ver detalles del pago
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right ml-2">
                            <div className="text-base md:text-xl font-bold text-slate-900">
                              ${item.amount.toLocaleString()}
                            </div>
                            <Badge className={`${statusColor} mt-1 text-[11px] md:text-xs px-2 py-0.5`}>
                              {statusText}
                            </Badge>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referidos */}
          <TabsContent value="referidos">
            {loadingReferrals ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando datos de referidos...</p>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {/* Tu Link de Referido */}
                <Card className="border-2 bg-brand-50 border-brand-200">
                  <CardHeader className="pb-3 md:pb-6">
                    <CardTitle className="text-base md:text-lg">Tu Link de Referido</CardTitle>
                    <CardDescription className="text-xs md:text-sm">Comparte este link y gana el 6% por cada inversión verificada</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 md:space-y-4">
                      {/* Link completo */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
                        <div className="flex-1 bg-white border-2 border-brand-300 rounded-lg p-3 md:p-4">
                          <div className="text-xs sm:text-sm md:text-base font-mono text-brand-600 break-all">
                            {`${BASE_URL}/referred?ref=${user?.referral_code || user?.id?.slice(-10).toUpperCase()}`}
                          </div>
                        </div>
                        <Button onClick={handleCopyReferralCode} className="bg-brand-600 hover:bg-brand-700 w-full sm:w-auto">
                          {copiedCode ? <Check className="h-4 w-4 md:h-5 md:w-5 mr-2" /> : <Copy className="h-4 w-4 md:h-5 md:w-5 mr-2" />}
                          {copiedCode ? 'Copiado' : 'Copiar Link'}
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 md:mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs md:text-sm text-blue-700">
                        <strong className="block md:inline">Cómo funciona:</strong> <span className="block md:inline mt-1 md:mt-0">Comparte tu link con amigos. Cuando se registren e inviertan, recibirás el 6% de cada inversión verificada como comisión.</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Mostrar información del referidor (si ya tiene código aplicado) */}
                {referralData && referralData.referred_by && (
                  <Card className="border-2 border-brand-200 bg-brand-50">
                    <CardHeader className="pb-3 md:pb-6">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Users className="h-4 w-4 md:h-5 md:w-5 text-brand-600" />
                        Fuiste Referido Por
                      </CardTitle>
                      <CardDescription className="text-xs md:text-sm">Información de quien te refirió a la plataforma</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-white rounded-lg border-2 border-brand-300 p-3 md:p-4">
                        <div className="flex items-start gap-3 md:gap-4">
                          {/* Foto del referidor con fallback */}
                          {(referralData.referred_by.custom_picture || referralData.referred_by.picture) ? (
                            <>
                              <img
                                src={referralData.referred_by.custom_picture || referralData.referred_by.picture}
                                alt={referralData.referred_by.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-brand-300 object-cover flex-shrink-0"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-base md:text-lg border-2 border-brand-300 flex-shrink-0"
                                style={{ display: 'none' }}
                              >
                                {referralData.referred_by.name?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            </>
                          ) : (
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-base md:text-lg border-2 border-brand-300 flex-shrink-0">
                              {referralData.referred_by.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm md:text-lg font-bold text-slate-900 truncate">
                              {referralData.referred_by.name}
                            </div>
                            <div className="text-xs md:text-sm text-slate-600 mb-2 truncate">
                              {referralData.referred_by.email}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-2 md:mt-3">
                              <div className="text-xs font-semibold text-slate-600">Código usado:</div>
                              <div className="px-2 md:px-3 py-1 bg-brand-100 border border-brand-300 rounded font-mono text-xs md:text-sm font-bold text-brand-700 w-fit">
                                {referralData.referred_by_code}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 md:mt-4 p-2 md:p-3 bg-brand-100 border border-brand-300 rounded-lg">
                          <p className="text-xs text-brand-700">
                            <strong>✓ Código aplicado.</strong> <span className="hidden sm:inline">Ambos recibirán beneficios por tus inversiones verificadas.</span>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}


                {/* Resumen de Comisiones */}
                {referralData && (
                  <Card className="border-2">
                    <CardHeader className="pb-3 md:pb-6">
                      <CardTitle className="text-base md:text-lg">Resumen de Comisiones</CardTitle>
                      <CardDescription className="text-xs md:text-sm">Total ganado por referidos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                        <div className="bg-brand-50 p-3 md:p-4 rounded-lg border border-brand-200">
                          <div className="text-xs md:text-sm text-slate-600 mb-1">Total Ganado</div>
                          <div className="text-lg md:text-2xl font-bold text-brand-600">
                            ${(referralData.total_earnings || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-orange-50 p-3 md:p-4 rounded-lg border border-orange-200">
                          <div className="text-xs md:text-sm text-slate-600 mb-1">Disponible</div>
                          <div className="text-lg md:text-2xl font-bold text-orange-600">
                            ${(referralData.approved_earnings || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
                          <div className="text-xs md:text-sm text-slate-600 mb-1">Retirado</div>
                          <div className="text-lg md:text-2xl font-bold text-blue-600">
                            ${(referralData.paid_earnings || 0).toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 md:p-4 rounded-lg border border-purple-200">
                          <div className="text-xs md:text-sm text-slate-600 mb-1">Referidos</div>
                          <div className="text-lg md:text-2xl font-bold text-purple-600">
                            {referralData.total_referrals || 0}
                          </div>
                        </div>
                      </div>

                      {/* Botón de retiro si hay saldo disponible */}
                      {referralData.approved_earnings > 0 && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-brand-50 to-green-50 border-2 border-brand-300 rounded-lg">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm md:text-base text-brand-900 mb-1">
                                ¡Tienes comisiones disponibles!
                              </h4>
                              <p className="text-xs md:text-sm text-brand-700">
                                Puedes retirar ${(referralData.approved_earnings || 0).toLocaleString()} a tu billetera
                              </p>
                            </div>
                            <Button
                              onClick={() => setShowWithdrawModal(true)}
                              className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 justify-center text-sm md:text-base"
                            >
                              <DollarSign className="h-4 w-4 mr-2" />
                              Retirar a Billetera
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Lista de Referidos */}
                {referralData && referralData.referrals && referralData.referrals.length > 0 && (
                  <Card className="border-2">
                    <CardHeader className="pb-3 md:pb-6">
                      <CardTitle className="text-base md:text-lg">Mis Referidos</CardTitle>
                      <CardDescription className="text-xs md:text-sm">Usuarios que se registraron con tu código</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto -mx-2 md:mx-0">
                        <table className="w-full min-w-[600px]">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-slate-700">Usuario</th>
                              <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-slate-700 hidden sm:table-cell">Email</th>
                              <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-slate-700 hidden md:table-cell">Registro</th>
                              <th className="text-right p-2 md:p-3 text-xs md:text-sm font-semibold text-slate-700">Inversiones</th>
                              <th className="text-right p-2 md:p-3 text-xs md:text-sm font-semibold text-slate-700 hidden sm:table-cell">Total Invertido</th>
                              <th className="text-right p-2 md:p-3 text-xs md:text-sm font-semibold text-slate-700">Comisión</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[...referralData.referrals]
                              .sort((a, b) => new Date(b.joined_at) - new Date(a.joined_at))
                              .map((ref) => (
                                <tr key={ref.user_id} className="border-b hover:bg-slate-50">
                                  <td className="p-2 md:p-3 text-xs md:text-sm font-medium text-slate-900">{ref.name}</td>
                                  <td className="p-2 md:p-3 text-xs md:text-sm text-slate-600 hidden sm:table-cell truncate max-w-[150px]">{ref.email}</td>
                                  <td className="p-2 md:p-3 text-xs md:text-sm text-slate-600 hidden md:table-cell">
                                    {formatDate(ref.joined_at)}
                                  </td>
                                  <td className="p-2 md:p-3 text-xs md:text-sm text-right text-slate-600">{ref.total_investments}</td>
                                  <td className="p-2 md:p-3 text-xs md:text-sm text-right font-semibold text-slate-900 hidden sm:table-cell">
                                    ${(ref.total_invested || 0).toLocaleString()}
                                  </td>
                                  <td className="p-2 md:p-3 text-xs md:text-sm text-right font-bold text-brand-600">
                                    ${(ref.commission_earned || 0).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Historial de Comisiones */}
                {referralData && (
                  <Card className="border-2">
                    <CardHeader className="pb-3 md:pb-6">
                      <CardTitle className="text-base md:text-lg">Historial de Comisiones</CardTitle>
                      <CardDescription className="text-xs md:text-sm">Detalle de todas tus comisiones por referidos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!referralData.commissions || referralData.commissions.length === 0 ? (
                        <div className="text-center py-8 md:py-12">
                          <DollarSign className="h-10 w-10 md:h-12 md:w-12 text-slate-400 mx-auto mb-3 md:mb-4" />
                          <p className="text-sm md:text-base text-slate-600 mb-2">No tienes comisiones aún</p>
                          <p className="text-xs md:text-sm text-slate-500 px-4">
                            Las comisiones se generan cuando tus referidos hacen inversiones verificadas
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto -mx-2 md:mx-0">
                          <table className="w-full min-w-[600px]">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-slate-700 hidden md:table-cell">Fecha</th>
                                <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-slate-700">Referido</th>
                                <th className="text-left p-2 md:p-3 text-xs md:text-sm font-semibold text-slate-700 hidden sm:table-cell">Plan</th>
                                <th className="text-right p-2 md:p-3 text-xs md:text-sm font-semibold text-slate-700 hidden sm:table-cell">Inversión</th>
                                <th className="text-right p-2 md:p-3 text-xs md:text-sm font-semibold text-slate-700">Comisión</th>
                                <th className="text-center p-2 md:p-3 text-xs md:text-sm font-semibold text-slate-700">Estado</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...referralData.commissions]
                                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                .map((comm) => (
                                  <tr key={comm.commission_id} className="border-b hover:bg-slate-50">
                                    <td className="p-2 md:p-3 text-xs md:text-sm text-slate-600 hidden md:table-cell">
                                      {formatDate(comm.created_at)}
                                    </td>
                                    <td className="p-2 md:p-3 text-xs md:text-sm font-medium text-slate-900">{comm.referred_user_name}</td>
                                    <td className="p-2 md:p-3 text-xs md:text-sm text-slate-600 hidden sm:table-cell">{comm.plan_name}</td>
                                    <td className="p-2 md:p-3 text-xs md:text-sm text-right text-slate-900 hidden sm:table-cell">
                                      ${(comm.investment_amount || 0).toLocaleString()}
                                    </td>
                                    <td className="p-2 md:p-3 text-xs md:text-sm text-right font-bold text-brand-600">
                                      ${(comm.commission_amount || 0).toLocaleString()}
                                    </td>
                                    <td className="p-2 md:p-3 text-center">
                                      <Badge className={`text-xs ${comm.status === 'paid' ? 'bg-blue-600' :
                                          comm.status === 'approved' ? 'bg-brand-600' :
                                            comm.status === 'pending' ? 'bg-orange-600' :
                                              'bg-slate-600'
                                        }`}>
                                        {comm.status === 'paid' ? 'Retirado' :
                                          comm.status === 'approved' ? 'Disponible' :
                                            comm.status === 'pending' ? 'Pendiente' :
                                              comm.status}
                                      </Badge>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Mensaje si no hay referidos */}
                {referralData && (!referralData.referrals || referralData.referrals.length === 0) && (
                  <Card className="border-2">
                    <CardContent className="pt-8 pb-8 md:pt-12 md:pb-12">
                      <div className="text-center px-4">
                        <Users className="h-12 w-12 md:h-16 md:w-16 text-slate-300 mx-auto mb-3 md:mb-4" />
                        <h3 className="text-base md:text-lg font-semibold text-slate-700 mb-2">
                          Aún no tienes referidos
                        </h3>
                        <p className="text-sm md:text-base text-slate-600">
                          Comparte tu link de referido para empezar a ganar comisiones
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Depósito */}
      <DepositModal
        open={showDepositModal}
        onOpenChange={setShowDepositModal}
        onSuccess={fetchWalletData}
      />

      {/* Modal de Comprobante de Pago */}
      <PaymentProofModal
        open={showProofModal}
        onOpenChange={setShowProofModal}
        item={proofModalType === 'investment' ? selectedInvestment : selectedDeposit}
        type={proofModalType}
        onSuccess={proofModalType === 'investment' ? fetchUserData : fetchWalletData}
      />

      {/* Diálogo de confirmación de logout */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl">¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs sm:text-sm">
              ¿Estás seguro de que quieres cerrar sesión? Tendrás que volver a iniciar sesión para acceder a tu cuenta.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="text-sm sm:text-base h-9 sm:h-10 m-0">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-sm sm:text-base h-9 sm:h-10">
              Cerrar Sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Confirmación de Retiro */}
      <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600" />
              <span className="text-base sm:text-xl">Retirar Comisiones a Billetera</span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Vas a transferir tus comisiones disponibles a tu billetera
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
            <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-slate-600 mb-2">Monto a retirar:</div>
              <div className="text-2xl sm:text-3xl font-bold text-brand-600">
                ${(referralData?.approved_earnings || 0).toLocaleString()}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 mt-2">
                {referralData?.commissions?.filter(c => c.status === 'approved').length || 0} comisiones aprobadas
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-[10px] sm:text-xs text-blue-700">
                  <strong>Importante:</strong> El dinero se agregará a tu billetera y podrás usarlo para nuevas inversiones o retirarlo.
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              variant="outline"
              onClick={() => setShowWithdrawModal(false)}
              disabled={withdrawing}
              className="flex-1 text-sm sm:text-base h-9 sm:h-10"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={withdrawing}
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-sm sm:text-base h-9 sm:h-10"
            >
              {withdrawing ? 'Procesando...' : 'Confirmar Retiro'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Pago Unificado */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        type="wallet"
        onSuccess={() => {
          fetchWalletData();
        }}
      />

      {/* Modal de Edición de Depósito */}
      <EditDepositModal
        isOpen={showEditDepositModal}
        onClose={() => {
          setShowEditDepositModal(false);
          setSelectedDepositForEdit(null);
        }}
        deposit={selectedDepositForEdit}
        onSuccess={() => {
          fetchWalletData();
        }}
      />

      {/* Modal de confirmación de referido post-registro */}
      <ReferralConfirmationModal
        isOpen={showReferralConfirmModal}
        onClose={handleCancelReferral}
        referrerData={pendingReferralData}
        onConfirm={handleConfirmReferral}
        isLoading={confirmingReferral}
      />

      {/* Modal de alerta: usuario ya tiene referidor */}
      <AlertDialog open={showReferralAlreadySetModal} onOpenChange={setShowReferralAlreadySetModal}>
        <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              Código de Referido Ya Asignado
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-700 dark:text-gray-300">
              Ya tienes un código de referido vinculado a tu cuenta. No es posible cambiar o reemplazar tu referidor una vez asignado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowReferralAlreadySetModal(false)}
              className="bg-brand-600 hover:bg-brand-700"
            >
              Entendido
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de error de referido */}
      <AlertDialog open={showReferralErrorModal} onOpenChange={setShowReferralErrorModal}>
        <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Código No Válido
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-gray-700 dark:text-gray-300">
              {referralErrorMessage || 'El código de referido proporcionado no es válido.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowReferralErrorModal(false);
                setReferralErrorMessage('');
              }}
              className="bg-brand-600 hover:bg-brand-700"
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
