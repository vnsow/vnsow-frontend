import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowLeft, AlertTriangle, CheckCircle2, Eye, Database, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import logoFull from '../assets/icons/vnsow-logo.svg';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/')} variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img src={logoFull} alt="VNSOW" className="h-8" />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-100 to-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Lock className="h-16 w-16 text-brand-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Políticas de Privacidad
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Última actualización: 9 de Enero, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Important Notices */}
          <Alert className="mb-8 border-2 border-blue-300 bg-blue-50">
            <Shield className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-900 font-bold">COMPROMISO CON SU PRIVACIDAD</AlertTitle>
            <AlertDescription className="text-blue-800">
              En iastake.com nos tomamos muy en serio la protección de sus datos personales. Esta política explica cómo recopilamos, usamos, almacenamos y protegemos su información.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            {/* Section 1 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Información que Recopilamos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="font-bold text-slate-900 mb-3">Datos Personales:</h4>
                <ul className="space-y-3 text-slate-700 mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Información de Registro:</strong> Nombre completo, dirección de correo electrónico, fecha de nacimiento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Autenticación OAuth:</strong> Datos de perfil de Google (nombre, email, foto de perfil)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Verificación KYC:</strong> Documento de identidad, comprobante de domicilio (cuando sea requerido)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Información Financiera:</strong> Datos de métodos de pago, historial de transacciones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Datos de Uso:</strong> Dirección IP, tipo de dispositivo, navegador, actividad en la plataforma</span>
                  </li>
                </ul>

                <h4 className="font-bold text-slate-900 mb-3 mt-6">Datos Técnicos:</h4>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Cookies y tecnologías similares para mejorar su experiencia</li>
                  <li>Logs de servidor para seguridad y mantenimiento</li>
                  <li>Análisis de uso de la plataforma para mejoras continuas</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  Cómo Usamos su Información
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Utilizamos la información recopilada para los siguientes propósitos:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Prestación de Servicios:</strong> Procesar inversiones, retiros, y gestionar su cuenta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Seguridad:</strong> Prevenir fraude, detectar actividad sospechosa y proteger su cuenta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Cumplimiento Legal:</strong> Verificación KYC/AML y cumplimiento de regulaciones aplicables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Comunicación:</strong> Notificaciones importantes, actualizaciones de cuenta y soporte</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Mejoras:</strong> Análisis de uso para optimizar la plataforma y servicios</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Marketing:</strong> Envío de promociones (solo con su consentimiento)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 3 - Seguridad */}
            <Card className="border-2 border-brand-200 bg-brand-50">
              <CardHeader className="bg-brand-100">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-brand-600"/>
                  Protección y Seguridad de Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="font-bold text-slate-900 mb-3">Medidas de Seguridad Implementadas:</h4>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0"/>
                    <span><strong>Encriptación TLS 1.3:</strong> Toda comunicación entre su navegador y nuestros servidores está cifrada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Encriptación AES-256:</strong> Datos sensibles almacenados con cifrado de grado militar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>OAuth 2.0:</strong> No almacenamos contraseñas, usamos autenticación segura con Google</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Monitoreo 24/7:</strong> Sistemas automáticos de detección de amenazas y actividad sospechosa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Acceso Restringido:</strong> Solo personal autorizado puede acceder a datos personales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Auditorías Regulares:</strong> Revisión periódica de sistemas de seguridad</span>
                  </li>
                </ul>

                <div className="bg-white p-4 rounded-lg mt-4 border-2 border-brand-300">
                  <p className="text-slate-700 text-sm">
                    <strong>Importante:</strong> Ningún sistema es 100% seguro. Aunque implementamos las mejores prácticas de seguridad, recomendamos que usted también proteja su cuenta manteniendo sus credenciales seguras y reportando cualquier actividad sospechosa.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                  Compartir Información con Terceros
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  NO vendemos ni alquilamos su información personal. Solo compartimos datos en estas circunstancias:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span><strong>Proveedores de Servicios:</strong> Procesadores de pago, servicios de verificación KYC, proveedores de hosting (todos bajo acuerdos de confidencialidad)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span><strong>Cumplimiento Legal:</strong> Cuando sea requerido por ley, orden judicial o autoridades gubernamentales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span><strong>Protección de Derechos:</strong> Para investigar fraude, violaciones de términos o proteger la seguridad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span><strong>Con su Consentimiento:</strong> En cualquier otra situación con su autorización explícita</span>
                  </li>
                </ul>

                <div className="bg-blue-50 p-4 rounded-lg mt-4 border-2 border-blue-200">
                  <p className="text-blue-900 text-sm">
                    <strong>Nota:</strong> Todos los terceros con acceso a sus datos están obligados contractualmente a mantener la confidencialidad y solo usar la información para los propósitos autorizados.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                  Cookies y Tecnologías de Seguimiento
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Utilizamos cookies y tecnologías similares para mejorar su experiencia:
                </p>

                <h4 className="font-bold text-slate-900 mb-3">Tipos de Cookies que Usamos:</h4>
                <ul className="space-y-3 text-slate-700 mb-4">
                  <li>• <strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento de la plataforma (sesión, autenticación)</li>
                  <li>• <strong>Cookies de Rendimiento:</strong> Análisis de uso para mejorar el servicio</li>
                  <li>• <strong>Cookies de Funcionalidad:</strong> Recordar sus preferencias y configuraciones</li>
                  <li>• <strong>Cookies de Marketing:</strong> Solo con su consentimiento, para personalizar contenido</li>
                </ul>

                <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <strong>Control de Cookies:</strong> Puede gestionar o deshabilitar cookies desde la configuración de su navegador. Note que algunas funcionalidades pueden no estar disponibles si deshabilita cookies esenciales.
                </p>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                  Retención de Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Conservamos su información personal durante el tiempo necesario para:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                  <li>Proporcionar nuestros servicios mientras su cuenta esté activa</li>
                  <li>Cumplir con obligaciones legales y regulatorias (típicamente 5-7 años después del cierre de cuenta)</li>
                  <li>Resolver disputas y hacer cumplir acuerdos</li>
                  <li>Prevenir fraude y proteger la seguridad</li>
                </ul>

                <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300">
                  <p className="text-amber-900 text-sm">
                    <strong>Importante:</strong> Incluso después de eliminar su cuenta, algunas informaciones pueden conservarse por períodos más largos según lo requiera la ley (regulaciones AML/KYC, registros financieros, etc.).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                  Sus Derechos de Privacidad
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="font-bold text-slate-900 mb-3">Usted tiene derecho a:</h4>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <UserCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Acceso:</strong> Solicitar copia de sus datos personales que tenemos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <UserCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <UserCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Eliminación:</strong> Solicitar la eliminación de sus datos (sujeto a obligaciones legales)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <UserCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Portabilidad:</strong> Recibir sus datos en formato estructurado y legible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <UserCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Oposición:</strong> Oponerse al procesamiento de sus datos para ciertos fines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <UserCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Restricción:</strong> Solicitar limitación del procesamiento de sus datos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <UserCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Revocar Consentimiento:</strong> Retirar consentimiento para marketing en cualquier momento</span>
                  </li>
                </ul>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <p className="text-slate-700 text-sm">
                    Para ejercer estos derechos, contáctenos en: <strong>privacy@iastake.com</strong>
                    <br />Responderemos a su solicitud dentro de 30 días.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                  Transferencias Internacionales
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Sus datos pueden ser transferidos y procesados en países fuera de su jurisdicción. Aseguramos que:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Todas las transferencias cumplen con leyes de protección de datos aplicables</li>
                  <li>Implementamos salvaguardas apropiadas (contratos de transferencia de datos, cláusulas estándar)</li>
                  <li>Proveedores en terceros países mantienen niveles adecuados de protección</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 9 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                  Menores de Edad
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Nuestros servicios están dirigidos a personas mayores de 18 años.
                </p>
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <p className="text-red-900 font-semibold">
                    NO recopilamos intencionalmente información de menores de 18 años.
                  </p>
                  <p className="text-red-800 text-sm mt-2">
                    Si descubrimos que hemos recopilado datos de un menor, eliminaremos dicha información inmediatamente. Si cree que un menor nos ha proporcionado información, contáctenos de inmediato.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 10 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">10</span>
                  Cambios a esta Política
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Podemos actualizar esta política de privacidad periódicamente para reflejar:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                  <li>Cambios en nuestras prácticas de datos</li>
                  <li>Nuevas funcionalidades de la plataforma</li>
                  <li>Requisitos legales o regulatorios</li>
                  <li>Mejoras en medidas de seguridad</li>
                </ul>
                <p className="text-slate-700">
                  Le notificaremos sobre cambios significativos por email o mediante aviso destacado en la plataforma. La fecha de "Última actualización" siempre refleja la versión vigente.
                </p>
              </CardContent>
            </Card>

            {/* Section 11 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">11</span>
                  Contacto - Oficial de Privacidad
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Para preguntas, solicitudes o inquietudes sobre privacidad:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700"><strong>Email de Privacidad:</strong> privacy@iastake.com</p>
                  <p className="text-slate-700"><strong>Email General:</strong> support@iastake.com</p>
                  <p className="text-slate-700"><strong>Sitio web:</strong> www.iastake.com</p>
                  <p className="text-slate-700 mt-2 text-sm">Tiempo de respuesta: 5-10 días hábiles para solicitudes de privacidad</p>
                </div>
              </CardContent>
            </Card>

            {/* Final Notice */}
            <Alert className="border-2 border-brand-300 bg-brand-50">
              <CheckCircle2 className="h-5 w-5 text-brand-600" />
              <AlertTitle className="text-brand-900 font-bold">Consentimiento</AlertTitle>
              <AlertDescription className="text-brand-800">
                Al utilizar iastake.com, usted acepta esta Política de Privacidad y el procesamiento de sus datos personales según lo descrito. Si no está de acuerdo, por favor no utilice nuestros servicios.
              </AlertDescription>
            </Alert>

            {/* CTA */}
            <Card className="mt-8 border-2 bg-gradient-to-r from-brand-50 to-blue-50">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate('/')} className="bg-brand-600 hover:bg-brand-700">
                    Volver al Inicio
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/terms')}>
                    Ver Términos y Condiciones
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">&copy; 2026 iastake.com. Todos los derechos reservados.</p>
          <p className="text-slate-500 text-xs mt-2">Última actualización: 9 de Enero, 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
