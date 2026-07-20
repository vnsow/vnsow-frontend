import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import axios from 'axios';
import { TrendingUp, Users, DollarSign, CheckCircle, XCircle, Clock, Bell, Eye, Calendar, CreditCard, Activity, Briefcase, Plus, Edit, Trash2, Power, PowerOff, FileText, Image as ImageIcon, Download, Hash, ArrowRight, Building2, CheckCircle2, X, Upload, Wallet, Loader2, ChevronDown, Search, History, Settings, Menu, LogOut, MessageCircle } from 'lucide-react';
import logoFull from '../assets/icons/vnsow-logo.svg';
import UserMobileCard from './UserMobileCard';
import PendingInvestmentMobileCard from './PendingInvestmentMobileCard';
import HistoryUserMobileCard from './HistoryUserMobileCard';
import PendingPayoutMobileCard from './PendingPayoutMobileCard';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Input } from './ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Modal de configuración de pagos pendientes (demo, solo front)
const PayoutConfigDialog = ({ dialogState, onClose, onSave, saving }) => {
  const { open, payout } = dialogState;

  const [percentage, setPercentage] = useState(0);
  const [manualAmount, setManualAmount] = useState('');

  useEffect(() => {
    if (payout) {
      const min = Number(payout.plan_rate_min) || 0;
      const max = Number(payout.plan_rate_max) || min;
      // Si ya tiene un porcentaje configurado, usar ese; si no, usar el promedio
      const initial = payout.configured_percentage
        ? Number(payout.configured_percentage)
        : (min === max ? min : (min + max) / 2);
      setPercentage(initial);
      // Calcular el monto inicial basado en el porcentaje
      const initialAmount = payout.base_amount * (initial / 100);
      setManualAmount(initialAmount.toFixed(2));
    }
  }, [payout]);

  if (!payout) return null;

  const min = Number(payout.plan_rate_min) || 0;
  const max = Number(payout.plan_rate_max) || min;
  // Permitir desde 0% hasta el máximo del plan
  const clampedPercentage = Math.min(Math.max(percentage, 0), max);
  const payoutAmount = payout.base_amount * (clampedPercentage / 100);

  // Calcular rangos de monto permitidos (mínimo es 0)
  const minAmount = 0;
  const maxAmount = payout.base_amount * (max / 100);

  // Manejar cambio en el slider
  const handleSliderChange = (e) => {
    const newPercentage = Number(e.target.value);
    setPercentage(newPercentage);
    // Actualizar el input de monto
    const newAmount = payout.base_amount * (newPercentage / 100);
    setManualAmount(newAmount.toFixed(2));
  };

  // Manejar cambio en el input de monto
  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Permitir vacío o números con decimales
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setManualAmount(value);

      // Si hay un valor válido, calcular el porcentaje
      if (value !== '' && !isNaN(value)) {
        const amount = Number(value);
        const newPercentage = (amount / payout.base_amount) * 100;
        // Clampar el porcentaje al rango permitido (desde 0 hasta max)
        const clampedPct = Math.min(Math.max(newPercentage, 0), max);
        setPercentage(clampedPct);
      }
    }
  };

  // Validar y ajustar el monto al perder el foco
  const handleAmountBlur = () => {
    if (manualAmount === '' || isNaN(manualAmount)) {
      // Si está vacío o no es válido, restaurar al valor del slider
      const amount = payout.base_amount * (clampedPercentage / 100);
      setManualAmount(amount.toFixed(2));
      return;
    }

    const amount = Number(manualAmount);

    // Clampar el monto al rango permitido (desde 0 hasta max)
    if (amount < 0) {
      setManualAmount('0.00');
      setPercentage(0);
    } else if (amount > maxAmount) {
      setManualAmount(maxAmount.toFixed(2));
      setPercentage(max);
    } else {
      // Recalcular el porcentaje exacto
      const newPercentage = (amount / payout.base_amount) * 100;
      setPercentage(newPercentage);
      setManualAmount(amount.toFixed(2));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen && !saving) onClose(); }} modal>
      <DialogContent className="w-[calc(100%-2rem)] max-w-xl max-h-[85vh] overflow-hidden flex flex-col rounded-2xl">
        <DialogHeader className="flex-shrink-0">
          {/* Desktop: título con icono */}
          <DialogTitle className="hidden md:flex items-center gap-2 text-2xl">
            <DollarSign className="h-6 w-6 text-teal-600" />
            Configurar pago pendiente
          </DialogTitle>

          {/* Mobile: título centrado sin icono */}
          <DialogTitle className="md:hidden text-xl text-center">
            Configurar pago pendiente
          </DialogTitle>

          <DialogDescription className="text-center md:text-left">
            Define el porcentaje de retribución para este usuario dentro del rango permitido por su plan.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 pl-1 py-4 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Información del usuario y plan */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-3 md:gap-0">
              <div>
                <div className="text-sm text-slate-600 mb-1">Usuario</div>
                <div className="font-semibold text-slate-900">{payout.user_name}</div>
                <div className="text-xs text-slate-500">{payout.user_email}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-600 mb-1">Monto base</div>
                <div className="text-2xl font-bold text-brand-600">
                  ${payout.base_amount.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col md:flex-row md:justify-between gap-3 md:gap-0">
              <div>
                <div className="text-sm text-slate-600 mb-1">Plan</div>
                <div className="font-semibold text-slate-900">{payout.plan_name}</div>
                <div className="text-xs text-slate-500 mt-1">
                  Rango permitido: {min}% - {max}% sobre el monto base
                </div>
              </div>
              <div className="md:text-right">
                <div className="text-sm text-slate-600 mb-1">Fecha</div>
                <div className="text-sm text-slate-900">
                  {new Date(payout.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

          {/* Configuración de porcentaje */}
          <div className="bg-white border-2 border-teal-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-700">Porcentaje de retribución</div>
              <Badge className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
                {clampedPercentage.toFixed(2)}%
              </Badge>
            </div>
            <input
              type="range"
              min={0}
              max={max}
              step="0.1"
              value={clampedPercentage}
              onChange={handleSliderChange}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>0%</span>
              <span>{max}%</span>
            </div>

            {/* Input manual de monto */}
            <div className="mt-4">
              <label htmlFor="manual-amount" className="text-sm font-semibold text-slate-700 block mb-2">
                O ingresa el monto directamente
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                  $
                </span>
                <input
                  id="manual-amount"
                  type="text"
                  value={manualAmount}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-2.5 border-2 border-slate-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-lg font-semibold text-slate-900"
                />
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-1.5">
                <span>Mínimo: ${minAmount.toFixed(2)}</span>
                <span>Máximo: ${maxAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Resumen */}
            <div className="mt-4 bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200 rounded-lg p-4">
              <div className="text-sm text-teal-700 font-medium mb-2">Resumen del pago</div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-teal-600 mb-0.5">Monto a pagar</div>
                  <div className="text-2xl font-bold text-teal-900">
                    ${payoutAmount.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-teal-600 mb-0.5">De un total de</div>
                  <div className="text-lg font-semibold text-teal-800">
                    ${payout.base_amount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-center text-teal-600">
                {clampedPercentage.toFixed(2)}% del monto base
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => onSave(payout, clampedPercentage)}
            disabled={saving}
            className="bg-teal-600 hover:bg-teal-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar cambios'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [totalWalletBalance, setTotalWalletBalance] = useState(0);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Función para formatear montos: punto para miles, coma para decimales
  const formatMoney = (amount) => {
    const parts = amount.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  };
  const [actionDialog, setActionDialog] = useState({ open: false, type: null, payment: null });
  const [paymentInfoDialog, setPaymentInfoDialog] = useState({ open: false, payment: null });
  const [processingAction, setProcessingAction] = useState(false);

  // Estados para vista detallada de usuario
  const [userDetailDialog, setUserDetailDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(false);

  // Estados para gestión de planes
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [planDialog, setPlanDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    description: '',
    min_amount: '',
    max_amount: '',
    rate_min: '',
    rate_max: '',
    withdrawal_period: '',
    withdrawal_period_days: '',
    market: '',
    is_active: true,
    is_popular: false,
    features: []
  });
  const [savingPlan, setSavingPlan] = useState(false);
  const [deletePlanDialog, setDeletePlanDialog] = useState(null);

  // Estados para modal de comprobante de pago
  const [proofModal, setProofModal] = useState(false);
  const [selectedProof, setSelectedProof] = useState(null);

  // Estados para métodos de pago
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [paymentMethodDialog, setPaymentMethodDialog] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState(null);
  const [paymentMethodFormData, setPaymentMethodFormData] = useState({
    type: '', // bank, paypal, zelle, stripe, binance, crypto
    details: {
      // Para bank (transferencia bancaria)
      bank_name: '',
      account_number: '',
      account_type: '',
      account_holder: '',
      identification: '',
      // Para paypal, zelle, stripe, binance
      email: '',
      // Para crypto
      wallet_address: '',
      qr_code_url: ''
    },
    is_active: true,
    qr_code_file: null
  });
  const [savingPaymentMethod, setSavingPaymentMethod] = useState(false);
  const [deletePaymentMethodDialog, setDeletePaymentMethodDialog] = useState(null);

  // Estados para historial de pagos
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Estados para detalle de historial de operaciones por usuario
  const [historyDetailDialog, setHistoryDetailDialog] = useState(false);
  const [selectedUserHistory, setSelectedUserHistory] = useState(null);
  const [userOperations, setUserOperations] = useState([]);
  const [loadingOperations, setLoadingOperations] = useState(false);

  // Estados para configuración de pagos pendientes (demo)
  const [payoutConfigDialog, setPayoutConfigDialog] = useState({ open: false, payout: null });
  const [savingPayoutConfig, setSavingPayoutConfig] = useState(false);
  const [payoutConfigs, setPayoutConfigs] = useState({});
  const [payoutActionDialog, setPayoutActionDialog] = useState({ open: false, payout: null });
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [loadingPayouts, setLoadingPayouts] = useState(false);
  const [processingPayoutAction, setProcessingPayoutAction] = useState(false);

  // Estados para retiros pendientes
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [withdrawalRejectDialog, setWithdrawalRejectDialog] = useState({ open: false, withdrawal: null });
  const [withdrawalRejectReason, setWithdrawalRejectReason] = useState('');
  const [withdrawalDetailDialog, setWithdrawalDetailDialog] = useState({ open: false, withdrawal: null });

  // Estados para historial de retiros (todos)
  const [allWithdrawals, setAllWithdrawals] = useState([]);
  const [loadingAllWithdrawals, setLoadingAllWithdrawals] = useState(false);
  const [withdrawalFilters, setWithdrawalFilters] = useState({
    status: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  // Estados para billetera del admin y ganancias
  const [adminWalletBalance, setAdminWalletBalance] = useState(0);
  const [platformEarningsStats, setPlatformEarningsStats] = useState({
    today: { total: 0, count: 0 },
    month: { total: 0, count: 0 },
    all_time: { total: 0, count: 0 }
  });

  // Estados para navegación móvil y control de tabs
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('usuarios');

  useEffect(() => {
    fetchUsers();
    fetchPendingPayments();
    fetchPlans();
    fetchPendingPayouts();
    fetchPendingWithdrawals();
    fetchPlatformEarningsStats();
  }, []);

  // Bloquear scroll del body cuando el menú móvil esté abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/admin/users`, { withCredentials: true });
      // Nueva estructura: { users: [...], stats: { total_wallet_balance: ... } }
      const usersData = response.data.users || response.data;
      const walletTotal = response.data.stats?.total_wallet_balance || 0;

      setUsers(usersData);
      setTotalWalletBalance(walletTotal);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingPayments = async () => {
    setLoadingPayments(true);
    try {
      const response = await axios.get(`${API}/admin/payments/all-pending`, { withCredentials: true });
      // El endpoint devuelve { total, investments, deposits, payments }
      setPendingPayments(response.data.payments || []);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      setPendingPayments([]); // Asegurar que sea un array en caso de error
    } finally {
      setLoadingPayments(false);
    }
  };

  const fetchPaymentHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await axios.get(`${API}/admin/users/payment-history`, { withCredentials: true });
      setPaymentHistory(response.data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setPaymentHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchPendingPayouts = async () => {
    setLoadingPayouts(true);
    try {
      const response = await axios.get(`${API}/admin/investment-returns/pending`, {
        withCredentials: true
      });
      setPendingPayouts(response.data || []);
    } catch (error) {
      setPendingPayouts([]);
      if (error.response?.status !== 404) {
        toast.error('Error al cargar pagos pendientes');
      }
    } finally {
      setLoadingPayouts(false);
    }
  };

  // Funciones para retiros pendientes
  const fetchPendingWithdrawals = async () => {
    setLoadingWithdrawals(true);
    try {
      const response = await axios.get(`${API}/admin/withdrawals/pending`, {
        withCredentials: true
      });
      setPendingWithdrawals(response.data || []);
    } catch (error) {
      setPendingWithdrawals([]);
      if (error.response?.status !== 404) {
        console.error('Error fetching withdrawals:', error);
      }
    } finally {
      setLoadingWithdrawals(false);
    }
  };

  // Función para obtener historial completo de retiros
  const fetchAllWithdrawals = async () => {
    setLoadingAllWithdrawals(true);
    try {
      const response = await axios.get(`${API}/admin/withdrawals`, {
        withCredentials: true
      });
      setAllWithdrawals(response.data || []);
    } catch (error) {
      setAllWithdrawals([]);
      if (error.response?.status !== 404) {
        console.error('Error fetching all withdrawals:', error);
      }
    } finally {
      setLoadingAllWithdrawals(false);
    }
  };

  // Filtrar retiros según los filtros seleccionados
  const getFilteredWithdrawals = () => {
    return allWithdrawals.filter(withdrawal => {
      // Filtro por estado
      if (withdrawalFilters.status !== 'all' && withdrawal.status !== withdrawalFilters.status) {
        return false;
      }

      // Filtro por búsqueda (nombre o email)
      if (withdrawalFilters.search) {
        const searchLower = withdrawalFilters.search.toLowerCase();
        const nameMatch = withdrawal.user_name?.toLowerCase().includes(searchLower);
        const emailMatch = withdrawal.user_email?.toLowerCase().includes(searchLower);
        if (!nameMatch && !emailMatch) {
          return false;
        }
      }

      // Filtro por fecha desde
      if (withdrawalFilters.dateFrom) {
        const withdrawalDate = new Date(withdrawal.created_at);
        const fromDate = new Date(withdrawalFilters.dateFrom);
        if (withdrawalDate < fromDate) {
          return false;
        }
      }

      // Filtro por fecha hasta
      if (withdrawalFilters.dateTo) {
        const withdrawalDate = new Date(withdrawal.created_at);
        const toDate = new Date(withdrawalFilters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (withdrawalDate > toDate) {
          return false;
        }
      }

      return true;
    });
  };

  const handleApproveWithdrawal = async (withdrawalId) => {
    setProcessingWithdrawal(true);
    try {
      await axios.post(`${API}/admin/withdrawals/${withdrawalId}/approve`, {}, {
        withCredentials: true
      });
      toast.success('Retiro aprobado exitosamente');
      fetchPendingWithdrawals();
      fetchUsers(); // Actualizar saldos
      fetchPlatformEarningsStats(); // Actualizar ganancias de la plataforma
      // Actualizar historial si ya fue cargado
      if (allWithdrawals.length > 0) fetchAllWithdrawals();
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      toast.error(error.response?.data?.detail || 'Error al aprobar el retiro');
    } finally {
      setProcessingWithdrawal(false);
    }
  };

  const handleRejectWithdrawal = async () => {
    if (!withdrawalRejectDialog.withdrawal || !withdrawalRejectReason.trim()) {
      toast.error('Debes proporcionar un motivo de rechazo');
      return;
    }

    setProcessingWithdrawal(true);
    try {
      await axios.post(
        `${API}/admin/withdrawals/${withdrawalRejectDialog.withdrawal._id}/reject`,
        { rejection_reason: withdrawalRejectReason.trim() },
        { withCredentials: true }
      );
      toast.success('Retiro rechazado');
      setWithdrawalRejectDialog({ open: false, withdrawal: null });
      setWithdrawalRejectReason('');
      fetchPendingWithdrawals();
      // Actualizar historial si ya fue cargado
      if (allWithdrawals.length > 0) fetchAllWithdrawals();
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      toast.error(error.response?.data?.detail || 'Error al rechazar el retiro');
    } finally {
      setProcessingWithdrawal(false);
    }
  };

  // Obtener estadísticas de ganancias de la plataforma
  const fetchPlatformEarningsStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/platform-earnings/stats`, {
        withCredentials: true
      });
      setAdminWalletBalance(response.data.balance || 0);
      setPlatformEarningsStats({
        today: response.data.today || { total: 0, count: 0 },
        month: response.data.month || { total: 0, count: 0 },
        all_time: response.data.all_time || { total: 0, count: 0 }
      });
    } catch (error) {
      console.error('Error fetching platform earnings stats:', error);
    }
  };

  const fetchUserOperations = async (userId) => {
    setLoadingOperations(true);
    try {
      const response = await axios.get(`${API}/admin/user/${userId}/payment-operations`, { withCredentials: true });
      setUserOperations(response.data);
    } catch (error) {
      console.error('Error fetching user operations:', error);
      setUserOperations([]);
    } finally {
      setLoadingOperations(false);
    }
  };

  const openHistoryDetail = async (user) => {
    setSelectedUserHistory(user);
    setHistoryDetailDialog(true);
    await fetchUserOperations(user.id);
  };

  // Filtrar usuarios del historial
  const filteredPaymentHistory = paymentHistory.filter(user => {
    const searchLower = searchFilter.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.referral_code?.toLowerCase().includes(searchLower)
    );
  });

  // Helper para formatear fechas en formato DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper para formatear fechas con hora DD/MM/YYYY HH:MM
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const formattedDate = formatDate(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${formattedDate} ${hours}:${minutes}`;
  };

  const handlePaymentAction = async () => {
    if (!actionDialog.payment || !actionDialog.type) return;

    setProcessingAction(true);
    try {
      const payment = actionDialog.payment;
      const paymentId = payment.investment_id || payment.id || payment._id;
      const isDeposit = payment.type === 'deposit';

      // Usar el endpoint correcto según el tipo de pago
      let endpoint;
      if (isDeposit) {
        endpoint = actionDialog.type === 'verify'
          ? `${API}/admin/deposits/${paymentId}/verify`
          : `${API}/admin/deposits/${paymentId}/reject`;
      } else {
        endpoint = actionDialog.type === 'verify'
          ? `${API}/admin/payments/${paymentId}/verify`
          : `${API}/admin/payments/${paymentId}/reject`;
      }

      await axios.post(endpoint, {}, { withCredentials: true });

      // Recargar los datos
      await fetchPendingPayments();
      await fetchUsers();

    } catch (error) {
      console.error('Error processing payment action:', error);
      const errorMsg = error.response?.data?.detail || 'Error al procesar la acción. Intenta nuevamente.';
      alert(errorMsg);
    } finally {
      setProcessingAction(false);
      // Cerrar el diálogo después de que todo termine
      setActionDialog({ open: false, type: null, payment: null });
    }
  };

  const openActionDialog = (type, payment) => {
    setActionDialog({ open: true, type, payment });
  };

  const openUserDetail = async (user) => {
    setSelectedUser(user);
    setUserDetailDialog(true);
    setLoadingUserDetails(true);
    setUserDetails(null);

    try {
      const response = await axios.get(`${API}/admin/user/${user.id}`, { withCredentials: true });
      setUserDetails(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Error al cargar los detalles del usuario');
    } finally {
      setLoadingUserDetails(false);
    }
  };

  const fetchPlans = async () => {
    setLoadingPlans(true);
    try {
      const response = await axios.get(`${API}/admin/plans`, { withCredentials: true });
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoadingPlans(false);
    }
  };

  const openPlanDialog = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);

      // Extraer rate_min y rate_max del return_rate si es necesario
      let rateMin = '';
      let rateMax = '';
      if (plan.return_rate) {
        const rateMatch = plan.return_rate.match(/(\d+(?:\.\d+)?)%\s*-\s*(\d+(?:\.\d+)?)%/);
        if (rateMatch) {
          rateMin = rateMatch[1];
          rateMax = rateMatch[2];
        }
      }

      setPlanFormData({
        name: plan.name || '',
        description: plan.description || '',
        min_amount: plan.min_amount || '',
        max_amount: plan.max_amount || '',
        rate_min: rateMin,
        rate_max: rateMax,
        withdrawal_period: plan.withdrawal_period || '',
        withdrawal_period_days: plan.withdrawal_period_days || '',
        market: plan.market || '',
        is_active: plan.is_active !== undefined ? plan.is_active : true,
        is_popular: plan.is_popular !== undefined ? plan.is_popular : false,
        features: plan.features || []
      });
    } else {
      setEditingPlan(null);
      setPlanFormData({
        name: '',
        description: '',
        min_amount: '',
        max_amount: '',
        rate_min: '',
        rate_max: '',
        withdrawal_period: '',
        withdrawal_period_days: '',
        market: '',
        is_active: true,
        is_popular: false,
        features: []
      });
    }
    setPlanDialog(true);
  };

  const handleSavePlan = async () => {
    // Validar campos requeridos
    if (!planFormData.name || !planFormData.min_amount || !planFormData.rate_min ||
      !planFormData.rate_max || !planFormData.withdrawal_period_days || !planFormData.market) {
      alert('Por favor completa todos los campos obligatorios (*)');
      return;
    }

    // Validar que las tasas sean válidas
    if (parseFloat(planFormData.rate_min) >= parseFloat(planFormData.rate_max)) {
      alert('La tasa mínima debe ser menor que la tasa máxima');
      return;
    }

    // Validar que el monto mínimo sea válido
    if (parseFloat(planFormData.min_amount) <= 0) {
      alert('El monto mínimo debe ser mayor a 0');
      return;
    }

    // Validar que si hay monto máximo, sea mayor al mínimo
    if (planFormData.max_amount && parseFloat(planFormData.max_amount) <= parseFloat(planFormData.min_amount)) {
      alert('El monto máximo debe ser mayor al monto mínimo');
      return;
    }

    setSavingPlan(true);
    try {
      if (editingPlan) {
        // Editar plan existente
        await axios.put(`${API}/admin/plans/${editingPlan._id}`, planFormData, { withCredentials: true });
      } else {
        // Crear nuevo plan
        await axios.post(`${API}/admin/plans`, planFormData, { withCredentials: true });
      }
      await fetchPlans();
      setPlanDialog(false);
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Error al guardar el plan. Verifica los campos.');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await axios.delete(`${API}/admin/plans/${planId}`, { withCredentials: true });
      await fetchPlans();
      setDeletePlanDialog(null);
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Error al eliminar el plan');
    }
  };

  const handleTogglePlanStatus = async (plan) => {
    try {
      await axios.put(`${API}/admin/plans/${plan._id}`, {
        is_active: !plan.is_active
      }, { withCredentials: true });
      await fetchPlans();
    } catch (error) {
      console.error('Error toggling plan status:', error);
      alert('Error al cambiar el estado del plan');
    }
  };

  const handleLogout = () => {
    setShowLogoutDialog(false);
    logout();
  };

  const openProofModal = (payment) => {
    if (payment.payment_proof) {
      setSelectedProof(payment);
      setProofModal(true);
    }
  };

  // Funciones para métodos de pago
  const fetchPaymentMethods = async () => {
    setLoadingPaymentMethods(true);
    try {
      const response = await axios.get(`${API}/admin/payment-methods`, { withCredentials: true });
      setPaymentMethods(response.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  const openPaymentMethodDialog = (method = null) => {
    if (method) {
      setEditingPaymentMethod(method);
      setPaymentMethodFormData({
        type: method.type || 'bank',
        details: method.details || {
          bank_name: '',
          account_number: '',
          account_type: '',
          account_holder: '',
          identification: '',
          email: '',
          wallet_address: '',
          qr_code_url: ''
        },
        is_active: method.is_active !== undefined ? method.is_active : true,
        qr_code_file: null
      });
    } else {
      setEditingPaymentMethod(null);
      setPaymentMethodFormData({
        type: '',
        details: {
          bank_name: '',
          account_number: '',
          account_type: '',
          account_holder: '',
          identification: '',
          email: '',
          wallet_address: '',
          qr_code_url: ''
        },
        is_active: true,
        qr_code_file: null
      });
    }
    setPaymentMethodDialog(true);
  };

  const handleSavePaymentMethod = async () => {
    // Validar que se haya seleccionado un tipo de método
    if (!paymentMethodFormData.type) {
      toast.error('Por favor selecciona un tipo de método de pago');
      return;
    }

    setSavingPaymentMethod(true);
    try {
      let qrCodeUrl = paymentMethodFormData.details.qr_code_url || '';

      // Si hay un archivo QR para subir
      if (paymentMethodFormData.qr_code_file) {
        const formData = new FormData();
        formData.append('file', paymentMethodFormData.qr_code_file);

        const uploadResponse = await axios.post(
          `${API}/admin/upload-qr`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          }
        );

        qrCodeUrl = uploadResponse.data.url;
      }

      // Generar nombre automáticamente basado en el tipo
      const typeNames = {
        'crypto': 'Wallet TRC20',
        'binance': 'Binance Pay',
        'bank': 'Transferencia Bancaria',
        'zelle': 'Zelle',
        'paypal': 'PayPal',
        'stripe': 'Stripe',
        'contact': 'Contactar con el Administrador'
      };

      // Preparar detalles, solo incluir qr_code_url si existe
      const details = { ...paymentMethodFormData.details };
      if (qrCodeUrl) {
        details.qr_code_url = qrCodeUrl;
      } else {
        delete details.qr_code_url;
      }

      // Preparar datos para guardar
      const dataToSave = {
        ...paymentMethodFormData,
        name: typeNames[paymentMethodFormData.type] || paymentMethodFormData.type,
        details
      };
      delete dataToSave.qr_code_file;

      if (editingPaymentMethod) {
        // Actualizar método existente
        await axios.put(
          `${API}/admin/payment-methods/${editingPaymentMethod._id}`,
          dataToSave,
          { withCredentials: true }
        );
        toast.success('Método de pago actualizado exitosamente');
      } else {
        // Crear nuevo método
        await axios.post(
          `${API}/admin/payment-methods`,
          dataToSave,
          { withCredentials: true }
        );
        toast.success('Método de pago creado exitosamente');
      }

      await fetchPaymentMethods();
      setPaymentMethodDialog(false);
    } catch (error) {
      console.error('Error saving payment method:', error);
      toast.error(error.response?.data?.detail || 'Error al guardar el método de pago');
    } finally {
      setSavingPaymentMethod(false);
    }
  };

  const handleTogglePaymentMethodStatus = async (methodId, currentStatus) => {
    try {
      await axios.put(
        `${API}/admin/payment-methods/${methodId}`,
        { is_active: !currentStatus },
        { withCredentials: true }
      );
      await fetchPaymentMethods();
      toast.success(`Método de pago ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
    } catch (error) {
      console.error('Error toggling payment method status:', error);
      toast.error('Error al cambiar el estado del método de pago');
    }
  };

  const confirmDeletePaymentMethod = async () => {
    try {
      await axios.delete(
        `${API}/admin/payment-methods/${deletePaymentMethodDialog._id}`,
        { withCredentials: true }
      );
      await fetchPaymentMethods();
      setDeletePaymentMethodDialog(null);
      toast.success('Método de pago eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error(error.response?.data?.detail || 'Error al eliminar el método de pago');
    }
  };

  // Estados para configuración de pagos pendientes
  const handleOpenPayoutConfig = (payout) => {
    setPayoutConfigDialog({ open: true, payout });
  };

  const handleClosePayoutConfig = () => {
    setPayoutConfigDialog({ open: false, payout: null });
  };



  const handleApprovePayout = async (payout) => {
    setProcessingPayoutAction(true);
    try {
      await axios.post(
        `${API}/admin/investment-returns/${payout._id}/approve`,
        {},
        { withCredentials: true }
      );

      toast.success('Pago aprobado exitosamente');
      await fetchPendingPayouts();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al aprobar pago');
    } finally {
      setProcessingPayoutAction(false);
    }
  };

  const openPayoutActionDialog = (payout) => {
    setPayoutActionDialog({ open: true, payout });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando datos administrativos...</p>
        </div>
      </div>
    );
  }

  const totalInvested = users.reduce((sum, u) => sum + u.total_invested, 0);
  const totalUsers = users.length;
  const activeInvestments = users.reduce((sum, u) => sum + u.active_investments, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="w-full px-3 md:px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Botón hamburguesa - solo móvil */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-brand-500 transition-colors"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <img src={logoFull} alt="VNSOW" className="h-6 md:h-8" />
            <span className="hidden md:inline text-xl font-semibold text-slate-600">Admin</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            {/* Notification Badge */}
            {(pendingPayments.length > 0 || pendingPayouts.length > 0) && (
              <div className="relative">
                <Bell className="h-5 w-5 md:h-6 md:w-6 text-slate-600" />
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[18px] h-4.5 md:min-w-[20px] md:h-5 flex items-center justify-center">
                  {pendingPayments.length + pendingPayouts.length}
                </Badge>
              </div>
            )}
            {/* Settings Button */}
            <button
              onClick={() => navigate('/admin/settings')}
              className="inline-flex items-center justify-center text-slate-500 hover:text-brand-600 transition-colors"
              title="Configuración"
            >
              <Settings className="h-5 w-5 md:h-6 md:w-6" />
            </button>
            {/* Avatar y nombre - solo escritorio */}
            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center">
                <span className="text-brand-700 font-bold text-lg">
                  {admin?.username?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-semibold text-slate-900">{admin?.username || 'Admin'}</div>
                <div className="text-xs text-brand-600">Administrador</div>
              </div>
            </div>
            {/* Botón Cerrar Sesión - solo escritorio */}
            <Button
              onClick={() => setShowLogoutDialog(true)}
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Menú lateral móvil del admin */}
      <div
        className={`fixed inset-x-0 top-[64px] h-[calc(100vh-64px)] z-40 md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        {/* Overlay con transición */}
        <div
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Sidebar con transición de deslizamiento */}
        <div
          className={`absolute left-0 top-0 h-full w-72 max-w-[80vw] bg-white shadow-xl border-r border-slate-200 flex flex-col transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
            {/* Navegación */}
            <div className="flex-1 p-4 overflow-y-auto">
              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('usuarios');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'usuarios'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Users className="h-5 w-5" />
                  <span>Usuarios</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('pagos');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pagos'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Clock className="h-5 w-5" />
                  <span>Inversiones Pendientes</span>
                  {pendingPayments.length > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs">
                      {pendingPayments.length}
                    </Badge>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('pagos-pendientes');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pagos-pendientes'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <DollarSign className="h-5 w-5" />
                  <span>Pagos Pendientes</span>
                  {pendingPayouts.length > 0 && (
                    <Badge className="ml-auto bg-red-500 text-white text-xs">
                      {pendingPayouts.length}
                    </Badge>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('planes');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'planes'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Briefcase className="h-5 w-5" />
                  <span>Planes de Inversión</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('metodos-pago');
                    if (!paymentMethods.length) fetchPaymentMethods();
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'metodos-pago'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Métodos de Pago</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('retiros-pendientes');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'retiros-pendientes'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <Wallet className="h-5 w-5" />
                  <span>Retiros Pendientes</span>
                  {pendingWithdrawals.length > 0 && (
                    <Badge className="ml-auto bg-orange-500">{pendingWithdrawals.length}</Badge>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('historial-retiros');
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'historial-retiros'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <FileText className="h-5 w-5" />
                  <span>Historial de Retiros</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('historial-pagos');
                    if (!paymentHistory.length) fetchPaymentHistory();
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'historial-pagos'
                    ? 'bg-brand-50 text-brand-700 border border-brand-200'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <History className="h-5 w-5" />
                  <span>Historial de Operaciones</span>
                </button>

                {/* Configuración */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/admin/settings');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                  <span>Configuración</span>
                </button>

                {/* Cerrar Sesión (dentro del menú, mismo estilo que cliente) */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowLogoutDialog(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-4 border-t pt-4 border-slate-100"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

      {/* Layout principal con sidebar */}
      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Sidebar fijo - solo desktop */}
        <aside className="hidden md:flex flex-col w-72 lg:w-80 bg-white border-r border-slate-200 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
          {/* Navegación del sidebar */}
          <nav className="flex-1 p-4 space-y-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('usuarios');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'usuarios'
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Usuarios</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('pagos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pagos'
                ? 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Clock className="h-5 w-5" />
              <span>Inversiones Pendientes</span>
              {pendingPayments.length > 0 && (
                <Badge className="ml-auto bg-red-500 text-white text-xs">
                  {pendingPayments.length}
                </Badge>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('pagos-pendientes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pagos-pendientes'
                ? 'bg-teal-50 text-teal-700 border border-teal-200'
                : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <DollarSign className="h-5 w-5" />
              <span>Pagos Pendientes</span>
              {pendingPayouts.length > 0 && (
                <Badge className="ml-auto bg-red-500 text-white text-xs">
                  {pendingPayouts.length}
                </Badge>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('planes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'planes'
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span>Planes de Inversión</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('metodos-pago');
                if (!paymentMethods.length) fetchPaymentMethods();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'metodos-pago'
                ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span>Métodos de Pago</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('retiros-pendientes');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'retiros-pendientes'
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Wallet className="h-5 w-5" />
              <span>Retiros Pendientes</span>
              {pendingWithdrawals.length > 0 && (
                <Badge className="ml-auto bg-orange-500 text-white text-xs">{pendingWithdrawals.length}</Badge>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('historial-retiros');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'historial-retiros'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Historial de Retiros</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('historial-pagos');
                if (!paymentHistory.length) fetchPaymentHistory();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'historial-pagos'
                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <History className="h-5 w-5" />
              <span>Historial de Operaciones</span>
            </button>

            {/* Separador */}
            <div className="border-t border-slate-200 my-3"></div>

            {/* Configuración */}
            <button
              type="button"
              onClick={() => navigate('/admin/settings')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Configuración</span>
            </button>
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowLogoutDialog(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
        {/* Admin Stats - Diseño atractivo compacto */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 md:gap-4 mb-5 md:mb-6">
          {/* Total Usuarios */}
          <Card className="border-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-3 md:p-4 relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] md:text-xs text-blue-100 font-semibold uppercase tracking-wide">Total Usuarios</div>
                <div className="bg-white/20 p-1.5 md:p-2 rounded-lg backdrop-blur-sm">
                  <Users className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
              </div>
              <div className="text-2xl md:text-4xl font-extrabold mb-1">{totalUsers.toLocaleString()}</div>
              <div className="text-[10px] md:text-xs text-blue-100 flex items-center gap-1">
                <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
                <span>{activeInvestments.toLocaleString()} inversiones</span>
              </div>
            </CardContent>
          </Card>

          {/* Capital Total */}
          <Card className="border-0 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-3 md:p-4 relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] md:text-xs text-brand-100 font-semibold uppercase tracking-wide">Capital Total</div>
                <div className="bg-white/20 p-1.5 md:p-2 rounded-lg backdrop-blur-sm">
                  <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
              </div>
              <div className="text-2xl md:text-4xl font-extrabold mb-1">
                ${totalInvested >= 1000000
                  ? formatMoney(totalInvested / 1000000).replace(',00', '') + 'M'
                  : formatMoney(totalInvested)}
              </div>
              <div className="text-[10px] md:text-xs text-brand-100">Total invertido</div>
            </CardContent>
          </Card>

          {/* Dinero en Billeteras */}
          <Card className="border-0 bg-gradient-to-br from-teal-500 via-teal-600 to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-3 md:p-4 relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] md:text-xs text-teal-100 font-semibold uppercase tracking-wide">En Billeteras</div>
                <div className="bg-white/20 p-1.5 md:p-2 rounded-lg backdrop-blur-sm">
                  <Wallet className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
              </div>
              <div className="text-2xl md:text-4xl font-extrabold mb-1">
                ${totalWalletBalance >= 1000000
                  ? formatMoney(totalWalletBalance / 1000000).replace(',00', '') + 'M'
                  : formatMoney(totalWalletBalance)}
              </div>
              <div className="text-[10px] md:text-xs text-teal-100">Dinero disponible</div>
            </CardContent>
          </Card>

          {/* Inversiones Activas */}
          <Card className="border-0 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-3 md:p-4 relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] md:text-xs text-purple-100 font-semibold uppercase tracking-wide">Inversiones Activas</div>
                <div className="bg-white/20 p-1.5 md:p-2 rounded-lg backdrop-blur-sm">
                  <Activity className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
              </div>
              <div className="text-2xl md:text-4xl font-extrabold mb-1">{activeInvestments.toLocaleString()}</div>
              <div className="text-[10px] md:text-xs text-purple-100">Operaciones activas</div>
            </CardContent>
          </Card>

          {/* Promedio Usuario */}
          <Card className="border-0 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-3 md:p-4 relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] md:text-xs text-orange-100 font-semibold uppercase tracking-wide">Promedio Usuario</div>
                <div className="bg-white/20 p-1.5 md:p-2 rounded-lg backdrop-blur-sm">
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
              </div>
              <div className="text-2xl md:text-4xl font-extrabold mb-1">
                ${totalUsers > 0 ? formatMoney(totalInvested / totalUsers) : '0,00'}
              </div>
              <div className="text-[10px] md:text-xs text-orange-100">Inversión promedio</div>
            </CardContent>
          </Card>

          {/* Comisiones / Ganancias */}
          <Card className="border-0 bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
            <CardContent className="p-3 md:p-4 relative z-10">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] md:text-xs text-amber-100 font-semibold uppercase tracking-wide">Comisiones</div>
                <div className="bg-white/20 p-1.5 md:p-2 rounded-lg backdrop-blur-sm">
                  <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
              </div>
              <div className="text-2xl md:text-4xl font-extrabold mb-1">
                ${formatMoney(adminWalletBalance)}
              </div>
              <div className="text-[10px] md:text-xs text-amber-100 flex items-center gap-1">
                <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
                <span>${formatMoney(platformEarningsStats.month.total)} este mes</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          {/* Usuarios - Tabla Mejorada */}
          <TabsContent value="usuarios">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="h-6 w-6 text-brand-600" />
                  Gestión de Usuarios
                </CardTitle>
                <CardDescription>Vista general de todos los usuarios registrados ({users.length} usuarios)</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Vista de tabla - solo escritorio */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="font-semibold">Usuario</TableHead>
                        <TableHead className="font-semibold">Contacto</TableHead>
                        <TableHead className="font-semibold">Info de Pago</TableHead>
                        <TableHead className="font-semibold text-right">Total Invertido</TableHead>
                        <TableHead className="font-semibold text-center">Inversiones</TableHead>
                        <TableHead className="font-semibold text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((u) => (
                        <TableRow key={u.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {/* Avatar de usuario - prioridad: custom_picture > picture > inicial */}
                              {(u.custom_picture || u.picture) ? (
                                <>
                                  <img
                                    src={u.custom_picture || u.picture}
                                    alt={u.name}
                                    referrerPolicy="no-referrer"
                                    className="w-10 h-10 rounded-full border-2 border-brand-200 object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg border-2 border-brand-200"
                                    style={{ display: 'none' }}
                                  >
                                    {u.name?.charAt(0).toUpperCase() || 'U'}
                                  </div>
                                </>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg border-2 border-brand-200">
                                  {u.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                              )}
                              <div>
                                <div className="font-semibold text-slate-900">{u.name}</div>
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Desde {new Date(u.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm text-slate-900">{u.email}</div>
                              {u.phone && (
                                <div className="text-xs text-slate-500">📞 {u.phone}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {u.payment_info ? (
                              <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-300">
                                {u.payment_info.payment_type === 'bank_transfer' ? 'Transferencia' :
                                 u.payment_info.payment_type === 'crypto' ? 'Wallet TRC20' :
                                 u.payment_info.payment_type === 'binance' ? 'Binance Pay' :
                                 u.payment_info.payment_type === 'zelle' ? 'Zelle' :
                                 u.payment_info.payment_type === 'paypal' ? 'PayPal' :
                                 u.payment_info.payment_type}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-slate-100 text-slate-500">
                                Sin registrar
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="font-bold text-lg text-brand-600">
                              ${u.total_invested.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                              {u.active_investments} activas
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              onClick={() => openUserDetail(u)}
                              size="sm"
                              className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalle
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Vista de tarjetas - solo móvil */}
                <div className="md:hidden">
                  {users.map((u) => (
                    <UserMobileCard
                      key={u.id}
                      user={u}
                      onViewDetail={openUserDetail}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inversiones Pendientes - Mejorado */}
          <TabsContent value="pagos">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b">
                {/* Desktop: layout horizontal */}
                <div className="hidden md:flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Clock className="h-6 w-6 text-orange-600" />
                      <span>Inversiones Pendientes por Verificación</span>
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Inversiones creadas por usuarios que requieren verificación de pago ({pendingPayments.length} pendientes)
                    </CardDescription>
                  </div>
                </div>

                {/* Mobile: layout vertical centrado */}
                <div className="md:hidden text-center">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <CardTitle className="text-xl">
                      Inversiones Pendientes por Verificación
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-600">
                    Verificación de pago ({pendingPayments.length} pendientes)
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-2.5">
                {loadingPayments && !processingAction ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando inversiones pendientes...</p>
                  </div>
                ) : pendingPayments.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-brand-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">¡Todo al día!</h3>
                    <p className="text-slate-600">No hay inversiones pendientes de verificación en este momento.</p>
                  </div>
                ) : (
                  <>
                    {/* Vista de tabla - solo escritorio */}
                    <div className="hidden md:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="font-semibold">Usuario</TableHead>
                            <TableHead className="font-semibold">Contacto</TableHead>
                            <TableHead className="font-semibold text-right">Monto</TableHead>
                            <TableHead className="font-semibold">Plan/Tipo</TableHead>
                            <TableHead className="font-semibold text-center">Información de Pago</TableHead>
                            <TableHead className="font-semibold">Fecha</TableHead>
                            <TableHead className="font-semibold text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingPayments.map((payment) => (
                            <TableRow key={payment.id || payment.investment_id} className="hover:bg-orange-50 transition-colors border-l-4 border-l-orange-400">
                              <TableCell>
                                <div className="font-semibold text-slate-900 flex items-center gap-2">
                                  {/* Avatar de usuario - prioridad: user_picture > inicial */}
                                  {payment.user_picture ? (
                                    <>
                                      <img
                                        src={payment.user_picture}
                                        alt={payment.user_name}
                                        referrerPolicy="no-referrer"
                                        className={`w-9 h-9 rounded-full border-2 object-cover ${payment.type === 'deposit' ? 'border-brand-300' : 'border-orange-300'}`}
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'flex';
                                        }}
                                      />
                                      <div
                                        className={`w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm ${payment.type === 'deposit' ? 'from-brand-400 to-brand-600' : 'from-orange-400 to-orange-600'}`}
                                        style={{ display: 'none' }}
                                      >
                                        {payment.user_name?.charAt(0).toUpperCase() || '?'}
                                      </div>
                                    </>
                                  ) : (
                                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm ${payment.type === 'deposit' ? 'from-brand-400 to-brand-600' : 'from-orange-400 to-orange-600'}`}>
                                      {payment.user_name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                  )}
                                  <div>
                                    <div>{payment.user_name || 'N/A'}</div>
                                    <div className="text-xs text-slate-500 font-normal">{payment.user_email || 'N/A'}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-slate-600">
                                  {payment.user_phone || 'Sin teléfono'}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="font-bold text-lg text-brand-600">
                                  ${payment.amount?.toLocaleString() || '0'}
                                </div>
                              </TableCell>
                              <TableCell>
                                {payment.type === 'deposit' ? (
                                  <Badge className="bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm">
                                    💰 Depósito de Billetera
                                  </Badge>
                                ) : (
                                  <div className="space-y-1">
                                    <div className="text-sm font-semibold text-slate-900">{payment.plan_name}</div>
                                    <div className="text-xs text-slate-500">{payment.plan_rate}</div>
                                    <Badge variant="outline" className="mt-1 text-xs bg-purple-50 text-purple-700 border-purple-300">
                                      {payment.market}
                                    </Badge>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setPaymentInfoDialog({ open: true, payment })}
                                  className="bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver detalles
                                </Button>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-slate-600">
                                  {new Date(payment.created_at).toLocaleString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }).replace(',', '')}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    size="sm"
                                    onClick={() => openActionDialog('verify', payment)}
                                    className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-md hover:shadow-lg transition-all"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Aprobar
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => openActionDialog('reject', payment)}
                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Rechazar
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Vista de tarjetas - solo móvil */}
                    <div className="md:hidden">
                      {pendingPayments.map((payment) => (
                        <PendingInvestmentMobileCard
                          key={payment.id || payment.investment_id}
                          payment={payment}
                          onViewDetails={(p) => setPaymentInfoDialog({ open: true, payment: p })}
                          onApprove={(p) => openActionDialog('verify', p)}
                          onReject={(p) => openActionDialog('reject', p)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pagos Pendientes */}
          <TabsContent value="pagos-pendientes">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-teal-50 to-teal-100 border-b">
                {/* Desktop: layout horizontal */}
                <div className="hidden md:flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-teal-600" />
                        <span>Pagos de retribuciones pendientes</span>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Gestión de pagos de retribución pendientes a los usuarios
                    </CardDescription>
                  </div>
                </div>

                {/* Mobile: layout vertical centrado */}
                <div className="md:hidden text-center">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <DollarSign className="h-8 w-8 text-teal-600" />
                    <CardTitle className="text-xl">
                      Pagos de retribuciones pendientes
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-600">
                    Gestión de pagos de retribución pendientes a los usuarios
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {(() => {
                  // Datos hardcodeados de pagos pendientes para configuración de retribución


                  const handleOpenPayoutConfig = (payout) => {
                    setPayoutConfigDialog({ open: true, payout });
                  };

                  const handleClosePayoutConfig = () => {
                    setPayoutConfigDialog({ open: false, payout: null });
                  };

                  const handleSavePayoutConfig = async (payout, percentage) => {
                    setSavingPayoutConfig(true);
                    try {
                      await axios.post(
                        `${API}/admin/investment-returns/${payout._id}/configure`,
                        { percentage },
                        { withCredentials: true }
                      );

                      toast.success('Configuración guardada exitosamente');
                      await fetchPendingPayouts();
                      handleClosePayoutConfig();
                    } catch (error) {
                      toast.error(error.response?.data?.detail || 'Error al guardar configuración');
                    } finally {
                      setSavingPayoutConfig(false);
                    }
                  };

                  const openPayoutActionDialog = (type, payout) => {
                    setPayoutActionDialog({ open: true, payout });
                  };

                  return (
                    <>
                      {pendingPayouts.length === 0 ? (
                        <div className="text-center py-12">
                          <CheckCircle className="h-16 w-16 text-brand-500 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay pagos pendientes</h3>
                          <p className="text-slate-600">Actualmente no hay pagos pendientes por configurar.</p>
                        </div>
                      ) : (
                        <>
                          {/* Vista de tarjetas minimalista - solo escritorio */}
                          <div className="hidden md:block space-y-3">
                            {pendingPayouts.map((payout) => {
                              const percentageLabel = payout.configured_percentage
                                ? `${payout.configured_percentage.toFixed(2)}%`
                                : '-';
                              const amountLabel = payout.configured_amount
                                ? `$${payout.configured_amount.toFixed(2)}`
                                : '-';
                              const hasConfig = payout.status === 'configured';

                              // Determinar si es rango o porcentaje fijo
                              const isRange = payout.plan_rate_min !== payout.plan_rate_max;
                              const rateDisplay = isRange
                                ? `${payout.plan_rate_min}% - ${payout.plan_rate_max}%`
                                : `${payout.plan_rate_min}%`;

                              return (
                                <div
                                  key={payout._id}
                                  className="bg-white rounded-lg border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all duration-200 p-4"
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    {/* Usuario - Sección izquierda */}
                                    <div className="flex items-center gap-3 min-w-[200px]">
                                      {payout.user_custom_picture || payout.user_picture ? (
                                        <img
                                          src={payout.user_custom_picture || payout.user_picture}
                                          alt={payout.user_name}
                                          referrerPolicy="no-referrer"
                                          className="w-10 h-10 rounded-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                                          {payout.user_name.charAt(0).toUpperCase()}
                                        </div>
                                      )}
                                      <div className="min-w-0">
                                        <div className="font-semibold text-sm text-slate-900 truncate">{payout.user_name}</div>
                                        <div className="text-xs text-slate-500 truncate">{payout.user_email}</div>
                                      </div>
                                    </div>

                                    {/* Plan e info - Centro */}
                                    <div className="flex items-center gap-6 flex-1">
                                      {/* Plan y rango */}
                                      <div className="min-w-[160px]">
                                        <div className="text-xs text-slate-500 mb-0.5">Plan</div>
                                        <div className="font-medium text-sm text-slate-900">{payout.plan_name}</div>
                                        <div className="flex items-center gap-1.5 mt-1">
                                          <Badge variant="outline" className="text-xs py-0 px-1.5 bg-teal-50 text-teal-700 border-teal-200">
                                            {rateDisplay}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs py-0 px-1.5 bg-blue-50 text-blue-700 border-blue-200">
                                            Ciclo {payout.cycle_number}
                                          </Badge>
                                        </div>
                                      </div>

                                      {/* Monto base */}
                                      <div className="min-w-[100px]">
                                        <div className="text-xs text-slate-500 mb-0.5">Monto Base</div>
                                        <div className="font-bold text-lg text-brand-600">
                                          ${payout.base_amount.toLocaleString()}
                                        </div>
                                      </div>

                                      {/* Porcentaje y monto configurado */}
                                      <div className="min-w-[140px]">
                                        <div className="text-xs text-slate-500 mb-0.5">Config. / A Pagar</div>
                                        <div className="flex items-center gap-2">
                                          {percentageLabel !== '-' ? (
                                            <>
                                              <Badge className="bg-teal-600 text-white text-sm font-semibold">
                                                {percentageLabel}
                                              </Badge>
                                              <span className="font-bold text-base text-teal-600">{amountLabel}</span>
                                            </>
                                          ) : (
                                            <span className="text-slate-400 text-sm">Sin configurar</span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Fecha */}
                                      <div className="min-w-[90px]">
                                        <div className="text-xs text-slate-500 mb-0.5">Fecha</div>
                                        <div className="text-sm text-slate-700">
                                          {new Date(payout.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Acciones - Derecha */}
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleOpenPayoutConfig(payout)}
                                        className="bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700"
                                      >
                                        <Settings className="h-4 w-4 mr-1.5" />
                                        Configurar
                                      </Button>

                                      <Button
                                        size="sm"
                                        disabled={!hasConfig}
                                        onClick={() => hasConfig && openPayoutActionDialog('approve', payout)}
                                        className={`${hasConfig
                                          ? 'bg-brand-600 hover:bg-brand-700 text-white'
                                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                          }`}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1.5" />
                                        Aprobar
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Vista de tarjetas - solo móvil */}
                          <div className="md:hidden">
                            {pendingPayouts.map((payout) => (
                              <PendingPayoutMobileCard
                                key={payout._id}
                                payout={payout}
                                onConfigure={handleOpenPayoutConfig}
                                onApprove={(payout) => openPayoutActionDialog('approve', payout)}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      {/* Diálogo de confirmación de aprobación/rechazo (demo, solo front) */}
                      <AlertDialog
                        open={payoutActionDialog.open}
                        onOpenChange={(open) => !processingPayoutAction && setPayoutActionDialog({ open: false, payout: null })}
                      >
                        <AlertDialogContent className="w-[calc(100%-2rem)] rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Aprobar pago?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {payoutActionDialog.payout && (
                                <>
                                  Estás a punto de <strong>aprobar</strong> el pago de{' '}
                                  <strong>
                                    ${payoutActionDialog.payout.configured_amount?.toFixed(2)}
                                  </strong>{' '}
                                  del usuario <strong>{payoutActionDialog.payout.user_name}</strong>.
                                  <br /><br />
                                  El monto será agregado a su billetera y recibirá una notificación.
                                </>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={processingPayoutAction}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              disabled={processingPayoutAction}
                              className="bg-brand-600 hover:bg-brand-700"
                              onClick={async () => {
                                await handleApprovePayout(payoutActionDialog.payout);
                                setPayoutActionDialog({ open: false, payout: null });
                              }}
                            >
                              {processingPayoutAction ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Procesando...
                                </>
                              ) : (
                                'Aprobar Pago'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Modal de configuración de pago pendiente (demo, solo front) */}
                      {/* Diálogo de confirmación de aprobación */}
                      <AlertDialog
                        open={payoutActionDialog.open}
                        onOpenChange={(open) => !processingPayoutAction && setPayoutActionDialog({ open: false, payout: null })}
                      >
                        <AlertDialogContent className="w-[calc(100%-2rem)] rounded-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Aprobar pago?</AlertDialogTitle>
                            <AlertDialogDescription>
                              {payoutActionDialog.payout && (() => {
                                const configuredAmount = payoutActionDialog.payout.configured_amount ||
                                  (payoutActionDialog.payout.base_amount * (payoutActionDialog.payout.configured_percentage / 100));
                                return (
                                  <>
                                    Estás a punto de <strong>aprobar</strong> el pago de{' '}
                                    <strong>
                                      ${configuredAmount ? configuredAmount.toLocaleString() : '0'}
                                    </strong>{' '}
                                    del usuario <strong>{payoutActionDialog.payout.user_name}</strong>.
                                    <br /><br />
                                    El monto será agregado a su billetera y recibirá una notificación.
                                  </>
                                );
                              })()}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel disabled={processingPayoutAction}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              disabled={processingPayoutAction}
                              className="bg-brand-600 hover:bg-brand-700"
                              onClick={async () => {
                                await handleApprovePayout(payoutActionDialog.payout);
                                setPayoutActionDialog({ open: false, payout: null });
                              }}
                            >
                              {processingPayoutAction ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Procesando...
                                </>
                              ) : (
                                'Aprobar Pago'
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <PayoutConfigDialog
                        dialogState={payoutConfigDialog}
                        onClose={handleClosePayoutConfig}
                        onSave={handleSavePayoutConfig}
                        saving={savingPayoutConfig}
                      />
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Planes de Inversión */}
          <TabsContent value="planes">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
                {/* Desktop: layout horizontal */}
                <div className="hidden md:flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Briefcase className="h-6 w-6 text-purple-600" />
                      Planes de Inversión
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Gestiona los planes de inversión disponibles para los usuarios ({plans.length} planes)
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => openPlanDialog()}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Plan
                  </Button>
                </div>

                {/* Mobile: layout vertical centrado */}
                <div className="md:hidden text-center">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <Briefcase className="h-8 w-8 text-purple-600" />
                    <CardTitle className="text-2xl">
                      Planes de Inversión
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 mb-3">
                    Gestiona los planes de inversión disponibles para los usuarios ({plans.length} planes)
                  </CardDescription>
                  <Button
                    onClick={() => openPlanDialog()}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-md w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Plan
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loadingPlans ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando planes...</p>
                  </div>
                ) : plans.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay planes creados</h3>
                    <p className="text-slate-600 mb-4">Crea tu primer plan de inversión</p>
                    <Button
                      onClick={() => openPlanDialog()}
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Plan
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map((plan) => (
                      <div
                        key={plan._id}
                        className={`relative border-2 rounded-lg p-4 transition-all ${plan.is_active
                          ? 'border-brand-300 bg-gradient-to-br from-brand-50 to-teal-50 shadow-md'
                          : 'border-slate-300 bg-slate-50 opacity-75'
                          }`}
                      >
                        {/* Badges de Estado */}
                        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                          {plan.is_active ? (
                            <Badge className="bg-brand-600 text-white shadow-sm text-xs">
                              <Power className="h-2.5 w-2.5 mr-1" />
                              Activo
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-slate-200 text-slate-600 text-xs">
                              <PowerOff className="h-2.5 w-2.5 mr-1" />
                              Inactivo
                            </Badge>
                          )}
                          {plan.is_popular && (
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm text-xs font-bold">
                              ⭐ POPULAR
                            </Badge>
                          )}
                        </div>

                        {/* Nombre del Plan */}
                        <div className="mb-3 pr-16">
                          <h3 className="font-bold text-lg text-slate-900 mb-0.5">
                            {plan.name}
                          </h3>
                          {plan.description && (
                            <p className="text-xs text-slate-600 line-clamp-1">
                              {plan.description}
                            </p>
                          )}
                        </div>

                        {/* Tasa de Retorno */}
                        <div className="mb-3">
                          <div className="text-2xl font-bold text-brand-600">
                            {plan.return_rate || `${plan.rate_min}% - ${plan.rate_max}%`}
                          </div>
                          <div className="text-xs text-slate-500">Rentabilidad mensual</div>
                        </div>

                        {/* Detalles del Plan */}
                        <div className="space-y-1.5 mb-3">
                          <div className="flex items-start gap-1.5 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">
                              <strong>Mínimo:</strong> ${plan.min_amount.toLocaleString()}
                            </span>
                          </div>
                          {plan.max_amount && (
                            <div className="flex items-start gap-1.5 text-xs">
                              <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 mt-0.5 flex-shrink-0" />
                              <span className="text-slate-700">
                                <strong>Máximo:</strong> ${plan.max_amount.toLocaleString()}
                              </span>
                            </div>
                          )}
                          <div className="flex items-start gap-1.5 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">
                              <strong>Retiros:</strong> {plan.withdrawal_period || `${plan.withdrawal_period_days} días`}
                            </span>
                          </div>
                          <div className="flex items-start gap-1.5 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-brand-600 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">
                              <strong>Mercado:</strong> {plan.market}
                            </span>
                          </div>
                        </div>

                        {/* Features */}
                        {plan.features && plan.features.length > 0 && (
                          <div className="mb-3 p-2 bg-white rounded-md border border-brand-200">
                            <div className="text-xs font-semibold text-slate-600 mb-1">
                              Características:
                            </div>
                            <div className="space-y-0.5">
                              {plan.features.slice(0, 2).map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-1 text-xs text-slate-600">
                                  <span className="text-brand-600">•</span>
                                  <span className="line-clamp-1">{feature}</span>
                                </div>
                              ))}
                              {plan.features.length > 2 && (
                                <div className="text-xs text-slate-500 italic">
                                  +{plan.features.length - 2} más...
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Acciones */}
                        <div className="flex gap-1.5 pt-3 border-t border-slate-200">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleTogglePlanStatus(plan)}
                            className={`flex-1 text-xs h-8 ${plan.is_active
                              ? 'hover:bg-slate-100'
                              : 'hover:bg-brand-50 text-brand-700'
                              }`}
                            title={plan.is_active ? 'Desactivar' : 'Activar'}
                          >
                            {plan.is_active ? (
                              <>
                                <PowerOff className="h-3 w-3 mr-1" />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <Power className="h-3 w-3 mr-1" />
                                Activar
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openPlanDialog(plan)}
                            className="hover:bg-blue-50 h-8 w-8 p-0"
                            title="Editar"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeletePlanDialog(plan)}
                            className="hover:bg-red-50 text-red-600 h-8 w-8 p-0"
                            title="Eliminar"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Métodos de Pago */}
          <TabsContent value="metodos-pago">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-t-lg">
                {/* Desktop: layout horizontal */}
                <div className="hidden md:flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <CreditCard className="h-6 w-6" />
                      Métodos de Pago
                    </CardTitle>
                    <CardDescription className="text-cyan-50">
                      Gestiona los métodos de pago disponibles para los usuarios
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => openPaymentMethodDialog()}
                    className="bg-white text-cyan-600 hover:bg-cyan-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Método
                  </Button>
                </div>

                {/* Mobile: layout vertical centrado */}
                <div className="md:hidden text-center">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <CreditCard className="h-8 w-8" />
                    <CardTitle className="text-2xl">
                      Métodos de Pago
                    </CardTitle>
                  </div>
                  <CardDescription className="text-cyan-50 mb-3">
                    Gestiona los métodos de pago disponibles para los usuarios
                  </CardDescription>
                  <Button
                    onClick={() => openPaymentMethodDialog()}
                    className="bg-white text-cyan-600 hover:bg-cyan-50 w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Método
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {loadingPaymentMethods ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando métodos de pago...</p>
                  </div>
                ) : paymentMethods.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg mb-2">No hay métodos de pago configurados</p>
                    <p className="text-slate-500 text-sm">Crea tu primer método de pago haciendo clic en "Nuevo Método"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {paymentMethods.map((method) => (
                      <Card key={method._id} className="border-2 hover:shadow-lg transition-all">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${method.type === 'bank' ? 'bg-blue-100' :
                                method.type === 'crypto' ? 'bg-orange-100' :
                                  method.type === 'paypal' ? 'bg-purple-100' :
                                    method.type === 'zelle' ? 'bg-green-100' :
                                      method.type === 'stripe' ? 'bg-indigo-100' :
                                        method.type === 'binance' ? 'bg-yellow-100' :
                                          method.type === 'contact' ? 'bg-brand-100' :
                                            'bg-slate-100'
                                }`}>
                                {method.type === 'bank' ? (
                                  <Building2 className="h-6 w-6 text-blue-600" />
                                ) : method.type === 'crypto' ? (
                                  <Hash className="h-6 w-6 text-orange-600" />
                                ) : method.type === 'paypal' ? (
                                  <CreditCard className="h-6 w-6 text-purple-600" />
                                ) : method.type === 'zelle' ? (
                                  <DollarSign className="h-6 w-6 text-green-600" />
                                ) : method.type === 'stripe' ? (
                                  <CreditCard className="h-6 w-6 text-indigo-600" />
                                ) : method.type === 'binance' ? (
                                  <Hash className="h-6 w-6 text-yellow-600" />
                                ) : method.type === 'contact' ? (
                                  <MessageCircle className="h-6 w-6 text-brand-600" />
                                ) : (
                                  <Wallet className="h-6 w-6 text-slate-600" />
                                )}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{method.name}</CardTitle>
                                <Badge className={method.is_active ? 'bg-brand-600' : 'bg-slate-400'}>
                                  {method.is_active ? 'Activo' : 'Inactivo'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Detalles según el tipo */}
                          {method.type === 'bank' && (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Banco:</span>
                                <span className="font-semibold">{method.details.bank_name}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Titular:</span>
                                <span className="font-semibold">{method.details.account_holder}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Tipo:</span>
                                <span className="font-semibold">{method.details.account_type === 'savings' ? 'Ahorros' : method.details.account_type === 'checking' ? 'Corriente' : method.details.account_type === 'business' ? 'Empresarial' : method.details.account_type}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">ID:</span>
                                <span className="font-semibold">{method.details.identification}</span>
                              </div>
                              <div>
                                <div className="text-slate-600 mb-1">Número de cuenta:</div>
                                <div className="font-mono text-xs bg-slate-50 p-2 rounded border">
                                  {method.details.account_number}
                                </div>
                              </div>
                            </div>
                          )}

                          {(method.type === 'paypal' || method.type === 'zelle' ||
                            method.type === 'stripe' || method.type === 'binance') && (
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-slate-600">Tipo:</span>
                                  <span className="font-semibold capitalize">{method.type}</span>
                                </div>
                                <div>
                                  <div className="text-slate-600 mb-1">Correo electrónico:</div>
                                  <div className="font-mono text-xs bg-slate-50 p-2 rounded border break-all">
                                    {method.details.email}
                                  </div>
                                </div>
                              </div>
                            )}

                          {method.type === 'crypto' && (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Red:</span>
                                <span className="font-semibold">TRC20</span>
                              </div>
                              <div>
                                <div className="text-slate-600 mb-1">Dirección de billetera:</div>
                                <div className="font-mono text-xs bg-slate-50 p-2 rounded border break-all">
                                  {method.details.wallet_address}
                                </div>
                              </div>
                              {method.details.qr_code_url && (
                                <div>
                                  <div className="text-slate-600 mb-1">Código QR:</div>
                                  <div className="bg-white p-2 rounded border">
                                    <img
                                      src={method.details.qr_code_url}
                                      alt="QR Code"
                                      className="w-24 h-24 object-contain mx-auto"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {method.type === 'contact' && (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-slate-600">Método:</span>
                                <span className="font-semibold">{method.details.contact_method}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-600">Teléfono:</span>
                                <span className="font-semibold">{method.details.phone_number}</span>
                              </div>
                              <div className="pt-2">
                                <a
                                  href={`https://wa.me/${method.details.phone_number?.replace(/[^0-9]/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                  <MessageCircle className="h-4 w-4" />
                                  Abrir en WhatsApp
                                </a>
                              </div>
                            </div>
                          )}

                          {/* Botones de acción */}
                          <div className="flex gap-2 pt-3 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openPaymentMethodDialog(method)}
                              className="flex-1"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTogglePaymentMethodStatus(method._id, method.is_active)}
                              className={method.is_active ? 'text-orange-600 hover:text-orange-700' : 'text-brand-600 hover:text-brand-700'}
                            >
                              {method.is_active ? (
                                <>
                                  <PowerOff className="h-4 w-4 mr-1" />
                                  Desactivar
                                </>
                              ) : (
                                <>
                                  <Power className="h-4 w-4 mr-1" />
                                  Activar
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletePaymentMethodDialog(method)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Historial de Operaciones */}
          <TabsContent value="historial-pagos">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b-2 bg-gradient-to-r from-brand-50 to-green-50">
                {/* Desktop: layout horizontal */}
                <div className="hidden md:block">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <History className="h-6 w-6 text-brand-600" />
                    Historial de Operaciones
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Registro completo de todas las operaciones procesadas (aprobadas y rechazadas)
                  </CardDescription>
                </div>

                {/* Mobile: layout vertical centrado */}
                <div className="md:hidden text-center">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <History className="h-8 w-8 text-brand-600" />
                    <CardTitle className="text-2xl">
                      Historial de Operaciones
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-600">
                    Registro completo de todas las operaciones procesadas (aprobadas y rechazadas)
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Filtro de búsqueda */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Buscar usuario..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="pl-10 h-10 md:h-12 text-base border-2 focus:border-brand-500"
                    />
                  </div>
                </div>

                {loadingHistory ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Cargando historial...</p>
                  </div>
                ) : filteredPaymentHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {searchFilter ? 'No se encontraron resultados' : 'No hay historial'}
                    </h3>
                    <p className="text-slate-600">
                      {searchFilter ? 'Intenta con otro término de búsqueda' : 'Aún no hay operaciones procesadas'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Vista de tabla - solo escritorio */}
                    <div className="hidden md:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="font-semibold">Usuario</TableHead>
                            <TableHead className="font-semibold text-center">Número de Operaciones</TableHead>
                            <TableHead className="font-semibold text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPaymentHistory.map((user) => (
                            <TableRow key={user.id} className="hover:bg-brand-50 transition-colors">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  {user.custom_picture || user.picture ? (
                                    <img
                                      src={user.custom_picture || user.picture}
                                      alt={user.name}
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 rounded-full object-cover border-2 border-brand-200 flex-shrink-0"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : null}
                                  <div
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                                    style={{ display: (user.custom_picture || user.picture) ? 'none' : 'flex' }}
                                  >
                                    {user.name?.charAt(0).toUpperCase() || '?'}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-slate-900 truncate">{user.name || 'Sin nombre'}</div>
                                    <div className="text-sm text-slate-600 truncate">{user.email}</div>
                                    <div className="text-xs text-slate-500">Código: {user.referral_code || 'N/A'}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white w-[75px] inline-flex items-center justify-center">
                                  {user.total_operations}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  onClick={() => openHistoryDetail(user)}
                                  size="sm"
                                  className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Ver Detalle
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Vista de tarjetas - solo móvil */}
                    <div className="md:hidden">
                      {filteredPaymentHistory.map((user) => (
                        <HistoryUserMobileCard
                          key={user.id}
                          user={user}
                          onViewDetail={openHistoryDetail}
                        />
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Retiros Pendientes */}
          <TabsContent value="retiros-pendientes">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-100 border-b">
                {/* Desktop: layout horizontal */}
                <div className="hidden md:flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-6 w-6 text-amber-600" />
                        <span>Retiros Pendientes</span>
                        {pendingWithdrawals.length > 0 && (
                          <Badge className="bg-amber-500">{pendingWithdrawals.length}</Badge>
                        )}
                      </div>
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Solicitudes de retiro pendientes de aprobación
                    </CardDescription>
                  </div>
                </div>

                {/* Mobile: layout vertical centrado */}
                <div className="md:hidden text-center">
                  <div className="flex flex-col items-center gap-2 mb-3">
                    <Wallet className="h-8 w-8 text-amber-600" />
                    <CardTitle className="text-xl">
                      Retiros Pendientes
                      {pendingWithdrawals.length > 0 && (
                        <Badge className="ml-2 bg-amber-500">{pendingWithdrawals.length}</Badge>
                      )}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-slate-600">
                    Solicitudes de retiro pendientes de aprobación
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingWithdrawals ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                  </div>
                ) : pendingWithdrawals.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-brand-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No hay retiros pendientes</h3>
                    <p className="text-slate-600">Actualmente no hay solicitudes de retiro por procesar.</p>
                  </div>
                ) : (
                  <>
                    {/* Vista de tarjetas minimalista - solo escritorio */}
                    <div className="hidden md:block space-y-3">
                      {pendingWithdrawals.map((withdrawal) => {
                        const methodLabel = withdrawal.payment_method_type === 'bank_transfer'
                          ? `${withdrawal.payment_method_details?.bank_name || 'Banco'} ****${(withdrawal.payment_method_details?.account_number || '').slice(-4)}`
                          : `${withdrawal.payment_method_type.toUpperCase()} - ${withdrawal.payment_method_details?.email || ''}`;

                        return (
                          <div
                            key={withdrawal._id}
                            className="bg-white rounded-lg border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all duration-200 p-4"
                          >
                            <div className="flex items-center justify-between gap-4">
                              {/* Usuario - Sección izquierda */}
                              <div className="flex items-center gap-3 min-w-[180px]">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-sm">
                                  {withdrawal.user_name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-semibold text-sm text-slate-900 truncate">{withdrawal.user_name}</div>
                                  <div className="text-xs text-slate-500 truncate">{withdrawal.user_email}</div>
                                </div>
                              </div>

                              {/* Info - Centro */}
                              <div className="flex items-center gap-6 flex-1">
                                {/* Monto */}
                                <div className="min-w-[100px]">
                                  <div className="text-xs text-slate-500 mb-0.5">Monto</div>
                                  <div className="font-bold text-lg text-slate-900">
                                    ${withdrawal.amount.toLocaleString()}
                                  </div>
                                </div>

                                {/* Comisión y Neto */}
                                <div className="min-w-[140px]">
                                  <div className="text-xs text-slate-500 mb-0.5">Comisión / Neto</div>
                                  <div className="flex items-center gap-2">
                                    {withdrawal.commission > 0 ? (
                                      <>
                                        <Badge variant="outline" className="text-xs py-0 px-1.5 bg-red-50 text-red-600 border-red-200">
                                          -${withdrawal.commission.toFixed(2)}
                                        </Badge>
                                        <span className="font-bold text-base text-brand-600">${withdrawal.net_amount.toFixed(2)}</span>
                                      </>
                                    ) : (
                                      <span className="font-bold text-base text-brand-600">${withdrawal.amount.toFixed(2)}</span>
                                    )}
                                  </div>
                                </div>

                                {/* Método de pago */}
                                <div className="min-w-[180px]">
                                  <div className="text-xs text-slate-500 mb-0.5">Método de Pago</div>
                                  <div className="flex items-center gap-1.5">
                                    {withdrawal.payment_method_type === 'bank_transfer' ? (
                                      <Building2 className="h-4 w-4 text-blue-600" />
                                    ) : (
                                      <CreditCard className="h-4 w-4 text-purple-600" />
                                    )}
                                    <span className="text-sm text-slate-700 truncate">{methodLabel}</span>
                                  </div>
                                </div>

                                {/* Fecha */}
                                <div className="min-w-[90px]">
                                  <div className="text-xs text-slate-500 mb-0.5">Fecha</div>
                                  <div className="text-sm text-slate-700">
                                    {formatDate(withdrawal.created_at)}
                                  </div>
                                </div>
                              </div>

                              {/* Acciones - Derecha */}
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setWithdrawalDetailDialog({ open: true, withdrawal })}
                                  className="bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver detalles
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveWithdrawal(withdrawal._id)}
                                  disabled={processingWithdrawal}
                                  className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-md hover:shadow-lg transition-all"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Aprobar
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setWithdrawalRejectDialog({ open: true, withdrawal })}
                                  disabled={processingWithdrawal}
                                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Rechazar
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Vista móvil - tarjetas verticales */}
                    <div className="md:hidden space-y-4">
                      {pendingWithdrawals.map((withdrawal) => (
                        <div
                          key={withdrawal._id}
                          className="bg-white rounded-xl border-2 border-amber-200 p-4 shadow-sm"
                        >
                          {/* Header con usuario */}
                          <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                              {withdrawal.user_name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-slate-900 truncate">{withdrawal.user_name}</div>
                              <div className="text-sm text-slate-500 truncate">{withdrawal.user_email}</div>
                            </div>
                          </div>

                          {/* Info grid */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-slate-50 rounded-lg p-3">
                              <div className="text-xs text-slate-500">Monto</div>
                              <div className="font-bold text-xl text-slate-900">${withdrawal.amount.toLocaleString()}</div>
                            </div>
                            <div className="bg-brand-50 rounded-lg p-3">
                              <div className="text-xs text-slate-500">Neto a Pagar</div>
                              <div className="font-bold text-xl text-brand-600">${withdrawal.net_amount.toFixed(2)}</div>
                            </div>
                          </div>

                          {/* Método de pago */}
                          <div className="bg-blue-50 rounded-lg p-3 mb-4">
                            <div className="text-xs text-slate-500 mb-1">Método de Pago</div>
                            <div className="flex items-center gap-2">
                              {withdrawal.payment_method_type === 'bank_transfer' ? (
                                <Building2 className="h-4 w-4 text-blue-600" />
                              ) : (
                                <CreditCard className="h-4 w-4 text-purple-600" />
                              )}
                              <span className="font-medium text-slate-900">
                                {withdrawal.payment_method_type === 'bank_transfer'
                                  ? `${withdrawal.payment_method_details?.bank_name || 'Banco'} ****${(withdrawal.payment_method_details?.account_number || '').slice(-4)}`
                                  : `${withdrawal.payment_method_type} - ${withdrawal.payment_method_details?.email || ''}`
                                }
                              </span>
                            </div>
                          </div>

                          {/* Fecha y comisión */}
                          <div className="flex justify-between items-center text-sm text-slate-500 mb-4">
                            <span>{formatDateTime(withdrawal.created_at)}</span>
                            {withdrawal.commission > 0 && (
                              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                                Comisión: ${withdrawal.commission.toFixed(2)}
                              </Badge>
                            )}
                          </div>

                          {/* Botones */}
                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              onClick={() => setWithdrawalDetailDialog({ open: true, withdrawal })}
                              className="w-full bg-slate-50 hover:bg-slate-100 border-slate-300 text-slate-700"
                            >
                              <Eye className="h-4 w-4 mr-1.5" />
                              Ver detalles
                            </Button>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleApproveWithdrawal(withdrawal._id)}
                                disabled={processingWithdrawal}
                                className="flex-1 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-md hover:shadow-lg transition-all"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Aprobar
                              </Button>
                              <Button
                                onClick={() => setWithdrawalRejectDialog({ open: true, withdrawal })}
                                disabled={processingWithdrawal}
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Rechazar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Historial de Retiros */}
          <TabsContent value="historial-retiros">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b">
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                  <FileText className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" />
                  Historial de Retiros
                </CardTitle>
                <CardDescription>Historial completo de todos los retiros del sistema</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {/* Filtros */}
                <div className="bg-slate-50 rounded-lg p-4 mb-6 border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Búsqueda */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Buscar usuario
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          type="text"
                          placeholder="Nombre o email..."
                          value={withdrawalFilters.search}
                          onChange={(e) => setWithdrawalFilters(prev => ({ ...prev, search: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Estado */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Estado
                      </label>
                      <select
                        value={withdrawalFilters.status}
                        onChange={(e) => setWithdrawalFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full h-10 px-3 rounded-md border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="all">Todos</option>
                        <option value="pending">Pendientes</option>
                        <option value="approved">Aprobados</option>
                        <option value="rejected">Rechazados</option>
                      </select>
                    </div>

                    {/* Botón cargar */}
                    <div className="flex items-end">
                      <Button
                        onClick={fetchAllWithdrawals}
                        disabled={loadingAllWithdrawals}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        {loadingAllWithdrawals ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Search className="h-4 w-4 mr-2" />
                        )}
                        Cargar historial
                      </Button>
                    </div>

                    {/* Fecha desde */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Desde
                      </label>
                      <Input
                        type="date"
                        value={withdrawalFilters.dateFrom}
                        onChange={(e) => setWithdrawalFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                      />
                    </div>

                    {/* Fecha hasta */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Hasta
                      </label>
                      <Input
                        type="date"
                        value={withdrawalFilters.dateTo}
                        onChange={(e) => setWithdrawalFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                      />
                    </div>

                    {/* Limpiar filtros */}
                    <div className="md:col-span-2 flex items-end">
                      <Button
                        variant="outline"
                        onClick={() => setWithdrawalFilters({ status: 'all', search: '', dateFrom: '', dateTo: '' })}
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Limpiar filtros
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tabla de retiros */}
                {allWithdrawals.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-2">No hay datos de retiros</p>
                    <p className="text-sm text-slate-500">Haz clic en "Cargar historial" para ver los retiros</p>
                  </div>
                ) : (
                  <>
                    {/* Estadísticas rápidas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      <div className="bg-slate-100 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-slate-700">{getFilteredWithdrawals().length}</div>
                        <div className="text-xs text-slate-600">Mostrando</div>
                      </div>
                      <div className="bg-orange-100 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-orange-700">
                          {getFilteredWithdrawals().filter(w => w.status === 'pending').length}
                        </div>
                        <div className="text-xs text-orange-600">Pendientes</div>
                      </div>
                      <div className="bg-brand-100 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-brand-700">
                          {getFilteredWithdrawals().filter(w => w.status === 'approved').length}
                        </div>
                        <div className="text-xs text-brand-600">Aprobados</div>
                      </div>
                      <div className="bg-red-100 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-red-700">
                          {getFilteredWithdrawals().filter(w => w.status === 'rejected').length}
                        </div>
                        <div className="text-xs text-red-600">Rechazados</div>
                      </div>
                    </div>

                    {/* Vista de tabla - escritorio */}
                    <div className="hidden md:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50">
                            <TableHead className="font-semibold">Fecha</TableHead>
                            <TableHead className="font-semibold">Usuario</TableHead>
                            <TableHead className="font-semibold text-right pr-8">Monto</TableHead>
                            <TableHead className="font-semibold text-center w-[60px]">Ver</TableHead>
                            <TableHead className="font-semibold text-center">Estado</TableHead>
                            <TableHead className="font-semibold">Notas</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredWithdrawals()
                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                            .map((withdrawal) => (
                              <TableRow key={withdrawal._id} className="hover:bg-slate-50">
                                <TableCell className="text-sm">
                                  <div className="flex items-center gap-1.5 text-slate-600">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(withdrawal.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-0.5">
                                    {new Date(withdrawal.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium text-slate-900">{withdrawal.user_name}</div>
                                  <div className="text-xs text-slate-500">{withdrawal.user_email}</div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                  <div className="text-lg font-bold text-slate-900">
                                    ${withdrawal.amount.toLocaleString()}
                                  </div>
                                  {withdrawal.commission > 0 && (
                                    <div className="text-xs text-slate-500">
                                      Comisión: ${withdrawal.commission.toLocaleString()}
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <button
                                    onClick={() => setWithdrawalDetailDialog({ open: true, withdrawal })}
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                    title="Ver detalles"
                                  >
                                    <Eye className="h-5 w-5" />
                                  </button>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge className={
                                    withdrawal.status === 'approved' ? 'bg-brand-600' :
                                    withdrawal.status === 'rejected' ? 'bg-red-600' :
                                    'bg-orange-500'
                                  }>
                                    {withdrawal.status === 'approved' ? 'Aprobado' :
                                     withdrawal.status === 'rejected' ? 'Rechazado' :
                                     'Pendiente'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="max-w-[200px]">
                                  <div className="text-sm text-slate-600 truncate">
                                    {withdrawal.notes || withdrawal.rejection_reason || '-'}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Vista móvil - tarjetas */}
                    <div className="md:hidden space-y-3">
                      {getFilteredWithdrawals()
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .map((withdrawal) => (
                          <div key={withdrawal._id} className="bg-white border-2 border-slate-200 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="font-semibold text-slate-900">{withdrawal.user_name}</div>
                                <div className="text-xs text-slate-500">{withdrawal.user_email}</div>
                              </div>
                              <Badge className={
                                withdrawal.status === 'approved' ? 'bg-brand-600' :
                                withdrawal.status === 'rejected' ? 'bg-red-600' :
                                'bg-orange-500'
                              }>
                                {withdrawal.status === 'approved' ? 'Aprobado' :
                                 withdrawal.status === 'rejected' ? 'Rechazado' :
                                 'Pendiente'}
                              </Badge>
                            </div>

                            <div className="flex justify-between items-center mb-3">
                              <div className="text-2xl font-bold text-slate-900">
                                ${withdrawal.amount.toLocaleString()}
                              </div>
                              <button
                                onClick={() => setWithdrawalDetailDialog({ open: true, withdrawal })}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                title="Ver detalles"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                            </div>

                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <Calendar className="h-4 w-4" />
                              {new Date(withdrawal.created_at).toLocaleDateString('es-ES', {
                                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </div>

                            {(withdrawal.notes || withdrawal.rejection_reason) && (
                              <div className="mt-3 pt-3 border-t border-slate-100">
                                <div className="text-xs text-slate-500 mb-1">Notas:</div>
                                <div className="text-sm text-slate-700">{withdrawal.notes || withdrawal.rejection_reason}</div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
        </main>
      </div>

      {/* Dialog de rechazo de retiro */}
      <Dialog open={withdrawalRejectDialog.open} onOpenChange={(open) => {
        if (!processingWithdrawal) {
          setWithdrawalRejectDialog({ open, withdrawal: open ? withdrawalRejectDialog.withdrawal : null });
          if (!open) setWithdrawalRejectReason('');
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              Rechazar Retiro
            </DialogTitle>
            <DialogDescription>
              Estás por rechazar el retiro de{' '}
              <strong>${withdrawalRejectDialog.withdrawal?.amount.toLocaleString()}</strong> de{' '}
              <strong>{withdrawalRejectDialog.withdrawal?.user_name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Motivo del rechazo *
              </label>
              <textarea
                value={withdrawalRejectReason}
                onChange={(e) => setWithdrawalRejectReason(e.target.value)}
                placeholder="Explica el motivo del rechazo..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setWithdrawalRejectDialog({ open: false, withdrawal: null });
                setWithdrawalRejectReason('');
              }}
              disabled={processingWithdrawal}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleRejectWithdrawal}
              disabled={processingWithdrawal || !withdrawalRejectReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {processingWithdrawal ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Confirmar Rechazo'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de detalles de retiro */}
      <Dialog open={withdrawalDetailDialog.open} onOpenChange={(open) => setWithdrawalDetailDialog({ open, withdrawal: open ? withdrawalDetailDialog.withdrawal : null })}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <Wallet className="h-5 w-5" />
              Detalles del Retiro
            </DialogTitle>
            <DialogDescription>
              Información completa de la solicitud de retiro
            </DialogDescription>
          </DialogHeader>

          {withdrawalDetailDialog.withdrawal && (
            <div className="space-y-4 py-4">
              {/* Usuario */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg">
                  {withdrawalDetailDialog.withdrawal.user_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{withdrawalDetailDialog.withdrawal.user_name}</div>
                  <div className="text-sm text-slate-500">{withdrawalDetailDialog.withdrawal.user_email}</div>
                </div>
              </div>

              {/* Montos */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-100 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-1">Monto Solicitado</div>
                  <div className="font-bold text-lg text-slate-900">
                    ${withdrawalDetailDialog.withdrawal.amount?.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-1">Comisión</div>
                  <div className="font-bold text-lg text-red-600">
                    ${withdrawalDetailDialog.withdrawal.commission?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div className="p-3 bg-brand-50 rounded-lg text-center">
                  <div className="text-xs text-slate-500 mb-1">Neto a Pagar</div>
                  <div className="font-bold text-lg text-brand-600">
                    ${withdrawalDetailDialog.withdrawal.net_amount?.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Método de pago */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-2">
                  Datos de la cuenta para enviar el pago
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {withdrawalDetailDialog.withdrawal.payment_method_type === 'bank_transfer' ? (
                    <Building2 className="h-5 w-5 text-blue-600" />
                  ) : (
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  )}
                  <span className="font-semibold text-slate-900 capitalize">
                    {withdrawalDetailDialog.withdrawal.payment_method_type === 'bank_transfer'
                      ? 'Transferencia Bancaria'
                      : withdrawalDetailDialog.withdrawal.payment_method_type}
                  </span>
                </div>

                {withdrawalDetailDialog.withdrawal.payment_method_type === 'bank_transfer' ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Banco:</span>
                      <span className="font-medium text-slate-900">{withdrawalDetailDialog.withdrawal.payment_method_details?.bank_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tipo de cuenta:</span>
                      <span className="font-medium text-slate-900">{withdrawalDetailDialog.withdrawal.payment_method_details?.account_type === 'savings' ? 'Ahorros' : withdrawalDetailDialog.withdrawal.payment_method_details?.account_type === 'checking' ? 'Corriente' : withdrawalDetailDialog.withdrawal.payment_method_details?.account_type === 'business' ? 'Empresarial' : withdrawalDetailDialog.withdrawal.payment_method_details?.account_type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Número de cuenta:</span>
                      <span className="font-medium text-slate-900">{withdrawalDetailDialog.withdrawal.payment_method_details?.account_number || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Documento de identidad:</span>
                      <span className="font-medium text-slate-900">{withdrawalDetailDialog.withdrawal.payment_method_details?.document_id || 'N/A'}</span>
                    </div>
                    {withdrawalDetailDialog.withdrawal.payment_method_details?.routing_number && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Número de ruta:</span>
                        <span className="font-medium text-slate-900">{withdrawalDetailDialog.withdrawal.payment_method_details?.routing_number}</span>
                      </div>
                    )}
                    {withdrawalDetailDialog.withdrawal.payment_method_details?.holder_name && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Titular:</span>
                        <span className="font-medium text-slate-900">{withdrawalDetailDialog.withdrawal.payment_method_details?.holder_name}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-medium text-slate-900">{withdrawalDetailDialog.withdrawal.payment_method_details?.email || 'N/A'}</span>
                    </div>
                    {withdrawalDetailDialog.withdrawal.payment_method_details?.phone && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Teléfono:</span>
                        <span className="font-medium text-slate-900">{withdrawalDetailDialog.withdrawal.payment_method_details?.phone}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Notas del usuario */}
              {withdrawalDetailDialog.withdrawal.notes && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="text-xs text-yellow-700 font-semibold mb-1">Notas del usuario:</div>
                  <p className="text-sm text-slate-700">{withdrawalDetailDialog.withdrawal.notes}</p>
                </div>
              )}

              {/* Fecha */}
              <div className="text-center text-sm text-slate-500">
                Solicitado el {new Date(withdrawalDetailDialog.withdrawal.created_at).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setWithdrawalDetailDialog({ open: false, withdrawal: null })}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Action Confirmation Dialog */}
      <AlertDialog open={actionDialog.open} onOpenChange={(open) => !processingAction && setActionDialog({ ...actionDialog, open })}>
        <AlertDialogContent className="w-[calc(100%-2rem)] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.type === 'verify' ? '¿Aprobar pago?' : '¿Rechazar pago?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.type === 'verify' ? (
                <>
                  Estás a punto de <strong>aprobar</strong> el pago de{' '}
                  <strong>${actionDialog.payment?.amount.toLocaleString()}</strong> del usuario{' '}
                  <strong>{actionDialog.payment?.user_name}</strong>.
                  <br /><br />
                  Esta acción marcará la inversión como verificada y el usuario podrá ver su inversión activa.
                </>
              ) : (
                <>
                  Estás a punto de <strong>rechazar</strong> el pago de{' '}
                  <strong>${actionDialog.payment?.amount.toLocaleString()}</strong> del usuario{' '}
                  <strong>{actionDialog.payment?.user_name}</strong>.
                  <br /><br />
                  Esto marcará el pago como rechazado. Considera contactar al usuario para explicar el motivo.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processingAction}>Cancelar</AlertDialogCancel>
            <Button
              onClick={handlePaymentAction}
              disabled={processingAction}
              className={actionDialog.type === 'verify' ? 'bg-brand-600 hover:bg-brand-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {processingAction ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                actionDialog.type === 'verify' ? 'Aprobar Pago' : 'Rechazar Pago'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="w-[calc(100%-2rem)] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al panel de administración.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
              Cerrar Sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Detail Dialog */}
      <Dialog open={userDetailDialog} onOpenChange={setUserDetailDialog}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-4xl max-h-[90vh] overflow-y-auto p-4 md:p-6 rounded-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg md:text-2xl">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-brand-600" />
              Detalle de Usuario
            </DialogTitle>
            <DialogDescription className="text-sm">
              Información completa del usuario y sus inversiones
            </DialogDescription>
          </DialogHeader>

          {loadingUserDetails ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-600">Cargando detalles del usuario...</p>
            </div>
          ) : userDetails ? (
            <div className="space-y-4 md:space-y-6">
              {/* Información General del Usuario */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Información Personal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Avatar y nombre destacado */}
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-6 pb-6 border-b-2 border-slate-100">
                    {/* Avatar */}
                    {userDetails.user.custom_picture || userDetails.user.picture ? (
                      <img
                        src={userDetails.user.custom_picture || userDetails.user.picture}
                        alt={userDetails.user.name}
                        referrerPolicy="no-referrer"
                        className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover ring-4 ring-blue-100 shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-4xl ring-4 ring-blue-100 shadow-lg">
                        {userDetails.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* Info destacada */}
                    <div className="text-center md:text-left flex-1">
                      <div className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        {userDetails.user.name}
                      </div>
                      <div className="text-base text-slate-600 mb-2">
                        {userDetails.user.email}
                      </div>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
                          <Calendar className="h-3 w-3 mr-1" />
                          Registrado {new Date(userDetails.user.created_at).toLocaleDateString('es-ES', {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Badge>
                        {userDetails.user.referral_code && (
                          <Badge className="bg-brand-100 text-brand-700 border border-brand-300 font-mono">
                            Código: {userDetails.user.referral_code}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detalles adicionales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <div className="text-sm text-slate-600">Nombre Completo</div>
                      <div className="font-semibold text-slate-900">{userDetails.user.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Email</div>
                      <div className="font-semibold text-slate-900">{userDetails.user.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Teléfono</div>
                      <div className="font-semibold text-slate-900">{userDetails.user.phone || 'No registrado'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Fecha de Registro</div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(userDetails.user.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Código de Referido</div>
                      <div className="font-mono text-base md:text-lg font-bold text-brand-600 bg-brand-50 p-2 rounded border-2 border-brand-200">
                        {userDetails.user.referral_code || 'Sin código'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información de Pago */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    Información de Pago Principal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userDetails.primary_payment_method ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <div className="text-sm text-slate-600">Tipo de Pago</div>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {userDetails.primary_payment_method.payment_type === 'bank_transfer' && '🏦 Transferencia Bancaria'}
                          {userDetails.primary_payment_method.payment_type === 'zelle' && '💵 Zelle'}
                          {userDetails.primary_payment_method.payment_type === 'paypal' && '💳 PayPal'}
                          {userDetails.primary_payment_method.payment_type === 'binance' && '₿ Binance'}
                          {userDetails.primary_payment_method.payment_type === 'stripe' && '💰 Stripe'}
                        </Badge>
                      </div>

                      {userDetails.primary_payment_method.payment_type === 'bank_transfer' ? (
                        <>
                          <div>
                            <div className="text-sm text-slate-600">Banco</div>
                            <div className="font-semibold text-slate-900">
                              {userDetails.primary_payment_method.bank_name || 'No especificado'}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-600">Tipo de Cuenta</div>
                            <div className="font-semibold text-slate-900">
                              {userDetails.primary_payment_method.account_type === 'savings' ? 'Ahorros' : userDetails.primary_payment_method.account_type === 'checking' ? 'Corriente' : userDetails.primary_payment_method.account_type === 'business' ? 'Empresarial' : userDetails.primary_payment_method.account_type || 'No especificado'}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-600">Número de Cuenta</div>
                            <div className="font-mono text-sm text-slate-900 bg-slate-100 p-2 rounded">
                              {userDetails.primary_payment_method.account_number || 'No especificado'}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-slate-600">Documento de Identidad</div>
                            <div className="font-mono text-sm text-slate-900 bg-slate-100 p-2 rounded">
                              {userDetails.primary_payment_method.document_id || 'No especificado'}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="col-span-2">
                          <div className="text-sm text-slate-600">Email / ID de Cuenta</div>
                          <div className="font-mono text-sm text-slate-900 bg-slate-100 p-3 rounded mt-1">
                            {userDetails.primary_payment_method.email || 'No especificado'}
                          </div>
                        </div>
                      )}

                      <div>
                        <div className="text-sm text-slate-600">Registrado el</div>
                        <div className="text-sm text-slate-700">
                          {new Date(userDetails.primary_payment_method.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-slate-600">Última Actualización</div>
                        <div className="text-sm text-slate-700">
                          {new Date(userDetails.primary_payment_method.updated_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-lg">
                      <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600">El usuario no ha registrado un método de pago principal</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Inversiones del Usuario */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-brand-600" />
                    Inversiones ({userDetails.investments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userDetails.investments.length === 0 ? (
                    <div className="text-center py-6 bg-slate-50 rounded-lg">
                      <Activity className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-600">El usuario no tiene inversiones registradas</p>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-4">
                      {userDetails.investments
                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .map((inv, idx) => (
                          <div key={inv._id || idx} className="border-2 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="font-semibold text-lg text-slate-900">{inv.plan_name}</div>
                                <div className="text-sm text-slate-600">{inv.plan_rate} • {inv.market}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl md:text-2xl font-bold text-brand-600">${inv.amount.toLocaleString()}</div>
                                <Badge
                                  variant={inv.status === 'active' ? 'default' : 'secondary'}
                                  className={inv.status === 'active' ? 'bg-brand-600' : ''}
                                >
                                  {inv.status === 'active' ? 'Activa' : 'Completada'}
                                </Badge>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3 pt-3 border-t">
                              <div>
                                <div className="text-xs text-slate-600">Estado de Pago</div>
                                <Badge
                                  variant={
                                    inv.payment_status === 'verified' ? 'default' :
                                      inv.payment_status === 'rejected' ? 'destructive' :
                                        'outline'
                                  }
                                  className={`mt-1 ${inv.payment_status === 'verified' ? 'bg-brand-600' :
                                    inv.payment_status === 'pending' ? 'bg-orange-500 text-white' : ''
                                    }`}
                                >
                                  {inv.payment_status === 'verified' ? '✓ Verificado' :
                                    inv.payment_status === 'rejected' ? '✗ Rechazado' :
                                      '⏳ Pendiente'}
                                </Badge>
                              </div>
                              <div>
                                <div className="text-xs text-slate-600">Fecha de Creación</div>
                                <div className="text-sm text-slate-700 mt-1">
                                  {new Date(inv.created_at).toLocaleString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }).replace(',', '')}
                                </div>
                              </div>
                              {inv.payment_verified_by && (
                                <>
                                  <div>
                                    <div className="text-xs text-slate-600">Verificado por</div>
                                    <div className="text-sm font-medium text-slate-900 mt-1">
                                      {inv.payment_verified_by}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-600">Fecha de Verificación</div>
                                    <div className="text-sm text-slate-700 mt-1">
                                      {new Date(inv.payment_verified_at).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </div>
                                  </div>
                                </>
                              )}
                              {inv.payment_notes && (
                                <div className="col-span-2">
                                  <div className="text-xs text-slate-600">Notas del Admin</div>
                                  <div className="text-sm text-slate-700 bg-slate-50 p-2 rounded mt-1">
                                    {inv.payment_notes}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                      {/* Resumen Financiero */}
                      <div className="mt-4 p-4 bg-gradient-to-br from-brand-50 to-teal-50 border-2 border-brand-200 rounded-lg">
                        <div className="text-sm font-semibold text-brand-800 mb-3 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Resumen Financiero
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                          {/* Total Invertido */}
                          <div className="bg-white rounded-lg p-3 border border-brand-200 text-center">
                            <div className="text-xs text-brand-700 mb-1">Total Invertido</div>
                            <div className="text-lg md:text-xl font-bold text-brand-600">
                              ${userDetails.investments
                                .filter(inv => inv.payment_status === 'verified')
                                .reduce((sum, inv) => sum + inv.amount, 0)
                                .toLocaleString()}
                            </div>
                          </div>

                          {/* Ganancias Totales */}
                          <div className="bg-white rounded-lg p-3 border border-teal-200 text-center">
                            <div className="text-xs text-teal-700 mb-1">Ganancias Totales</div>
                            <div className="text-lg md:text-xl font-bold text-teal-600">
                              ${(userDetails.total_earnings || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-teal-500 mt-0.5">
                              {userDetails.approved_returns_count || 0} pago(s)
                            </div>
                          </div>

                          {/* Dinero en Billetera */}
                          <div className="bg-white rounded-lg p-3 border border-blue-200 text-center">
                            <div className="text-xs text-blue-700 mb-1">En Billetera</div>
                            <div className="text-lg md:text-xl font-bold text-blue-600">
                              ${(userDetails.wallet_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-blue-500 mt-0.5">
                              Disponible
                            </div>
                          </div>

                          {/* Inversiones Activas */}
                          <div className="bg-white rounded-lg p-3 border border-brand-200 text-center">
                            <div className="text-xs text-brand-700 mb-1">Inversiones Activas</div>
                            <div className="text-lg md:text-xl font-bold text-brand-600">
                              {userDetails.investments.filter(inv => inv.status === 'active').length}
                            </div>
                          </div>

                          {/* Pagos Verificados */}
                          <div className="bg-white rounded-lg p-3 border border-brand-200 text-center">
                            <div className="text-xs text-brand-700 mb-1">Pagos Verificados</div>
                            <div className="text-lg md:text-xl font-bold text-brand-600">
                              {userDetails.investments.filter(inv => inv.payment_status === 'verified').length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">No se pudieron cargar los detalles del usuario</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Plan Create/Edit Dialog */}
      <Dialog open={planDialog} onOpenChange={(open) => {
        if (!open) {
          // Reset form when closing
          setPlanFormData({
            name: '',
            description: '',
            min_amount: '',
            max_amount: '',
            rate_min: '',
            rate_max: '',
            withdrawal_period: '',
            withdrawal_period_days: '',
            market: '',
            is_active: true,
            is_popular: false,
            features: []
          });
          setEditingPlan(null);
        }
        setPlanDialog(open);
      }}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-2xl max-h-[80vh] overflow-hidden flex flex-col rounded-2xl">
          <DialogHeader className="flex-shrink-0">
            {/* Desktop: título con icono a la izquierda */}
            <DialogTitle className="hidden md:flex items-center gap-2 text-2xl">
              <Briefcase className="h-6 w-6 text-purple-600" />
              {editingPlan ? 'Editar Plan de Inversión' : 'Crear Nuevo Plan de Inversión'}
            </DialogTitle>

            {/* Mobile: título centrado con icono arriba */}
            <div className="md:hidden flex flex-col items-center gap-2">
              <Briefcase className="h-8 w-8 text-purple-600" />
              <DialogTitle className="text-xl text-center">
                {editingPlan ? 'Editar Plan de Inversión' : 'Crear Nuevo Plan de Inversión'}
              </DialogTitle>
            </div>

            <DialogDescription className="text-center md:text-left">
              {editingPlan ? 'Modifica los detalles del plan' : 'Completa los detalles del nuevo plan'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 overflow-y-auto flex-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Nombre del Plan */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Nombre del Plan *</label>
              <input
                type="text"
                value={planFormData.name}
                onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="Ej: Retiro 30 días"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Descripción</label>
              <textarea
                value={planFormData.description}
                onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="Descripción del plan (opcional)"
                rows="3"
              />
            </div>

            {/* Montos - Grid en desktop, stack en mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Monto Mínimo ($) *</label>
                <input
                  type="number"
                  value={planFormData.min_amount}
                  onChange={(e) => setPlanFormData({ ...planFormData, min_amount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                  placeholder="100"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Monto Máximo ($)</label>
                <input
                  type="number"
                  value={planFormData.max_amount}
                  onChange={(e) => setPlanFormData({ ...planFormData, max_amount: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                  placeholder="10000 (opcional)"
                />
              </div>
            </div>

            {/* Tasas - Grid en desktop, stack en mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Tasa Mínima (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={planFormData.rate_min}
                  onChange={(e) => setPlanFormData({ ...planFormData, rate_min: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Tasa Máxima (%) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={planFormData.rate_max}
                  onChange={(e) => setPlanFormData({ ...planFormData, rate_max: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                  placeholder="7"
                />
              </div>
            </div>

            {/* Período de Retiro - Grid en desktop, stack en mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Período de Retiro (días) *</label>
                <input
                  type="number"
                  value={planFormData.withdrawal_period_days}
                  onChange={(e) => setPlanFormData({ ...planFormData, withdrawal_period_days: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                  placeholder="15"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Período de Retiro (texto)</label>
                <input
                  type="text"
                  value={planFormData.withdrawal_period}
                  onChange={(e) => setPlanFormData({ ...planFormData, withdrawal_period: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                  placeholder="30 días (opcional)"
                />
                <p className="text-xs text-slate-500 mt-1">Si no se especifica, se generará automáticamente</p>
              </div>
            </div>

            {/* Mercado */}
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Mercado *</label>
              <input
                type="text"
                value={planFormData.market}
                onChange={(e) => setPlanFormData({ ...planFormData, market: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                placeholder="Tangibles"
              />
            </div>

            {/* Features Section */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Características del Plan
              </label>
              <div className="space-y-2">
                {planFormData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...planFormData.features];
                        newFeatures[index] = e.target.value;
                        setPlanFormData({ ...planFormData, features: newFeatures });
                      }}
                      className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
                      placeholder={`Característica ${index + 1}`}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newFeatures = planFormData.features.filter((_, i) => i !== index);
                        setPlanFormData({ ...planFormData, features: newFeatures });
                      }}
                      className="hover:bg-red-50 text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setPlanFormData({ ...planFormData, features: [...planFormData.features, ''] });
                  }}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Característica
                </Button>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={planFormData.is_active}
                  onChange={(e) => setPlanFormData({ ...planFormData, is_active: e.target.checked })}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                  Plan activo (visible para usuarios)
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_popular"
                  checked={planFormData.is_popular}
                  onChange={(e) => setPlanFormData({ ...planFormData, is_popular: e.target.checked })}
                  className="w-4 h-4 text-brand-600 border-gray-300 rounded focus:ring-brand-500"
                />
                <label htmlFor="is_popular" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  Marcar como Popular
                  <Badge className="bg-brand-600 text-white px-2 py-0.5 text-xs">POPULAR</Badge>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-6 mt-4 border-t flex-shrink-0 bg-white px-1">
            <Button variant="outline" onClick={() => setPlanDialog(false)} disabled={savingPlan}>
              Cancelar
            </Button>
            <Button
              onClick={handleSavePlan}
              disabled={savingPlan}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            >
              {savingPlan ? 'Guardando...' : (editingPlan ? 'Actualizar Plan' : 'Crear Plan')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Plan Confirmation Dialog */}
      <AlertDialog open={!!deletePlanDialog} onOpenChange={() => setDeletePlanDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar plan?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas eliminar el plan <strong>{deletePlanDialog?.name}</strong>?
              <br /><br />
              Esta acción no se puede deshacer. Los usuarios ya no podrán ver este plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeletePlan(deletePlanDialog?._id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Comprobante de Pago */}
      <Dialog open={proofModal} onOpenChange={setProofModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <FileText className="h-6 w-6 text-blue-600" />
              Comprobante de Pago
            </DialogTitle>
            <DialogDescription>
              Comprobante subido por el usuario para verificación
            </DialogDescription>
          </DialogHeader>

          {selectedProof && selectedProof.payment_proof && (
            <div className="space-y-6">
              {/* Información del pago */}
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">Información del Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-600">Usuario</div>
                      <div className="font-semibold text-slate-900">{selectedProof.user_name}</div>
                      <div className="text-xs text-slate-500">{selectedProof.user_email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600">Monto</div>
                      <div className="text-2xl font-bold text-brand-600">
                        ${selectedProof.amount?.toLocaleString()}
                      </div>
                    </div>
                    {selectedProof.type === 'deposit' ? (
                      <>
                        <div>
                          <div className="text-sm text-slate-600">Tipo</div>
                          <Badge className="mt-1 bg-gradient-to-r from-brand-500 to-brand-600 text-white">
                            💰 Depósito de Billetera
                          </Badge>
                        </div>
                        <div>
                          <div className="text-sm text-slate-600">Método</div>
                          <div className="font-semibold text-slate-900">
                            {selectedProof.payment_method || 'Transferencia'}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="text-sm text-slate-600">Plan</div>
                          <div className="font-semibold text-slate-900">{selectedProof.plan_name}</div>
                          <div className="text-xs text-slate-500">{selectedProof.plan_rate}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-600">Mercado</div>
                          <Badge className="mt-1 bg-purple-100 text-purple-700">
                            {selectedProof.market}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Información del Pago Realizado */}
              {selectedProof.payment_proof.payment_reference && (
                <Card className="border-2 border-brand-300 bg-gradient-to-br from-brand-50 to-teal-50 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold text-brand-800 flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-brand-600" />
                      Datos del Pago Realizado
                    </CardTitle>
                    <p className="text-sm text-brand-700 mt-1">Información del comprobante de pago enviado</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Referencia y Monto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Hash className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="text-sm font-medium text-slate-600">Referencia del Pago</div>
                        </div>
                        <div className="font-mono font-bold text-slate-900 text-lg ml-10">
                          {selectedProof.payment_proof.payment_reference}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm border border-brand-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-brand-600" />
                          </div>
                          <div className="text-sm font-medium text-slate-600">Monto Pagado</div>
                        </div>
                        <div className="font-bold text-brand-700 text-2xl ml-10">
                          ${selectedProof.payment_proof.payment_amount?.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Fecha del Pago */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="text-sm font-medium text-slate-600">Fecha del Pago</div>
                      </div>
                      <div className="font-semibold text-slate-900 text-lg ml-10">
                        {new Date(selectedProof.payment_proof.payment_date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    {/* Transferencia Bancaria */}
                    <div className="bg-gradient-to-r from-blue-50 to-brand-50 rounded-lg p-5 border-2 border-dashed border-blue-300">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-brand-500 flex items-center justify-center">
                          <ArrowRight className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-bold text-slate-800 text-base">Transferencia Bancaria</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Banco Emisor */}
                        <div className="relative">
                          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 h-full w-1 bg-blue-400 rounded-full"></div>
                          <div className="pl-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className="h-4 w-4 text-blue-600" />
                              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Banco Emisor</span>
                            </div>
                            <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm px-4 py-2 font-semibold shadow-md">
                              {selectedProof.payment_proof.banco_emisor || 'No especificado'}
                            </Badge>
                            <p className="text-xs text-slate-600 mt-2 italic">Desde dónde se envió el pago</p>
                          </div>
                        </div>

                        {/* Banco Receptor */}
                        <div className="relative">
                          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 h-full w-1 bg-brand-400 rounded-full"></div>
                          <div className="pl-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className="h-4 w-4 text-brand-600" />
                              <span className="text-xs font-semibold text-brand-700 uppercase tracking-wide">Banco Receptor</span>
                            </div>
                            <Badge className="bg-gradient-to-r from-brand-600 to-brand-500 text-white text-sm px-4 py-2 font-semibold shadow-md">
                              {selectedProof.payment_proof.banco_receptor || 'No especificado'}
                            </Badge>
                            <p className="text-xs text-slate-600 mt-2 italic">A dónde se envió el pago</p>
                          </div>
                        </div>
                      </div>

                      {/* Flecha de transferencia visual */}
                      <div className="flex items-center justify-center mt-4 opacity-30">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <div className="h-0.5 w-8 bg-gradient-to-r from-blue-500 to-brand-500"></div>
                          <ArrowRight className="h-4 w-4 text-brand-500" />
                          <div className="h-0.5 w-8 bg-gradient-to-r from-blue-500 to-brand-500"></div>
                          <div className="h-2 w-2 rounded-full bg-brand-500"></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detalles del archivo */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                    Detalles del Comprobante
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Nombre original:</span>
                      <span className="font-semibold">{selectedProof.payment_proof.original_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tamaño:</span>
                      <span className="font-semibold">
                        {(selectedProof.payment_proof.file_size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tipo:</span>
                      <span className="font-semibold">{selectedProof.payment_proof.mime_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subido el:</span>
                      <span className="font-semibold">
                        {new Date(selectedProof.payment_proof.uploaded_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Estado:</span>
                      <Badge className={selectedProof.payment_proof_status === 'submitted' ? 'bg-blue-600' : 'bg-slate-500'}>
                        {selectedProof.payment_proof_status === 'submitted' ? 'En revisión' : 'Pendiente'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vista previa del comprobante */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-slate-600" />
                      Vista Previa
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(selectedProof.payment_proof.url, '_blank')}
                      className="bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedProof.payment_proof.mime_type.startsWith('image/') ? (
                    <div className="border-2 border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <img
                        src={selectedProof.payment_proof.url}
                        alt="Comprobante de pago"
                        className="w-full h-auto max-h-[600px] object-contain"
                      />
                    </div>
                  ) : selectedProof.payment_proof.mime_type === 'application/pdf' ? (
                    <div className="border-2 border-slate-200 rounded-lg p-12 text-center bg-slate-50">
                      <FileText className="h-24 w-24 text-slate-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-slate-700 mb-2">
                        Archivo PDF
                      </p>
                      <p className="text-sm text-slate-600 mb-4">
                        Los archivos PDF no se pueden previsualizar aquí
                      </p>
                      <Button
                        onClick={() => window.open(selectedProof.payment_proof.url, '_blank')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Abrir PDF
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-600">
                      Tipo de archivo no soportado para vista previa
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Información de pago del usuario */}
              {selectedProof.payment_info && (
                <Card className="border-2 border-brand-200 bg-brand-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Información de Pago del Usuario</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Método de pago:</span>
                        <Badge className="bg-brand-600">
                          {selectedProof.payment_info.payment_type}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Titular:</span>
                        <span className="font-semibold">{selectedProof.payment_info.account_holder}</span>
                      </div>
                      <div>
                        <div className="text-slate-600 mb-1">Detalles de cuenta:</div>
                        <div className="font-mono text-xs bg-white p-2 rounded border">
                          {selectedProof.payment_info.account_details}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal para crear/editar método de pago */}
      <Dialog open={paymentMethodDialog} onOpenChange={setPaymentMethodDialog}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-2xl max-h-[85vh] overflow-hidden flex flex-col rounded-2xl">
          <DialogHeader className="flex-shrink-0">
            {/* Desktop: título normal */}
            <DialogTitle className="hidden md:block text-xl">
              {editingPaymentMethod ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
            </DialogTitle>

            {/* Mobile: título centrado */}
            <DialogTitle className="md:hidden text-xl text-center">
              {editingPaymentMethod ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
            </DialogTitle>

            <DialogDescription className="text-center md:text-left">
              Configura los detalles del método de pago disponible para los usuarios
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 overflow-y-auto flex-1 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Tipo de método */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tipo de Método de Pago <span className="text-red-500">*</span>
              </label>
              <select
                value={paymentMethodFormData.type}
                onChange={(e) => setPaymentMethodFormData({
                  ...paymentMethodFormData,
                  type: e.target.value,
                  details: {
                    bank_name: '',
                    account_number: '',
                    account_type: '',
                    account_holder: '',
                    identification: '',
                    email: '',
                    wallet_address: '',
                    qr_code_url: '',
                    contact_method: '',
                    phone_number: ''
                  },
                  qr_code_file: null
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              >
                <option value="" disabled>Seleccionar método de pago</option>
                <option value="crypto">Wallet TRC20</option>
                <option value="binance">Binance Pay</option>
                <option value="bank">Transferencia Bancaria</option>
                <option value="zelle">Zelle</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
                <option value="contact">Contactar con el Administrador</option>
              </select>
            </div>

            {/* Campos para Transferencia Bancaria */}
            {paymentMethodFormData.type === 'bank' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nombre del Banco <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentMethodFormData.details.bank_name}
                    onChange={(e) => setPaymentMethodFormData({
                      ...paymentMethodFormData,
                      details: { ...paymentMethodFormData.details, bank_name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Ej: Bank of America, Chase Bank"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Número de Cuenta Bancaria <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentMethodFormData.details.account_number}
                    onChange={(e) => setPaymentMethodFormData({
                      ...paymentMethodFormData,
                      details: { ...paymentMethodFormData.details, account_number: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg font-mono focus:ring-2 focus:ring-cyan-500"
                    placeholder="0123456789012345678901"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Titular de la Cuenta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentMethodFormData.details.account_holder}
                    onChange={(e) => setPaymentMethodFormData({
                      ...paymentMethodFormData,
                      details: { ...paymentMethodFormData.details, account_holder: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Nombre completo del titular"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Número de Identidad del Titular <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentMethodFormData.details.identification}
                    onChange={(e) => setPaymentMethodFormData({
                      ...paymentMethodFormData,
                      details: { ...paymentMethodFormData.details, identification: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Ej: 123-45-6789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Tipo de Cuenta <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={paymentMethodFormData.details.account_type}
                    onChange={(e) => setPaymentMethodFormData({
                      ...paymentMethodFormData,
                      details: { ...paymentMethodFormData.details, account_type: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Seleccionar tipo de cuenta...</option>
                    <option value="Ahorro">Ahorro</option>
                    <option value="Corriente">Corriente</option>
                  </select>
                </div>
              </>
            )}

            {/* Campos para PayPal, Zelle, Stripe, Binance - Solo Email */}
            {(paymentMethodFormData.type === 'paypal' ||
              paymentMethodFormData.type === 'zelle' ||
              paymentMethodFormData.type === 'stripe' ||
              paymentMethodFormData.type === 'binance') && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={paymentMethodFormData.details.email}
                    onChange={(e) => setPaymentMethodFormData({
                      ...paymentMethodFormData,
                      details: { ...paymentMethodFormData.details, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder={`correo@${paymentMethodFormData.type}.com`}
                  />
                </div>
              )}

            {/* Campos para Criptomonedas */}
            {paymentMethodFormData.type === 'crypto' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Dirección de Wallet TRC20 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentMethodFormData.details.wallet_address}
                    onChange={(e) => setPaymentMethodFormData({
                      ...paymentMethodFormData,
                      details: { ...paymentMethodFormData.details, wallet_address: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-cyan-500"
                    placeholder="T..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Código QR de Pago (Opcional)
                  </label>

                  {!paymentMethodFormData.qr_code_file && !paymentMethodFormData.details.qr_code_url ? (
                    <div
                      className="border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer border-slate-300 hover:border-cyan-500 hover:bg-cyan-50"
                      onClick={() => document.getElementById('qr-file-input').click()}
                    >
                      <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-700 font-semibold mb-1">
                        Arrastra tu imagen aquí o haz clic para seleccionar
                      </p>
                      <p className="text-sm text-slate-500">
                        Formatos: JPG, PNG (máx. 5MB)
                      </p>
                      <input
                        id="qr-file-input"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // Validar tamaño
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error('El archivo es demasiado grande. Máximo 5MB.');
                              return;
                            }
                            setPaymentMethodFormData({
                              ...paymentMethodFormData,
                              qr_code_file: file
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-cyan-600 bg-cyan-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <ImageIcon className="h-6 w-6 text-cyan-600" />
                          <div>
                            <p className="font-semibold text-slate-900">
                              {paymentMethodFormData.qr_code_file?.name || 'Código QR actual'}
                            </p>
                            {paymentMethodFormData.qr_code_file && (
                              <p className="text-sm text-slate-600">
                                {(paymentMethodFormData.qr_code_file.size / 1024).toFixed(2)} KB
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setPaymentMethodFormData({
                            ...paymentMethodFormData,
                            qr_code_file: null,
                            details: { ...paymentMethodFormData.details, qr_code_url: '' }
                          })}
                          className="text-slate-500 hover:text-slate-700"
                          type="button"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Vista previa de imagen */}
                      {paymentMethodFormData.qr_code_file ? (
                        <div className="mt-3">
                          <img
                            src={URL.createObjectURL(paymentMethodFormData.qr_code_file)}
                            alt="Vista previa QR"
                            className="w-full h-48 object-contain bg-white rounded border"
                          />
                        </div>
                      ) : paymentMethodFormData.details.qr_code_url ? (
                        <div className="mt-3">
                          <img
                            src={paymentMethodFormData.details.qr_code_url}
                            alt="QR Code actual"
                            className="w-full h-48 object-contain bg-white rounded border"
                          />
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Campos para Contactar con el administrador */}
            {paymentMethodFormData.type === 'contact' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Método de Contacto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentMethodFormData.details.contact_method}
                    onChange={(e) => setPaymentMethodFormData({
                      ...paymentMethodFormData,
                      details: { ...paymentMethodFormData.details, contact_method: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Ej: WhatsApp, Telegram"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Número Telefónico <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={paymentMethodFormData.details.phone_number}
                    onChange={(e) => setPaymentMethodFormData({
                      ...paymentMethodFormData,
                      details: { ...paymentMethodFormData.details, phone_number: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Ej: +1234567890 (formato internacional)"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Incluye el código de país (ej: +1 para USA, +44 para UK)
                  </p>
                </div>
              </>
            )}

            {/* Estado activo/inactivo */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <input
                type="checkbox"
                id="is_active_payment"
                checked={paymentMethodFormData.is_active}
                onChange={(e) => setPaymentMethodFormData({ ...paymentMethodFormData, is_active: e.target.checked })}
                className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <label htmlFor="is_active_payment" className="text-sm font-medium text-slate-700">
                Método activo (visible para usuarios)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 mt-4 border-t flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setPaymentMethodDialog(false)}
              disabled={savingPaymentMethod}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSavePaymentMethod}
              disabled={savingPaymentMethod}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {savingPaymentMethod ? 'Guardando...' : 'Guardar Método'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación para eliminar método de pago */}
      <AlertDialog
        open={!!deletePaymentMethodDialog}
        onOpenChange={(open) => !open && setDeletePaymentMethodDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar método de pago?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de eliminar el método de pago "{deletePaymentMethodDialog?.name}".
              Esta acción no se puede deshacer. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletePaymentMethod}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de Información de Pago */}
      <Dialog open={paymentInfoDialog.open} onOpenChange={(open) => setPaymentInfoDialog({ open, payment: null })}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-2xl max-h-[85vh] overflow-hidden flex flex-col rounded-2xl">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" />
              Información de Pago
            </DialogTitle>
            <DialogDescription>
              Detalles completos del pago proporcionado por el usuario
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-4 pl-1 space-y-6 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {paymentInfoDialog.payment && (
              <>
                {/* Tipo de pago */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
                  <div className="text-sm text-slate-600 mb-1">Tipo de pago</div>
                  <div className="font-semibold text-lg">
                    {paymentInfoDialog.payment.type === 'deposit' ? (
                      paymentInfoDialog.payment.deposit_type === 'wallet_deposit' ? 'Depósito a Billetera' : 'Pago de Inversión'
                    ) : (
                      'Inversión'
                    )}
                  </div>
                </div>

                {/* Monto */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="text-sm text-blue-700 mb-1">Monto</div>
                  <div className="text-3xl font-bold text-blue-600">
                    ${paymentInfoDialog.payment.amount?.toLocaleString()}
                  </div>
                </div>

                {/* Información según tipo */}
                {paymentInfoDialog.payment.type === 'deposit' ? (
                  <>
                    {/* Método de pago */}
                    {paymentInfoDialog.payment.payment_method_name && (
                      <div className={`border-2 rounded-lg p-4 ${
                        paymentInfoDialog.payment.payment_method_type === 'contact'
                          ? 'bg-brand-50 border-brand-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="text-sm text-slate-600 mb-2">Método de pago</div>
                        <div className="flex items-center gap-2">
                          {paymentInfoDialog.payment.payment_method_type === 'contact' ? (
                            <>
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand-100">
                                <MessageCircle className="h-5 w-5 text-brand-600" />
                              </div>
                              <div>
                                <Badge className="bg-brand-600 text-white">
                                  {paymentInfoDialog.payment.payment_method_name}
                                </Badge>
                                <p className="text-xs text-brand-600 mt-1">
                                  Gestión vía WhatsApp
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <Badge className="bg-blue-600 text-white">
                                {paymentInfoDialog.payment.payment_method_name}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                Tipo: {paymentInfoDialog.payment.payment_method_type}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sección especial para método contact */}
                    {paymentInfoDialog.payment.payment_method_type === 'contact' && (
                      <div className="bg-gradient-to-br from-brand-50 to-green-50 border-2 border-brand-300 rounded-lg p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-brand-500 flex items-center justify-center shadow-lg">
                            <MessageCircle className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-brand-800 text-lg">Contacto por WhatsApp</h4>
                            <p className="text-sm text-brand-600">Este pago se gestiona directamente con el usuario</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-brand-200">
                          <p className="text-sm text-slate-600 mb-2">
                            <span className="font-semibold text-slate-700">Estado de la gestión:</span>
                          </p>
                          <p className="text-slate-700">
                            El usuario ha solicitado realizar este pago a través de contacto directo por WhatsApp.
                            Verifica con el usuario el estado del pago antes de aprobar o rechazar.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Referencia de pago - Solo si no es método contact */}
                    {paymentInfoDialog.payment.payment_reference &&
                     paymentInfoDialog.payment.payment_method_type !== 'contact' && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Referencia de pago
                        </label>
                        <div className="bg-white border-2 border-slate-200 rounded-lg p-3 font-mono text-sm">
                          {paymentInfoDialog.payment.payment_reference}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* Información de inversión legacy */
                  paymentInfoDialog.payment.payment_info && (
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
                      <div className="text-sm text-slate-600 mb-2">Información de pago (Sistema anterior)</div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-semibold">Tipo:</span> {paymentInfoDialog.payment.payment_info.payment_type}
                        </div>
                        {paymentInfoDialog.payment.payment_info.account_holder && (
                          <div>
                            <span className="font-semibold">Titular:</span> {paymentInfoDialog.payment.payment_info.account_holder}
                          </div>
                        )}
                        {paymentInfoDialog.payment.payment_info.account_details && (
                          <div>
                            <span className="font-semibold">Detalles:</span> {paymentInfoDialog.payment.payment_info.account_details}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}

                {/* Comprobante de pago - Ocultar para método contact */}
                {paymentInfoDialog.payment.payment_method_type !== 'contact' && (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Comprobante de pago
                    </label>
                    {paymentInfoDialog.payment.has_proof ? (
                      <div className="border-2 border-brand-200 bg-brand-50 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="h-6 w-6 text-brand-600" />
                          <div>
                            <p className="font-semibold text-slate-900">Comprobante disponible</p>
                            <p className="text-sm text-slate-600">Vista previa del archivo</p>
                          </div>
                        </div>

                        {/* Vista previa de la imagen */}
                        <div className="mt-3 bg-white rounded-lg border-2 border-slate-200 p-2">
                          <img
                            src={
                              paymentInfoDialog.payment.proof_url ||
                              (typeof paymentInfoDialog.payment.payment_proof === 'string'
                                ? paymentInfoDialog.payment.payment_proof
                                : paymentInfoDialog.payment.payment_proof?.url)
                            }
                            alt="Comprobante de pago"
                            className="w-full h-auto max-h-96 object-contain rounded"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                        No se ha cargado ningún comprobante
                      </div>
                    )}
                  </div>
                )}

                {/* Fecha */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Fecha de creación
                  </label>
                  <div className="flex items-center gap-2 text-slate-700 bg-slate-50 border-2 border-slate-200 rounded-lg p-3">
                    <span>{formatDateTime(paymentInfoDialog.payment.created_at)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setPaymentInfoDialog({ open: false, payment: null })}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Historial de Operaciones */}
      <Dialog open={historyDetailDialog} onOpenChange={setHistoryDetailDialog}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-2xl">
          <DialogHeader className="flex-shrink-0">
            {/* Desktop: título normal */}
            <DialogTitle className="hidden md:block text-2xl">Detalles de las operaciones</DialogTitle>

            {/* Mobile: título centrado */}
            <DialogTitle className="md:hidden text-xl text-center">Detalles de las operaciones</DialogTitle>

            <DialogDescription className="text-center md:text-left">
              Historial completo de operaciones procesadas del usuario
            </DialogDescription>
            {selectedUserHistory && (
              <div className="flex items-center gap-3 mt-2 pt-2 border-t">
                {selectedUserHistory.custom_picture || selectedUserHistory.picture ? (
                  <img
                    src={selectedUserHistory.custom_picture || selectedUserHistory.picture}
                    alt={selectedUserHistory.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border-2 border-brand-200 flex-shrink-0"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold flex-shrink-0"
                  style={{ display: (selectedUserHistory.custom_picture || selectedUserHistory.picture) ? 'none' : 'flex' }}
                >
                  {selectedUserHistory.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{selectedUserHistory.name}</div>
                  <div className="text-sm text-slate-600 truncate">{selectedUserHistory.email}</div>
                </div>
              </div>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {loadingOperations ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Cargando operaciones...</p>
              </div>
            ) : userOperations.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Este usuario no tiene operaciones procesadas</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {userOperations.map((operation, index) => {
                    const isInvestment = operation.type === 'investment';
                    const isApproved = isInvestment
                      ? operation.status === 'verified'
                      : operation.status === 'approved';

                    return (
                      <AccordionItem
                        key={operation.id}
                        value={`operation-${index}`}
                        className="border-2 rounded-xl mb-4 overflow-hidden transition-all duration-300 data-[state=open]:border-brand-400 data-[state=open]:shadow-lg data-[state=open]:shadow-brand-100 data-[state=closed]:border-slate-200 data-[state=closed]:hover:border-slate-300 bg-white"
                      >
                        <AccordionTrigger className="px-3 md:px-5 py-3 md:py-4 hover:no-underline data-[state=open]:bg-gradient-to-r data-[state=open]:from-brand-50 data-[state=open]:to-teal-50 data-[state=closed]:hover:bg-slate-50 transition-colors">
                          <div className="flex items-center justify-between w-full pr-2 md:pr-4">
                            <div className="flex items-center gap-2 md:gap-4">
                              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center shadow-md transition-transform data-[state=open]:scale-110 ${isInvestment
                                ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                                : 'bg-gradient-to-br from-purple-400 to-purple-600'
                                }`}>
                                {isInvestment ? (
                                  <TrendingUp className="h-5 w-5 md:h-7 md:w-7 text-white" />
                                ) : (
                                  <Wallet className="h-5 w-5 md:h-7 md:w-7 text-white" />
                                )}
                              </div>
                              <div className="text-left">
                                <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                  <Badge className={`${isInvestment ? 'bg-blue-600' : 'bg-purple-600'} shadow-sm text-xs`}>
                                    {isInvestment ? 'Inversión' : 'Depósito'}
                                  </Badge>
                                  <Badge className={`${isApproved ? 'bg-brand-600' : 'bg-red-600'} shadow-sm text-xs`}>
                                    {isApproved ? '✓ Aprobado' : '✗ Rechazado'}
                                  </Badge>
                                </div>
                                <div className="font-bold text-lg md:text-xl text-slate-900">
                                  ${operation.amount?.toLocaleString()}
                                </div>
                                <div className="text-sm text-slate-600 mt-1 font-medium">
                                  {formatDateTime(operation.created_at)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 md:px-5 py-4 md:py-5 bg-gradient-to-br from-slate-50 via-white to-slate-50 border-t-2 border-brand-100">
                          <div className="space-y-4">
                            {/* Tipo y Estado */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-white border-2 border-slate-200 rounded-lg p-3">
                                <div className="text-sm text-slate-600 mb-1">Tipo de operación</div>
                                <div className="font-semibold">
                                  {isInvestment ? 'Inversión' : operation.deposit_type === 'wallet_deposit' ? 'Depósito a billetera' : 'Pago de inversión'}
                                </div>
                              </div>
                              <div className="bg-white border-2 border-slate-200 rounded-lg p-3">
                                <div className="text-sm text-slate-600 mb-1">Estado</div>
                                <Badge className={isApproved ? 'bg-brand-600' : 'bg-red-600'}>
                                  {isApproved ? 'Aprobado' : 'Rechazado'}
                                </Badge>
                              </div>
                            </div>

                            {/* Monto */}
                            <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-4">
                              <div className="text-sm text-brand-700 mb-1">Monto</div>
                              <div className="text-3xl font-bold text-brand-600">
                                ${operation.amount?.toLocaleString()}
                              </div>
                            </div>

                            {/* Plan (solo para inversiones) */}
                            {isInvestment && operation.plan_name && (
                              <div className="bg-white border-2 border-slate-200 rounded-lg p-3">
                                <div className="text-sm text-slate-600 mb-1">Plan de inversión</div>
                                <div className="font-semibold text-slate-900">{operation.plan_name}</div>
                              </div>
                            )}

                            {/* Método de pago */}
                            {operation.payment_method_name && (
                              <div className="bg-white border-2 border-slate-200 rounded-lg p-3">
                                <div className="text-sm text-slate-600 mb-1">Método de pago</div>
                                <div className="font-semibold text-slate-900">{operation.payment_method_name}</div>
                                <div className="text-sm text-slate-600">{operation.payment_method_type}</div>
                              </div>
                            )}

                            {/* Referencia */}
                            {operation.payment_reference && (
                              <div className="bg-white border-2 border-slate-200 rounded-lg p-3">
                                <div className="text-sm text-slate-600 mb-1">Referencia de pago</div>
                                <div className="font-mono text-sm text-slate-900">{operation.payment_reference}</div>
                              </div>
                            )}

                            {/* Comprobante */}
                            {operation.proof_url && (
                              <div className="bg-white border-2 border-slate-200 rounded-lg p-3">
                                <div className="text-sm text-slate-600 mb-2">Comprobante de pago</div>
                                <div className="relative">
                                  <img
                                    src={operation.proof_url}
                                    alt="Comprobante"
                                    className="w-full h-auto max-h-64 object-contain rounded border"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                  <div
                                    className="hidden flex-col items-center justify-center p-8 bg-slate-100 rounded border-2 border-dashed border-slate-300"
                                    style={{ minHeight: '200px' }}
                                  >
                                    <ImageIcon className="h-16 w-16 text-slate-400 mb-3" />
                                    <p className="text-slate-600 text-center">No se pudo cargar la imagen del comprobante</p>
                                    <a
                                      href={operation.proof_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-brand-600 hover:text-brand-700 text-sm mt-2 underline"
                                    >
                                      Intentar abrir en nueva pestaña
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Fechas */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white border-2 border-slate-200 rounded-lg p-3">
                                <div className="text-sm text-slate-600 mb-1">Fecha de creación</div>
                                <div className="text-sm text-slate-900">
                                  {formatDateTime(operation.created_at)}
                                </div>
                              </div>
                              {(operation.verified_at || operation.approved_at || operation.rejected_at) && (
                                <div className="bg-white border-2 border-slate-200 rounded-lg p-3">
                                  <div className="text-sm text-slate-600 mb-1">
                                    Fecha de {isApproved ? 'aprobación' : 'rechazo'}
                                  </div>
                                  <div className="text-sm text-slate-900">
                                    {formatDateTime(operation.verified_at || operation.approved_at || operation.rejected_at)}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Motivo de rechazo */}
                            {!isApproved && operation.rejection_reason && (
                              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                                <div className="text-sm font-semibold text-red-900 mb-1">Motivo de rechazo</div>
                                <div className="text-red-700">{operation.rejection_reason}</div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            )}
          </div>

          <DialogFooter className="flex-shrink-0">
            <Button
              variant="outline"
              onClick={() => setHistoryDetailDialog(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default AdminPanel;
