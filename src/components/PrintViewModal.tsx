import React from 'react';
import { Worker, WeekPlan, ShiftId } from '../types';
import { SHIFT_DEFINITIONS, WEEK_DAYS } from '../data/initialData';
import { Printer, X } from 'lucide-react';

interface PrintViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek: WeekPlan;
  workers: Worker[];
}

export const PrintViewModal: React.FC<PrintViewModalProps> = ({
  isOpen,
  onClose,
  currentWeek,
  workers,
}) => {
  if (!isOpen) return null;

  const getWorker = (id: string) => workers.find((w) => w.id === id);
  const shiftsOrder: ShiftId[] = ['AM', 'PM', 'NOCHE', 'NORMAL'];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Top Bar (Hidden during print) */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Vista de Impresión / Cartelera Mural de Planta
            </h3>
            <p className="text-xs text-slate-500">
              Formato limpio de alta legibilidad para imprimir o guardar como PDF.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Imprimir Planilla
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div className="p-8 overflow-y-auto flex-1 font-sans text-slate-900 print:p-0">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-slate-500 font-bold">
                PLANTA DE PRODUCCIÓN · CONTROL DE OPERACIONES
              </span>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 mt-0.5">
                PROGRAMACIÓN SEMANAL DE TURNOS Y TRASLADOS
              </h1>
              <p className="text-sm font-semibold text-slate-700 mt-1">
                {currentWeek.label} · Lunes a Viernes
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-slate-500 block">Emisión: Octubre 2026</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-1">
                OFICIAL PLANTA
              </span>
            </div>
          </div>

          {/* Table of Shifts */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              1. Nómina Oficial por Turno (Vigente de Lunes a Viernes)
            </h2>
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold">
                  <th className="border border-slate-300 p-2 text-left w-36">Turno</th>
                  <th className="border border-slate-300 p-2 text-left w-28">Horario</th>
                  <th className="border border-slate-300 p-2 text-left">Personal Asignado</th>
                  <th className="border border-slate-300 p-2 text-left w-48">Traslado Entrada</th>
                  <th className="border border-slate-300 p-2 text-left w-48">Traslado Salida</th>
                </tr>
              </thead>
              <tbody>
                {shiftsOrder.map((sId) => {
                  const def = SHIFT_DEFINITIONS[sId];
                  const assigned = (currentWeek.assignments[sId] || [])
                    .map(getWorker)
                    .filter((w): w is Worker => Boolean(w));

                  return (
                    <tr key={sId} className="border-b border-slate-300">
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">
                        {def.name}
                      </td>
                      <td className="border border-slate-300 p-2 font-mono font-semibold">
                        {def.startTime} - {def.endTime}
                      </td>
                      <td className="border border-slate-300 p-2">
                        <div className="space-y-1">
                          {assigned.map((w) => (
                            <div key={w.id} className="flex items-center justify-between">
                              <span className="font-semibold text-slate-900">{w.name}</span>
                              <span className="font-mono text-[10px] text-slate-600 border border-slate-200 px-1 rounded">
                                {w.role}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-700">
                        <span className="font-semibold block">{def.entryTransfer.label}</span>
                        <span className="text-[10px] text-slate-500">{def.entryTransfer.estimatedWindow}</span>
                      </td>
                      <td className="border border-slate-300 p-2 text-slate-700">
                        <span className="font-semibold block">{def.exitTransfer.label}</span>
                        <span className="text-[10px] text-slate-500">{def.exitTransfer.estimatedWindow}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Transfers Summary for Drivers */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              2. Hoja de Ruta para Transporte y Choferes
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-300 rounded p-3">
                <span className="font-bold text-slate-900 block mb-1">
                  ENTRADAS A PLANTA:
                </span>
                <ul className="space-y-1 text-slate-700">
                  <li>
                    <strong>05:45 - 06:50:</strong> Domicilio → Planta (Turno AM)
                  </li>
                  <li>
                    <strong>14:15 - 14:45:</strong> Metro → Planta (Turno PM)
                  </li>
                  <li>
                    <strong>21:45 - 22:45:</strong> Domicilio → Planta (Turno Noche)
                  </li>
                </ul>
              </div>
              <div className="border border-slate-300 rounded p-3">
                <span className="font-bold text-slate-900 block mb-1">
                  SALIDAS DESDE PLANTA:
                </span>
                <ul className="space-y-1 text-slate-700">
                  <li>
                    <strong>15:10 - 15:40:</strong> Planta → Metro (Turno AM)
                  </li>
                  <li>
                    <strong>23:15 - 00:30:</strong> Planta → Domicilio (Turno PM)
                  </li>
                  <li>
                    <strong>07:10 - 07:45:</strong> Planta → Metro (Turno Noche)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mt-8 pt-6 border-t border-slate-300 grid grid-cols-2 gap-12 text-xs">
            <div className="text-center pt-8 border-t border-dashed border-slate-400">
              <span className="font-bold block text-slate-900">Jefe de Planta / Producción</span>
              <span className="text-slate-500">Firma y Timbre</span>
            </div>
            <div className="text-center pt-8 border-t border-dashed border-slate-400">
              <span className="font-bold block text-slate-900">Coordinación de Logística</span>
              <span className="text-slate-500">Recepción Chofer Móvil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
