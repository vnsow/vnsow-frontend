import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, Loader2 } from 'lucide-react';
import logoFull from '../assets/icons/vnsow-logo.svg';
import { useAuth } from '../context/AuthContext';
import { loginWithGoogle, BACKEND_UNAVAILABLE_MESSAGE } from '../utils/backendHealth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Variables de URL base - comentar/descomentar según el entorno
// const BASE_URL = 'http://localhost:3000'; // Desarrollo
const BASE_URL = 'https://vnsow.com'; // Producción

const RegisterWithReferral = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const referralCode = searchParams.get('ref');
  const { user } = useAuth(); // Obtener usuario autenticado

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [validatingCode, setValidatingCode] = useState(true);
  const [codeValid, setCodeValid] = useState(false);
  const [referrerInfo, setReferrerInfo] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState('');

  // Validar código de referido al cargar
  useEffect(() => {
    const validateReferralCode = async () => {
      if (!referralCode) {
        setErrorModalMessage('No se proporcionó un código de referido válido.');
        setShowErrorModal(true);
        setValidatingCode(false);
        return;
      }

      try {
        setValidatingCode(true);
        const response = await axios.get(`${BACKEND_URL}/api/validate-referral-code/${referralCode}`, {
          withCredentials: true // Incluir credenciales para validación adicional
        });

        if (response.data.valid) {
          // Si el usuario ya está logueado, redirigir al dashboard
          if (user) {
            // Solo guardar en localStorage si el usuario NO tiene referrer
            if (!user.referred_by_code) {
              localStorage.setItem('pending_referral_code', referralCode);
              localStorage.setItem('pending_referral_data', JSON.stringify(response.data.referrer));
              // Forzar recarga completa del dashboard para activar el modal
              window.location.href = '/dashboard';
            } else {
              // Usuario ya tiene referrer, solo redirigir normalmente
              navigate('/dashboard');
            }
            return;
          }

          // Usuario no logueado: mostrar formulario de registro
          setCodeValid(true);
          setReferrerInfo(response.data.referrer);
          // Guardar código de referido en localStorage para procesarlo después del registro
          localStorage.setItem('pending_referral_code', referralCode);
          localStorage.setItem('pending_referral_data', JSON.stringify(response.data.referrer));
        } else {
          setErrorModalMessage(response.data.message || 'El código de referido no es válido.');
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error('Error validating referral code:', error);
        setErrorModalMessage(
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'El código de referido no existe o no es válido.'
        );
        setShowErrorModal(true);
      } finally {
        setValidatingCode(false);
      }
    };

    validateReferralCode();
  }, [referralCode, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    if (attemptedSubmit) setAttemptedSubmit(false);
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError('');
    if (attemptedSubmit) setAttemptedSubmit(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!loginData.email || !loginData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        loginData,
        { withCredentials: true }
      );

      if (response.data.user) {
        // El código de referido ya está en localStorage, redirigir al dashboard
        window.location.href = '/dashboard';
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Email o contraseña incorrectos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAttemptedSubmit(true);
    setLoading(true);

    // Validaciones
    if (!formData.name || !formData.email || !formData.password) {
      setError('Por favor completa todos los campos obligatorios');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un email válido');
      setLoading(false);
      return;
    }

    try {
      // Registrar usuario SIN código de referido (se procesará después en el dashboard)
      await axios.post(`${BACKEND_URL}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null,
      });

      setSuccess(true);

      // Después de 2 segundos, intentar hacer login automático
      setTimeout(async () => {
        try {
          const loginResponse = await axios.post(
            `${BACKEND_URL}/api/auth/login`,
            {
              email: formData.email,
              password: formData.password,
            },
            { withCredentials: true }
          );

          if (loginResponse.data.user) {
            // El código de referido ya está en localStorage, redirigir al dashboard
            window.location.href = '/dashboard';
          }
        } catch (err) {
          console.error('Error en login automático:', err);
          navigate('/');
        }
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Error al registrar usuario';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      // El código de referido ya está guardado en localStorage, no necesitamos pasarlo por URL
      await loginWithGoogle();
    } catch (e) {
      setError(BACKEND_UNAVAILABLE_MESSAGE);
      setLoading(false);
    }
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    navigate('/');
  };

  // Mostrar loader mientras valida el código
  if (validatingCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-brand-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Validando código de referido...</p>
        </div>
      </div>
    );
  }

  // Mostrar modal de error si el código no es válido
  if (!codeValid && showErrorModal) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Código Inválido</h2>
            <p className="text-slate-600 mb-6">{errorModalMessage}</p>
            <Button
              onClick={handleErrorModalClose}
              className="w-full bg-brand-600 hover:bg-brand-700"
            >
              Ir al Inicio
            </Button>
          </div>
        </div>

        {/* Modal de respaldo */}
        <Dialog open={showErrorModal} onOpenChange={handleErrorModalClose}>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Código Inválido
              </DialogTitle>
              <DialogDescription>{errorModalMessage}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end mt-4">
              <Button onClick={handleErrorModalClose} className="bg-brand-600 hover:bg-brand-700">
                OK
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <img src={logoFull} alt="VNSOW" className="h-8 sm:h-10 mx-auto mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            {success ? '¡Bienvenido!' : isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          {!success && !isLoginMode && (
            <p className="text-sm sm:text-base text-slate-600">
              Registrado por <span className="font-semibold text-brand-600">{referrerInfo?.name || 'referido'}</span>
            </p>
          )}
        </div>

        {/* Información del referidor - Mostrar siempre si NO se ha completado el registro/login */}
        {referrerInfo && !success && (
          <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-3 sm:p-4 mb-6">
            <div className="flex items-center gap-3">
              {/* Avatar del referidor con jerarquía: custom_picture > picture > iniciales */}
              {(referrerInfo.custom_picture || referrerInfo.picture) ? (
                <img
                  src={referrerInfo.custom_picture || referrerInfo.picture}
                  alt={referrerInfo.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-brand-300 flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm sm:text-lg border-2 border-brand-300 flex-shrink-0"
                style={{ display: (referrerInfo.custom_picture || referrerInfo.picture) ? 'none' : 'flex' }}
              >
                {referrerInfo.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-600">{isLoginMode ? 'Link de referido de' : 'Te invitó'}</p>
                <p className="font-semibold text-sm sm:text-base text-slate-900">{referrerInfo.name}</p>
                <p className="text-xs text-brand-600">{isLoginMode ? 'Inicia sesión para vincularlo' : `Código: ${referralCode}`}</p>
              </div>
            </div>
          </div>
        )}

        {success ? (
          <div className="py-6 sm:py-8 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2">¡Registro Completado!</h3>
            <p className="text-sm sm:text-base text-slate-600 mb-2">Tu cuenta ha sido creada exitosamente.</p>
            <p className="text-xs sm:text-sm text-slate-500">Redirigiendo al dashboard...</p>
          </div>
        ) : (
          <>
            {/* Botón de Google */}
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              disabled={loading}
              className="w-full border-2 hover:bg-slate-50 text-sm sm:text-base h-10 sm:h-11 mb-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                  <span className="text-sm sm:text-base">Conectando...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-sm sm:text-base">Continuar con Google</span>
                </>
              )}
            </Button>

            <div className="relative mb-4">
              <Separator />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] sm:text-xs text-slate-500">
                {isLoginMode ? 'O inicia sesión con email' : 'O regístrate con email'}
              </span>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm mb-4">
                {error}
              </div>
            )}

            {/* Formulario de Login */}
            {isLoginMode ? (
              <form onSubmit={handleLogin} noValidate className="space-y-3 sm:space-y-4">
                {/* Email */}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="login-email" className="text-xs sm:text-sm">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      autoComplete="email"
                      className={`pl-8 sm:pl-10 text-sm sm:text-base h-9 sm:h-10 ${
                        attemptedSubmit && !loginData.email
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : ''
                      }`}
                      required
                    />
                  </div>
                  {attemptedSubmit && !loginData.email && (
                    <div className="flex items-center gap-1 text-red-600 text-xs sm:text-sm">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>El email es obligatorio</span>
                    </div>
                  )}
                </div>

                {/* Contraseña */}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="login-password" className="text-xs sm:text-sm">Contraseña *</Label>
                  <div className="relative">
                    <Lock className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Tu contraseña"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      autoComplete="current-password"
                      className={`pl-8 sm:pl-10 pr-9 sm:pr-10 text-sm sm:text-base h-9 sm:h-10 ${
                        attemptedSubmit && !loginData.password
                          ? 'border-red-500 focus-visible:ring-red-500'
                          : ''
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                    </button>
                  </div>
                  {attemptedSubmit && !loginData.password && (
                    <div className="flex items-center gap-1 text-red-600 text-xs sm:text-sm">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>La contraseña es obligatoria</span>
                    </div>
                  )}
                </div>

                {/* Botón de login */}
                <Button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-sm sm:text-base h-9 sm:h-10"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar sesión'
                  )}
                </Button>
              </form>
            ) : (
              /* Formulario de Registro */
              <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-4">
              {/* Nombre */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="name" className="text-xs sm:text-sm">Nombre completo *</Label>
                <div className="relative">
                  <User className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Smith"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    className={`pl-8 sm:pl-10 text-sm sm:text-base h-9 sm:h-10 ${
                      attemptedSubmit && !formData.name
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }`}
                    required
                  />
                </div>
                {attemptedSubmit && !formData.name && (
                  <div className="flex items-center gap-1 text-red-600 text-xs sm:text-sm">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>El nombre es obligatorio</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    className={`pl-8 sm:pl-10 text-sm sm:text-base h-9 sm:h-10 ${
                      attemptedSubmit && !formData.email
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }`}
                    required
                  />
                </div>
                {attemptedSubmit && !formData.email && (
                  <div className="flex items-center gap-1 text-red-600 text-xs sm:text-sm">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>El email es obligatorio</span>
                  </div>
                )}
              </div>

              {/* Teléfono (opcional) */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="phone" className="text-xs sm:text-sm">Teléfono (opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="pl-8 sm:pl-10 text-sm sm:text-base h-9 sm:h-10"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm">Contraseña *</Label>
                <div className="relative">
                  <Lock className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className={`pl-8 sm:pl-10 pr-9 sm:pr-10 text-sm sm:text-base h-9 sm:h-10 ${
                      attemptedSubmit && !formData.password
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
                {attemptedSubmit && !formData.password && (
                  <div className="flex items-center gap-1 text-red-600 text-xs sm:text-sm">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>La contraseña es obligatoria</span>
                  </div>
                )}
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Confirmar contraseña *</Label>
                <div className="relative">
                  <Lock className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirma tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className={`pl-8 sm:pl-10 pr-9 sm:pr-10 text-sm sm:text-base h-9 sm:h-10 ${
                      attemptedSubmit && !formData.confirmPassword
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </button>
                </div>
                {attemptedSubmit && !formData.confirmPassword && (
                  <div className="flex items-center gap-1 text-red-600 text-xs sm:text-sm">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Debes confirmar tu contraseña</span>
                  </div>
                )}
              </div>

              {/* Botón de registro */}
              <Button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 text-sm sm:text-base h-9 sm:h-10"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta'
                )}
              </Button>
            </form>
            )}

            {/* Link para cambiar modo */}
            <div className="text-center text-xs sm:text-sm mt-4">
              {isLoginMode ? (
                <>
                  <span className="text-slate-600">¿No tienes cuenta?</span>{' '}
                  <button
                    onClick={() => {
                      setIsLoginMode(false);
                      setError('');
                      setAttemptedSubmit(false);
                    }}
                    className="text-brand-600 hover:text-brand-700 font-semibold"
                  >
                    Crear cuenta
                  </button>
                </>
              ) : (
                <>
                  <span className="text-slate-600">¿Ya tienes cuenta?</span>{' '}
                  <button
                    onClick={() => {
                      setIsLoginMode(true);
                      setError('');
                      setAttemptedSubmit(false);
                    }}
                    className="text-brand-600 hover:text-brand-700 font-semibold"
                  >
                    Iniciar sesión
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterWithReferral;
