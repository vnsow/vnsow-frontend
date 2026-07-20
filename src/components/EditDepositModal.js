import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Building2,
  CreditCard,
  DollarSign,
  Hash,
  Upload,
  X,
  Image as ImageIcon,
  Loader2,
  FileText,
  Calendar,
  Wallet,
  MessageCircle
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const EditDepositModal = ({ isOpen, onClose, deposit, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [methodDetails, setMethodDetails] = useState(null);

  // Obtener detalles del método de pago cuando es tipo contact
  useEffect(() => {
    const fetchMethodDetails = async () => {
      if (isOpen && deposit?.payment_method_type === 'contact' && deposit?.payment_method_id) {
        try {
          const response = await axios.get(`${API}/payment-methods`, {
            withCredentials: true
          });
          const methods = response.data.payment_methods || [];
          const method = methods.find(m => m._id === deposit.payment_method_id);
          if (method) {
            setMethodDetails(method.details);
          }
        } catch (error) {
          console.error('Error fetching method details:', error);
        }
      }
    };
    fetchMethodDetails();
  }, [isOpen, deposit]);

  // Determinar si es método de contacto
  const isContactMethod = deposit?.payment_method_type === 'contact';

  // Generar link de WhatsApp sin mensaje precargado
  const getWhatsAppLink = () => {
    if (!methodDetails?.phone_number) return '';
    const phoneNumber = methodDetails.phone_number.replace(/[^0-9]/g, '');
    return `https://wa.me/${phoneNumber}`;
  };

  const getMethodIcon = (type) => {
    switch (type) {
      case 'bank':
        return <Building2 className="h-5 w-5" />;
      case 'paypal':
      case 'stripe':
        return <CreditCard className="h-5 w-5" />;
      case 'zelle':
        return <DollarSign className="h-5 w-5" />;
      case 'binance':
      case 'crypto':
        return <Hash className="h-5 w-5" />;
      case 'contact':
        return <MessageCircle className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getMethodIconColor = (type) => {
    switch (type) {
      case 'bank':
        return 'text-blue-600 bg-blue-100';
      case 'paypal':
        return 'text-purple-600 bg-purple-100';
      case 'zelle':
        return 'text-green-600 bg-green-100';
      case 'stripe':
        return 'text-indigo-600 bg-indigo-100';
      case 'binance':
        return 'text-yellow-600 bg-yellow-100';
      case 'crypto':
        return 'text-orange-600 bg-orange-100';
      case 'contact':
        return 'text-brand-600 bg-brand-100';
      default:
        return 'text-slate-600 bg-slate-100';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-600">Pendiente</Badge>;
      case 'approved':
        return <Badge className="bg-brand-600">Aprobado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600">Rechazado</Badge>;
      default:
        return <Badge className="bg-slate-600">{status}</Badge>;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'wallet_deposit':
        return 'Depósito a billetera';
      case 'investment_payment':
        return 'Pago de inversión';
      default:
        return type;
    }
  };

  const handleSave = async () => {
    if (!proofFile && !deposit?.proof_url) {
      toast.error('No hay comprobante para guardar');
      return;
    }

    setLoading(true);
    try {
      let proofUrl = deposit?.proof_url || '';

      // Subir nuevo comprobante si hay uno
      if (proofFile) {
        const formData = new FormData();
        formData.append('file', proofFile);

        const uploadResponse = await axios.post(
          `${API}/upload-payment-proof`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
          }
        );

        proofUrl = uploadResponse.data.url;
      }

      // Actualizar depósito
      await axios.put(
        `${API}/deposits/${deposit._id}`,
        { proof_url: proofUrl },
        { withCredentials: true }
      );

      toast.success('Comprobante actualizado exitosamente');
      setProofFile(null);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating deposit:', error);
      toast.error(error.response?.data?.detail || 'Error al actualizar el comprobante');
    } finally {
      setLoading(false);
    }
  };

  if (!deposit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] rounded-2xl p-0 overflow-hidden flex flex-col">
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 custom-scrollbar"
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

          <DialogHeader className="flex-shrink-0 mb-4 sm:mb-6">
            <DialogTitle className="text-lg sm:text-xl">Detalles del Depósito</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Visualiza y actualiza la información de tu depósito
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
          {/* Estado y Tipo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-slate-600 mb-1">Estado</div>
              <div>{getStatusBadge(deposit.status)}</div>
            </div>
            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-slate-600 mb-1">Tipo de depósito</div>
              <div className="font-semibold text-sm sm:text-base">{getTypeLabel(deposit.type)}</div>
            </div>
          </div>

          {/* Monto */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-blue-700 mb-1">Monto depositado</div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-600">
              ${deposit.amount?.toLocaleString()}
            </div>
          </div>

          {/* Método de Pago */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-slate-600 mb-2 sm:mb-3">Método de pago utilizado</div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${getMethodIconColor(deposit.payment_method_type)}`}>
                {getMethodIcon(deposit.payment_method_type)}
              </div>
              <div>
                <div className="font-semibold text-sm sm:text-base text-slate-900">{deposit.payment_method_name}</div>
                <div className="text-xs sm:text-sm text-slate-600">{deposit.payment_method_type}</div>
              </div>
            </div>
          </div>

          {/* Referencia */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
              Referencia de pago
            </label>
            <div className="bg-white border-2 border-slate-200 rounded-lg p-2 sm:p-3 font-mono text-xs sm:text-sm break-all">
              {deposit.payment_reference}
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
              Fecha de creación
            </label>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span>{new Date(deposit.created_at).toLocaleString()}</span>
            </div>
          </div>

          {/* Sección de contacto por WhatsApp (solo para método contact) */}
          {isContactMethod && (
            <div className="bg-brand-50 border-2 border-brand-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center bg-brand-100">
                  <MessageCircle className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-xs sm:text-sm text-slate-900">Contacto con el administrador</p>
                  <p className="text-xs text-slate-600">Este depósito se gestiona por WhatsApp</p>
                </div>
              </div>
              {methodDetails?.phone_number && (
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors w-full justify-center"
                >
                  <MessageCircle className="h-5 w-5" />
                  Abrir WhatsApp
                </a>
              )}
            </div>
          )}

          {/* Comprobante de pago (oculto para método contact) */}
          {!isContactMethod && (
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                Comprobante de pago
              </label>

              {/* Si ya existe un comprobante */}
              {deposit.proof_url && !proofFile ? (
                <div className="border-2 border-brand-200 bg-brand-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-brand-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-xs sm:text-sm text-slate-900">Comprobante actual</p>
                        <p className="text-xs text-slate-600 hidden sm:block">Vista previa del archivo</p>
                      </div>
                    </div>
                    {deposit.status === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Trigger file input
                          document.getElementById('edit-proof-file-input').click();
                        }}
                        className="text-xs h-8"
                      >
                        Cambiar
                      </Button>
                    )}
                  </div>

                  {/* Vista previa de la imagen */}
                  <div className="mt-2 sm:mt-3 bg-white rounded-lg border-2 border-slate-200 p-1 sm:p-2">
                    <img
                      src={deposit.proof_url}
                      alt="Comprobante de pago"
                      className="w-full h-auto max-h-64 sm:max-h-96 object-contain rounded"
                    />
                  </div>
                </div>
              ) : !proofFile && !deposit.proof_url ? (
                // No hay comprobante
                deposit.status === 'pending' ? (
                  <div
                    className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all cursor-pointer border-slate-300 hover:border-blue-500 hover:bg-blue-50"
                    onClick={() => document.getElementById('edit-proof-file-input').click()}
                  >
                    <Upload className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400 mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-slate-700 font-semibold mb-1">
                      Arrastra tu comprobante aquí o haz clic para seleccionar
                    </p>
                    <p className="text-xs text-slate-500">
                      Formatos: JPG, PNG, PDF (máx. 5MB)
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4 sm:py-6 text-xs sm:text-sm text-slate-500">
                    No se ha cargado ningún comprobante
                  </div>
                )
              ) : (
                // Nuevo archivo seleccionado
                <div className="border-2 border-blue-600 bg-blue-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                          {proofFile.name}
                        </p>
                        <p className="text-xs text-slate-600">
                          {(proofFile.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setProofFile(null)}
                      className="text-slate-500 hover:text-slate-700 flex-shrink-0"
                      type="button"
                    >
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>

                  {/* Vista previa de imagen */}
                  {proofFile.type.startsWith('image/') && (
                    <div className="mt-2 sm:mt-3">
                      <img
                        src={URL.createObjectURL(proofFile)}
                        alt="Vista previa del comprobante"
                        className="w-full h-40 sm:h-48 object-contain bg-white rounded border"
                      />
                    </div>
                  )}
                </div>
              )}

              {deposit.status === 'pending' && (
                <input
                  id="edit-proof-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error('El archivo es demasiado grande. Máximo 5MB.');
                        return;
                      }
                      setProofFile(file);
                    }
                  }}
                  className="hidden"
                />
              )}
            </div>
          )}

          {/* Mensaje de rechazo si aplica */}
          {deposit.status === 'rejected' && deposit.rejection_reason && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-4">
              <div className="text-xs sm:text-sm font-semibold text-red-900 mb-1">Motivo de rechazo</div>
              <div className="text-xs sm:text-sm text-red-700">{deposit.rejection_reason}</div>
            </div>
          )}

          {/* Footer con botones */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto text-sm"
            >
              <span translate="no" className="notranslate">
                {proofFile ? 'Cancelar' : 'Cerrar'}
              </span>
            </Button>
            {deposit.status === 'pending' && proofFile && !isContactMethod && (
              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-sm"
              >
                {loading ? (
                  <span translate="no" className="notranslate inline-flex items-center">
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                    Guardando...
                  </span>
                ) : (
                  <span translate="no" className="notranslate">Guardar comprobante</span>
                )}
              </Button>
            )}
          </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDepositModal;
