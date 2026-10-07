import React, { useState } from 'react';
import { Worker, WeekPlan, ShiftId } from '../types';
import { SHIFT_DEFINITIONS, WEEK_DAYS } from '../data/initialData';
import { RoleBadge, ShiftTag } from './ShiftBadge';
import {
  Clock,
  Truck,
  Users,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle,
  ArrowRight,
  Home,
  Building2,
  Train,
  CheckCircle2
} from 'lucide-react';

interface GanttViewProps {
  currentWeek: WeekPlan;
  workers: Worker[];
  onOpenTeamEditor: () => void;
  onOpenTransfers: () => void;
}

export const GanttView: React.FC<GanttViewProps> = ({
  currentWeek,
  workers,
  onOpenTeamEditor,
  onOpenTransfers,
}) => {
  const [selectedDay, setSelectedDay] = useState<string>('lunes');
  const [viewMode, setViewMode] = useState<'by-shift' | 'by-worker'>('by-shift');
  const [activeShiftDetail, setActiveShiftDetail] = useState<ShiftId | null>(null);

  // Helper to get worker by ID
  const getWorker = (id: string) => workers.find((w) => w.id === id);

  // Time scale configuration: 24 hours (0 to 24)
  const HOURS = Array.from({ length: 25 }, (_, i) => i);

  // Percent calculation for 24h
  const toPercent = (hourDecimal: number) => {
    return (Math.max(0, Math.min(24, hourDecimal)) / 24) * 100;
  };

  const getTransferIcon = (type: string) => {
    switch (type) {
      case 'DOMICILIO_PLANTA':
        return <Home className="w-3.5 h-3.5 shrink-0" />;
      case 'PLANTA_METRO':
      case 'METRO_PLANTA':
        return <Train className="w-3.5 h-3.5 shrink-0" />;
      case 'PLANTA_DOMICILIO':
        return <Building2 className="w-3.5 h-3.5 shrink-0" />;
      default:
        return <Truck className="w-3.5 h-3.5 shrink-0" />;
    }
  };

  const currentDayName = WEEK_DAYS.find((d) => d.id === selectedDay)?.name || 'Lunes';

  // Workers assigned by shift
  const shiftsList: ShiftId[] = ['AM', 'NORMAL', 'PM', 'NOCHE'];

  return (
    <div className="space-y-6">
      {/* Top Controls: Day selector + View mode */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Planificación Semanal · {currentWeek.label}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Gantt Diario de Operaciones (Lunes a Viernes)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mismo equipo y horario constante durante toda la semana laboral.
          </p>
        </div>

        {/* Day selection tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
          {WEEK_DAYS.map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                selectedDay === day.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {day.name}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start lg:self-auto">
          <button
            onClick={() => setViewMode('by-shift')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              viewMode === 'by-shift'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Por Turno (Planta)
          </button>
          <button
            onClick={() => setViewMode('by-worker')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              viewMode === 'by-worker'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Por Operador (9)
          </button>
        </div>
      </div>

      {/* Gantt Chart Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Legend with Shift Info & Transfers */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Programación para {currentDayName}:</span>
            <span className="text-slate-500">24 horas de cobertura continua con relevos</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded bg-blue-600 inline-block" /> AM (07:00 - 15:00)
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> NORMAL (08:45 - 18:00)
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded bg-amber-600 inline-block" /> PM (15:00 - 23:00)
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded bg-indigo-900 inline-block" /> NOCHE (23:00 - 07:00)
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-600 font-medium border-l border-slate-300 pl-3">
              <span className="w-3 h-3 rounded border border-dashed border-slate-500 bg-slate-100 inline-block" /> Traslado (Entrada/Salida)
            </span>
          </div>
        </div>

        {/* Interactive Gantt Timeline Area */}
        <div className="p-4 overflow-x-auto min-w-[950px]">
          {/* Time axis header */}
          <div className="grid grid-cols-[220px_1fr] border-b border-slate-200 pb-2 mb-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {viewMode === 'by-shift' ? 'Turno / Personal Asignado' : 'Operador / Rol'}
            </div>
            <div className="relative h-6 text-[11px] font-mono text-slate-500">
              {HOURS.filter((h) => h % 2 === 0).map((hour) => {
                const left = toPercent(hour);
                return (
                  <div
                    key={hour}
                    className="absolute -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${left}%` }}
                  >
                    <span>{String(hour).padStart(2, '0')}:00</span>
                    <div className="w-px h-1.5 bg-slate-300 mt-0.5" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Background vertical hour grid lines */}
          <div className="relative">
            <div className="absolute inset-0 left-[220px] pointer-events-none flex">
              {HOURS.filter((h) => h % 2 === 0).map((hour) => {
                const left = toPercent(hour);
                return (
                  <div
                    key={hour}
                    className="absolute top-0 bottom-0 w-px border-r border-slate-100"
                    style={{ left: `${left}%` }}
                  />
                );
              })}
            </div>

            {/* View Mode 1: By Shift */}
            {viewMode === 'by-shift' && (
              <div className="space-y-4 relative z-10">
                {shiftsList.map((shiftId) => {
                  const def = SHIFT_DEFINITIONS[shiftId];
                  const workerIds = currentWeek.assignments[shiftId] || [];
                  const assignedWorkers = workerIds
                    .map(getWorker)
                    .filter((w): w is Worker => Boolean(w));
                  const impCount = assignedWorkers.filter((w) => w.role === 'IMPRESION').length;
                  const routerCount = assignedWorkers.filter((w) => w.role === 'ROUTER').length;

                  return (
                    <div
                      key={shiftId}
                      className="grid grid-cols-[220px_1fr] items-center gap-4 py-2 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 rounded-lg transition-colors p-2"
                    >
                      {/* Left Column: Shift Name & Assigned Crew */}
                      <div className="pr-2">
                        <div className="flex items-center justify-between mb-1">
                          <button
                            onClick={() => setActiveShiftDetail(activeShiftDetail === shiftId ? null : shiftId)}
                            className="font-bold text-sm text-slate-900 hover:text-blue-600 flex items-center gap-1.5 text-left"
                          >
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
                            {def.name}
                          </button>
                          <span className="font-mono text-xs font-semibold text-slate-500">
                            {def.startTime} - {def.endTime}
                          </span>
                        </div>

                        {/* Crew summary */}
                        <div className="text-xs text-slate-600 flex items-center gap-1.5 mb-1.5">
                          <span className="font-medium">{assignedWorkers.length} pers.</span>
                          <span>·</span>
                          <span className="text-cyan-800 font-semibold">{impCount} Imp</span>
                          <span>·</span>
                          <span className="text-amber-800 font-semibold">{routerCount} Rtr</span>
                        </div>

                        {/* Worker names list */}
                        <div className="space-y-1">
                          {assignedWorkers.map((w) => (
                            <div key={w.id} className="flex items-center justify-between text-xs py-0.5">
                              <span className="text-slate-800 font-medium truncate max-w-[140px]">
                                {w.name}
                              </span>
                              <RoleBadge role={w.role} size="sm" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Column: Timeline bars for Transfers & Shift Work */}
                      <div className="relative h-20 bg-slate-50/80 rounded-lg border border-slate-200/80 p-1 flex items-center">
                        {/* Rendering for AM (07:00 to 15:00) */}
                        {shiftId === 'AM' && (
                          <>
                            {/* Entrada Transfer: 05:45 to 07:00 (5.75 to 7.0) */}
                            <div
                              className="absolute top-2 h-7 rounded border border-dashed border-blue-400 bg-blue-50/90 text-blue-900 text-[11px] font-medium flex items-center px-2 gap-1.5 shadow-2xs z-20 overflow-hidden"
                              style={{
                                left: `${toPercent(5.75)}%`,
                                width: `${toPercent(7.0) - toPercent(5.75)}%`,
                              }}
                              title="Traslado Entrada: Domicilio → Planta (05:45 a 07:00)"
                            >
                              <Home className="w-3 h-3 text-blue-700 shrink-0" />
                              <span className="truncate text-[10px] leading-tight">
                                Entrada: Dom → Planta
                              </span>
                            </div>

                            {/* Main Shift Bar: 07:00 to 15:00 (7.0 to 15.0) */}
                            <div
                              className="absolute top-2 bottom-2 rounded-md bg-blue-600 text-white p-2 flex flex-col justify-between shadow-xs z-10 cursor-pointer hover:brightness-105 transition-all"
                              style={{
                                left: `${toPercent(7.0)}%`,
                                width: `${toPercent(15.0) - toPercent(7.0)}%`,
                              }}
                              onClick={() => setActiveShiftDetail(shiftId)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs flex items-center gap-1.5">
                                  <span>Turno AM</span>
                                  <span className="text-[10px] font-normal opacity-90 font-mono">
                                    07:00 a 15:00 (8h)
                                  </span>
                                </span>
                                <span className="text-[10px] bg-blue-700/80 px-1.5 py-0.5 rounded font-mono">
                                  1 Imp + 2 Router
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] opacity-95 truncate">
                                <span>{assignedWorkers.map((w) => w.name.split(' ')[0]).join(', ')}</span>
                              </div>
                            </div>

                            {/* Salida Transfer: 15:00 to 15.75 (15:00 a 15:45) */}
                            <div
                              className="absolute top-2 h-7 rounded border border-dashed border-blue-400 bg-blue-50/90 text-blue-900 text-[11px] font-medium flex items-center px-2 gap-1.5 shadow-2xs z-20 overflow-hidden"
                              style={{
                                left: `${toPercent(15.0)}%`,
                                width: `${toPercent(15.75) - toPercent(15.0)}%`,
                              }}
                              title="Traslado Salida: Planta → Metro (15:00 a 15:45)"
                            >
                              <Train className="w-3 h-3 text-blue-700 shrink-0" />
                              <span className="truncate text-[10px] leading-tight">
                                Salida: Planta → Metro
                              </span>
                            </div>
                          </>
                        )}

                        {/* Rendering for NORMAL (08:45 to 18:00) */}
                        {shiftId === 'NORMAL' && (
                          <>
                            {/* Main Shift Bar: 08:45 to 18:00 (8.75 to 18.0) */}
                            <div
                              className="absolute top-2 bottom-2 rounded-md bg-emerald-600 text-white p-2 flex flex-col justify-between shadow-xs z-10 cursor-pointer hover:brightness-105 transition-all"
                              style={{
                                left: `${toPercent(8.75)}%`,
                                width: `${toPercent(18.0) - toPercent(8.75)}%`,
                              }}
                              onClick={() => setActiveShiftDetail(shiftId)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs flex items-center gap-1.5">
                                  <span>Horario Normal</span>
                                  <span className="text-[10px] font-normal opacity-90 font-mono">
                                    08:45 a 18:00 (9h 15m)
                                  </span>
                                </span>
                                <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.5 rounded">
                                  Sin Traslado
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] opacity-95 truncate">
                                <span>{assignedWorkers.map((w) => w.name.split(' ')[0]).join(', ')}</span>
                              </div>
                            </div>
                          </>
                        )}

                        {/* Rendering for PM (15:00 to 23:00) */}
                        {shiftId === 'PM' && (
                          <>
                            {/* Entrada Transfer: 14:15 to 15:00 (14.25 to 15.0) */}
                            <div
                              className="absolute top-2 h-7 rounded border border-dashed border-amber-400 bg-amber-50/90 text-amber-900 text-[11px] font-medium flex items-center px-2 gap-1.5 shadow-2xs z-20 overflow-hidden"
                              style={{
                                left: `${toPercent(14.25)}%`,
                                width: `${toPercent(15.0) - toPercent(14.25)}%`,
                              }}
                              title="Traslado Entrada: Metro → Planta (14:15 a 15:00)"
                            >
                              <Train className="w-3 h-3 text-amber-700 shrink-0" />
                              <span className="truncate text-[10px] leading-tight">
                                Entrada: Metro → Planta
                              </span>
                            </div>

                            {/* Main Shift Bar: 15:00 to 23:00 (15.0 to 23.0) */}
                            <div
                              className="absolute top-2 bottom-2 rounded-md bg-amber-600 text-white p-2 flex flex-col justify-between shadow-xs z-10 cursor-pointer hover:brightness-105 transition-all"
                              style={{
                                left: `${toPercent(15.0)}%`,
                                width: `${toPercent(23.0) - toPercent(15.0)}%`,
                              }}
                              onClick={() => setActiveShiftDetail(shiftId)}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-xs flex items-center gap-1.5">
                                  <span>Turno PM (Tarde)</span>
                                  <span className="text-[10px] font-normal opacity-90 font-mono">
                                    15:00 a 23:00 (8h)
                                  </span>
                                </span>
                                <span className="text-[10px] bg-amber-700/80 px-1.5 py-0.5 rounded font-mono">
                                  1 Imp + {routerCount} Router
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] opacity-95 truncate">
                                <span>{assignedWorkers.map((w) => w.name.split(' ')[0]).join(', ')}</span>
                              </div>
                            </div>

                            {/* Salida Transfer: 23:00 to 24.0 (23:00 a 00:00) */}
                            <div
                              className="absolute top-2 h-7 rounded border border-dashed border-amber-400 bg-amber-50/90 text-amber-900 text-[11px] font-medium flex items-center px-2 gap-1.5 shadow-2xs z-20 overflow-hidden"
                              style={{
                                left: `${toPercent(23.0)}%`,
                                width: `${toPercent(24.0) - toPercent(23.0)}%`,
                              }}
                              title="Traslado Salida: Planta → Domicilio (23:00 a 00:00)"
                            >
                              <Building2 className="w-3 h-3 text-amber-700 shrink-0" />
                              <span className="truncate text-[10px] leading-tight">
                                Salida: Planta → Domicilio
                              </span>
                            </div>
                          </>
                        )}

                        {/* Rendering for NOCHE (23:00 to 07:00 next day) */}
                        {shiftId === 'NOCHE' && (
                          <>
                            {/* Next Morning Salida Transfer (empalme): 07:00 to 07:45 */}
                            <div
                              className="absolute top-2 h-7 rounded border border-dashed border-indigo-400 bg-indigo-50/90 text-indigo-950 text-[11px] font-medium flex items-center px-1.5 gap-1 shadow-2xs z-20 overflow-hidden"
                              style={{
                                left: `${toPercent(7.0)}%`,
                                width: `${toPercent(7.75) - toPercent(7.0)}%`,
                              }}
                              title="Traslado Salida Fin de Turno Noche: Planta → Metro (07:00 a 07:45)"
                            >
                              <Train className="w-3 h-3 text-indigo-700 shrink-0" />
                              <span className="truncate text-[9px] leading-tight">
                                Salida Noche: Planta → Metro
                              </span>
                            </div>

                            {/* Part 1 (Morning end of night shift): 00:00 to 07:00 (7h) */}
                            <div
                              className="absolute top-2 bottom-2 rounded-r-md bg-indigo-900 text-white p-2 flex flex-col justify-between shadow-xs z-10 cursor-pointer hover:brightness-110 transition-all border-l-2 border-indigo-400"
                              style={{
                                left: `0%`,
                                width: `${toPercent(7.0)}%`,
                              }}
                              onClick={() => setActiveShiftDetail(shiftId)}
                              title="Turno Noche continuación (00:00 a 07:00)"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[11px]">
                                  Noche (Hasta 07:00)
                                </span>
                              </div>
                              <span className="text-[10px] opacity-80 truncate">
                                Salida a las 07:00
                              </span>
                            </div>

                            {/* Entrada Transfer: 22:00 to 23:00 (22.0 to 23.0) */}
                            <div
                              className="absolute top-2 h-7 rounded border border-dashed border-indigo-400 bg-indigo-50/90 text-indigo-950 text-[11px] font-medium flex items-center px-1.5 gap-1 shadow-2xs z-20 overflow-hidden"
                              style={{
                                left: `${toPercent(22.0)}%`,
                                width: `${toPercent(23.0) - toPercent(22.0)}%`,
                              }}
                              title="Traslado Entrada Turno Noche: Domicilio → Planta (22:00 a 23:00)"
                            >
                              <Home className="w-3 h-3 text-indigo-700 shrink-0" />
                              <span className="truncate text-[9px] leading-tight">
                                Entrada Noche: Dom → Planta
                              </span>
                            </div>

                            {/* Part 2 (Night start): 23:00 to 24:00 (1h) */}
                            <div
                              className="absolute top-2 bottom-2 rounded-l-md bg-indigo-900 text-white p-2 flex flex-col justify-between shadow-xs z-10 cursor-pointer hover:brightness-110 transition-all border-r-2 border-indigo-400"
                              style={{
                                left: `${toPercent(23.0)}%`,
                                width: `${toPercent(24.0) - toPercent(23.0)}%`,
                              }}
                              onClick={() => setActiveShiftDetail(shiftId)}
                              title="Turno Noche inicio (23:00 a 24:00)"
                            >
                              <span className="font-bold text-[11px] truncate">
                                Noche (23:00 →)
                              </span>
                              <span className="text-[10px] opacity-80 truncate">
                                Empalma al día sgte.
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* View Mode 2: By Worker */}
            {viewMode === 'by-worker' && (
              <div className="space-y-3 relative z-10">
                {workers.map((worker) => {
                  // Find which shift this worker belongs to
                  let assignedShiftId: ShiftId | null = null;
                  for (const s of shiftsList) {
                    if (currentWeek.assignments[s]?.includes(worker.id)) {
                      assignedShiftId = s;
                      break;
                    }
                  }

                  const def = assignedShiftId ? SHIFT_DEFINITIONS[assignedShiftId] : null;

                  return (
                    <div
                      key={worker.id}
                      className="grid grid-cols-[220px_1fr] items-center gap-4 py-1.5 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 rounded-lg p-1.5"
                    >
                      {/* Left: Worker info */}
                      <div className="pr-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-slate-900 truncate">
                            {worker.name}
                          </span>
                          <RoleBadge role={worker.role} size="sm" />
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                          <span>
                            {def ? def.name : 'Sin turno asignado'}
                          </span>
                          {def && (
                            <span className="font-mono text-[10px]">
                              {def.startTime} - {def.endTime}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Worker Bar */}
                      <div className="relative h-11 bg-slate-50/60 rounded border border-slate-200/60 flex items-center px-1">
                        {!assignedShiftId && (
                          <div className="text-xs text-slate-400 italic pl-3">
                            Disponible / Sin asignación
                          </div>
                        )}

                        {assignedShiftId === 'AM' && (
                          <>
                            {/* Entrada */}
                            <div
                              className="absolute h-6 rounded border border-dashed border-blue-400 bg-blue-50 text-blue-900 text-[10px] flex items-center px-1 gap-1"
                              style={{
                                left: `${toPercent(5.75)}%`,
                                width: `${toPercent(7.0) - toPercent(5.75)}%`,
                              }}
                              title="Traslado: Domicilio → Planta"
                            >
                              <Home className="w-2.5 h-2.5" />
                              <span className="truncate">Dom→Pta</span>
                            </div>
                            {/* Work */}
                            <div
                              className="absolute h-8 rounded bg-blue-600 text-white px-2 flex items-center justify-between text-xs font-semibold shadow-2xs"
                              style={{
                                left: `${toPercent(7.0)}%`,
                                width: `${toPercent(15.0) - toPercent(7.0)}%`,
                              }}
                            >
                              <span>Turno AM (07:00 a 15:00)</span>
                              <span className="text-[10px] font-mono opacity-80">8 hrs</span>
                            </div>
                            {/* Salida */}
                            <div
                              className="absolute h-6 rounded border border-dashed border-blue-400 bg-blue-50 text-blue-900 text-[10px] flex items-center px-1 gap-1"
                              style={{
                                left: `${toPercent(15.0)}%`,
                                width: `${toPercent(15.75) - toPercent(15.0)}%`,
                              }}
                              title="Traslado: Planta → Metro"
                            >
                              <Train className="w-2.5 h-2.5" />
                              <span className="truncate">Pta→Metro</span>
                            </div>
                          </>
                        )}

                        {assignedShiftId === 'NORMAL' && (
                          <div
                            className="absolute h-8 rounded bg-emerald-600 text-white px-2 flex items-center justify-between text-xs font-semibold shadow-2xs"
                            style={{
                              left: `${toPercent(8.75)}%`,
                              width: `${toPercent(18.0) - toPercent(8.75)}%`,
                            }}
                          >
                            <span>Horario Normal (08:45 a 18:00)</span>
                            <span className="text-[10px] font-mono opacity-80">Sin traslado</span>
                          </div>
                        )}

                        {assignedShiftId === 'PM' && (
                          <>
                            {/* Entrada */}
                            <div
                              className="absolute h-6 rounded border border-dashed border-amber-400 bg-amber-50 text-amber-900 text-[10px] flex items-center px-1 gap-1"
                              style={{
                                left: `${toPercent(14.25)}%`,
                                width: `${toPercent(15.0) - toPercent(14.25)}%`,
                              }}
                              title="Traslado: Metro → Planta"
                            >
                              <Train className="w-2.5 h-2.5" />
                              <span className="truncate">Metro→Pta</span>
                            </div>
                            {/* Work */}
                            <div
                              className="absolute h-8 rounded bg-amber-600 text-white px-2 flex items-center justify-between text-xs font-semibold shadow-2xs"
                              style={{
                                left: `${toPercent(15.0)}%`,
                                width: `${toPercent(23.0) - toPercent(15.0)}%`,
                              }}
                            >
                              <span>Turno PM (15:00 a 23:00)</span>
                              <span className="text-[10px] font-mono opacity-80">8 hrs</span>
                            </div>
                            {/* Salida */}
                            <div
                              className="absolute h-6 rounded border border-dashed border-amber-400 bg-amber-50 text-amber-900 text-[10px] flex items-center px-1 gap-1"
                              style={{
                                left: `${toPercent(23.0)}%`,
                                width: `${toPercent(24.0) - toPercent(23.0)}%`,
                              }}
                              title="Traslado: Planta → Domicilio"
                            >
                              <Building2 className="w-2.5 h-2.5" />
                              <span className="truncate">Pta→Dom</span>
                            </div>
                          </>
                        )}

                        {assignedShiftId === 'NOCHE' && (
                          <>
                            {/* Morning part */}
                            <div
                              className="absolute h-8 rounded-r bg-indigo-900 text-white px-2 flex items-center justify-between text-xs font-semibold border-l border-indigo-400"
                              style={{
                                left: `0%`,
                                width: `${toPercent(7.0)}%`,
                              }}
                            >
                              <span>Noche (00:00 - 07:00)</span>
                            </div>
                            {/* Morning Salida */}
                            <div
                              className="absolute h-6 rounded border border-dashed border-indigo-400 bg-indigo-50 text-indigo-950 text-[10px] flex items-center px-1 gap-1"
                              style={{
                                left: `${toPercent(7.0)}%`,
                                width: `${toPercent(7.75) - toPercent(7.0)}%`,
                              }}
                            >
                              <Train className="w-2.5 h-2.5" />
                              <span className="truncate">Pta→Metro</span>
                            </div>
                            {/* Entrada Night */}
                            <div
                              className="absolute h-6 rounded border border-dashed border-indigo-400 bg-indigo-50 text-indigo-950 text-[10px] flex items-center px-1 gap-1"
                              style={{
                                left: `${toPercent(22.0)}%`,
                                width: `${toPercent(23.0) - toPercent(22.0)}%`,
                              }}
                            >
                              <Home className="w-2.5 h-2.5" />
                              <span className="truncate">Dom→Pta</span>
                            </div>
                            {/* Night Start */}
                            <div
                              className="absolute h-8 rounded-l bg-indigo-900 text-white px-2 flex items-center justify-between text-xs font-semibold border-r border-indigo-400"
                              style={{
                                left: `${toPercent(23.0)}%`,
                                width: `${toPercent(24.0) - toPercent(23.0)}%`,
                              }}
                            >
                              <span>Noche (23:00 - 24:00)</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions & details banner */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Regla de Planta:</strong> Cada turno se compone de 1 Impresión y 2 Router (en Turno PM puede ser 1 Router).
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTransfers}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-slate-500" />
              Ver Nómina de Traslados
            </button>
            <button
              onClick={onOpenTeamEditor}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              Configurar Equipos
            </button>
          </div>
        </div>
      </div>

      {/* Detail Cards for the 4 Shifts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {shiftsList.map((shiftId) => {
          const def = SHIFT_DEFINITIONS[shiftId];
          const workerIds = currentWeek.assignments[shiftId] || [];
          const assigned = workerIds.map(getWorker).filter((w): w is Worker => Boolean(w));
          const impWorkers = assigned.filter((w) => w.role === 'IMPRESION');
          const routerWorkers = assigned.filter((w) => w.role === 'ROUTER');

          return (
            <div
              key={shiftId}
              className={`bg-white rounded-xl border p-4 shadow-xs transition-all ${
                activeShiftDetail === shiftId
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        shiftId === 'AM'
                          ? 'bg-blue-600'
                          : shiftId === 'PM'
                          ? 'bg-amber-600'
                          : shiftId === 'NOCHE'
                          ? 'bg-indigo-900'
                          : 'bg-emerald-600'
                      }`}
                    />
                    {def.name}
                  </h3>
                  <p className="font-mono text-xs text-slate-600 font-medium">
                    {def.startTime} a {def.endTime}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {assigned.length} Operarios
                </span>
              </div>

              {/* Transfers explicitly separated */}
              <div className="my-3 space-y-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                <div className="font-semibold text-slate-700 flex items-center gap-1 mb-1">
                  <Truck className="w-3 h-3 text-slate-500" />
                  <span>Traslados Programados:</span>
                </div>
                <div className="flex items-start justify-between text-slate-600">
                  <span className="text-slate-500">Entrada:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {def.entryTransfer.label}
                  </span>
                </div>
                <div className="flex items-start justify-between text-slate-600">
                  <span className="text-slate-500">Salida:</span>
                  <span className="font-medium text-slate-800 text-right">
                    {def.exitTransfer.label}
                  </span>
                </div>
              </div>

              {/* Crew breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Dotación:</span>
                  <span className="text-[11px] text-slate-500">{def.rules.ruleDescription}</span>
                </div>

                <div className="space-y-1">
                  {assigned.map((w) => (
                    <div
                      key={w.id}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-50/80 border border-slate-100"
                    >
                      <span className="font-medium text-slate-900">{w.name}</span>
                      <RoleBadge role={w.role} size="sm" />
                    </div>
                  ))}
                  {assigned.length === 0 && (
                    <div className="text-xs text-amber-700 italic py-1">
                      Sin personal asignado
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
