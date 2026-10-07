import React, { useState } from 'react';
import { Worker, WeekPlan, ShiftId } from '../types';
import { SHIFT_DEFINITIONS } from '../data/initialData';
import { validateShiftAssignment, validateWeekPlan, generateSmartRotation } from '../utils/scheduleRules';
import { getWeekRangeStrings } from '../utils/dateUtils';
import { RoleBadge } from './ShiftBadge';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Copy,
  Plus,
  Trash2,
  ArrowRightLeft,
  CalendarPlus,
  ShieldCheck,
  Check
} from 'lucide-react';

interface TeamManagerProps {
  currentWeek: WeekPlan;
  allWeeks: WeekPlan[];
  workers: Worker[];
  onUpdateWeekAssignments: (weekId: string, assignments: Record<ShiftId, string[]>) => void;
  onAddNextWeek: (newWeek: WeekPlan) => void;
  onSetActiveWeek: (weekId: string) => void;
}

export const TeamManager: React.FC<TeamManagerProps> = ({
  currentWeek,
  allWeeks,
  workers,
  onUpdateWeekAssignments,
  onAddNextWeek,
  onSetActiveWeek,
}) => {
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const getWorker = (id: string) => workers.find((w) => w.id === id);

  const showNotification = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const validation = validateWeekPlan(currentWeek, workers);

  // Move worker from one shift to another
  const handleMoveWorker = (workerId: string, fromShift: ShiftId, toShift: ShiftId) => {
    if (fromShift === toShift) return;

    const newAssignments = { ...currentWeek.assignments };
    newAssignments[fromShift] = (newAssignments[fromShift] || []).filter((id) => id !== workerId);
    if (!newAssignments[toShift]) newAssignments[toShift] = [];
    if (!newAssignments[toShift].includes(workerId)) {
      newAssignments[toShift] = [...newAssignments[toShift], workerId];
    }

    onUpdateWeekAssignments(currentWeek.id, newAssignments);
    showNotification(`Operador reasignado a ${SHIFT_DEFINITIONS[toShift].name}`);
  };

  // Remove worker from shift (becomes unassigned)
  const handleRemoveWorker = (workerId: string, shiftId: ShiftId) => {
    const newAssignments = { ...currentWeek.assignments };
    newAssignments[shiftId] = (newAssignments[shiftId] || []).filter((id) => id !== workerId);
    onUpdateWeekAssignments(currentWeek.id, newAssignments);
    showNotification('Operador quitado del turno.');
  };

  // Assign an unassigned worker to a shift
  const handleAssignWorker = (workerId: string, shiftId: ShiftId) => {
    const newAssignments = { ...currentWeek.assignments };
    // Remove from any shift first
    (Object.keys(newAssignments) as ShiftId[]).forEach((s) => {
      newAssignments[s] = (newAssignments[s] || []).filter((id) => id !== workerId);
    });
    // Add to target
    newAssignments[shiftId] = [...(newAssignments[shiftId] || []), workerId];
    onUpdateWeekAssignments(currentWeek.id, newAssignments);
    showNotification(`Operador asignado a ${SHIFT_DEFINITIONS[shiftId].name}`);
  };

  // Clone current week to create next week
  const handleCloneToNextWeek = () => {
    const nextWeekNumber = currentWeek.weekNumber + 1;
    const year = currentWeek.year;
    const range = getWeekRangeStrings(year, nextWeekNumber);

    const newWeek: WeekPlan = {
      id: `${year}-W${String(nextWeekNumber).padStart(2, '0')}`,
      weekNumber: nextWeekNumber,
      year: year,
      startDate: range.startDate,
      endDate: range.endDate,
      label: range.label,
      notes: `Clonada de ${currentWeek.label}`,
      assignments: { ...currentWeek.assignments },
    };

    onAddNextWeek(newWeek);
    onSetActiveWeek(newWeek.id);
    showNotification(`Semana siguiente (${range.label}) creada con éxito.`);
  };

  // Generate smart rotation for next week
  const handleGenerateRotation = () => {
    const nextWeekNumber = currentWeek.weekNumber + 1;
    const year = currentWeek.year;
    const range = getWeekRangeStrings(year, nextWeekNumber);

    const rotatedWeek = generateSmartRotation(
      currentWeek,
      workers,
      nextWeekNumber,
      year,
      range.startDate,
      range.endDate,
      range.label
    );

    onAddNextWeek(rotatedWeek);
    onSetActiveWeek(rotatedWeek.id);
    showNotification(`Semana siguiente generada con rotación equitativa.`);
  };

  const shiftsOrder: ShiftId[] = ['AM', 'PM', 'NOCHE', 'NORMAL'];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-xs font-semibold animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header and Week Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Configuración y Reglas de Equipos de Producción</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Planificación: {currentWeek.label}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Regla de asignación: Cada equipo se compone de <strong>1 Impresión + 2 Router</strong> (Turno PM puede ser 1).
          </p>
        </div>

        {/* Action Buttons for Next Week */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCloneToNextWeek}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            title="Copia los mismos equipos a la semana siguiente"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            Clonar a Siguiente Semana
          </button>

          <button
            onClick={handleGenerateRotation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
            title="Avanza los turnos rotando roles para equidad"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Rotar Equipos Semana Siguiente
          </button>
        </div>
      </div>

      {/* Overall Compliance Status */}
      <div
        className={`p-4 rounded-xl border text-xs flex items-center justify-between gap-4 ${
          validation.isFullyValid
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-3">
          {validation.isFullyValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <div>
            <span className="font-bold block text-sm">
              {validation.isFullyValid
                ? 'Conformación de Equipos Completa y Válida'
                : 'Atención: Ajustes requeridos en los equipos'}
            </span>
            <span className="text-slate-600">
              {validation.isFullyValid
                ? 'Todos los turnos (AM, PM, NOCHE) cumplen con 1 Impresión y sus respectivos Routers.'
                : 'Revise las alertas de cada turno para asegurar la dotación requerida.'}
            </span>
          </div>
        </div>

        {validation.unassignedWorkerIds.length > 0 && (
          <span className="font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded">
            {validation.unassignedWorkerIds.length} sin asignar
          </span>
        )}
      </div>

      {/* Unassigned Workers Bar (if any) */}
      {validation.unassignedWorkerIds.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-amber-700" />
            Personal Disponible sin Asignar ({validation.unassignedWorkerIds.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {validation.unassignedWorkerIds.map((id) => {
              const worker = getWorker(id);
              if (!worker) return null;
              return (
                <div
                  key={id}
                  className="bg-white border border-amber-300 rounded-lg p-2 flex items-center gap-2 shadow-2xs"
                >
                  <span className="text-xs font-semibold text-slate-800">{worker.name}</span>
                  <RoleBadge role={worker.role} size="sm" />
                  <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                    <span className="text-[10px] text-slate-500 font-medium">Asignar a:</span>
                    {shiftsOrder.map((sId) => (
                      <button
                        key={sId}
                        onClick={() => handleAssignWorker(id, sId)}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        {sId}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Shifts Grid Configurator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {shiftsOrder.map((shiftId) => {
          const def = SHIFT_DEFINITIONS[shiftId];
          const workerIds = currentWeek.assignments[shiftId] || [];
          const assigned = workerIds.map(getWorker).filter((w): w is Worker => Boolean(w));
          const shiftStatus = validation.shiftStatuses[shiftId];

          const impCount = assigned.filter((w) => w.role === 'IMPRESION').length;
          const routerCount = assigned.filter((w) => w.role === 'ROUTER').length;

          return (
            <div
              key={shiftId}
              className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/70">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          shiftId === 'AM'
                            ? 'bg-blue-600'
                            : shiftId === 'PM'
                            ? 'bg-amber-600'
                            : shiftId === 'NOCHE'
                            ? 'bg-indigo-900'
                            : 'bg-emerald-600'
                        }`}
                      />
                      <h3 className="font-bold text-slate-900 text-base">{def.name}</h3>
                    </div>
                    <p className="font-mono text-xs text-slate-600 font-semibold mt-0.5">
                      {def.startTime} a {def.endTime}
                    </p>
                  </div>

                  {/* Status chip */}
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border ${
                      shiftStatus.isValid
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {shiftStatus.isValid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Regla Cumplida</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Requiere Ajuste</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Rule specification */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-slate-500">Regla de Equipo:</span>
                  <span className="font-semibold text-slate-800">{def.rules.ruleDescription}</span>
                </div>

                {/* Counts breakdown */}
                <div className="mt-2 flex items-center gap-4 text-xs font-medium">
                  <span
                    className={
                      shiftId !== 'NORMAL' && impCount !== 1
                        ? 'text-red-700 font-bold'
                        : 'text-cyan-800'
                    }
                  >
                    Impresión: {impCount} / {shiftId === 'NORMAL' ? '—' : '1'}
                  </span>
                  <span
                    className={
                      shiftId !== 'NORMAL' &&
                      (routerCount < def.rules.minRouter || routerCount > def.rules.maxRouter)
                        ? 'text-red-700 font-bold'
                        : 'text-amber-800'
                    }
                  >
                    Router: {routerCount} / {shiftId === 'NORMAL' ? '—' : `${def.rules.minRouter}${def.rules.maxRouter !== def.rules.minRouter ? ` o ${def.rules.maxRouter}` : ''}`}
                  </span>
                </div>
              </div>

              {/* Workers in this shift */}
              <div className="p-4 flex-1 space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Integrantes del Equipo ({assigned.length})
                </div>

                {assigned.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
                    Sin personal asignado a este turno.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {assigned.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900">{w.name}</span>
                          <RoleBadge role={w.role} size="sm" />
                        </div>

                        {/* Shift Mover Controls */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 font-medium">Mover a:</span>
                          <select
                            value={shiftId}
                            onChange={(e) => handleMoveWorker(w.id, shiftId, e.target.value as ShiftId)}
                            className="text-[11px] font-semibold bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                          >
                            <option value={shiftId} disabled>
                              {shiftId} (Actual)
                            </option>
                            {shiftsOrder
                              .filter((s) => s !== shiftId)
                              .map((target) => (
                                <option key={target} value={target}>
                                  {target}
                                </option>
                              ))}
                          </select>

                          <button
                            onClick={() => handleRemoveWorker(w.id, shiftId)}
                            title="Quitar del turno"
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Transfers summary at bottom of shift card */}
              <div className="p-3 bg-slate-50/90 border-t border-slate-200 text-[11px] text-slate-600 flex flex-col gap-0.5">
                <div>
                  <span className="font-semibold text-slate-700">Entrada:</span>{' '}
                  <span className="text-slate-800">{def.entryTransfer.label}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Salida:</span>{' '}
                  <span className="text-slate-800">{def.exitTransfer.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
