import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import axios from 'axios';
import { Upload, FileText, Image, X, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PaymentProofModal = ({ open, onOpenChange, item, type = 'investment', onSuccess }) => {
  // type puede ser 'investment' o 'deposit'
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Campos del formulario
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [bancoEmisor, setBancoEmisor] = useState('');
  const [bancoReceptor, setBancoReceptor] = useState('');

  const resetModal = () => {
    setFile(null);
    setPreview(null);
    setUploadSuccess(false);
    setPaymentReference('');
    setPaymentAmount('');
    setPaymentDate('');
    setBancoEmisor('');
    setBancoReceptor('');
  };

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      resetModal();
    }
    onOpenChange(newOpen);
  };

  const validateFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Tipo de archivo no permitido. Solo JPG, PNG o PDF.');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('El archivo es demasiado grande. Máximo 5MB.');
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);

      // Crear vista previa para imágenes
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);

        // Crear vista previa para imágenes
        if (droppedFile.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result);
          };
          reader.readAsDataURL(droppedFile);
        } else {
          setPreview(null);
        }
      }
    }
  };

  const handleUpload = async () => {
    if (uploading) return;
    // Validar archivo
    if (!file) {
      toast.error('Por favor selecciona un archivo');
      return;
    }

    // Validar campos obligatorios
    if (!paymentReference.trim()) {
      toast.error('Por favor ingresa la referencia del pago');
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast.error('Por favor ingresa un monto válido');
      return;
    }

    if (!paymentDate) {
      toast.error('Por favor selecciona la fecha del pago');
      return;
    }

    if (!bancoEmisor.trim()) {
      toast.error('Por favor ingresa el banco emisor');
      return;
    }

    if (!bancoReceptor.trim()) {
      toast.error('Por favor ingresa el banco receptor');
      return;
    }

    // Validar que el monto coincida
    const expectedAmount = item.amount;
    const enteredAmount = parseFloat(paymentAmount);

    if (Math.abs(enteredAmount - expectedAmount) > 0.01) {
      toast.error(`El monto debe ser $${expectedAmount.toLocaleString()}`);
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('proof', file);
      formData.append('payment_reference', paymentReference);
      formData.append('payment_amount', paymentAmount);
      formData.append('payment_date', paymentDate);
      formData.append('banco_emisor', bancoEmisor);
      formData.append('banco_receptor', bancoReceptor);

      // Endpoint según el tipo
      const endpoint = type === 'deposit'
        ? `${BACKEND_URL}/api/user/deposits/${item._id}/upload-proof`
        : `${BACKEND_URL}/api/user/investments/${item._id}/upload-proof`;

      await axios.post(
        endpoint,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 90000,
        }
      );

      setUploadSuccess(true);
      toast.success('¡Comprobante subido exitosamente!');

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        handleOpenChange(false);
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (error) {
      console.error('Error uploading proof:', error);
      const isTimeout = error.code === 'ECONNABORTED' || /timeout/i.test(error.message || '');
      const errorMessage = isTimeout
        ? 'La subida tardó demasiado. Verifica tu conexión e intenta de nuevo.'
        : (error.response?.data?.detail || 'Error al subir el comprobante');
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  if (!item) return null;

  const isDeposit = type === 'deposit';
  const title = isDeposit ? 'Depósito' : 'Inversión';

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Subir Comprobante de Pago
          </DialogTitle>
          <DialogDescription>
            Sube una captura o foto de tu comprobante de pago para este {title.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        {uploadSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">¡Comprobante enviado!</h3>
            <p className="text-slate-600">El administrador revisará tu pago pronto</p>
          </div>
        ) : (
          <>
            {/* Detalles del ítem */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-slate-900 mb-3">Detalles del {title}</h4>
              <div className="space-y-2 text-sm">
                {!isDeposit && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Plan:</span>
                      <span className="font-semibold">{item.plan_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Rentabilidad:</span>
                      <span className="font-semibold">{item.plan_rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Mercado:</span>
                      <span className="font-semibold">{item.market}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-600">Monto:</span>
                  <span className="font-semibold text-brand-600">
                    ${item.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Estado:</span>
                  <Badge className="bg-orange-500">
                    ⏳ Pago Pendiente
                  </Badge>
                </div>
              </div>
            </div>

            {/* Información del comprobante actual si existe */}
            {item.payment_proof && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-700">
                    <p className="font-semibold mb-1">Ya subiste un comprobante</p>
                    <p>Si subes uno nuevo, reemplazará al anterior.</p>
                    {item.payment_proof_status === 'submitted' && (
                      <p className="mt-1">Estado: En revisión</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Formulario de datos del pago */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-slate-900 mb-4">Información del Pago</h4>
              <div className="grid grid-cols-1 gap-4">
                {/* Referencia del pago */}
                <div className="space-y-2">
                  <Label htmlFor="payment-reference" className="text-sm font-medium text-slate-700">
                    Referencia del Pago <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="payment-reference"
                    type="text"
                    placeholder="Ej: 123456789"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Monto y Fecha en la misma fila */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Monto del pago */}
                  <div className="space-y-2">
                    <Label htmlFor="payment-amount" className="text-sm font-medium text-slate-700">
                      Monto Pagado <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      step="0.01"
                      placeholder={item.amount?.toLocaleString()}
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Fecha del pago */}
                  <div className="space-y-2">
                    <Label htmlFor="payment-date" className="text-sm font-medium text-slate-700">
                      Fecha del Pago <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="payment-date"
                      type="date"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Banco Emisor y Receptor en la misma fila */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Banco Emisor */}
                  <div className="space-y-2">
                    <Label htmlFor="banco-emisor" className="text-sm font-medium text-slate-700">
                      Banco Emisor <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="banco-emisor"
                      type="text"
                      placeholder="Ej: Bank of America"
                      value={bancoEmisor}
                      onChange={(e) => setBancoEmisor(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-slate-500">Desde dónde enviaste</p>
                  </div>

                  {/* Banco Receptor */}
                  <div className="space-y-2">
                    <Label htmlFor="banco-receptor" className="text-sm font-medium text-slate-700">
                      Banco Receptor <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="banco-receptor"
                      type="text"
                      placeholder="Ej: Banco Mercantil"
                      value={bancoReceptor}
                      onChange={(e) => setBancoReceptor(e.target.value)}
                      className="w-full"
                    />
                    <p className="text-xs text-slate-500">A dónde enviaste</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Zona de carga de archivos */}
            <div className="space-y-4">
              {!file ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                    dragActive
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-700 font-semibold mb-1">
                    Arrastra tu archivo aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-slate-500">
                    Formatos permitidos: JPG, PNG, PDF (máx. 5MB)
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border-2 border-brand-600 bg-brand-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {preview ? (
                        <Image className="h-6 w-6 text-brand-600" />
                      ) : (
                        <FileText className="h-6 w-6 text-brand-600" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900">{file.name}</p>
                        <p className="text-sm text-slate-600">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-slate-500 hover:text-slate-700"
                      type="button"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Vista previa de imagen */}
                  {preview && (
                    <div className="mt-3">
                      <img
                        src={preview}
                        alt="Vista previa"
                        className="w-full h-48 object-contain bg-white rounded border"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Instrucciones */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <p className="text-sm text-slate-700">
                  <strong className="text-slate-900">Importante:</strong> Completa todos los campos obligatorios (*)
                  y asegúrate de que el comprobante muestre claramente la información del pago realizado.
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  className="flex-1"
                  disabled={uploading}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpload}
                  className="flex-1 bg-brand-600 hover:bg-brand-700"
                  disabled={uploading}
                >
                  {uploading ? 'Enviando...' : 'Enviar Comprobante'}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentProofModal;
