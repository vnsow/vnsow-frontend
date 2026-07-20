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
            Última actualización: 5 de Enero, 2025
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
              Al utilizar iastake.com, usted acepta estos términos en su totalidad. Si no está de acuerdo con alguna parte, no utilice nuestros servicios. La inversión conlleva riesgos y los retornos son variables.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            {/* Section 1 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Aceptación de Términos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Al acceder y utilizar la plataforma iastake.com ("el Servicio", "la Plataforma", "nosotros", "nuestro"), operada por iastake.com ("la Compañía"), usted ("el Usuario", "usted", "Cliente") acepta estar legalmente vinculado por estos Términos y Condiciones.
                </p>
                <p className="text-slate-700">
                  Estos términos constituyen un acuerdo legal entre usted y iastake.com. Si no acepta estos términos, debe cesar el uso de la plataforma inmediatamente.
                </p>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  Descripción del Servicio
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  iastake.com es una plataforma de inversión que ofrece acceso a mercados tangibles e intangibles, incluyendo pero no limitado a:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                  <li><strong>Activos Tangibles:</strong> Bienes raíces, metales preciosos, commodities, arte y coleccionables</li>
                  <li><strong>Activos Intangibles:</strong> Criptomonedas, protocolos DeFi, NFTs, trading algorítmico</li>
                </ul>
                <p className="text-slate-700">
                  Los retornos son VARIABLES y oscilan entre 2.5% y 7% mensual dependiendo del plan, condiciones de mercado, y volatilidad de activos.
                </p>
              </CardContent>
            </Card>

            {/* Section 3 - RIESGOS */}
            <Card className="border-2 border-red-200 bg-red-50">
              <CardHeader className="bg-red-100">
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <AlertTriangle className="h-6 w-6" />
                  RIESGOS Y ADVERTENCIAS IMPORTANTES
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-white p-4 rounded-lg mb-4 border-2 border-red-200">
                  <h4 className="font-bold text-red-900 mb-2">⚠️ DECLARACIÓN DE RIESGOS</h4>
                  <p className="text-red-800 font-semibold mb-4">
                    TODA INVERSIÓN CONLLEVA RIESGOS. PUEDE PERDER PARTE O LA TOTALIDAD DE SU CAPITAL INVERTIDO.
                  </p>
                </div>

                <h4 className="font-bold text-slate-900 mb-3">Riesgos Específicos:</h4>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span><strong>Volatilidad del Mercado:</strong> Los retornos son variables y pueden ser menores a lo estimado o incluso negativos en períodos específicos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span><strong>Riesgo de Capital:</strong> No garantizamos la devolución del capital inicial. Puede experimentar pérdidas parciales o totales.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span><strong>Liquidez:</strong> El capital inicial permanece invertido durante el período del plan. Retiros anticipados pueden estar sujetos a penalizaciones.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span><strong>Criptomonedas:</strong> Alta volatilidad, riesgo tecnológico, y posibles cambios regulatorios que afecten valor.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-1">•</span>
                    <span><strong>Riesgos Regulatorios:</strong> Cambios en legislación pueden afectar operaciones y retornos.</span>
                  </li>
                </ul>

                <div className="bg-amber-50 p-4 rounded-lg mt-4 border-2 border-amber-300">
                  <p className="text-amber-900 font-semibold">
                    ⚠️ INVIERTA SOLO LO QUE PUEDA PERMITIRSE PERDER. Si tiene dudas, consulte con un asesor financiero independiente.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                  Elegibilidad y Registro
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="font-bold text-slate-900 mb-3">Requisitos:</h4>
                <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                  <li>Ser mayor de 18 años de edad</li>
                  <li>Tener capacidad legal para celebrar contratos vinculantes</li>
                  <li>No estar en jurisdicción donde nuestros servicios estén prohibidos</li>
                  <li>Proporcionar información veraz y completa durante el registro</li>
                  <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                </ul>
                <p className="text-slate-700">
                  Nos reservamos el derecho de rechazar o cancelar cuentas que no cumplan estos requisitos o que violen estos términos.
                </p>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                  Inversiones y Planes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="font-bold text-slate-900 mb-3">Condiciones de Inversión:</h4>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span>Inversión mínima: $100 USD</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span>Los planes tienen duraciones específicas (30 días o mensual según selección)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span>Los retornos son VARIABLES del 2.5% al 7% mensual según mercado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span>El capital inicial permanece invertido durante el período del plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span>Las ganancias se calculan y distribuyen según calendario del plan</span>
                  </li>
                </ul>

                <div className="bg-blue-50 p-4 rounded-lg mt-4 border-2 border-blue-200">
                  <p className="text-blue-900 text-sm">
                    <strong>Importante:</strong> Una vez iniciada una inversión, el capital permanece comprometido hasta completar el período. Solicitudes de retiro anticipado están sujetas a evaluación y pueden incurrir en penalizaciones.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 6 - Retiros */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
                  Retiros y Pagos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="font-bold text-slate-900 mb-3">Política de Retiros:</h4>
                <ul className="space-y-3 text-slate-700 mb-4">
                  <li>• Retiro mínimo: $50 USD</li>
                  <li>• Tiempo de procesamiento: 24-72 horas hábiles</li>
                  <li>• Retiros superiores a $10,000 pueden requerir verificación adicional (KYC)</li>
                  <li>• No cobramos comisiones en retiros estándar (costos de red externos aplican)</li>
                  <li className="list-none">
                    <span className="font-semibold text-slate-900 block mb-2">Métodos disponibles:</span>
                    <ul className="grid gap-2 pl-4 border-l-2 border-slate-200 ml-1">
                      <li className="text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                        Transferencia Bancaria Internacional
                      </li>
                      <li className="text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                        Criptomonedas <span
                          className="text-xs text-slate-500 font-medium">(Según disponibilidad local)</span>
                      </li>
                      <li className="text-slate-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                        Otros métodos digitales
                      </li>
                    </ul>

                    <p className="mt-4 text-sm text-slate-500 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <strong>Nota:</strong> La disponibilidad de métodos puede variar según el país. Para confirmar
                      opciones específicas, puedes consultar directamente con soporte técnico o comercial.
                    </p>
                  </li>
                </ul>

                <h4 className="font-bold text-slate-900 mb-3 mt-6">Verificación de Identidad:</h4>
                <p className="text-slate-700 mb-4">
                  Por seguridad y cumplimiento normativo (AML/KYC), nos reservamos el derecho de solicitar verificación
                  de identidad antes de procesar retiros, especialmente en montos significativos. Esto puede incluir:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Documento de identidad oficial con fotografía</li>
                  <li>Comprobante de domicilio reciente</li>
                  <li>Verificación de método de pago</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 7 - Seguridad */}
            <Card className="border-2 border-brand-200 bg-brand-50">
              <CardHeader className="bg-brand-100">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-brand-600"/>
                  Seguridad y Protección de Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="font-bold text-slate-900 mb-3">Compromiso de Seguridad:</h4>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0"/>
                    <span><strong>Encriptación:</strong> TLS 1.3 para datos en tránsito, AES-256 para datos en reposo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Autenticación:</strong> OAuth 2.0 con Google, no almacenamos contraseñas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Privacidad:</strong> No compartimos información personal con terceros sin consentimiento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Monitoreo:</strong> Sistema de detección de actividad sospechosa 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Cumplimiento:</strong> Adherimos a estándares internacionales de protección de datos</span>
                  </li>
                </ul>

                <div className="bg-white p-4 rounded-lg mt-4 border-2 border-brand-300">
                  <h5 className="font-bold text-slate-900 mb-2">Responsabilidad del Usuario:</h5>
                  <p className="text-slate-700 text-sm">
                    Usted es responsable de mantener la confidencialidad de sus credenciales de acceso. No comparta su información de inicio de sesión. Notifique inmediatamente cualquier uso no autorizado de su cuenta.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 8 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                  Sistema de Referidos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Al referir nuevos usuarios, usted acepta:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>No realizar publicidad engañosa o spam</li>
                  <li>No crear cuentas falsas para obtener bonos</li>
                  <li>El bono del 6% se otorga sobre la primera inversión del referido</li>
                  <li>Nos reservamos el derecho de anular bonos obtenidos fraudulentamente</li>
                  <li>El programa de referidos puede modificarse o cancelarse sin previo aviso</li>
                </ul>
              </CardContent>
            </Card>

            {/* Section 9 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
                  Limitación de Responsabilidad
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4 font-semibold">
                  EN LA MÁXIMA MEDIDA PERMITIDA POR LA LEY:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li>• NO GARANTIZAMOS retornos específicos o devolución de capital</li>
                  <li>• NO SOMOS RESPONSABLES por pérdidas derivadas de volatilidad del mercado</li>
                  <li>• NO GARANTIZAMOS disponibilidad ininterrumpida del servicio</li>
                  <li>• NO SOMOS RESPONSABLES por errores de terceros (procesadores de pago, exchanges)</li>
                  <li>• La responsabilidad máxima se limita al monto de su inversión activa</li>
                </ul>

                <div className="bg-red-50 p-4 rounded-lg mt-4 border-2 border-red-200">
                  <p className="text-red-900 text-sm font-semibold">
                    USTED ASUME TODOS LOS RIESGOS ASOCIADOS CON LA INVERSIÓN. Lea la Declaración de Riesgos (Sección 3) cuidadosamente.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 10 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">10</span>
                  Prohibiciones y Uso Aceptable
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="font-bold text-slate-900 mb-3">Está PROHIBIDO:</h4>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Usar la plataforma para lavado de dinero o actividades ilegales</li>
                  <li>Intentar hackear, realizar ingeniería inversa o comprometer el sistema</li>
                  <li>Crear múltiples cuentas para abusar del sistema de referidos</li>
                  <li>Proporcionar información falsa o fraudulenta</li>
                  <li>Usar bots o automatización no autorizada</li>
                  <li>Revender o transferir su cuenta a terceros</li>
                </ul>

                <p className="text-slate-700 mt-4">
                  La violación de estas prohibiciones resultará en suspensión o cierre permanente de cuenta, retención de fondos, y posible acción legal.
                </p>
              </CardContent>
            </Card>

            {/* Section 11 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">11</span>
                  Modificación de Términos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entran en vigor inmediatamente tras su publicación en la plataforma.
                </p>
                <p className="text-slate-700">
                  Es su responsabilidad revisar periódicamente estos términos. El uso continuado del servicio después de modificaciones constituye aceptación de los nuevos términos.
                </p>
              </CardContent>
            </Card>

            {/* Section 12 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">12</span>
                  Terminación de Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Podemos suspender o terminar su cuenta si:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                  <li>Viola estos términos y condiciones</li>
                  <li>Proporciona información falsa o fraudulenta</li>
                  <li>Se detecta actividad sospechosa o ilegal</li>
                  <li>No responde a solicitudes de verificación KYC</li>
                  <li>Por razones de seguridad o cumplimiento legal</li>
                </ul>
                <p className="text-slate-700">
                  En caso de terminación, procesaremos el retorno de fondos legítimos después de verificaciones necesarias, menos cualquier penalización aplicable.
                </p>
              </CardContent>
            </Card>

            {/* Section 13 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">13</span>
                  Resolución de Disputas
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="font-bold text-slate-900 mb-3">Proceso de Resolución:</h4>
                <ol className="list-decimal pl-6 space-y-2 text-slate-700 mb-4">
                  <li>Contacte a soporte: support@iastake.com</li>
                  <li>Proporcione detalles completos de la disputa</li>
                  <li>Tiempo de respuesta: 5-10 días hábiles</li>
                  <li>Si no se resuelve, puede escalar a mediación</li>
                </ol>

                <p className="text-slate-700">
                  Cualquier disputa no resuelta se someterá a arbitraje vinculante según las leyes aplicables.
                </p>
              </CardContent>
            </Card>

            {/* Section 14 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">14</span>
                  Contacto y Soporte
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Para preguntas, soporte o reportar problemas:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-slate-700"><strong>Email:</strong> support@iastake.com</p>
                  <p className="text-slate-700"><strong>Sitio web:</strong> www.iastake.com</p>
                  <p className="text-slate-700"><strong>Horario:</strong> Lunes a Viernes, 9:00 AM - 6:00 PM EST</p>
                  <p className="text-slate-700 mt-2 text-sm">Tiempo de respuesta: 24-48 horas hábiles</p>
                </div>
              </CardContent>
            </Card>

            {/* Section 15 - Modelo de Renta Variable */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">15</span>
                  Modelo de Inversión de Renta Variable
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-slate-700">
                  La presente plataforma opera exclusivamente bajo un <strong>modelo de inversión de renta variable</strong>, mediante la participación en proyectos, activos y oportunidades de carácter tangible e intangible, cuyos resultados están sujetos al comportamiento real del mercado.
                </p>

                <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300">
                  <p className="text-amber-900 font-semibold mb-2">
                    ⚠️ IMPORTANTE - Sin Garantías de Rentabilidad
                  </p>
                  <p className="text-amber-800 text-sm">
                    Los rendimientos indicados, estimados o proyectados, los cuales pueden fluctuar aproximadamente entre 2.5% y 7% mensual, <strong>no constituyen una promesa, garantía ni obligación contractual de rentabilidad</strong>. En particular, los porcentajes más elevados representan escenarios de mayor riesgo y no deben interpretarse como resultados asegurados.
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-3">El usuario reconoce y acepta expresamente que:</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <span>No existen rendimientos garantizados en inversiones de renta variable.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <span>Toda inversión implica riesgos financieros, operativos y de mercado.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-1">•</span>
                      <span>Los resultados pueden verse afectados por factores externos, incluyendo —pero no limitándose a— condiciones económicas globales, cambios regulatorios, variaciones del mercado, eventos políticos, financieros o situaciones de fuerza mayor.</span>
                    </li>
                  </ul>
                </div>

                <p className="text-slate-700">
                  La empresa <strong>no ofrece, promete ni asegura</strong> beneficios fijos, capitalizaciones automáticas ni resultados predeterminados. Cualquier referencia a porcentajes o escenarios de rentabilidad tiene un carácter estrictamente informativo y estimativo, basado en análisis de mercado y experiencias previas, sin que ello implique obligación de cumplimiento.
                </p>

                <p className="text-slate-700">
                  La gestión de los fondos se realiza bajo criterios de administración responsable, análisis técnico y prudencia financiera, priorizando en todo momento la preservación del capital por encima de rendimientos extraordinarios. En determinados escenarios de mercado, los resultados pueden ser menores a los estimados o incluso nulos, sin que ello constituya incumplimiento, negligencia o mala práctica por parte de la empresa.
                </p>

                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <p className="text-red-900 font-semibold mb-2">
                    Declaración de Responsabilidad del Inversionista
                  </p>
                  <p className="text-red-800 text-sm">
                    El inversionista declara actuar de manera voluntaria, informada y bajo su propia responsabilidad, comprendiendo plenamente la naturaleza del modelo de inversión ofrecido y aceptando los riesgos inherentes al mismo.
                  </p>
                </div>

                <div className="bg-slate-900 p-4 rounded-lg">
                  <p className="text-white text-sm">
                    Al registrarse y utilizar esta plataforma, el usuario declara haber leído, comprendido y aceptado íntegramente las presentes condiciones, liberando expresamente a la empresa, sus representantes y colaboradores de cualquier responsabilidad derivada de expectativas de rentabilidad garantizada o resultados ajenos al comportamiento real del mercado.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Final Notice */}
            <Alert className="border-2 border-brand-300 bg-brand-50">
              <CheckCircle2 className="h-5 w-5 text-brand-600" />
              <AlertTitle className="text-brand-900 font-bold">Aceptación de Términos</AlertTitle>
              <AlertDescription className="text-brand-800">
                Al utilizar iastake.com, usted confirma que ha leído, comprendido y aceptado estos Términos y Condiciones en su totalidad, incluyendo la Declaración de Riesgos. Si no está de acuerdo, debe cesar el uso de la plataforma inmediatamente.
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
          <p className="text-slate-400 text-sm">&copy; 2025 iastake.com. Todos los derechos reservados.</p>
          <p className="text-slate-500 text-xs mt-2">Última actualización: 5 de Enero, 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndConditions;
