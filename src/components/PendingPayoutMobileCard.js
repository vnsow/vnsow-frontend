import React from 'react';
import { Settings, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const PendingPayoutMobileCard = ({ payout, onConfigure, onApprove }) => {
    const percentageLabel = payout.configured_percentage
        ? `${payout.configured_percentage.toFixed(2)}%`
        : 'Sin configurar';
    const amountLabel = payout.configured_amount
        ? `$${payout.configured_amount.toFixed(2)}`
        : 'Pendiente';
    const hasConfig = payout.status === 'configured';

    // Determinar si es rango o porcentaje fijo
    const isRange = payout.plan_rate_min !== payout.plan_rate_max;
    const rateDisplay = isRange
        ? `${payout.plan_rate_min}% - ${payout.plan_rate_max}%`
        : `${payout.plan_rate_min}%`;

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all mb-3 p-3 border-l-4 border-l-teal-400">
            {/* Header: Usuario */}
            <div className="flex items-start gap-2 mb-3">
                {payout.user_custom_picture || payout.user_picture ? (
                    <img
                        src={payout.user_custom_picture || payout.user_picture}
                        alt={payout.user_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-teal-200 flex-shrink-0"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                        {payout.user_name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-sm truncate">{payout.user_name}</div>
                    <div className="text-xs text-slate-600 truncate">{payout.user_email}</div>
                </div>
            </div>

            {/* Plan y Ciclo */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 mb-2 border border-purple-200">
                <div className="text-xs text-purple-700 font-medium mb-0.5">Plan</div>
                <div className="font-semibold text-sm text-slate-900">{payout.plan_name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                    {isRange ? 'Rango: ' : 'Retribución: '}{rateDisplay}
                </div>
                <div className="text-xs text-teal-600 font-semibold mt-0.5">
                    Ciclo {payout.cycle_number}
                </div>
            </div>

            {/* Montos */}
            <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-brand-50 rounded-lg p-2 border border-brand-200">
                    <div className="text-xs text-brand-700 font-medium mb-0.5">Monto base</div>
                    <div className="font-bold text-base text-brand-600">${payout.base_amount.toLocaleString()}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                    <div className="text-xs text-blue-700 font-medium mb-0.5">Configurado</div>
                    <div className="font-bold text-base text-blue-600">{amountLabel}</div>
                </div>
            </div>

            {/* Porcentaje y Estado */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <div className="text-xs text-slate-500 mb-0.5">% Seleccionado</div>
                    {payout.configured_percentage ? (
                        <Badge className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs">
                            {percentageLabel}
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="bg-slate-100 text-slate-500 text-xs">
                            Sin configurar
                        </Badge>
                    )}
                </div>
                <div>
                    <div className="text-xs text-slate-500 mb-0.5">Estado</div>
                    {hasConfig ? (
                        <Badge className="bg-brand-600 text-white text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Configurado
                        </Badge>
                    ) : (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-xs">
                            Pendiente
                        </Badge>
                    )}
                </div>
            </div>

            {/* Fecha */}
            <div className="text-xs text-slate-500 mb-2">
                {new Date(payout.created_at).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }).replace(',', '')}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col gap-2 items-center">
                <Button
                    onClick={() => onConfigure(payout)}
                    variant="outline"
                    className="w-full max-w-xs border-teal-300 text-teal-700 hover:bg-teal-50 h-9 text-sm"
                >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                </Button>
                <Button
                    onClick={() => hasConfig && onApprove(payout)}
                    disabled={!hasConfig}
                    className={`w-full max-w-xs h-9 text-sm ${hasConfig
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-md'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprobar
                </Button>
            </div>
        </div>
    );
};

export default PendingPayoutMobileCard;
