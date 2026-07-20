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
      category: "Modelo y Planes de Ejecución",
      questions: [
        {
          question: "¿Qué es VNSOW?",
          answer: "VNSOW (vnsow.com) es una aceleradora de gestión de capital. No somos un banco ni un producto de ahorro con interés fijo: operamos capital de terceros bajo estrategias de ejecución definidas, con control de riesgo activo y validación humana en cada activación.\n\nEl modelo se articula en tres planes de ejecución (FLEX, IMPULSO y RAÍCES), cada uno con su propio ciclo, rango de rendimiento variable y límite de pérdida (stop-loss).\n\nOperamos bajo políticas de cumplimiento AML/KYC y jurisdicción legal en Delaware (USA), con resolución de disputas por arbitraje vinculante."
        },
        {
          question: "¿Cómo funcionan los planes de ejecución?",
          answer: "Cada plan define un ciclo, una estrategia y un límite de pérdida:\n\n• FLEX — Ciclo de 24 horas. Estrategia de arbitraje de latencia. Rendimiento variable de 0% a 2% por día. Stop-loss en -10%. Sin penalidad de retiro.\n\n• IMPULSO — Ciclo de 30 días. Capital semilla aplicado a proyectos en evaluación. Rendimiento variable de 0% a 4% por mes. Stop-loss en -5%. Penalidad de retiro anticipado del 2%.\n\n• RAÍCES — Ciclo de 180 días. Activos físicos. Rendimiento variable de 0% a 15% por ciclo. Stop-loss en -3%. Penalidad de retiro anticipado del 5%.\n\nLos rangos indicados son límites de desempeño esperado, no promesas de pago. El resultado real de cada ciclo puede situarse en cualquier punto del rango, incluido 0%, o ser negativo hasta el stop-loss."
        },
        {
          question: "¿El rendimiento está garantizado?",
          answer: "NO. El rendimiento es VARIABLE y no está garantizado en ningún plan.\n\n• Los rangos publicados (0%–2% diario en FLEX, 0%–4% mensual en IMPULSO, 0%–15% por ciclo en RAÍCES) parten en 0%. Un ciclo puede cerrar sin rendimiento alguno.\n• El resultado depende exclusivamente de la ejecución de la estrategia y de las condiciones reales del mercado o del activo.\n• Existe riesgo real de pérdida parcial o total del capital aportado.\n• El stop-loss limita la exposición, pero no elimina el riesgo ni asegura la devolución del capital.\n• VNSOW no ofrece interés fijo, ni capital protegido, ni ninguna forma de garantía de retorno.\n\nAporta únicamente capital que puedas permitirte perder."
        }
      ]
    },
    {
      category: "Control de Riesgo y Validación",
      questions: [
        {
          question: "¿Qué es la validación humana?",
          answer: "Ninguna activación se ejecuta de forma automática. Toda solicitud pasa por una auditoría manual realizada por nuestro equipo antes de entrar en operación.\n\nDurante la validación se revisa la consistencia del aporte, el cumplimiento AML/KYC y la coherencia entre el plan elegido y el perfil de riesgo declarado.\n\nEl plazo máximo de activación es de 24 horas hábiles desde la recepción del aporte. El ciclo del plan comienza a contar únicamente desde el momento de la activación, no desde la solicitud."
        },
        {
          question: "¿Qué es el stop-loss y cómo funciona?",
          answer: "El stop-loss es un límite automático de pérdida asociado a cada plan. Cuando la posición alcanza ese umbral, se cierra de forma automática para impedir que la pérdida siga creciendo.\n\n• FLEX: se cierra al alcanzar -10%.\n• IMPULSO: se cierra al alcanzar -5%.\n• RAÍCES: se cierra al alcanzar -3%.\n\nAl activarse, el ciclo termina y el capital remanente queda disponible según los plazos de liquidez. El stop-loss es una herramienta de contención de riesgo, no un seguro: no garantiza la recuperación del capital ni evita pérdidas en escenarios de mercado extremos."
        }
      ]
    },
    {
      category: "Liquidez y Retiros",
      questions: [
        {
          question: "¿Cuándo puedo retirar mi capital?",
          answer: "VNSOW opera bajo un esquema de liquidez estratégica: el capital base permanece comprometido durante el ciclo y se libera al cierre del mismo.\n\n• FLEX: cierre a las 24 horas.\n• IMPULSO: cierre a los 30 días.\n• RAÍCES: cierre a los 180 días.\n\nUna vez cerrado el ciclo puedes solicitar el retiro. Las solicitudes se procesan en un máximo de 72 horas hábiles. Los retiros están sujetos a la verificación AML/KYC vigente."
        },
        {
          question: "¿Qué pasa si retiro antes del vencimiento?",
          answer: "El retiro anticipado rompe el ciclo de ejecución y aplica una penalidad sobre el capital:\n\n• FLEX: sin penalidad. El ciclo de 24 horas permite salir sin costo.\n• IMPULSO: penalidad del 2% por retiro anticipado.\n• RAÍCES: penalidad del 5% por retiro anticipado.\n\nLa penalidad compensa el desmontaje anticipado de la posición. Al solicitar un retiro anticipado, el rendimiento del ciclo en curso no se consolida y el importe resultante se procesa dentro de las 72 horas hábiles posteriores a la aprobación."
        }
      ]
    },
    {
      category: "Proyectos Semilla y Contacto",
      questions: [
        {
          question: "¿Cómo envío un proyecto para evaluación?",
          answer: "El plan IMPULSO canaliza capital semilla hacia proyectos previamente evaluados. Si tienes un proyecto y buscas financiación, puedes enviarlo a evaluación escribiendo a support@vnsow.com.\n\nIncluye en tu propuesta:\n\n• Descripción del proyecto y modelo de negocio\n• Capital requerido y destino específico de los fondos\n• Estado actual de ejecución y tracción demostrable\n• Equipo responsable y estructura legal\n• Proyecciones y riesgos identificados\n\nCada propuesta se somete a revisión manual. La recepción de una propuesta no implica aceptación ni compromiso de financiación por parte de VNSOW."
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
              <span className="text-2xl font-bold text-slate-900">vnsow.com</span>
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
            Todo sobre los planes de ejecución FLEX, IMPULSO y RAÍCES: ciclos, rendimiento variable, control de riesgo y liquidez
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
                <CardTitle className="text-brand-900">Rendimiento Variable y Control de Riesgo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-brand-800">
                VNSOW es una aceleradora de gestión de capital, no un producto de ahorro. El rendimiento de cada plan es <strong>variable y no garantizado</strong>, y existe riesgo real de pérdida parcial o total del capital. Cada activación pasa por validación humana en un máximo de 24 h hábiles y opera con stop-loss automático bajo cumplimiento AML/KYC.
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
                <Button variant="outline" onClick={() => window.location.href = 'mailto:support@vnsow.com'}>
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
          <p className="text-slate-400 text-sm">&copy; 2025 vnsow.com. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
