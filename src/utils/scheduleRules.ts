import { Worker, ShiftId, WeekPlan, ValidationStatus } from '../types';
import { SHIFT_DEFINITIONS } from '../data/initialData';

export function validateShiftAssignment(
  shiftId: ShiftId,
  workerIds: string[],
  allWorkers: Worker[]
): ValidationStatus {
  const shiftDef = SHIFT_DEFINITIONS[shiftId];
  const assigned = workerIds
    .map((id) => allWorkers.find((w) => w.id === id))
    .filter((w): w is Worker => Boolean(w));

  const impresionCount = assigned.filter((w) => w.role === 'IMPRESION').length;
  const routerCount = assigned.filter((w) => w.role === 'ROUTER').length;

  const messages: string[] = [];
  let isValid = true;

  if (shiftId === 'NORMAL') {
    return {
      isValid: true,
      impresionCount,
      routerCount,
      impresionDiff: 0,
      routerDiff: 0,
      messages: ['Horario general flexible sin restricción estricta de equipo.'],
    };
  }

  // Check Impresión
  if (impresionCount < shiftDef.rules.requiredImpresion) {
    isValid = false;
    messages.push(`Falta ${shiftDef.rules.requiredImpresion - impresionCount} Impresión.`);
  } else if (impresionCount > shiftDef.rules.requiredImpresion) {
    isValid = false;
    messages.push(`Excede el límite de 1 Impresión (tiene ${impresionCount}).`);
  }

  // Check Router
  if (routerCount < shiftDef.rules.minRouter) {
    isValid = false;
    messages.push(`Faltan ${shiftDef.rules.minRouter - routerCount} Router(s).`);
  } else if (routerCount > shiftDef.rules.maxRouter) {
    isValid = false;
    messages.push(`Excede el máximo de ${shiftDef.rules.maxRouter} Router(s) (tiene ${routerCount}).`);
  }

  if (isValid) {
    messages.push('Equipo completo cumple con la normativa.');
  }

  return {
    isValid,
    impresionCount,
    routerCount,
    impresionDiff: impresionCount - shiftDef.rules.requiredImpresion,
    routerDiff: routerCount - shiftDef.rules.minRouter,
    messages,
  };
}

export function validateWeekPlan(
  plan: WeekPlan,
  allWorkers: Worker[]
): {
  isFullyValid: boolean;
  unassignedWorkerIds: string[];
  duplicateWorkerIds: string[];
  shiftStatuses: Record<ShiftId, ValidationStatus>;
} {
  const assignedMap = new Map<string, number>();

  (Object.keys(plan.assignments) as ShiftId[]).forEach((shiftId) => {
    (plan.assignments[shiftId] || []).forEach((wId) => {
      assignedMap.set(wId, (assignedMap.get(wId) || 0) + 1);
    });
  });

  const duplicateWorkerIds = Array.from(assignedMap.entries())
    .filter(([_, count]) => count > 1)
    .map(([id]) => id);

  const unassignedWorkerIds = allWorkers
    .filter((w) => !assignedMap.has(w.id))
    .map((w) => w.id);

  const shiftStatuses = {
    AM: validateShiftAssignment('AM', plan.assignments.AM || [], allWorkers),
    PM: validateShiftAssignment('PM', plan.assignments.PM || [], allWorkers),
    NOCHE: validateShiftAssignment('NOCHE', plan.assignments.NOCHE || [], allWorkers),
    NORMAL: validateShiftAssignment('NORMAL', plan.assignments.NORMAL || [], allWorkers),
  };

  const isFullyValid =
    duplicateWorkerIds.length === 0 &&
    shiftStatuses.AM.isValid &&
    shiftStatuses.PM.isValid &&
    shiftStatuses.NOCHE.isValid;

  return {
    isFullyValid,
    unassignedWorkerIds,
    duplicateWorkerIds,
    shiftStatuses,
  };
}

/**
 * Generate a smart rotation for the following week:
 * Impresiones rotate: AM -> PM -> NOCHE -> NORMAL -> AM
 * Routers rotate: AM -> PM -> NOCHE -> AM (with 1 in PM, 2 in AM, 2 in NOCHE)
 */
export function generateSmartRotation(
  currentPlan: WeekPlan,
  allWorkers: Worker[],
  newWeekNumber: number,
  newYear: number,
  newStartDate: string,
  newEndDate: string,
  newLabel: string
): WeekPlan {
  const currentAssigned = currentPlan.assignments;

  // Group workers by role
  const impresores = allWorkers.filter((w) => w.role === 'IMPRESION');
  const routers = allWorkers.filter((w) => w.role === 'ROUTER');

  // Find where each currently is
  const findShift = (id: string): ShiftId => {
    for (const s of ['AM', 'PM', 'NOCHE', 'NORMAL'] as ShiftId[]) {
      if (currentAssigned[s]?.includes(id)) return s;
    }
    return 'NORMAL';
  };

  // Rotation cycle for Impresion: AM -> PM -> NOCHE -> NORMAL -> AM
  const impOrder: ShiftId[] = ['AM', 'PM', 'NOCHE', 'NORMAL'];
  const nextImpAssignment: Record<ShiftId, string[]> = {
    AM: [],
    PM: [],
    NOCHE: [],
    NORMAL: [],
  };

  impresores.forEach((imp) => {
    const curr = findShift(imp.id);
    const currIdx = impOrder.indexOf(curr);
    const nextShift = currIdx === -1 ? 'AM' : impOrder[(currIdx + 1) % impOrder.length];
    nextImpAssignment[nextShift].push(imp.id);
  });

  // Balance Routers: We need AM: 2, PM: 1, NOCHE: 2 (Total 5)
  // Let's rotate routers cyclically among [AM, AM, PM, NOCHE, NOCHE]
  const currentRouterList = [...routers];
  // Sort according to current shift order: AM first, PM second, NOCHE third, NORMAL fourth
  currentRouterList.sort((a, b) => {
    const sa = findShift(a.id);
    const sb = findShift(b.id);
    const rank: Record<ShiftId, number> = { AM: 0, PM: 1, NOCHE: 2, NORMAL: 3 };
    return rank[sa] - rank[sb];
  });

  // Shift router list by 1 or 2 slots to advance
  const rotatedRouters = [
    ...currentRouterList.slice(2),
    ...currentRouterList.slice(0, 2),
  ];

  const nextRouterAssignment: Record<ShiftId, string[]> = {
    AM: [rotatedRouters[0]?.id, rotatedRouters[1]?.id].filter(Boolean),
    PM: [rotatedRouters[2]?.id].filter(Boolean),
    NOCHE: [rotatedRouters[3]?.id, rotatedRouters[4]?.id].filter(Boolean),
    NORMAL: [],
  };

  return {
    id: `${newYear}-W${String(newWeekNumber).padStart(2, '0')}`,
    weekNumber: newWeekNumber,
    year: newYear,
    startDate: newStartDate,
    endDate: newEndDate,
    label: newLabel,
    notes: `Rotación equitativa generada a partir de la ${currentPlan.label}`,
    assignments: {
      AM: [...nextImpAssignment.AM, ...nextRouterAssignment.AM],
      PM: [...nextImpAssignment.PM, ...nextRouterAssignment.PM],
      NOCHE: [...nextImpAssignment.NOCHE, ...nextRouterAssignment.NOCHE],
      NORMAL: [...nextImpAssignment.NORMAL, ...nextRouterAssignment.NORMAL],
    },
  };
}
