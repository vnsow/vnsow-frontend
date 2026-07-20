import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { loginWithGoogle, BACKEND_UNAVAILABLE_MESSAGE } from '../utils/backendHealth';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LoginModal = ({ open, onOpenChange, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Limpiar error al escribir
    if (attemptedSubmit) setAttemptedSubmit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAttemptedSubmit(true);
    setLoading(true);

    // Validaciones
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
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
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true, // Importante para recibir cookies
        }
      );

      // Login exitoso, redirigir al dashboard
      if (response.data.user) {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Error al iniciar sesión';
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
      await loginWithGoogle();
      // Si llegamos aquí, ya se redirigió. No reseteamos loading porque la página se descarga.
    } catch (e) {
      setError(BACKEND_UNAVAILABLE_MESSAGE);
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
    });
    setError('');
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center">Iniciar Sesión</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-center">
            Accede a tu cuenta para continuar invirtiendo
          </DialogDescription>
        </DialogHeader>

        {/* Botón de Google */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          disabled={loading}
          className="w-full border-2 hover:bg-slate-50 text-sm sm:text-base h-10 sm:h-11"
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

        <div className="relative">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] sm:text-xs text-slate-500">
            O inicia sesión con email
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-4">
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

          {/* Contraseña */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="password" className="text-xs sm:text-sm">Contraseña *</Label>
            <div className="relative">
              <Lock className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
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

          {/* Botón de login */}
          <Button
            type="submit"
            className="w-full bg-brand-600 hover:bg-brand-700 text-sm sm:text-base h-9 sm:h-10"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </Button>
        </form>

        {/* Link para cambiar a registro */}
        <div className="text-center text-xs sm:text-sm">
          <span className="text-slate-600">¿No tienes cuenta?</span>{' '}
          <button
            onClick={() => {
              resetForm();
              onOpenChange(false);
              onSwitchToRegister();
            }}
            className="text-brand-600 hover:text-brand-700 font-semibold"
          >
            Registrarse
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
