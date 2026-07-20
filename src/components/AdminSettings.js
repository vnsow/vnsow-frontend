import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import axios from 'axios';
import { ArrowLeft, Settings, CheckCircle, Loader2, Wallet, DollarSign, TrendingUp, Calendar, Phone } from 'lucide-react';
import logoFull from '../assets/icons/vnsow-logo.svg';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminSettings = () => {
  const navigate = useNavigate();
  const { admin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('retiros');

  // Withdrawal config state
  const [withdrawalConfig, setWithdrawalConfig] = useState({
    min_amount: 0,
    max_amount: 0,
    commission_type: 'percentage',
    commission_value: 0,
    admin_contact: ''
  });
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  // Platform earnings state
  const [earningsStats, setEarningsStats] = useState({
    balance: 0,
    today: { total: 0, count: 0 },
    month: { total: 0, count: 0 },
    all_time: { total: 0, count: 0 }
  });
  const [earningsHistory, setEarningsHistory] = useState([]);
  const [loadingEarnings, setLoadingEarnings] = useState(false);

  useEffect(() => {
    fetchWithdrawalConfig();
  }, []);

  useEffect(() => {
    if (activeTab === 'ganancias') {
      fetchEarningsStats();
      fetchEarningsHistory();
    }
  }, [activeTab]);

  const fetchWithdrawalConfig = async () => {
    setLoadingConfig(true);
    try {
      const response = await axios.get(`${API}/admin/config/withdrawals`, {
        withCredentials: true
      });
      setWithdrawalConfig(response.data);
    } catch (error) {
      console.error('Error loading withdrawal config:', error);
      toast.error('Error al cargar la configuración');
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleSaveWithdrawalConfig = async () => {
    setSavingConfig(true);
    try {
      await axios.put(`${API}/admin/config/withdrawals`, withdrawalConfig, {
        withCredentials: true
      });
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setSavingConfig(false);
    }
  };

  const fetchEarningsStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/platform-earnings/stats`, {
        withCredentials: true
      });
      setEarningsStats(response.data);
    } catch (error) {
      console.error('Error loading earnings stats:', error);
    }
  };

  const fetchEarningsHistory = async () => {
    setLoadingEarnings(true);
    try {
      const response = await axios.get(`${API}/admin/platform-earnings?limit=50`, {
        withCredentials: true
      });
      setEarningsHistory(response.data.earnings || []);
    } catch (error) {
      console.error('Error loading earnings history:', error);
    } finally {
      setLoadingEarnings(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMoney = (amount) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="w-full px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline">Volver</span>
            </Button>

            <img src={logoFull} alt="VNSOW" className="h-6 md:h-8" />
            <span className="text-xl font-semibold text-slate-600">Configuración</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tabs para escritorio */}
          <TabsList className="hidden md:flex bg-white border-2 shadow-md p-1 h-auto gap-1">
            <TabsTrigger
              value="retiros"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-sm font-semibold px-4 py-2"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Configuración de Retiros
            </TabsTrigger>
            <TabsTrigger
              value="ganancias"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-500 data-[state=active]:to-brand-600 data-[state=active]:text-white text-sm font-semibold px-4 py-2"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Ganancias de la Plataforma
            </TabsTrigger>
          </TabsList>

          {/* Tabs para móvil - más compactas */}
          <TabsList className="md:hidden grid grid-cols-2 bg-white border-2 shadow-md p-1 h-auto gap-1 w-full">
            <TabsTrigger
              value="retiros"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white text-xs font-semibold px-2 py-2.5 flex flex-col items-center gap-1"
            >
              <Wallet className="h-5 w-5" />
              <span>Retiros</span>
            </TabsTrigger>
            <TabsTrigger
              value="ganancias"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-brand-500 data-[state=active]:to-brand-600 data-[state=active]:text-white text-xs font-semibold px-2 py-2.5 flex flex-col items-center gap-1"
            >
              <DollarSign className="h-5 w-5" />
              <span>Ganancias</span>
            </TabsTrigger>
          </TabsList>

          {/* Configuración de Retiros */}
          <TabsContent value="retiros">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b-2 bg-gradient-to-r from-slate-50 to-gray-50">
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                  <Settings className="h-5 w-5 md:h-6 md:w-6 text-slate-600" />
                  Configuración de Retiros
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Configura los parámetros para las solicitudes de retiro
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {loadingConfig ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                  </div>
                ) : (
                  <div className="max-w-2xl space-y-6">
                    {/* Monto Mínimo */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Monto Mínimo de Retiro (USD)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={withdrawalConfig.min_amount}
                        onChange={(e) => setWithdrawalConfig({
                          ...withdrawalConfig,
                          min_amount: parseFloat(e.target.value) || 0
                        })}
                        placeholder="0.00"
                        className="max-w-xs"
                      />
                      <p className="text-xs text-slate-500">
                        Dejar en 0 para no establecer un mínimo
                      </p>
                    </div>

                    {/* Monto Máximo */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Monto Máximo de Retiro (USD)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={withdrawalConfig.max_amount}
                        onChange={(e) => setWithdrawalConfig({
                          ...withdrawalConfig,
                          max_amount: parseFloat(e.target.value) || 0
                        })}
                        placeholder="0.00"
                        className="max-w-xs"
                      />
                      <p className="text-xs text-slate-500">
                        Dejar en 0 para que el máximo sea el saldo disponible del usuario
                      </p>
                    </div>

                    {/* Tipo de Comisión */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Tipo de Comisión
                      </label>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="commission_type"
                            value="none"
                            checked={withdrawalConfig.commission_type === 'none'}
                            onChange={(e) => setWithdrawalConfig({
                              ...withdrawalConfig,
                              commission_type: e.target.value,
                              commission_value: 0
                            })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-slate-700">Sin comisión</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="commission_type"
                            value="percentage"
                            checked={withdrawalConfig.commission_type === 'percentage'}
                            onChange={(e) => setWithdrawalConfig({
                              ...withdrawalConfig,
                              commission_type: e.target.value
                            })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-slate-700">Porcentaje (%)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="commission_type"
                            value="fixed"
                            checked={withdrawalConfig.commission_type === 'fixed'}
                            onChange={(e) => setWithdrawalConfig({
                              ...withdrawalConfig,
                              commission_type: e.target.value
                            })}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-slate-700">Monto Fijo (USD)</span>
                        </label>
                      </div>
                    </div>

                    {/* Valor de Comisión - Solo mostrar si no es "sin comisión" */}
                    {withdrawalConfig.commission_type !== 'none' && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                          Valor de Comisión {withdrawalConfig.commission_type === 'percentage' ? '(%)' : '(USD)'}
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step={withdrawalConfig.commission_type === 'percentage' ? '0.1' : '0.01'}
                          value={withdrawalConfig.commission_value}
                          onChange={(e) => setWithdrawalConfig({
                            ...withdrawalConfig,
                            commission_value: parseFloat(e.target.value) || 0
                          })}
                          placeholder="0"
                          className="max-w-xs"
                        />
                      </div>
                    )}

                    {/* Separador */}
                    <div className="border-t border-slate-200 pt-6 mt-6">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Phone className="h-5 w-5 text-slate-600" />
                        Contacto del Administrador
                      </h3>
                    </div>

                    {/* Número de Contacto del Admin */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-700">
                        Número de WhatsApp / Teléfono
                      </label>
                      <Input
                        type="text"
                        value={withdrawalConfig.admin_contact || ''}
                        onChange={(e) => setWithdrawalConfig({
                          ...withdrawalConfig,
                          admin_contact: e.target.value
                        })}
                        placeholder="Ej: +1 234 567 8900"
                        className="max-w-md"
                      />
                      <p className="text-xs text-slate-500">
                        Este número se mostrará a los usuarios cuando seleccionen "Contactar administrador" como método de retiro
                      </p>
                    </div>

                    {/* Preview de configuración */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Vista previa de la configuración</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>
                          <strong>Mínimo:</strong> {withdrawalConfig.min_amount > 0 ? `$${withdrawalConfig.min_amount}` : 'Sin mínimo'}
                        </p>
                        <p>
                          <strong>Máximo:</strong> {withdrawalConfig.max_amount > 0 ? `$${withdrawalConfig.max_amount}` : 'Saldo del usuario'}
                        </p>
                        <p>
                          <strong>Comisión:</strong> {withdrawalConfig.commission_type === 'none' || withdrawalConfig.commission_value <= 0
                            ? 'Sin comisión'
                            : (withdrawalConfig.commission_type === 'percentage'
                              ? `${withdrawalConfig.commission_value}% del monto`
                              : `$${withdrawalConfig.commission_value} fijo`)}
                        </p>
                        <p>
                          <strong>Contacto Admin:</strong> {withdrawalConfig.admin_contact || 'No configurado'}
                        </p>
                      </div>
                    </div>

                    {/* Botón Guardar */}
                    <div className="pt-4">
                      <Button
                        onClick={handleSaveWithdrawalConfig}
                        disabled={savingConfig}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {savingConfig ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Guardando...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Guardar Configuración
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ganancias de la Plataforma */}
          <TabsContent value="ganancias">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-0 bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-brand-100 uppercase font-semibold">Balance Total</span>
                      <DollarSign className="h-5 w-5 text-brand-200" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold">${formatMoney(earningsStats.balance)}</div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-blue-100 uppercase font-semibold">Hoy</span>
                      <Calendar className="h-5 w-5 text-blue-200" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold">${formatMoney(earningsStats.today.total)}</div>
                    <div className="text-xs text-blue-200">{earningsStats.today.count} transacciones</div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-purple-100 uppercase font-semibold">Este Mes</span>
                      <TrendingUp className="h-5 w-5 text-purple-200" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold">${formatMoney(earningsStats.month.total)}</div>
                    <div className="text-xs text-purple-200">{earningsStats.month.count} transacciones</div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-amber-100 uppercase font-semibold">Total Histórico</span>
                      <DollarSign className="h-5 w-5 text-amber-200" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold">${formatMoney(earningsStats.all_time.total)}</div>
                    <div className="text-xs text-amber-200">{earningsStats.all_time.count} transacciones</div>
                  </CardContent>
                </Card>
              </div>

              {/* Historial */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b-2 bg-gradient-to-r from-slate-50 to-gray-50">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-brand-600" />
                    Historial de Comisiones
                  </CardTitle>
                  <CardDescription>
                    Registro detallado de todas las comisiones cobradas
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  {loadingEarnings ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                    </div>
                  ) : earningsHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <DollarSign className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">Sin comisiones registradas</h3>
                      <p className="text-slate-600">Las comisiones de los retiros aparecerán aquí cuando se aprueben.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {earningsHistory.map((earning) => (
                        <div
                          key={earning._id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-brand-300 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-semibold">
                              {earning.user_name?.charAt(0).toUpperCase() || '$'}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{earning.user_name}</div>
                              <div className="text-sm text-slate-500">{earning.description}</div>
                              <div className="text-xs text-slate-400">{formatDate(earning.created_at)}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg text-brand-600">+${formatMoney(earning.amount)}</div>
                            <Badge variant="outline" className="text-xs bg-brand-50 text-brand-700 border-brand-200">
                              {earning.type === 'withdrawal_commission' ? 'Comisión Retiro' : earning.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
