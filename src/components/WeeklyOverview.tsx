import React from 'react';
import { Worker, WeekPlan, ShiftId } from '../types';
import { SHIFT_DEFINITIONS, WEEK_DAYS } from '../data/initialData';
import { RoleBadge } from './ShiftBadge';
import { Clock, Truck, ShieldCheck, CalendarCheck, Users } from 'lucide-react';

interface WeeklyOverviewProps {
  currentWeek: WeekPlan;
  workers: Worker[];
  onOpenTeamEditor: () => void;
}

export const WeeklyOverview: React.FC<WeeklyOverviewProps> = ({
  currentWeek,
  workers,
  onOpenTeamEditor,
}) => {
  const getWorker = (id: string) => workers.find((w) => w.id === id);
  const shiftsOrder: ShiftId[] = ['AM', 'NORMAL', 'PM', 'NOCHE'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
            <span>Matriz Semanal de Cobertura (Lunes a Viernes)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {currentWeek.label}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            El personal asignado a cada turno permanece estable de Lunes a Viernes durante la semana en curso.
          </p>
        </div>

        <button
          onClick={onOpenTeamEditor}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors self-start md:self-auto"
        >
          <Users className="w-3.5 h-3.5" />
          Ajustar Asignaciones Semanales
        </button>
      </div>

      {/* 5-Day Schedule Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {WEEK_DAYS.map((day, dayIndex) => (
          <div
            key={day.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col"
          >
            {/* Day Header */}
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 text-sm">{day.name}</span>
                <span className="text-[11px] text-slate-500 block">Día {dayIndex + 1} de 5</span>
              </div>
              <span className="text-[11px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                9 Operarios
              </span>
            </div>

            {/* Shift cards for this day */}
            <div className="p-3 space-y-3 flex-1 flex flex-col justify-between">
              {shiftsOrder.map((shiftId) => {
                const def = SHIFT_DEFINITIONS[shiftId];
                const workerIds = currentWeek.assignments[shiftId] || [];
                const assignedWorkers = workerIds
                  .map(getWorker)
                  .filter((w): w is Worker => Boolean(w));

                return (
                  <div
                    key={shiftId}
                    className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
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
                        {def.code}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 font-semibold">
                        {def.startTime} - {def.endTime}
                      </span>
                    </div>

                    <div className="space-y-1 mt-1.5">
                      {assignedWorkers.map((w) => (
                        <div
                          key={w.id}
                          className="flex items-center justify-between text-[11px] bg-white px-1.5 py-0.5 rounded border border-slate-200/60"
                        >
                          <span className="font-medium text-slate-800 truncate mr-1">
                            {w.name}
                          </span>
                          <RoleBadge role={w.role} size="sm" />
                        </div>
                      ))}
                    </div>

                    {/* Transfers summary */}
                    <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-500">
                      <div className="truncate">
                        <span className="font-semibold text-slate-600">Entrada:</span>{' '}
                        {def.entryTransfer.label}
                      </div>
                      <div className="truncate">
                        <span className="font-semibold text-slate-600">Salida:</span>{' '}
                        {def.exitTransfer.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Stability Guarantee Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-sm text-blue-950 mb-0.5">
            Continuidad de Equipo Semanal Garantizada
          </h4>
          <p className="text-blue-800 leading-relaxed">
            De acuerdo con los requerimientos operativos de la planta, los equipos de trabajo y traslados
            permanecen fijos de Lunes a Viernes durante la semana activa. Las modificaciones o rotaciones
            para la semana siguiente se configuran desde la pestaña <strong>Equipos y Reglas</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
