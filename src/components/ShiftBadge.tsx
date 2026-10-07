import React from 'react';
import { ShiftId, WorkerRole } from '../types';
import { SHIFT_DEFINITIONS } from '../data/initialData';

export const RoleBadge: React.FC<{ role: WorkerRole; size?: 'sm' | 'md' }> = ({
  role,
  size = 'md',
}) => {
  const isRouter = role === 'ROUTER';
  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded ${
        size === 'sm' ? 'text-[11px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
      } ${
        isRouter
          ? 'bg-amber-100 text-amber-900 border border-amber-300'
          : 'bg-cyan-100 text-cyan-900 border border-cyan-300'
      }`}
    >
      {isRouter ? 'ROUTER' : 'IMPRESIÓN'}
    </span>
  );
};

export const ShiftTag: React.FC<{ shiftId: ShiftId; showHours?: boolean }> = ({
  shiftId,
  showHours = false,
}) => {
  const def = SHIFT_DEFINITIONS[shiftId];
  if (!def) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold border ${def.color.badge}`}
    >
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
      <span>{def.name}</span>
      {showHours && (
        <span className="font-mono text-[11px] opacity-80">
          ({def.startTime} - {def.endTime})
        </span>
      )}
    </span>
  );
};
