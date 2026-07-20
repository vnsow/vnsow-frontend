import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowLeft, AlertTriangle, CheckCircle2, Eye, Database, UserCheck, Ban, FileCheck, Gavel, Mail } from 'lucide-react';
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
        <div className="w-full px-4 py-4 flex justify-between items-center">
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
            Última actualización: Julio 2026
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
              En vnsow.com nos tomamos muy en serio la protección de sus datos personales. Esta política explica cómo recopilamos, usamos, almacenamos y protegemos su información.
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
                <p className="text-slate-700 mb-4">
                  En VNSOW recopilamos únicamente la información necesaria para operar el servicio y cumplir con nuestras obligaciones legales:
                </p>
                <h4 className="font-bold text-slate-900 mb-3">Datos Personales:</h4>
                <ul className="space-y-3 text-slate-700 mb-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Datos de Contacto:</strong> Dirección de correo electrónico y demás datos que usted nos proporcione para comunicarnos con usted y gestionar su cuenta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Historial de Transacciones:</strong> Registro de las operaciones realizadas a través de la plataforma (montos, fechas y estado de cada transacción)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Database className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Identificadores de Wallet:</strong> Direcciones de billeteras de criptoactivos asociadas a sus operaciones en el servicio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Documentación KYC:</strong> Documentación de verificación de identidad que podamos solicitar en cumplimiento de las normativas AML/KYC (cuando sea requerido)</span>
                  </li>
                </ul>

                <h4 className="font-bold text-slate-900 mb-3 mt-6">Datos Técnicos:</h4>
                <ul className="list-disc pl-6 space-y-2 text-slate-700">
                  <li>Cookies y tecnologías similares necesarias para el funcionamiento de la plataforma</li>
                  <li>Logs de servidor para seguridad y mantenimiento del servicio</li>
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
                  La información recopilada se utiliza <strong>exclusivamente</strong> para la operatividad del servicio y el cumplimiento de nuestras obligaciones legales. En concreto:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Operatividad del Servicio:</strong> Procesar operaciones, gestionar depósitos y retiros, y administrar su cuenta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Validación de Transacciones:</strong> Verificar manualmente cada operación antes de su ejecución</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Seguridad:</strong> Prevenir fraude, detectar actividad sospechosa y proteger su cuenta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Cumplimiento Legal:</strong> Verificación KYC/AML y cumplimiento de las normativas aplicables</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Eye className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Comunicación Operativa:</strong> Notificaciones sobre el estado de sus operaciones, avisos de cuenta y soporte técnico</span>
                  </li>
                </ul>

                <div className="bg-slate-50 p-4 rounded-lg mt-4 border-2 border-slate-200">
                  <p className="text-slate-700 text-sm">
                    <strong>Lo que NO hacemos:</strong> VNSOW no utiliza sus datos personales con fines de marketing, publicidad, elaboración de perfiles comerciales ni segmentación. No enviamos comunicaciones promocionales ni cedemos su información con fines comerciales bajo ninguna circunstancia.
                  </p>
                </div>
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
                <p className="text-slate-700 mb-4">
                  VNSOW aplica medidas técnicas y organizativas para proteger su información frente a accesos no autorizados, pérdida, alteración o divulgación indebida.
                </p>

                <div className="bg-white p-4 rounded-lg mb-4 border-2 border-brand-300">
                  <div className="flex items-start gap-2">
                    <UserCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <p className="text-slate-700 text-sm">
                      <strong>Validación Humana de Transacciones:</strong> como medida de seguridad adicional, <strong>toda transacción realizada en la plataforma pasa por una validación humana</strong> (auditoría manual) antes de ser ejecutada. Ninguna operación se procesa de forma totalmente automática, lo que reduce el riesgo de fraude y de errores operativos.
                    </p>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 mb-3">Medidas Técnicas y Organizativas:</h4>
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
                <div className="bg-red-50 p-4 rounded-lg mb-4 border-2 border-red-200">
                  <div className="flex items-start gap-2">
                    <Ban className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                    <p className="text-red-900 font-semibold">
                      VNSOW NO comparte, NO vende y NO divulga sus datos personales a terceros. Sin excepciones comerciales.
                    </p>
                  </div>
                </div>

                <p className="text-slate-700 mb-4">
                  La única circunstancia en la que sus datos personales pueden ser divulgados es ante un <strong>requerimiento legal formal emitido por una autoridad competente</strong>:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <Gavel className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Requerimiento Legal:</strong> Orden judicial, requerimiento de una autoridad regulatoria o cualquier obligación legal de reporte que nos sea exigible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Gavel className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <span><strong>Obligaciones AML/KYC:</strong> Reporte de operaciones sospechosas a las unidades de inteligencia financiera cuando la normativa así lo exija</span>
                  </li>
                </ul>

                <h4 className="font-bold text-slate-900 mb-3 mt-6">Proveedores Técnicos Necesarios:</h4>
                <p className="text-slate-700 mb-3">
                  Para operar el servicio nos apoyamos en proveedores estrictamente necesarios (procesamiento de pagos, alojamiento e infraestructura). Estos proveedores actúan únicamente como encargados del tratamiento, procesan los datos siguiendo nuestras instrucciones, están sujetos a acuerdos de confidencialidad y solo acceden a la información imprescindible para prestar su servicio.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4 border-2 border-blue-200">
                  <p className="text-blue-900 text-sm">
                    <strong>Importante:</strong> El uso de estos proveedores <strong>no constituye una venta, cesión ni transferencia comercial</strong> de sus datos personales. Ninguno de ellos está autorizado a utilizar su información para fines propios, publicitarios o de perfilado.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
                  Cookies y Tecnologías Similares
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  VNSOW utiliza únicamente las cookies necesarias para que la plataforma funcione de forma segura. No empleamos cookies publicitarias, de seguimiento entre sitios ni de perfilado comercial.
                </p>

                <h4 className="font-bold text-slate-900 mb-3">Tipos de Cookies que Usamos:</h4>
                <ul className="space-y-3 text-slate-700 mb-4">
                  <li>• <strong>Cookies Esenciales:</strong> Necesarias para el funcionamiento de la plataforma (sesión, autenticación)</li>
                  <li>• <strong>Cookies de Seguridad:</strong> Detección de accesos no autorizados y protección de la sesión</li>
                  <li>• <strong>Cookies de Funcionalidad:</strong> Recordar sus preferencias y configuraciones básicas de la interfaz</li>
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
                <p className="text-slate-700 mb-4">
                  Como titular de los datos, usted puede solicitar en cualquier momento la <strong>rectificación</strong> o la <strong>eliminación</strong> de sus datos personales. Concretamente, tiene derecho a:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <UserCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Acceso:</strong> Solicitar una copia de los datos personales que conservamos sobre usted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <UserCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Rectificación:</strong> Solicitar la corrección de datos inexactos, desactualizados o incompletos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <UserCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Eliminación:</strong> Solicitar la supresión de sus datos personales de nuestros sistemas</span>
                  </li>
                </ul>

                <div className="bg-amber-50 p-4 rounded-lg mt-4 border-2 border-amber-300">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                    <p className="text-amber-900 text-sm">
                      <strong>Límite legal:</strong> estos derechos podrán ejercerse <strong>siempre que su ejercicio no contravenga las normativas de retención financiera</strong> aplicables. La legislación AML/KYC y las obligaciones contables nos exigen conservar determinados registros (historial de transacciones, documentación de verificación de identidad) durante plazos legalmente establecidos. En esos casos, la eliminación podrá quedar diferida hasta el vencimiento del plazo de retención obligatorio, informándole debidamente del motivo.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                  <p className="text-slate-700 text-sm">
                    Para ejercer estos derechos, contáctenos en: <strong>privacy@vnsow.com</strong>
                    <br />Responderemos a su solicitud dentro de 30 días.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 8 - AML/KYC */}
            <Card className="border-2 border-amber-300">
              <CardHeader className="bg-amber-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
                  Prevención de Blanqueo de Capitales (AML/KYC)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  VNSOW opera bajo estrictas políticas de prevención de blanqueo de capitales y financiación del terrorismo. Al utilizar la plataforma, usted acepta las siguientes condiciones:
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start gap-2">
                    <FileCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Solicitud de Documentación:</strong> La plataforma puede solicitarle documentación KYC (verificación de identidad, comprobante de domicilio, justificación del origen de los fondos) <strong>en cualquier momento</strong>, incluso después de haber operado con normalidad. La negativa a aportarla puede derivar en la suspensión de la cuenta.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileCheck className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <span><strong>Origen Lícito de los Fondos:</strong> El usuario <strong>garantiza y declara</strong> que la totalidad de los fondos que deposita o gestiona a través de la plataforma proviene de fuentes lícitas y de actividades legales, y que no está sujeto a sanciones internacionales.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-1 flex-shrink-0" />
                    <span><strong>Congelación y Reporte:</strong> Ante la detección de irregularidades, inconsistencias documentales u operaciones sospechosas, <strong>los fondos podrán ser congelados de forma preventiva y reportados a las autoridades competentes</strong>, conforme a la normativa vigente.</span>
                  </li>
                </ul>

                <div className="bg-amber-50 p-4 rounded-lg mt-4 border-2 border-amber-300">
                  <p className="text-amber-900 text-sm">
                    <strong>Importante:</strong> En los supuestos de reporte obligatorio, la normativa puede impedirnos legalmente informar al usuario sobre la existencia o el contenido de dicha comunicación a las autoridades.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 9 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">9</span>
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

            {/* Section 10 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">10</span>
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

            {/* Section 11 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">11</span>
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

            {/* Section 12 */}
            <Card className="border-2">
              <CardHeader className="bg-slate-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-brand-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">12</span>
                  Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 mb-4">
                  Para ejercer sus derechos o realizar cualquier consulta relacionada con el tratamiento de sus datos personales:
                </p>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <p className="text-slate-700"><strong>Asuntos de Privacidad:</strong> privacy@vnsow.com</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <p className="text-slate-700"><strong>Soporte General:</strong> support@vnsow.com</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Database className="h-5 w-5 text-brand-600 mt-1 flex-shrink-0" />
                    <p className="text-slate-700"><strong>Sitio web:</strong> www.vnsow.com</p>
                  </div>
                  <p className="text-slate-700 mt-2 text-sm">Tiempo de respuesta: 5-10 días hábiles para solicitudes de privacidad</p>
                </div>
              </CardContent>
            </Card>

            {/* Final Notice */}
            <Alert className="border-2 border-brand-300 bg-brand-50">
              <CheckCircle2 className="h-5 w-5 text-brand-600" />
              <AlertTitle className="text-brand-900 font-bold">Consentimiento</AlertTitle>
              <AlertDescription className="text-brand-800">
                Al utilizar vnsow.com, usted acepta esta Política de Privacidad y el procesamiento de sus datos personales según lo descrito. Si no está de acuerdo, por favor no utilice nuestros servicios.
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
          <p className="text-slate-400 text-sm">&copy; 2026 vnsow.com. Todos los derechos reservados.</p>
          <p className="text-slate-500 text-xs mt-2">Última actualización: Julio 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
