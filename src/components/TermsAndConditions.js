import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, FileText, ArrowLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import logoFull from '../assets/icons/vnsow-logo.svg';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const TermsAndConditions = () => {
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
          <FileText className="h-16 w-16 text-brand-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Términos y Condiciones
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Última actualización: Julio 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Important Notices */}
          <Alert className="mb-8 border-2 border-amber-300 bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-900 font-bold">AVISO IMPORTANTE - LEA CUIDADOSAMENTE</AlertTitle>
            <AlertDescription className="text-amber-800">
              Al utilizar vnsow.com, usted acepta estos términos en su totalidad. Si no está de acuerdo con alguna parte, no utilice nuestros servicios. La inversión conlleva riesgos y los retornos son variables.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            {/* Section 1 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Naturaleza del Servicio
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  vnsow.com provee software de ejecución técnica para activos financieros. El usuario reconoce el riesgo operativo de mercado.
                </p>
                <p className="text-slate-700">
                  Los rendimientos históricos no garantizan resultados futuros.
                </p>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  Validación Humana
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700">
                  Como medida de seguridad, toda activación requiere una verificación manual. El plan será activado en un plazo máximo de 24 horas hábiles tras la confirmación en la red blockchain.
                </p>
              </CardContent>
            </Card>

            {/* Section 3 - Seguridad y Conducta */}
            <Card className="border-2 border-brand-200 bg-brand-50">
              <CardHeader className="bg-brand-100">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                  Política de Seguridad y Conducta
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Nos reservamos el derecho de bloquear permanentemente a usuarios que detectemos realizando cualquiera de las siguientes acciones:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span>Actividades sospechosas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span>Uso de bots de terceros</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span>Técnicas de hacking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span>Scraping</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span>Cualquier acción que comprometa la integridad de nuestro sistema</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                  Prevención de Actividades Ilícitas (AML/KYC)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  El usuario garantiza que los fondos provienen de fuentes lícitas. Prohibido estrictamente el lavado de dinero o financiamiento de actividades ilegales.
                </p>
                <p className="text-slate-700">
                  La plataforma se reserva el derecho de solicitar documentación KYC en cualquier momento. En caso de irregularidades, los fondos serán congelados y reportados a las autoridades competentes.
                </p>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                  Privacidad y Protección de Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  vnsow.com se compromete a proteger la privacidad del usuario. La información recopilada (datos de contacto, historial de transacciones, identificadores de wallet) será utilizada exclusivamente para la operatividad del servicio y cumplimiento legal.
                </p>
                <p className="text-slate-700 mb-4">
                  No compartimos, vendemos ni divulgamos datos personales a terceros, salvo requerimiento legal de autoridad competente.
                </p>
                <p className="text-slate-700">
                  El usuario tiene derecho a solicitar la rectificación o eliminación de sus datos personales, siempre que no contravenga normativas de retención financiera.
                </p>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                  Gestión de Riesgo y Exoneración de Responsabilidad
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="list-disc pl-6 space-y-3 text-slate-700">
                  <li>
                    <strong>Protocolo Stop-Loss:</strong> El sistema cerrará automáticamente al alcanzar los límites de pérdida (-10% FLEX, -5% IMPULSO, -3% RAÍCES).
                  </li>
                  <li>
                    <strong>Exoneración:</strong> La plataforma no se responsabiliza por:
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                      <li>(a) fallos de terceros, latencias de red, errores en el despliegue del contrato inteligente o brechas de liquidez;</li>
                      <li>(b) eventos de fuerza mayor (desastres naturales, fallos eléctricos o ataques masivos a infraestructura de red);</li>
                      <li>(c) errores del usuario, tales como envío de fondos a direcciones incorrectas o pérdida de claves privadas.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Riesgo Tecnológico:</strong> El usuario reconoce que el uso de protocolos blockchain conlleva riesgos inherentes de vulnerabilidad técnica en el software que el usuario asume plenamente.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 7 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
                  Política de Retiro y Liquidación
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="list-disc pl-6 space-y-3 text-slate-700">
                  <li>
                    <strong>Vencimiento:</strong> El capital base está disponible al finalizar el ciclo.
                  </li>
                  <li>
                    <strong>Retiro Anticipado:</strong> La liquidación previa al vencimiento conlleva una penalidad operativa (2% IMPULSO / 5% RAÍCES) por cierre forzado de posiciones.
                  </li>
                  <li>
                    <strong>Plazos:</strong> Toda solicitud de retiro se procesa en un máximo de 72 horas hábiles.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                  Modificaciones del Servicio
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  vnsow.com se reserva el derecho de actualizar, modificar o suspender temporalmente el servicio para mantenimiento, mejoras de seguridad o ajustes de mercado sin previo aviso. Asimismo, la plataforma se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento.
                </p>
                <p className="text-slate-700">
                  La continuidad en el uso del servicio tras la notificación de cambios implica la aceptación irrevocable de los términos actualizados.
                </p>
              </CardContent>
            </Card>

            {/* Section 9 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                  Jurisdicción y Aceptación
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Cualquier disputa se regirá bajo las leyes del Estado de Delaware, USA, mediante arbitraje vinculante. Antes de iniciar cualquier acción, las partes se obligan a intentar una mediación amistosa.
                </p>
                <p className="text-slate-700">
                  La transferencia de fondos constituye la aceptación irrevocable de estos términos.
                </p>
              </CardContent>
            </Card>

            {/* Final Notice */}
            <Alert className="border-2 border-brand-300 bg-brand-50">
              <CheckCircle2 className="h-5 w-5 text-brand-600" />
              <AlertTitle className="text-brand-900 font-bold">Aceptación de Términos</AlertTitle>
              <AlertDescription className="text-brand-800">
                Al utilizar vnsow.com, usted confirma que ha leído, comprendido y aceptado estos Términos y Condiciones en su totalidad, incluyendo la Declaración de Riesgos. Si no está de acuerdo, debe cesar el uso de la plataforma inmediatamente.
              </AlertDescription>
            </Alert>

            {/* CTA */}
            <Card className="mt-8 border-2 bg-gradient-to-r from-brand-50 to-blue-50">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={() => navigate('/')} className="bg-brand-600 hover:bg-brand-700">
                    Volver al Inicio
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/faq')}>
                    Ver Preguntas Frecuentes
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
          <p className="text-slate-400 text-sm">&copy; 2025 vnsow.com. Todos los derechos reservados.</p>
          <p className="text-slate-500 text-xs mt-2">Última actualización: Julio 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
