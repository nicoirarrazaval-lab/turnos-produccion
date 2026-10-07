import React, { useState } from 'react';
import { ShiftDefinition, ShiftId } from '../types';
import { X, Check, RotateCcw, Sliders, Clock, Truck, Shield } from 'lucide-react';
import { SHIFT_DEFINITIONS } from '../data/initialData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftDefinitions: Record<string, ShiftDefinition>;
  onSaveDefinitions: (defs: Record<string, ShiftDefinition>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  shiftDefinitions,
  onSaveDefinitions,
}) => {
  if (!isOpen) return null;

  const [formState, setFormState] = useState<Record<string, ShiftDefinition>>(
    JSON.parse(JSON.stringify(shiftDefinitions))
  );
  const [selectedShiftId, setSelectedShiftId] = useState<ShiftId>('AM');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentDef = formState[selectedShiftId];

  const handleUpdateField = (field: keyof ShiftDefinition, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [selectedShiftId]: {
        ...prev[selectedShiftId],
        [field]: value,
      },
    }));
  };

  const handleUpdateTransfer = (
    transferType: 'entryTransfer' | 'exitTransfer',
    field: string,
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [selectedShiftId]: {
        ...prev[selectedShiftId],
        [transferType]: {
          ...prev[selectedShiftId][transferType],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    onSaveDefinitions(formState);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleResetCurrent = () => {
    setFormState((prev) => ({
      ...prev,
      [selectedShiftId]: JSON.parse(JSON.stringify(SHIFT_DEFINITIONS[selectedShiftId])),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Configuración de Parámetros de Turnos y Traslados
              </h3>
              <p className="text-xs text-slate-500">
                Personaliza horarios, paradas de móvil y ventanas de transporte de la planta.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shift Tabs */}
        <div className="px-4 pt-3 border-b border-slate-200 flex items-center gap-2 bg-slate-50/50">
          {(['AM', 'PM', 'NOCHE', 'NORMAL'] as ShiftId[]).map((sId) => (
            <button
              key={sId}
              onClick={() => setSelectedShiftId(sId)}
              className={`px-3 py-2 text-xs font-bold rounded-t-lg transition-colors border-b-2 ${
                selectedShiftId === sId
                  ? 'border-blue-600 text-blue-600 bg-white shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {SHIFT_DEFINITIONS[sId].name}
            </button>
          ))}
        </div>

        {/* Body Form */}
        <div className="p-5 overflow-y-auto max-h-[65vh] space-y-5 text-xs text-slate-700">
          {/* Horarios */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Horarios de Jornada ({currentDef.name})</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Hora Entrada:</label>
                <input
                  type="text"
                  value={currentDef.startTime}
                  onChange={(e) => handleUpdateField('startTime', e.target.value)}
                  placeholder="Ej: 07:00"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Hora Salida:</label>
                <input
                  type="text"
                  value={currentDef.endTime}
                  onChange={(e) => handleUpdateField('endTime', e.target.value)}
                  placeholder="Ej: 15:00"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Traslado de Entrada */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-1">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Traslado de ENTRADA</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Etiqueta de Ruta:</label>
                <input
                  type="text"
                  value={currentDef.entryTransfer.label}
                  onChange={(e) => handleUpdateTransfer('entryTransfer', 'label', e.target.value)}
                  placeholder="Ej: Domicilio → Planta"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Ventana Horaria Recogida:</label>
                <input
                  type="text"
                  value={currentDef.entryTransfer.estimatedWindow}
                  onChange={(e) => handleUpdateTransfer('entryTransfer', 'estimatedWindow', e.target.value)}
                  placeholder="Ej: 05:45 - 06:50"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Traslado de Salida */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-200 pb-1">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Traslado de SALIDA</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold block mb-1">Etiqueta de Ruta:</label>
                <input
                  type="text"
                  value={currentDef.exitTransfer.label}
                  onChange={(e) => handleUpdateTransfer('exitTransfer', 'label', e.target.value)}
                  placeholder="Ej: Planta → Metro"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Ventana Horaria Retorno:</label>
                <input
                  type="text"
                  value={currentDef.exitTransfer.estimatedWindow}
                  onChange={(e) => handleUpdateTransfer('exitTransfer', 'estimatedWindow', e.target.value)}
                  placeholder="Ej: 15:10 - 15:40"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Reglas de Dotación */}
          {selectedShiftId !== 'NORMAL' && (
            <div className="space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span>Regla de Validación:</span>
              </div>
              <p className="text-slate-600">
                {currentDef.rules.ruleDescription} (1 Impresión + {currentDef.rules.minRouter} {currentDef.rules.maxRouter > currentDef.rules.minRouter ? `o ${currentDef.rules.maxRouter}` : ''} Router).
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={handleResetCurrent}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restablecer este turno
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <span>Guardar Cambios</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
