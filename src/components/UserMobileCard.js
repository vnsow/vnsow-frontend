import React from 'react';
import { Calendar, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const UserMobileCard = ({ user, onViewDetail }) => {
    return (
        <div className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-b-0">
            {/* Header de la tarjeta: Avatar + Nombre */}
            <div className="flex items-start gap-3 mb-3">
                {(user.custom_picture || user.picture) ? (
                    <>
                        <img
                            src={user.custom_picture || user.picture}
                            alt={user.name}
                            className="w-12 h-12 rounded-full border-2 border-brand-200 object-cover flex-shrink-0"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg border-2 border-brand-200 flex-shrink-0"
                            style={{ display: 'none' }}
                        >
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </>
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg border-2 border-brand-200 flex-shrink-0">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-base truncate">{user.name}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                            Desde {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Información de contacto */}
            <div className="space-y-2 mb-3">
                <div className="text-sm text-slate-900 truncate">{user.email}</div>
                {user.phone && (
                    <div className="text-xs text-slate-500">📞 {user.phone}</div>
                )}
            </div>

            {/* Stats en grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-brand-50 rounded-lg p-2 border border-brand-200">
                    <div className="text-[10px] text-brand-700 font-medium mb-0.5">Total Invertido</div>
                    <div className="font-bold text-base text-brand-600">${user.total_invested.toLocaleString()}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 border border-purple-200">
                    <div className="text-[10px] text-purple-700 font-medium mb-0.5">Inversiones</div>
                    <div className="font-bold text-base text-purple-600">{user.active_investments} activas</div>
                </div>
            </div>

            {/* Info de pago */}
            <div className="mb-3">
                {user.payment_info ? (
                    <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-300 text-xs">
                        {user.payment_info.payment_type === 'bank_transfer' ? 'Transferencia' :
                         user.payment_info.payment_type === 'crypto' ? 'Wallet TRC20' :
                         user.payment_info.payment_type === 'binance' ? 'Binance Pay' :
                         user.payment_info.payment_type === 'zelle' ? 'Zelle' :
                         user.payment_info.payment_type === 'paypal' ? 'PayPal' :
                         user.payment_info.payment_type}
                    </Badge>
                ) : (
                    <Badge variant="outline" className="bg-slate-100 text-slate-500 text-xs">
                        Sin info de pago
                    </Badge>
                )}
            </div>

            {/* Botón de acción */}
            <Button
                onClick={() => onViewDetail(user)}
                size="sm"
                className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white"
            >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalle
            </Button>
        </div>
    );
};

export default UserMobileCard;
