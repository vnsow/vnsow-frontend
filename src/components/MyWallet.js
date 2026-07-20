import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Wallet,
  ArrowLeft,
  Plus,
  TrendingUp,
  TrendingDown,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  DollarSign,
  Activity,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  CreditCard,
  Menu,
  X,
  LayoutDashboard,
  History,
  FileText
} from 'lucide-react';
import PaymentModal from './PaymentModal';
import EditDepositModal from './EditDepositModal';
import WithdrawalModal from './WithdrawalModal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Helper para formatear fechas en formato DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper para formatear fecha y hora
const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const formattedDate = formatDate(dateString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${formattedDate} ${hours}:${minutes}`;
};

const MyWallet = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showEditDepositModal, setShowEditDepositModal] = useState(false);
  const [selectedDepositForEdit, setSelectedDepositForEdit] = useState(null);
  const [activeTab, setActiveTab] = useState('resumen');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const [walletRes, transactionsRes, depositsRes, withdrawalsRes] = await Promise.all([
        axios.get(`${API}/user/wallet`, { withCredentials: true }),
        axios.get(`${API}/user/wallet/transactions`, { withCredentials: true }),
        axios.get(`${API}/user/deposits`, { withCredentials: true }),
        axios.get(`${API}/withdrawals`, { withCredentials: true })
      ]);

      setWallet(walletRes.data);
      setWalletTransactions(transactionsRes.data);
      // Filtrar solo depósitos a billetera (wallet_deposit), no pagos de inversiones
      const walletDeposits = depositsRes.data.filter(d => d.type === 'wallet_deposit');
      setDeposits(walletDeposits);
      setWithdrawals(withdrawalsRes.data || []);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar el éxito de depósito
  const handleDepositSuccess = async () => {
    // Cambiar automáticamente a la pestaña de depósitos (instantáneo)
    setActiveTab('depositos');
    // Hacer scroll al inicio de la página (instantáneo)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Cerrar el modal
    setShowPaymentModal(false);
    // Recargar datos en segundo plano
    await fetchWalletData();
  };

  // Función para manejar el éxito de retiro
  const handleWithdrawalSuccess = async () => {
    // Cambiar automáticamente a la pestaña de retiros
    setActiveTab('retiros');
    // Hacer scroll al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Cerrar el modal
    setShowWithdrawalModal(false);
    // Recargar datos en segundo plano
    await fetchWalletData();
  };

  // Función para cambiar de pestaña
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calcular estadísticas
  const stats = {
    totalDeposited: walletTransactions
      .filter(t => t.type === 'deposit' && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0),
    totalInvested: walletTransactions
      .filter(t => t.type === 'investment' && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    totalWithdrawn: walletTransactions
      .filter(t => t.type === 'withdrawal' && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0),
    transactionCount: walletTransactions.length,
    pendingDeposits: deposits.filter(d => d.status === 'pending').length,
    approvedDeposits: deposits.filter(d => d.status === 'approved').length,
    rejectedDeposits: deposits.filter(d => d.status === 'rejected').length,
    pendingWithdrawals: withdrawals.filter(w => w.status === 'pending').length,
    approvedWithdrawals: withdrawals.filter(w => w.status === 'approved').length,
    rejectedWithdrawals: withdrawals.filter(w => w.status === 'rejected').length,
  };

  // Menú de navegación
  const menuItems = [
    {
      id: 'resumen',
      label: 'Resumen',
      icon: LayoutDashboard,
      activeColor: 'bg-blue-50 text-blue-700 border border-blue-200'
    },
    {
      id: 'transacciones',
      label: 'Transacciones',
      icon: History,
      activeColor: 'bg-purple-50 text-purple-700 border border-purple-200'
    },
    {
      id: 'depositos',
      label: 'Depósitos',
      icon: ArrowDownRight,
      badge: stats.pendingDeposits,
      activeColor: 'bg-brand-50 text-brand-700 border border-brand-200'
    },
    {
      id: 'retiros',
      label: 'Retiros',
      icon: ArrowUpRight,
      badge: stats.pendingWithdrawals,
      activeColor: 'bg-orange-50 text-orange-700 border border-orange-200'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando billetera...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="w-full px-3 md:px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Botón hamburguesa - solo móvil */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:border-blue-500 transition-colors"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/dashboard')}
              className="hidden md:flex"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Wallet className="h-6 w-6 md:h-7 md:w-7 text-blue-600" />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-900">Billetera</h1>
              <p className="hidden md:block text-xs text-slate-500">Administra tu saldo</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowPaymentModal(true)}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 text-sm md:px-4"
            >
              <Plus className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Depositar</span>
            </Button>
            <Button
              onClick={() => setShowWithdrawalModal(true)}
              className="bg-brand-600 hover:bg-brand-700 px-3 py-2 text-sm md:px-4"
            >
              <ArrowUpRight className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Retirar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Menú lateral móvil */}
      <div
        className={`fixed inset-x-0 top-[56px] md:top-[64px] h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] z-40 md:hidden overflow-hidden transition-all duration-300 ${
          mobileMenuOpen ? 'visible' : 'invisible pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Sidebar móvil */}
        <div
          className={`absolute left-0 top-0 h-full w-72 max-w-[80vw] bg-white shadow-xl border-r border-slate-200 flex flex-col transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Balance en el sidebar móvil */}
          <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="text-xs text-blue-100">Saldo Disponible</div>
            <div className="text-2xl font-bold">${wallet?.balance?.toLocaleString() || '0'}</div>
          </div>

          {/* Navegación */}
          <div className="flex-1 p-4 overflow-y-auto">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? item.activeColor
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge > 0 && (
                    <Badge className="ml-auto bg-orange-500 text-white text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}

              {/* Separador */}
              <div className="border-t border-slate-200 my-3"></div>

              {/* Volver al Dashboard */}
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Volver al Dashboard</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Layout principal con sidebar */}
      <div className="flex min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-64px)]">
        {/* Sidebar fijo - solo desktop */}
        <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-white border-r border-slate-200 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
          {/* Balance en el sidebar */}
          <div className="p-4 m-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white">
            <div className="text-xs text-blue-100 flex items-center gap-1">
              <Wallet className="h-3 w-3" />
              Saldo Disponible
            </div>
            <div className="text-3xl font-bold mt-1">${wallet?.balance?.toLocaleString() || '0'}</div>
            <div className="text-xs text-blue-100 mt-2 flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Listo para invertir
            </div>
          </div>

          {/* Navegación del sidebar */}
          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? item.activeColor
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <Badge className="ml-auto bg-orange-500 text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
              </button>
            ))}
          </nav>

          {/* Footer del sidebar */}
          <div className="p-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver al Dashboard</span>
            </button>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {/* Pestaña: Resumen */}
          {activeTab === 'resumen' && (
            <div className="space-y-5 md:space-y-6">
              {/* Estadísticas */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2 md:pb-4">
                    <CardTitle className="text-sm md:text-lg flex items-center gap-2">
                      <ArrowDownRight className="h-4 w-4 md:h-5 md:w-5 text-brand-600" />
                      Total Depositado
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 md:pt-2">
                    <div className="text-xl md:text-3xl font-bold text-brand-600">
                      ${stats.totalDeposited.toLocaleString()}
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 mt-1 md:mt-2">
                      {deposits.filter(d => d.status === 'approved').length} depósitos aprobados
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2 md:pb-4">
                    <CardTitle className="text-sm md:text-lg flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                      Total Invertido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 md:pt-2">
                    <div className="text-xl md:text-3xl font-bold text-orange-600">
                      ${stats.totalInvested.toLocaleString()}
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 mt-1 md:mt-2">
                      Desde tu billetera
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:shadow-lg transition-shadow col-span-2 md:col-span-1">
                  <CardHeader className="pb-2 md:pb-4">
                    <CardTitle className="text-sm md:text-lg flex items-center gap-2">
                      <Activity className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                      Movimientos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 md:pt-2">
                    <div className="text-xl md:text-3xl font-bold text-blue-600">
                      {stats.transactionCount}
                    </div>
                    <p className="text-xs md:text-sm text-slate-600 mt-1 md:mt-2">
                      Transacciones totales
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Resumen de Depósitos */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    Estado de Depósitos
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Resumen de todos tus depósitos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div className="text-center p-3 md:p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                      <div className="text-xl md:text-2xl font-bold text-orange-600">{stats.pendingDeposits}</div>
                      <div className="text-xs md:text-sm text-slate-600 mt-1">Pendientes</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-brand-50 rounded-lg border-2 border-brand-200">
                      <div className="text-xl md:text-2xl font-bold text-brand-600">{stats.approvedDeposits}</div>
                      <div className="text-xs md:text-sm text-slate-600 mt-1">Aprobados</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-red-50 rounded-lg border-2 border-red-200">
                      <div className="text-xl md:text-2xl font-bold text-red-600">{stats.rejectedDeposits}</div>
                      <div className="text-xs md:text-sm text-slate-600 mt-1">Rechazados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resumen de Retiros */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                    <ArrowUpRight className="h-5 w-5 md:h-6 md:w-6 text-brand-600" />
                    Estado de Retiros
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">Resumen de todos tus retiros</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div className="text-center p-3 md:p-4 bg-orange-50 rounded-lg border-2 border-orange-200">
                      <div className="text-xl md:text-2xl font-bold text-orange-600">{stats.pendingWithdrawals}</div>
                      <div className="text-xs md:text-sm text-slate-600 mt-1">Pendientes</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-brand-50 rounded-lg border-2 border-brand-200">
                      <div className="text-xl md:text-2xl font-bold text-brand-600">{stats.approvedWithdrawals}</div>
                      <div className="text-xs md:text-sm text-slate-600 mt-1">Aprobados</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-red-50 rounded-lg border-2 border-red-200">
                      <div className="text-xl md:text-2xl font-bold text-red-600">{stats.rejectedWithdrawals}</div>
                      <div className="text-xs md:text-sm text-slate-600 mt-1">Rechazados</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Pestaña: Transacciones */}
          {activeTab === 'transacciones' && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                  Historial de Transacciones
                </CardTitle>
                <CardDescription className="text-xs md:text-sm">Todos los movimientos de tu billetera</CardDescription>
              </CardHeader>
              <CardContent>
                {walletTransactions.length === 0 ? (
                  <div className="text-center py-10 md:py-12">
                    <TrendingDown className="h-10 w-10 md:h-12 md:w-12 text-slate-400 mx-auto mb-3 md:mb-4" />
                    <p className="text-sm md:text-base text-slate-600">No hay transacciones aún</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 md:space-y-3">
                    {[...walletTransactions]
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((transaction) => (
                        <div
                          key={transaction._id}
                          className="flex items-center justify-between px-3 py-3 md:p-4 border border-slate-200 rounded-lg hover:shadow-md transition-all bg-white/60"
                        >
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className={`w-9 h-9 md:w-12 md:h-12 rounded-full flex items-center justify-center ${
                              transaction.type === 'deposit' ? 'bg-brand-100' :
                              transaction.type === 'investment_return' ? 'bg-teal-100' :
                              transaction.type === 'referral_commission' ? 'bg-purple-100' :
                              transaction.type === 'withdrawal' ? 'bg-red-100' :
                              'bg-orange-100'
                            }`}>
                              {transaction.type === 'deposit' ? (
                                <ArrowDownRight className="h-4 w-4 md:h-6 md:w-6 text-brand-600" />
                              ) : transaction.type === 'investment_return' ? (
                                <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-teal-600" />
                              ) : transaction.type === 'referral_commission' ? (
                                <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
                              ) : transaction.type === 'withdrawal' ? (
                                <ArrowUpRight className="h-4 w-4 md:h-6 md:w-6 text-red-600" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm md:text-base font-semibold text-slate-900">
                                {transaction.type === 'deposit' ? 'Depósito' :
                                 transaction.type === 'investment_return' ? 'Retribución' :
                                 transaction.type === 'referral_commission' ? 'Comisión' :
                                 transaction.type === 'withdrawal' ? 'Retiro' :
                                 'Inversión'}
                              </div>
                              <div className="text-xs md:text-sm text-slate-600 line-clamp-2 md:line-clamp-none">
                                {transaction.description}
                              </div>
                              <div className="text-[11px] md:text-xs text-slate-500 flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                {formatDateTime(transaction.created_at)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-3">
                            <div className={`text-base md:text-2xl font-bold ${
                              transaction.amount > 0 ? 'text-brand-600' : 'text-orange-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                            </div>
                            <div className="text-[11px] md:text-xs text-slate-500 mt-0.5">
                              Saldo final: ${transaction.balance_after.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pestaña: Depósitos */}
          {activeTab === 'depositos' && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                  Historial de Depósitos a Billetera
                </CardTitle>
                <CardDescription>Depósitos realizados directamente a tu billetera</CardDescription>
              </CardHeader>
              <CardContent>
                {deposits.length === 0 ? (
                  <div className="text-center py-12">
                    <DollarSign className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No has realizado depósitos aún</p>
                    <Button
                      onClick={() => setShowPaymentModal(true)}
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Hacer tu primer depósito
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...deposits]
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((deposit) => {
                        const isPending = deposit.status === 'pending';

                        return (
                      <div
                        key={deposit._id}
                        className={`p-5 border-2 rounded-lg transition-all ${
                          isPending
                            ? 'hover:shadow-lg cursor-pointer border-orange-200 bg-orange-50 hover:border-orange-400'
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => {
                          if (isPending) {
                            setSelectedDepositForEdit(deposit);
                            setShowEditDepositModal(true);
                          }
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="text-2xl font-bold text-slate-900">
                                ${deposit.amount.toLocaleString()}
                              </div>
                              <Badge className={
                                deposit.status === 'approved' ? 'bg-brand-600' :
                                deposit.status === 'rejected' ? 'bg-red-600' :
                                'bg-orange-500'
                              }>
                                {deposit.status === 'approved' ? (
                                  <><CheckCircle className="h-3 w-3 mr-1" /> Aprobado</>
                                ) : deposit.status === 'rejected' ? (
                                  <><XCircle className="h-3 w-3 mr-1" /> Rechazado</>
                                ) : (
                                  <><Clock className="h-3 w-3 mr-1" /> Pendiente</>
                                )}
                              </Badge>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-slate-600">
                                <Calendar className="h-4 w-4" />
                                {formatDateTime(deposit.created_at)}
                              </div>

                              {deposit.status === 'approved' && deposit.approved_by && (
                                <div className="text-brand-600">
                                  Aprobado por: {deposit.approved_by}
                                </div>
                              )}

                              {deposit.status === 'rejected' && deposit.rejection_reason && (
                                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded p-3 mt-2">
                                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="font-semibold text-red-700 text-xs">Motivo del rechazo:</div>
                                    <div className="text-red-600">{deposit.rejection_reason}</div>
                                  </div>
                                </div>
                              )}

                              {isPending && (
                                <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div className="text-sm text-blue-700">
                                    <strong>Haz click aquí</strong> para editar o subir el comprobante de pago
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Pestaña: Retiros */}
          {activeTab === 'retiros' && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-6 w-6 text-brand-600" />
                  Historial de Retiros
                </CardTitle>
                <CardDescription>Solicitudes de retiro de tu billetera</CardDescription>
              </CardHeader>
              <CardContent>
                {withdrawals.length === 0 ? (
                  <div className="text-center py-12">
                    <ArrowUpRight className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No has realizado retiros aún</p>
                    <Button
                      onClick={() => setShowWithdrawalModal(true)}
                      className="mt-4 bg-brand-600 hover:bg-brand-700"
                    >
                      <ArrowUpRight className="h-4 w-4 mr-2" />
                      Solicitar tu primer retiro
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[...withdrawals]
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((withdrawal) => (
                        <div
                          key={withdrawal._id}
                          className={`p-5 border-2 rounded-lg transition-all hover:shadow-md ${
                            withdrawal.status === 'pending'
                              ? 'border-orange-200 bg-orange-50'
                              : withdrawal.status === 'approved'
                              ? 'border-brand-200 bg-brand-50'
                              : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="text-2xl font-bold text-slate-900">
                                  ${withdrawal.amount.toLocaleString()}
                                </div>
                                <Badge className={
                                  withdrawal.status === 'approved' ? 'bg-brand-600' :
                                  withdrawal.status === 'rejected' ? 'bg-red-600' :
                                  'bg-orange-500'
                                }>
                                  {withdrawal.status === 'approved' ? (
                                    <><CheckCircle className="h-3 w-3 mr-1" /> Aprobado</>
                                  ) : withdrawal.status === 'rejected' ? (
                                    <><XCircle className="h-3 w-3 mr-1" /> Rechazado</>
                                  ) : (
                                    <><Clock className="h-3 w-3 mr-1" /> Pendiente</>
                                  )}
                                </Badge>
                              </div>

                              {/* Detalles del método de pago */}
                              <div className="flex items-center gap-2 text-sm text-slate-700 mb-2">
                                {withdrawal.payment_method_type === 'bank_transfer' ? (
                                  <Building2 className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <CreditCard className="h-4 w-4 text-purple-600" />
                                )}
                                <span>
                                  {withdrawal.payment_method_type === 'bank_transfer'
                                    ? `${withdrawal.payment_method_details?.bank_name || 'Banco'} - ****${(withdrawal.payment_method_details?.account_number || '').slice(-4)}`
                                    : withdrawal.payment_method_details?.email || withdrawal.payment_method_type
                                  }
                                </span>
                              </div>

                              {/* Comisión y monto neto */}
                              {withdrawal.commission > 0 && (
                                <div className="text-sm text-slate-600 mb-2">
                                  Comisión: ${withdrawal.commission.toFixed(2)} |
                                  <span className="font-semibold text-brand-600 ml-1">
                                    Recibirás: ${withdrawal.net_amount.toFixed(2)}
                                  </span>
                                </div>
                              )}

                              <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                  <Calendar className="h-4 w-4" />
                                  {formatDateTime(withdrawal.created_at)}
                                </div>

                                {withdrawal.status === 'approved' && withdrawal.approved_by && (
                                  <div className="text-brand-600">
                                    Aprobado por: {withdrawal.approved_by}
                                  </div>
                                )}

                                {withdrawal.status === 'rejected' && withdrawal.rejection_reason && (
                                  <div className="flex items-start gap-2 bg-red-100 border border-red-300 rounded p-3 mt-2">
                                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                      <div className="font-semibold text-red-700 text-xs">Motivo del rechazo:</div>
                                      <div className="text-red-600">{withdrawal.rejection_reason}</div>
                                    </div>
                                  </div>
                                )}

                                {withdrawal.status === 'pending' && (
                                  <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded p-3 mt-3">
                                    <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-blue-700">
                                      Tu solicitud está siendo procesada. Te notificaremos cuando sea aprobada.
                                    </div>
                                  </div>
                                )}

                                {withdrawal.notes && (
                                  <div className="text-slate-500 italic mt-2">
                                    Nota: {withdrawal.notes}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      {/* Modal de Pago */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        type="wallet"
        onSuccess={handleDepositSuccess}
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

      {/* Modal de Retiro */}
      <WithdrawalModal
        isOpen={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        walletBalance={wallet?.balance || 0}
        onSuccess={handleWithdrawalSuccess}
      />
    </div>
  );
};

export default MyWallet;
