import React, { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Button } from './ui/button';
import { Bell, Calendar, CheckCheck, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Badge } from './ui/badge';

const NotificationPopover = ({
  notifications = [],
  unreadCount = 0,
  onNotificationClick,
  onMarkAllRead,
  children
}) => {
  const [open, setOpen] = useState(false);

  // Bloquear scroll del body solo en móviles cuando el popover está abierto
  useEffect(() => {
    const isMobile = window.innerWidth < 640; // sm breakpoint

    if (open && isMobile) {
      // Guardar el scroll actual
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restaurar el scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup al desmontar
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [open]);
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`;
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays}d`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'payment_approved':
      case 'deposit_approved':
        return <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-brand-600" />;
      case 'payment_rejected':
      case 'deposit_rejected':
        return <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />;
      default:
        return <Info className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />;
    }
  };

  return (
    <>
      {/* Overlay oscuro solo en móvil */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
        <PopoverContent className="w-[calc(100vw-2rem)] sm:w-96 p-0 rounded-xl sm:rounded-lg z-50" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            <h3 className="font-semibold text-sm sm:text-base text-slate-900">Notificaciones</h3>
            {unreadCount > 0 && (
              <Badge className="bg-blue-600 text-xs">{unreadCount}</Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAllRead();
              }}
              className="text-xs h-8 px-2"
            >
              <CheckCheck className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Marcar todas</span>
            </Button>
          )}
        </div>

        {/* Lista de notificaciones */}
        <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 sm:p-8 text-center">
              <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-2 sm:mb-3" />
              <p className="text-sm sm:text-base text-slate-600">No tienes notificaciones</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => {
                    onNotificationClick(notification);
                    setOpen(false);
                  }}
                  className={`p-3 sm:p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    {/* Icono */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                        )}
                      </div>

                      {/* Preview del mensaje - 2 líneas completas */}
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-1 sm:mb-2">
                        {notification.message?.substring(0, 150) || notification.preview}
                      </p>

                      {/* Fecha */}
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(notification.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </PopoverContent>
    </Popover>
    </>
  );
};

export default NotificationPopover;
