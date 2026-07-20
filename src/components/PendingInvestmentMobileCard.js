import React from 'react';
import { Eye, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const PendingInvestmentMobileCard = ({ payment, onViewDetails, onApprove, onReject }) => {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all mb-4 mt-4 first:mt-4 overflow-hidden border-l-4 border-l-orange-400">
            <div className="p-4">
                {/* Header: Usuario */}
                <div className="flex items-start gap-3 mb-4">
                    {/* Avatar de usuario - prioridad: user_picture > inicial */}
                    {payment.user_picture ? (
                        <>
                            <img
                                src={payment.user_picture}
                                alt={payment.user_name}
                                className={`w-12 h-12 rounded-full border-2 object-cover flex-shrink-0 shadow-sm ${payment.type === 'deposit' ? 'border-brand-300' : 'border-orange-300'}`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div
                                className={`w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm ${payment.type === 'deposit' ? 'from-brand-400 to-brand-600' : 'from-orange-400 to-orange-600'}`}
                                style={{ display: 'none' }}
                            >
                                {payment.user_name?.charAt(0).toUpperCase() || '?'}
                            </div>
                        </>
                    ) : (
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm ${payment.type === 'deposit' ? 'from-brand-400 to-brand-600' : 'from-orange-400 to-orange-600'}`}>
                            {payment.user_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 text-base truncate">{payment.user_name || 'N/A'}</div>
                        <div className="text-xs text-slate-500 truncate">{payment.user_email || 'N/A'}</div>
                        {payment.user_phone && (
                            <div className="text-xs text-slate-600 mt-0.5">📞 {payment.user_phone}</div>
                        )}
                    </div>
                </div>

                {/* Monto destacado */}
                <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl p-3 mb-3 border border-brand-200">
                    <div className="text-xs text-brand-700 font-medium mb-1">Monto</div>
                    <div className="text-2xl font-bold text-brand-600">${payment.amount?.toLocaleString() || '0'}</div>
                </div>

                {/* Plan/Tipo */}
                <div className="mb-3">
                    {payment.type === 'deposit' ? (
                        <Badge className="bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm shadow-sm">
                            💰 Depósito de Billetera
                        </Badge>
                    ) : (
                        <div className="space-y-1.5">
                            <div className="text-sm font-semibold text-slate-900">{payment.plan_name}</div>
                            <div className="text-xs text-slate-500">{payment.plan_rate}</div>
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                                {payment.market}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Fecha */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-4 bg-slate-50 rounded-lg p-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span>
                        {new Date(payment.created_at).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }).replace(',', '')}
                    </span>
                </div>

                {/* Botón Ver detalles */}
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(payment)}
                    className="w-full mb-3 bg-white hover:bg-slate-50 border-slate-300 text-slate-700 shadow-sm"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver detalles de pago
                </Button>

                {/* Botones de acción */}
                <div className="grid grid-cols-2 gap-2">
                    <Button
                        size="sm"
                        onClick={() => onApprove(payment)}
                        className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprobar
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => onReject(payment)}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all"
                    >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rechazar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PendingInvestmentMobileCard;
