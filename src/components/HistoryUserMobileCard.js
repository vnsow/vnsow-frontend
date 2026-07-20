import React from 'react';
import { Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const HistoryUserMobileCard = ({ user, onViewDetail }) => {
    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all mb-4 p-4 border-l-4 border-l-brand-400">
            {/* Header: Usuario */}
            <div className="flex items-start gap-3 mb-4">
                {user.custom_picture || user.picture ? (
                    <img
                        src={user.custom_picture || user.picture}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-brand-200 flex-shrink-0"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ display: (user.custom_picture || user.picture) ? 'none' : 'flex' }}
                >
                    {user.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 text-base truncate">{user.name || 'Sin nombre'}</div>
                    <div className="text-sm text-slate-600 truncate">{user.email}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Código: {user.referral_code || 'N/A'}</div>
                </div>
            </div>

            {/* Número de operaciones */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 mb-3 border border-purple-200">
                <div className="text-xs text-purple-700 font-medium mb-1">Número de Operaciones</div>
                <div className="text-2xl font-bold text-purple-600">{user.total_operations}</div>
            </div>

            {/* Botón Ver Detalle */}
            <Button
                onClick={() => onViewDetail(user)}
                className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-md hover:shadow-lg transition-all"
            >
                <Eye className="h-4 w-4 mr-2" />
                Ver Detalle
            </Button>
        </div>
    );
};

export default HistoryUserMobileCard;
