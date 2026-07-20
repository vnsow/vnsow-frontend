import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import axios from 'axios';
import logoIcon from '../assets/icons/vnsow-favicon.svg';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    setError('');

    // Validar campos vacíos
    if (!username.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API}/admin/auth/login`,
        { username, password },
        { withCredentials: true }
      );

      // Login exitoso - redirigir al panel de admin
      // Usamos window.location.href para forzar recarga y asegurar que la cookie esté disponible
      window.location.href = '/admin';
    } catch (err) {
      console.error('Error de login:', err);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Error al iniciar sesión. Por favor intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-brand-100 p-4 rounded-full">
              <img src={logoIcon} alt="VNSOW" className="h-12 w-12" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">
            Panel de Administración
          </CardTitle>
          <CardDescription className="text-slate-600">
            Ingresa tus credenciales de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username">Usuario *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className={`pl-10 ${
                    attemptedSubmit && !username.trim()
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }`}
                  placeholder="Ingresa tu usuario"
                  required
                />
              </div>
              {attemptedSubmit && !username.trim() && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>El usuario es obligatorio</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className={`pl-10 ${
                    attemptedSubmit && !password.trim()
                      ? 'border-red-500 focus-visible:ring-red-500'
                      : ''
                  }`}
                  placeholder="Ingresa tu contraseña"
                  required
                />
              </div>
              {attemptedSubmit && !password.trim() && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>La contraseña es obligatoria</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white py-6 text-lg font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Iniciando sesión...</span>
                </div>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-slate-600 hover:text-brand-600 transition-colors"
            >
              ← Volver al inicio
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
