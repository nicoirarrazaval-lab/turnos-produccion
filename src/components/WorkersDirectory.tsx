import React, { useState } from 'react';
import { Worker, WorkerRole, WeekPlan, ShiftId } from '../types';
import { SHIFT_DEFINITIONS } from '../data/initialData';
import { RoleBadge } from './ShiftBadge';
import { Users, UserPlus, Search, Phone, UserCheck, Shield } from 'lucide-react';

interface WorkersDirectoryProps {
  workers: Worker[];
  currentWeek: WeekPlan;
  nextWeek?: WeekPlan;
  onAddWorker: (worker: Worker) => void;
  onUpdateWorker: (worker: Worker) => void;
}

export const WorkersDirectory: React.FC<WorkersDirectoryProps> = ({
  workers,
  currentWeek,
  nextWeek,
  onAddWorker,
  onUpdateWorker,
}) => {
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'IMPRESION' | 'ROUTER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingWorker, setIsAddingWorker] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<WorkerRole>('ROUTER');

  const getWorkerShift = (workerId: string, plan: WeekPlan): ShiftId | null => {
    for (const s of ['AM', 'PM', 'NOCHE', 'NORMAL'] as ShiftId[]) {
      if (plan.assignments[s]?.includes(workerId)) {
        return s;
      }
    }
    return null;
  };

  const filteredWorkers = workers.filter((w) => {
    const matchesRole = roleFilter === 'ALL' || w.role === roleFilter;
    const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const impCount = workers.filter((w) => w.role === 'IMPRESION').length;
  const routerCount = workers.filter((w) => w.role === 'ROUTER').length;

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newWorker: Worker = {
      id: `w_${Date.now()}`,
      name: newName.trim(),
      role: newRole,
    };

    onAddWorker(newWorker);
    setNewName('');
    setIsAddingWorker(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Nómina de Personal de Producción</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Personal Disponible ({workers.length} Operarios)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Distribución de planta: {impCount} de Impresión y {routerCount} de Router.
          </p>
        </div>

        <button
          onClick={() => setIsAddingWorker(!isAddingWorker)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors self-start md:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{isAddingWorker ? 'Cancelar' : 'Agregar Operador'}</span>
        </button>
      </div>

      {/* Add Worker Form Modal/Accordion */}
      {isAddingWorker && (
        <form
          onSubmit={handleCreateWorker}
          className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-end gap-3 animate-fade-in text-xs"
        >
          <div className="flex-1 w-full">
            <label className="font-semibold text-slate-700 block mb-1">Nombre Completo:</label>
            <input
              type="text"
              required
              placeholder="Ej: Marcelo Rios"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-full sm:w-48">
            <label className="font-semibold text-slate-700 block mb-1">Especialidad / Rol:</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as WorkerRole)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-semibold"
            >
              <option value="ROUTER">ROUTER</option>
              <option value="IMPRESION">IMPRESIÓN</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Guardar
          </button>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              roleFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({workers.length})
          </button>
          <button
            onClick={() => setRoleFilter('IMPRESION')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              roleFilter === 'IMPRESION'
                ? 'bg-white text-cyan-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Impresión ({impCount})
          </button>
          <button
            onClick={() => setRoleFilter('ROUTER')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              roleFilter === 'ROUTER'
                ? 'bg-white text-amber-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Router ({routerCount})
          </button>
        </div>
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkers.map((worker) => {
          const currShift = getWorkerShift(worker.id, currentWeek);
          const nextShift = nextWeek ? getWorkerShift(worker.id, nextWeek) : null;
          const currDef = currShift ? SHIFT_DEFINITIONS[currShift] : null;
          const nextDef = nextShift ? SHIFT_DEFINITIONS[nextShift] : null;

          return (
            <div
              key={worker.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{worker.name}</h3>
                    <div className="mt-1">
                      <RoleBadge role={worker.role} size="md" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  {/* Current shift */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500">Turno Esta Semana:</span>
                    {currDef ? (
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            currShift === 'AM'
                              ? 'bg-blue-600'
                              : currShift === 'PM'
                              ? 'bg-amber-600'
                              : currShift === 'NOCHE'
                              ? 'bg-indigo-900'
                              : 'bg-emerald-600'
                          }`}
                        />
                        {currDef.name} ({currDef.startTime} - {currDef.endTime})
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Sin turno</span>
                    )}
                  </div>

                  {/* Next week shift (if available) */}
                  {nextWeek && (
                    <div className="bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between">
                      <span className="text-slate-500">Semana Siguiente:</span>
                      {nextDef ? (
                        <span className="font-semibold text-slate-700">
                          {nextDef.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Por definir</span>
                      )}
                    </div>
                  )}

                  {/* Transfer preview */}
                  {currDef && (
                    <div className="text-[11px] text-slate-600 pt-1">
                      <span className="font-medium text-slate-700">Traslado asignado: </span>
                      {currDef.entryTransfer.type === 'SIN_TRASLADO'
                        ? 'Sin traslado (Horario Normal)'
                        : `${currDef.entryTransfer.label} / ${currDef.exitTransfer.label}`}
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
