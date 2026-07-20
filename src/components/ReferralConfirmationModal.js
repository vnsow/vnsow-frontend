import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { User } from 'lucide-react';

const ReferralConfirmationModal = ({
  isOpen,
  onClose,
  referrerData,
  onConfirm,
  isLoading
}) => {
  if (!referrerData) return null;

  const referrerPicture = referrerData.custom_picture || referrerData.picture;
  const referrerName = referrerData.name || 'Usuario';
  const referrerEmail = referrerData.email || '';
  const referrerCode = referrerData.referral_code || '';

  // Formatear fecha si existe
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-center mb-4">
            Confirmación de Referido
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4">
          {/* Avatar del referidor */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {referrerPicture ? (
              <img
                src={referrerPicture}
                alt={referrerName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </div>

          {/* Información del referidor */}
          <div className="text-center space-y-2 w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {referrerName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {referrerEmail}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Código: <span className="font-mono font-semibold">{referrerCode}</span>
            </p>
            {referrerData.created_at && (
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Miembro desde {formatDate(referrerData.created_at)}
              </p>
            )}
          </div>

          {/* Descripción */}
          <DialogDescription className="text-center text-sm text-gray-700 dark:text-gray-300 pt-2">
            ¿Estás seguro/a de continuar como referido de{' '}
            <span className="font-semibold">{referrerName}</span>?
            <br />
            <span className="text-xs text-gray-600 dark:text-gray-400 mt-2 block">
              Una vez confirmado, este proceso no podrá revertirse.
            </span>
          </DialogDescription>
        </div>

        {/* Botones */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Procesando...
              </>
            ) : (
              'Confirmar'
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralConfirmationModal;
