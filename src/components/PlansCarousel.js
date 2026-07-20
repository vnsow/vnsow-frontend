import React, { useCallback, useState, useRef, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

// Card individual con detección de overflow en la descripción
const PlanCard = ({ plan, isSelected, onSelect, onShowMore }) => {
  const measureRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
    };

    checkOverflow();
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(el);

    return () => resizeObserver.disconnect();
  }, [plan.description]);

  return (
    <button
      type="button"
      onClick={() => onSelect && onSelect(plan)}
      className={`w-full bg-white rounded-xl transition-all duration-300 text-left border-2 relative overflow-hidden shadow-md hover:shadow-lg ${
        isSelected
          ? 'border-brand-600'
          : 'border-slate-200 hover:border-brand-300'
      }`}
    >
      {/* Cinta diagonal "Popular" - esquina superior derecha */}
      {plan.is_popular && (
        <div className="absolute top-[14px] -right-[24px] w-[96px] rotate-45 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold text-center py-[3px] shadow-md tracking-wider z-10 pointer-events-none">
          POPULAR
        </div>
      )}

      {/* Header con gradiente */}
      <div className="bg-gradient-to-br from-brand-600 to-teal-600 text-white p-4 sm:p-5">
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">{plan.name}</h3>

        <div className="relative">
          {/* Medición invisible del texto original para detectar overflow */}
          <p
            ref={measureRef}
            aria-hidden="true"
            className="text-xs sm:text-sm absolute top-0 left-0 right-0 pointer-events-none"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              visibility: 'hidden',
            }}
          >
            {plan.description}
          </p>

          {/* Texto visible. El float-spacer reserva espacio en la 2ª línea */}
          {/* (invisible, mismo ancho que "Ver más" para que coincidan). */}
          <p
            className="text-xs sm:text-sm text-brand-50 opacity-95"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {isOverflowing && (
              <span
                aria-hidden="true"
                style={{
                  float: 'right',
                  height: '3em',
                  paddingTop: '1.5em',
                  paddingLeft: '0.25em',
                  boxSizing: 'border-box',
                  shapeOutside: 'inset(1.5em 0 0 0)',
                  visibility: 'hidden',
                }}
              >
                <span className="font-semibold">Ver más</span>
              </span>
            )}
            {plan.description}
          </p>

          {/* "Ver más" visible: FUERA del <p> con overflow:hidden, para que */}
          {/* el subrayado se vea sin ser recortado. Posicionado absoluto en el */}
          {/* hueco que dejó el float-spacer en la 2ª línea. */}
          {isOverflowing && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onShowMore(plan);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onShowMore(plan);
                }
              }}
              className="absolute bottom-0 right-0 text-xs sm:text-sm font-semibold text-white hover:text-brand-100 cursor-pointer"
              style={{
                borderBottom: '1px solid currentColor',
                paddingBottom: '1px',
                lineHeight: '1.1',
              }}
            >
              Ver más
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5">
        {/* Retorno */}
        <div className="text-center py-3 sm:py-4 bg-gradient-to-br from-brand-50 to-teal-50 rounded-lg border-2 border-brand-100 mb-3 sm:mb-4">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-600">
            {plan.return_rate}
          </div>
          <div className="text-[10px] sm:text-xs text-brand-700 mt-1 font-medium">Rendimiento variable por ciclo</div>
        </div>

        {/* Detalles */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-start gap-2 text-xs sm:text-sm">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">
              Mínimo: ${plan.min_amount.toLocaleString()}
            </span>
          </div>
          {plan.max_amount && (
            <div className="flex items-start gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">
                Máximo: ${plan.max_amount.toLocaleString()}
              </span>
            </div>
          )}
          <div className="flex items-start gap-2 text-xs sm:text-sm">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">
              Ciclo: {plan.withdrawal_period}
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs sm:text-sm">
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 mt-0.5 flex-shrink-0" />
            <span className="text-slate-700">
              Enfoque: {plan.market}
            </span>
          </div>
          {plan.stop_loss !== undefined && plan.stop_loss !== null && (
            <div className="flex items-start gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">
                Stop-Loss: {plan.stop_loss}%
              </span>
            </div>
          )}
          {plan.early_withdrawal_penalty !== undefined && plan.early_withdrawal_penalty !== null && (
            <div className="flex items-start gap-2 text-xs sm:text-sm">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-brand-600 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">
                {plan.early_withdrawal_penalty > 0
                  ? `Penalidad retiro anticipado: ${plan.early_withdrawal_penalty}%`
                  : 'Sin penalidad por retiro'}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

const PlansCarousel = ({
  plans,
  selectedPlan,
  onPlanSelect,
  showButton = false,
  buttonText = '',
  onButtonClick = null,
  buttonDisabled = false
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    slidesToScroll: 1
  });

  // Plan cuya descripción completa se muestra en el modal (null = cerrado)
  const [descriptionModalPlan, setDescriptionModalPlan] = useState(null);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [prevBtnEnabled, setPrevBtnEnabled] = React.useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = React.useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative md:py-8">
      {/* Contenedor del carrusel */}
      <div className="overflow-hidden px-1" ref={emblaRef}>
        <div className="flex gap-4 md:gap-6 touch-pan-y">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-0.75rem)] lg:flex-[0_0_calc(33.333%-1rem)] min-w-0"
            >
              <PlanCard
                plan={plan}
                isSelected={selectedPlan?._id === plan._id}
                onSelect={onPlanSelect}
                onShowMore={setDescriptionModalPlan}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controles del carrusel - Solo mostrar si hay más de 1 plan */}
      {plans.length > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            className="p-2 rounded-full border-2 border-slate-300 hover:border-brand-600 hover:bg-brand-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Plan anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            className="p-2 rounded-full border-2 border-slate-300 hover:border-brand-600 hover:bg-brand-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Siguiente plan"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Botón opcional (para "Comenzar a Invertir" o "Crear Inversión") */}
      {showButton && buttonText && (
        <div className="text-center mt-6 sm:mt-8 px-2 sm:px-0">
          <button
            onClick={onButtonClick}
            disabled={buttonDisabled}
            className="bg-brand-600 hover:bg-brand-700 text-white text-sm sm:text-base md:text-lg px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 rounded-lg font-semibold w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {buttonText}
          </button>
        </div>
      )}

      {/* Modal de descripción completa del plan */}
      <Dialog
        open={!!descriptionModalPlan}
        onOpenChange={(open) => {
          if (!open) setDescriptionModalPlan(null);
        }}
      >
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg rounded-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col">
          <div
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 plan-description-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 transparent',
            }}
          >
            <style dangerouslySetInnerHTML={{__html: `
              .plan-description-scrollbar::-webkit-scrollbar {
                width: 8px;
              }
              .plan-description-scrollbar::-webkit-scrollbar-track {
                background: transparent;
                margin: 16px 0;
              }
              .plan-description-scrollbar::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 10px;
                border: 2px solid transparent;
                background-clip: padding-box;
              }
              .plan-description-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
                background-clip: padding-box;
              }
            `}} />

            <DialogHeader className="mb-3 sm:mb-4">
              <DialogTitle className="text-lg sm:text-xl font-bold pr-6">
                {descriptionModalPlan?.name}
              </DialogTitle>
            </DialogHeader>
            <p className="text-sm sm:text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
              {descriptionModalPlan?.description}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansCarousel;
