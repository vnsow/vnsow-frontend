import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Shield, HelpCircle, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const FAQ = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "¿Qué es iastake.com?",
          answer: "iastake.com es una plataforma profesional de inversión que ofrece acceso a mercados tangibles e intangibles con retornos variables del 2.5% al 7% mensual, dependiendo del plan seleccionado y las condiciones del mercado."
        },
        {
          question: "¿Cómo funciona la plataforma?",
          answer: "Registras tu cuenta con Google, seleccionas un plan de inversión según tu perfil de riesgo, realizas tu inversión mínima de $100, y comienzas a generar retornos variables. Puedes retirar tus ganancias cada 30 días o mensualmente según el plan elegido."
        },
        {
          question: "¿Cuál es la inversión mínima?",
          answer: "La inversión mínima es de $100 USD en nuestro plan básico 'Retiro 30 días' que ofrece retornos variables del 2.5% al 7% mensual."
        },
        {
          question: "¿Los retornos están garantizados?",
          answer: "Los retornos son VARIABLES y dependen de las condiciones del mercado. Los porcentajes mostrados (2.5%-7%) son estimados basados en desempeño histórico, pero pueden fluctuar hacia arriba o hacia abajo según la volatilidad de los activos tangibles e intangibles."
        }
      ]
    },
    {
      category: "Seguridad y Protección de Datos",
      questions: [
        {
          question: "¿Cómo protegen mis datos personales?",
          answer: "Utilizamos autenticación OAuth 2.0 con Google para máxima seguridad. Tus datos están encriptados con TLS 1.3 en tránsito y AES-256 en reposo. No almacenamos contraseñas. Cumplimos con estándares internacionales de protección de datos."
        },
        {
          question: "¿Quién tiene acceso a mi información?",
          answer: "Solo el personal administrativo autorizado puede ver tu información de contacto y pago para procesar retiros. Nunca compartimos tu información con terceros sin tu consentimiento explícito."
        },
        {
          question: "¿Es segura mi inversión?",
          answer: "Diversificamos las inversiones en múltiples activos tangibles (bienes raíces, metales preciosos) e intangibles (criptomonedas, DeFi) para minimizar riesgos. Sin embargo, toda inversión conlleva riesgos y los retornos son variables."
        },
        {
          question: "¿Cómo protegen mi dinero?",
          answer: "Los fondos se mantienen en cuentas separadas y se invierten según protocolos de gestión de riesgo. Implementamos auditorías periódicas y seguimiento continuo de las inversiones."
        }
      ]
    },
    {
      category: "Inversiones y Planes",
      questions: [
        {
          question: "¿Qué tipos de inversiones realizan?",
          answer: "Invertimos en dos categorías principales:\n\n• TANGIBLES: Bienes raíces, metales preciosos, commodities, arte y coleccionables.\n\n• INTANGIBLES: Criptomonedas (Bitcoin, Ethereum), trading algorítmico, protocolos DeFi, NFTs premium."
        },
        {
          question: "¿Puedo elegir en qué se invierte mi dinero?",
          answer: "Seleccionas el tipo de mercado (tangible o intangible) al elegir tu plan. Nuestro equipo de gestión profesional decide las inversiones específicas para optimizar retornos y minimizar riesgos."
        },
        {
          question: "¿Puedo tener múltiples inversiones?",
          answer: "Sí, puedes crear múltiples inversiones simultáneas en diferentes planes para diversificar tu portafolio y maximizar oportunidades."
        },
        {
          question: "¿Qué plan me recomienda?",
          answer: "• Plan 2.5-7% (30 días): Retornos variables según las condiciones del mercado, con acceso a activos tangibles e intangibles."
        }
      ]
    },
    {
      category: "Retiros y Pagos",
      questions: [
        {
          question: "¿Cómo retiro mis ganancias?",
          answer: "1. Ve a tu Dashboard\n2. Completa tu información de pago (banco, cripto, PayPal)\n3. Los retiros se procesan según el calendario de tu plan\n4. Recibes el pago en tu método seleccionado\n\nTiempo de procesamiento: 24-72 horas hábiles."
        },
        {
          question: "¿Qué métodos de pago aceptan?",
          answer: "Aceptamos:\n• Wallet TRC20\n• Binance Pay\n• Transferencia Bancaria\n• Zelle\n• PayPal"
        },
        {
          question: "¿Puedo retirar mi capital inicial?",
          answer: "El capital inicial permanece invertido durante el periodo del plan. Las ganancias se pueden retirar según el calendario (cada 30 días o mensual). Para retirar el capital completo, debes completar el ciclo del plan o solicitar cierre anticipado (puede aplicar penalización)."
        },
        {
          question: "¿Hay límites de retiro?",
          answer: "No hay límite máximo de retiro. El mínimo de retiro es $50 USD para cubrir costos de procesamiento. Retiros mayores a $10,000 pueden requerir verificación adicional de seguridad."
        },
        {
          question: "¿Cobran comisiones por retiro?",
          answer: "No cobramos comisiones en retiros estándar. Sin embargo, algunos métodos de pago (transferencias internacionales, criptomonedas) pueden tener costos de red que son absorbidos por el usuario."
        }
      ]
    },
    {
      category: "Sistema de Referidos",
      questions: [
        {
          question: "¿Cómo funciona el sistema de referidos?",
          answer: "Recibes un código único al registrarte. Cuando alguien se registra con tu código e invierte, obtienes el 6% del monto de su primera inversión como bono. El bono se acredita inmediatamente."
        },
        {
          question: "¿Cuántos referidos puedo tener?",
          answer: "No hay límite. Puedes referir a tantas personas como desees y seguir ganando el 6% por cada una que invierta."
        },
        {
          question: "¿Cuándo recibo el bono de referido?",
          answer: "El bono del 6% se acredita automáticamente a tu cuenta cuando tu referido completa su primera inversión. Puedes retirarlo junto con tus otras ganancias."
        }
      ]
    },
    {
      category: "Cuenta y Verificación",
      questions: [
        {
          question: "¿Necesito verificar mi identidad?",
          answer: "El registro inicial solo requiere autenticación con Google. Para retiros mayores a $5,000 acumulados, podemos solicitar verificación adicional de identidad (KYC) por seguridad y cumplimiento regulatorio."
        },
        {
          question: "¿Puedo cambiar mi información de pago?",
          answer: "Sí, puedes actualizar tu información de pago en cualquier momento desde tu Dashboard. Los cambios aplican para retiros futuros."
        },
        {
          question: "¿Qué pasa si pierdo acceso a mi cuenta de Google?",
          answer: "Contacta a soporte con tu información de pago registrada y última transacción. Verificaremos tu identidad y te ayudaremos a recuperar acceso o transferir a nueva cuenta."
        }
      ]
    },
    {
      category: "Riesgos y Responsabilidades",
      questions: [
        {
          question: "¿Qué riesgos existen al invertir?",
          answer: "RIESGOS IMPORTANTES:\n\n• Volatilidad del mercado: Los retornos son variables\n• Riesgo de capital: Posible pérdida parcial o total\n• Liquidez: Restricciones en retiros anticipados\n• Mercado cripto: Alta volatilidad en intangibles\n• Riesgos regulatorios: Cambios en legislación\n\nInvierte solo lo que puedas permitirte perder."
        },
        {
          question: "¿Garantizan devolución del capital?",
          answer: "NO garantizamos devolución del capital. Los retornos son variables y pueden ser positivos o negativos según mercado. Toda inversión conlleva riesgos. Lee los Términos y Condiciones antes de invertir."
        },
        {
          question: "¿Qué sucede en caso de pérdidas?",
          answer: "Si las inversiones generan pérdidas, esto se refleja en tu cuenta. Los retornos pueden ser menores al estimado o incluso negativos en periodos específicos. Diversificamos para minimizar este riesgo pero no lo eliminamos."
        }
      ]
    },
    {
      category: "Soporte y Contacto",
      questions: [
        {
          question: "¿Cómo contacto con soporte?",
          answer: "Puedes contactarnos por:\n\n• Email: support@iastake.com\n• Chat en vivo (próximamente)\n• Formulario de contacto en la web\n\nTiempo de respuesta: 24-48 horas hábiles."
        },
        {
          question: "¿Tienen horario de atención?",
          answer: "El sistema está disponible 24/7. Soporte humano opera de Lunes a Viernes, 9:00 AM - 6:00 PM (zona horaria EST). Consultas urgentes fuera de horario se atienden el siguiente día hábil."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/')} variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-brand-600" />
              <span className="text-2xl font-bold text-slate-900">iastake.com</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-50 to-white py-12">
        <div className="container mx-auto px-4 text-center">
          <HelpCircle className="h-16 w-16 text-brand-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Encuentra respuestas a las preguntas más comunes sobre inversiones, seguridad, retiros y más
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Security Banner */}
          <Card className="mb-8 border-2 border-brand-200 bg-brand-50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-brand-600" />
                <CardTitle className="text-brand-900">Tu Seguridad es Nuestra Prioridad</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-brand-800">
                Utilizamos encriptación de nivel bancario, autenticación OAuth 2.0, y cumplimos con estándares internacionales de protección de datos. Tu información y fondos están protegidos con las mejores tecnologías de seguridad disponibles.
              </p>
            </CardContent>
          </Card>

          {/* FAQ Accordion */}
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {catIndex + 1}
                </div>
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {category.questions.map((item, qIndex) => (
                  <AccordionItem key={qIndex} value={`${catIndex}-${qIndex}`} className="border-2 rounded-lg bg-white px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-semibold text-slate-900">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 whitespace-pre-line">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          {/* CTA */}
          <Card className="mt-12 border-2 bg-gradient-to-r from-brand-50 to-blue-50">
            <CardHeader>
              <CardTitle>¿No encontraste tu respuesta?</CardTitle>
              <CardDescription>Nuestro equipo está aquí para ayudarte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => navigate('/')} className="bg-brand-600 hover:bg-brand-700">
                  Volver al Inicio
                </Button>
                <Button variant="outline" onClick={() => window.location.href = 'mailto:support@iastake.com'}>
                  Contactar Soporte
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">&copy; 2025 iastake.com. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
