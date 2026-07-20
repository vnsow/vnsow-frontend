import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Shield, Users, Calculator, ArrowRight, CheckCircle2, Percent, Clock, Globe, Facebook, Instagram, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth } from '../context/AuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';
import PlansCarousel from './PlansCarousel';
import logoFull from '../assets/icons/vnsow-logo.svg';
import logoWhite from '../assets/icons/vnsow-logo-white.svg';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LandingPage = () => {
  const { user, logout: userLogout } = useAuth();
  const { admin, logout: adminLogout } = useAdminAuth();
  const [calculatorAmount, setCalculatorAmount] = useState(5000);
  const [selectedPlan, setSelectedPlan] = useState('mensual');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Estados para planes dinámicos
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [selectedPlanCard, setSelectedPlanCard] = useState(null); // Cantidad de cards visibles según pantalla

  // Cerrar sesión automáticamente si el usuario accede al landing estando logueado
  useEffect(() => {
    if (user) {
      userLogout(false); // false = no redirigir, solo limpiar sesión
    }
    if (admin) {
      adminLogout(false); // false = no redirigir, solo limpiar sesión
    }
  }, [user, admin, userLogout, adminLogout]);

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

  const calculateReturn = () => {
    // 15-day plan hidden
    // if (selectedPlan === '15') {
    //   if (calculatorAmount < 10000) return calculatorAmount * 0.05; // 3-7% average = 5%
    //   return calculatorAmount * 0.10; // 8-12% average = 10%
    // }
    return calculatorAmount * 0.0475; // 2.5-7% average = 4.75%
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={logoFull} alt="VNSOW" className="h-6 sm:h-8" />
          </div>
          <nav className="flex items-center gap-2 sm:gap-4">
            <a href="#planes" className="hidden md:inline text-slate-600 hover:text-brand-600 transition-colors text-sm">Planes</a>
            <a href="#calculadora" className="hidden md:inline text-slate-600 hover:text-brand-600 transition-colors text-sm">Calculadora</a>
            {/* <a href="#referidos" className="hidden md:inline text-slate-600 hover:text-brand-600 transition-colors text-sm">Referidos</a> */}
            <Button onClick={() => setShowLoginModal(true)} variant="outline" className="border-brand-600 text-brand-600 hover:bg-brand-50 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
              Iniciar Sesión
            </Button>
            <Button onClick={() => setShowRegisterModal(true)} className="bg-brand-600 hover:bg-brand-700 text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-10">
              Registrarse
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-16 md:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-50 text-brand-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-semibold">Rentabilidades del 2.5% al 7% mensual</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight px-2">
            Ingeniería de Capital
            <span className="text-brand-600"> en Movimiento</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Sembrando capital en proyectos de alto impacto.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button onClick={() => setShowRegisterModal(true)} size="lg" className="bg-brand-600 hover:bg-brand-700 text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6">
              Comenzar a invertir
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6" onClick={() => document.getElementById('calculadora').scrollIntoView({ behavior: 'smooth' })}>
              Calcular retornos
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-20 max-w-3xl mx-auto px-3">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-600 mb-1 sm:mb-2">2.5% - 7%</div>
              <div className="text-xs sm:text-sm md:text-base text-slate-600">Rentabilidad mensual variable</div>
            </CardContent>
          </Card>
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-600 mb-1 sm:mb-2">30</div>
              <div className="text-xs sm:text-sm md:text-base text-slate-600">Días para retiro</div>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 sm:mt-8 max-w-3xl mx-auto px-3">
          <div className="flex items-start gap-2 sm:gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-blue-800 text-left">
              Los porcentajes mostrados son estimaciones basadas en desempeño histórico. Los retornos reales pueden variar según condiciones del mercado.
            </p>
          </div>
        </div>
      </section>

      {/* Investment Plans */}
      <section id="planes" className="bg-slate-50 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">Planes de Inversión</h2>
            <p className="text-sm sm:text-base md:text-xl text-slate-600">Elige el plan que mejor se adapte a tus objetivos</p>
          </div>

          {loadingPlans ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-slate-600">Cargando planes...</p>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8 sm:py-12 bg-white rounded-lg border-2 border-dashed max-w-2xl mx-auto">
              <p className="text-sm sm:text-base text-slate-600">No hay planes disponibles en este momento</p>
            </div>
          ) : (
            <div className="relative max-w-7xl mx-auto">
              <PlansCarousel
                plans={plans}
                selectedPlan={selectedPlanCard}
                onPlanSelect={setSelectedPlanCard}
                showButton={true}
                buttonText="Comenzar a Invertir"
                onButtonClick={() => setShowLoginModal(true)}
              />
            </div>
          )}
        </div>
      </section>

      {/* Calculator */}
      <section id="calculadora" className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2">
              <Calculator className="h-10 w-10 sm:h-12 sm:w-12 text-brand-600 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">Calculadora de Retornos</h2>
              <p className="text-sm sm:text-base md:text-xl text-slate-600">Estima tus ganancias potenciales antes de invertir</p>
            </div>
            <Card className="border-2 shadow-xl">
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Monto a invertir: ${calculatorAmount.toLocaleString()}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="50000"
                      step="100"
                      value={calculatorAmount}
                      onChange={(e) => setCalculatorAmount(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider-range"
                      style={{
                        background: `linear-gradient(to right, #3aaa35 0%, #3aaa35 ${((calculatorAmount - 100) / (50000 - 100)) * 100}%, #e2e8f0 ${((calculatorAmount - 100) / (50000 - 100)) * 100}%, #e2e8f0 100%)`
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                      Plan de inversión
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {/* 15-day plan hidden
                      <button
                        onClick={() => setSelectedPlan('15')}
                        className={`p-3 sm:p-4 border-2 rounded-lg text-left transition-all ${
                          selectedPlan === '15' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-semibold text-xs sm:text-sm md:text-base text-slate-900">Retiro 15 días</div>
                        <div className="text-xs sm:text-sm text-slate-600">3% - 12% mensual</div>
                      </button>
                      */}
                      <button
                        onClick={() => setSelectedPlan('mensual')}
                        className={`p-3 sm:p-4 border-2 rounded-lg text-left transition-all ${
                          selectedPlan === 'mensual' ? 'border-brand-600 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-semibold text-xs sm:text-sm md:text-base text-slate-900">Retiro mensual</div>
                        <div className="text-xs sm:text-sm text-slate-600">2.5% - 7% mensual</div>
                      </button>
                    </div>
                  </div>
                  <div className="bg-brand-50 p-4 sm:p-6 rounded-lg border-2 border-brand-200">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm text-slate-600 mb-2">Ingresos estimados (variables).</div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-600">
                        ${calculateReturn().toLocaleString('es-ES', { maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-xs sm:text-sm text-slate-600 mt-3 sm:mt-4">
                        Retorno sobre inversión: {((calculateReturn() / calculatorAmount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5 sm:p-3">
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 text-slate-600 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] sm:text-xs text-slate-600">
                      Valores estimados basados en desempeño histórico. Los resultados pueden variar.
                    </p>
                  </div>
                  <Button onClick={() => setShowRegisterModal(true)} size="lg" className="w-full bg-brand-600 hover:bg-brand-700 text-sm sm:text-base">
                    Comenzar con este plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Referral Program (hidden)
      <section id="referidos" className="bg-slate-50 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2">
              <Users className="h-10 w-10 sm:h-12 sm:w-12 text-brand-600 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">Programa de Referidos</h2>
              <p className="text-sm sm:text-base md:text-xl text-slate-600">Gana el 6% por cada persona que invites</p>
            </div>
            <Card className="border-2 shadow-xl">
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-6 text-center">
                  <div>
                    <div className="bg-brand-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl font-bold text-brand-600">1</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-1 sm:mb-2">Comparte tu código</h3>
                    <p className="text-xs sm:text-sm text-slate-600">Recibe un código único al registrarte</p>
                  </div>
                  <div>
                    <div className="bg-brand-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl font-bold text-brand-600">2</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-1 sm:mb-2">Invita amigos</h3>
                    <p className="text-xs sm:text-sm text-slate-600">Comparte con amigos y familiares</p>
                  </div>
                  <div>
                    <div className="bg-brand-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl font-bold text-brand-600">3</span>
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-slate-900 mb-1 sm:mb-2">Gana el 6%</h3>
                    <p className="text-xs sm:text-sm text-slate-600">Recibe bonus cuando inviertan</p>
                  </div>
                </div>
                <div className="mt-6 sm:mt-8 bg-brand-50 p-4 sm:p-6 rounded-lg border-2 border-brand-200">
                  <div className="text-center">
                    <Percent className="h-6 w-6 sm:h-8 sm:w-8 text-brand-600 mx-auto mb-2" />
                    <div className="text-xs sm:text-sm text-slate-600 mb-1">Ejemplo: Si tu referido invierte $10,000</div>
                    <div className="text-2xl sm:text-3xl font-bold text-brand-600">Ganas $600</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      */}

      {/* Tipos de Mercados */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">Tipos de Inversión</h2>
            <p className="text-sm sm:text-base md:text-xl text-slate-600">Diversifica tu portafolio con activos tangibles e intangibles</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="bg-brand-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-brand-600" />
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl">Inversiones Tangibles</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Activos físicos con valor real y medible</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 mt-0.5 flex-shrink-0"/>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm md:text-base text-slate-900">Bienes Raíces</div>
                      <div className="text-xs sm:text-sm text-slate-600">Propiedades comerciales y residenciales</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 mt-0.5 flex-shrink-0"/>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm md:text-base text-slate-900">Metales Preciosos</div>
                      <div className="text-xs sm:text-sm text-slate-600">Oro, plata y otros metales de inversión</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 mt-0.5 flex-shrink-0"/>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm md:text-base text-slate-900">Materias Primas:</div>
                      <div className="text-xs sm:text-sm text-slate-600">Recursos naturales estratégicos</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 mt-0.5 flex-shrink-0"/>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm md:text-base text-slate-900">Arte y Coleccionables:</div>
                      <div className="text-xs sm:text-sm text-slate-600">Objetos de valor cultural e histórico</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 mt-0.5 flex-shrink-0"/>
                    <div>
                      <div className="font-semibold text-xs sm:text-sm md:text-base text-slate-900">Negocios de la Economía Real:</div>
                      <div className="text-xs sm:text-sm text-slate-600">Agroindustria, energía, manufactura, comercio,
                        infraestructura y construcción
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed italic bg-slate-50 p-2 sm:p-3 rounded-lg border border-slate-100">
                    <strong>Nota:</strong> Solidez patrimonial y rentabilidad a largo plazo, con generación de flujo económico directo.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader className="p-4 sm:p-6">
                <div className="bg-purple-100 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600"/>
                </div>
                <CardTitle className="text-lg sm:text-xl md:text-2xl">Mercados Financieros Intangibles</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Oportunidades globales sin soporte físico, pero con alto valor estratégico </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mt-0.5 flex-shrink-0"/>
                    <div className="text-xs sm:text-sm text-slate-600">Acciones y Bonos Internacionales</div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mt-0.5 flex-shrink-0"/>
                    <div className="text-xs sm:text-sm text-slate-600">Forex y Derivados Financieros</div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mt-0.5 flex-shrink-0"/>
                    <div className="text-xs sm:text-sm text-slate-600">Criptoactivos Regulados y ETFs Digitales</div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mt-0.5 flex-shrink-0"/>
                    <div className="text-xs sm:text-sm text-slate-600">Propiedad Intelectual y Derechos de Cobro</div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mt-0.5 flex-shrink-0"/>
                    <div className="text-xs sm:text-sm text-slate-600">Tecnología, Software y Datos como Activos</div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mt-0.5 flex-shrink-0"/>
                    <div className="text-xs sm:text-sm text-slate-600">Servicios Financieros de Alto Valor</div>
                  </div>
                  <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-500 leading-relaxed italic bg-slate-50 p-2 sm:p-3 rounded-lg border border-slate-100">
                    <strong>Nota:</strong> Diversificación inteligente para potenciar tu capital en el mundo digital y global.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 sm:mt-10 md:mt-12 max-w-3xl mx-auto">
            <Card className="border-2 bg-slate-50">
              <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                <div className="text-center">
                  <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-brand-600 mx-auto mb-2 sm:mb-3"/>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 mb-2">Diversificación Inteligente</h3>
                  <p className="text-xs sm:text-sm md:text-base text-slate-600">
                    Nuestros expertos gestionan tu portafolio combinando activos tangibles e intangibles
                    para maximizar retornos y minimizar riesgos. Cada inversión es cuidadosamente
                    seleccionada según las condiciones del mercado.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">¿Por qué invertir con nosotros?</h2>
            <p className="text-sm sm:text-base md:text-xl text-slate-600">Seguridad y transparencia en cada inversión</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 sm:p-6">
                <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-brand-600 mb-2" />
                <CardTitle className="text-base sm:text-lg">100% Seguro</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm md:text-base text-slate-600">Tus inversiones están protegidas con los más altos estándares de seguridad.</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 sm:p-6">
                <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-brand-600 mb-2" />
                <CardTitle className="text-base sm:text-lg">Retornos Competitivos</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm md:text-base text-slate-600">Rentabilidades del 2.5% al 7% mensual según tu plan de inversión seleccionado.</p>
              </CardContent>
            </Card>
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="p-4 sm:p-6">
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-brand-600 mb-2" />
                <CardTitle className="text-base sm:text-lg">Retiros Rápidos</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm md:text-base text-slate-600">Accede a tus ganancias cada 30 días o mensualmente según tu preferencia.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-600 text-white py-10 sm:py-14 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-6">¿Listo para comenzar a invertir?</h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg mb-5 sm:mb-6 md:mb-8 text-brand-50 max-w-2xl mx-auto px-2">
            Únete a miles de inversores que ya están haciendo crecer su capital de forma inteligente.
          </p>
          <Button
            onClick={() => setShowRegisterModal(true)}
            size="lg"
            variant="secondary"
            className="text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 bg-white text-brand-600 hover:bg-slate-50 w-full sm:w-auto max-w-sm sm:max-w-none shadow-lg hover:shadow-xl transition-shadow"
          >
            Crear cuenta gratis
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="mb-3 sm:mb-4">
                <img src={logoWhite} alt="VNSOW" className="h-6 sm:h-8" />
              </div>
              <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">Ingeniería de capital en movimiento. Rendimientos variables según ejecución; no garantizados.</p>

              {/* Social Media Icons */}
              <div className="flex items-center gap-2 sm:gap-3">
                <a
                  href="https://www.facebook.com/share/1K4V35yj2M/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-brand-600 transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a
                  href="https://www.instagram.com/ia.stake?igsh=MWZlYW5nNHhhcXQ1aQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
                <a
                  href="https://wa.me/+593963319001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-all hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Producto</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-400">
                <li><a href="#planes" className="hover:text-white transition-colors">Planes</a></li>
                <li><a href="#calculadora" className="hover:text-white transition-colors">Calculadora</a></li>
                {/* <li><a href="#referidos" className="hover:text-white transition-colors">Referidos</a></li> */}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Mercados</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-400">
                <li>Tangibles</li>
                <li>Intangibles</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Soporte</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-slate-400">
                <li><a href="mailto:support@vnsow.com" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
                <li><a href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</a></li>
                <li><a href="/privacidad" className="hover:text-white transition-colors">Políticas de Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-slate-400">
            <p>&copy; 2026 vnsow.com. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modales de Autenticación */}
      <RegisterModal
        open={showRegisterModal}
        onOpenChange={setShowRegisterModal}
        onSwitchToLogin={() => setShowLoginModal(true)}
      />
      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onSwitchToRegister={() => setShowRegisterModal(true)}
      />
    </div>
  );
};

export default LandingPage;
