import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Calendar, User, CheckCircle2, XCircle, Info } from 'lucide-react';

const NotificationModal = ({ isOpen, onClose, notification, onMarkAsRead }) => {
  if (!notification) return null;

  // Marcar como leída al abrir
  React.useEffect(() => {
    if (isOpen && notification && !notification.read && onMarkAsRead) {
      onMarkAsRead(notification._id);
    }
  }, [isOpen, notification, onMarkAsRead]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'payment_approved':
      case 'deposit_approved':
        return <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-brand-600" />;
      case 'payment_rejected':
      case 'deposit_rejected':
        return <XCircle className="h-7 w-7 sm:h-8 sm:w-8 text-red-600" />;
      default:
        return <Info className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'payment_approved':
      case 'deposit_approved':
        return 'bg-brand-600';
      case 'payment_rejected':
      case 'deposit_rejected':
        return 'bg-red-600';
      default:
        return 'bg-blue-600';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] rounded-2xl p-0 overflow-hidden"
      >
        <div
          className="overflow-y-auto max-h-[90vh] px-6 py-6 custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 transparent',
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: transparent;
              margin: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 10px;
              border: 2px solid transparent;
              background-clip: padding-box;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
              background-clip: padding-box;
            }
          `}} />

          <DialogHeader>
            <DialogTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex-shrink-0">{getTypeIcon(notification.type)}</div>
                <span className="text-base sm:text-lg">{notification.title}</span>
              </div>
              <Badge className={`${getTypeColor(notification.type)} text-xs w-fit`}>
                {notification.type === 'payment_approved' && 'Pago Aprobado'}
                {notification.type === 'payment_rejected' && 'Pago Rechazado'}
                {notification.type === 'deposit_approved' && 'Depósito Aprobado'}
                {notification.type === 'deposit_rejected' && 'Depósito Rechazado'}
              </Badge>
            </DialogTitle>
            <DialogDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{formatDate(notification.created_at)}</span>
              </div>
              {notification.metadata?.admin_username && (
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">{notification.metadata.admin_username}</span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
          {/* Mensaje principal */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 sm:p-6">
            <p className="text-sm sm:text-base text-slate-900 whitespace-pre-line leading-relaxed">
              {notification.message}
            </p>
          </div>

          {/* Información adicional */}
          {notification.metadata && (
            <div className="border-2 border-slate-200 rounded-lg p-3 sm:p-4">
              <h4 className="font-semibold text-sm sm:text-base text-slate-900 mb-2 sm:mb-3">Detalles:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {notification.metadata.amount && (
                  <div>
                    <span className="text-xs sm:text-sm text-slate-600">Monto:</span>
                    <p className="font-semibold text-base sm:text-lg text-slate-900">
                      ${notification.metadata.amount.toLocaleString()}
                    </p>
                  </div>
                )}
                {notification.metadata.plan_name && (
                  <div>
                    <span className="text-xs sm:text-sm text-slate-600">Plan:</span>
                    <p className="font-semibold text-sm sm:text-base text-slate-900">
                      {notification.metadata.plan_name}
                    </p>
                  </div>
                )}
                {notification.metadata.plan_rate && (
                  <div>
                    <span className="text-xs sm:text-sm text-slate-600">Tasa:</span>
                    <p className="font-semibold text-sm sm:text-base text-slate-900">
                      {notification.metadata.plan_rate}
                    </p>
                  </div>
                )}
                {notification.metadata.payment_method && (
                  <div>
                    <span className="text-xs sm:text-sm text-slate-600">Método de pago:</span>
                    <p className="font-semibold text-sm sm:text-base text-slate-900">
                      {notification.metadata.payment_method}
                    </p>
                  </div>
                )}
                {notification.metadata.new_balance !== undefined && (
                  <div>
                    <span className="text-xs sm:text-sm text-slate-600">Nuevo saldo:</span>
                    <p className="font-semibold text-base sm:text-lg text-brand-600">
                      ${notification.metadata.new_balance.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal;
