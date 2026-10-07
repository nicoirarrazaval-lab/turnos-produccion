import { Worker, ShiftDefinition, WeekPlan } from '../types';

export const INITIAL_WORKERS: Worker[] = [
  { id: 'w1', name: 'Ezequiel Navarrete', role: 'ROUTER' },
  { id: 'w2', name: 'Alexander Galaz', role: 'ROUTER' },
  { id: 'w3', name: 'Camilo Inoztroza', role: 'ROUTER' },
  { id: 'w4', name: 'Edgardo Muñoz', role: 'IMPRESION' },
  { id: 'w5', name: 'Edinson Silva', role: 'IMPRESION' },
  { id: 'w6', name: 'Segundo Cuevas', role: 'IMPRESION' },
  { id: 'w7', name: 'Carlos Gonzalez', role: 'ROUTER' },
  { id: 'w8', name: 'Ricardo Muñoz', role: 'ROUTER' },
  { id: 'w9', name: 'Lennart Muñoz', role: 'IMPRESION' },
];

export const SHIFT_DEFINITIONS: Record<string, ShiftDefinition> = {
  AM: {
    id: 'AM',
    name: 'Turno AM',
    code: 'AM',
    startTime: '07:00',
    endTime: '15:00',
    startHourDecimal: 7.0,
    endHourDecimal: 15.0,
    spansNextDay: false,
    entryTransfer: {
      type: 'DOMICILIO_PLANTA',
      label: 'Domicilio → Planta',
      origin: 'Domicilio',
      destination: 'Planta',
      estimatedWindow: '05:45 - 06:50',
    },
    exitTransfer: {
      type: 'PLANTA_METRO',
      label: 'Planta → Metro',
      origin: 'Planta',
      destination: 'Estación Metro',
      estimatedWindow: '15:10 - 15:40',
    },
    color: {
      bg: 'bg-blue-600',
      border: 'border-blue-500',
      text: 'text-blue-700',
      badge: 'bg-blue-50 text-blue-800 border-blue-200',
      light: 'bg-blue-50',
      accent: '#2563eb',
    },
    rules: {
      requiredImpresion: 1,
      minRouter: 2,
      maxRouter: 2,
      ruleDescription: '1 Impresión + 2 Router',
    },
  },
  PM: {
    id: 'PM',
    name: 'Turno PM (Tarde)',
    code: 'PM',
    startTime: '15:00',
    endTime: '23:00',
    startHourDecimal: 15.0,
    endHourDecimal: 23.0,
    spansNextDay: false,
    entryTransfer: {
      type: 'METRO_PLANTA',
      label: 'Metro → Planta',
      origin: 'Estación Metro',
      destination: 'Planta',
      estimatedWindow: '14:15 - 14:45',
    },
    exitTransfer: {
      type: 'PLANTA_DOMICILIO',
      label: 'Planta → Domicilio',
      origin: 'Planta',
      destination: 'Domicilio',
      estimatedWindow: '23:15 - 00:30',
    },
    color: {
      bg: 'bg-amber-600',
      border: 'border-amber-500',
      text: 'text-amber-800',
      badge: 'bg-amber-50 text-amber-900 border-amber-200',
      light: 'bg-amber-50',
      accent: '#d97706',
    },
    rules: {
      requiredImpresion: 1,
      minRouter: 1,
      maxRouter: 2,
      ruleDescription: '1 Impresión + 1 o 2 Router',
    },
  },
  NOCHE: {
    id: 'NOCHE',
    name: 'Turno NOCHE',
    code: 'NOCHE',
    startTime: '23:00',
    endTime: '07:00 (+1)',
    startHourDecimal: 23.0,
    endHourDecimal: 7.0,
    spansNextDay: true,
    entryTransfer: {
      type: 'DOMICILIO_PLANTA',
      label: 'Domicilio → Planta',
      origin: 'Domicilio',
      destination: 'Planta',
      estimatedWindow: '21:45 - 22:45',
    },
    exitTransfer: {
      type: 'PLANTA_METRO',
      label: 'Planta → Metro',
      origin: 'Planta',
      destination: 'Estación Metro',
      estimatedWindow: '07:10 - 07:45',
    },
    color: {
      bg: 'bg-indigo-900',
      border: 'border-indigo-800',
      text: 'text-indigo-900',
      badge: 'bg-indigo-50 text-indigo-950 border-indigo-200',
      light: 'bg-indigo-50',
      accent: '#312e81',
    },
    rules: {
      requiredImpresion: 1,
      minRouter: 2,
      maxRouter: 2,
      ruleDescription: '1 Impresión + 2 Router',
    },
  },
  NORMAL: {
    id: 'NORMAL',
    name: 'Horario NORMAL',
    code: 'NORMAL',
    startTime: '08:45',
    endTime: '18:00',
    startHourDecimal: 8.75,
    endHourDecimal: 18.0,
    spansNextDay: false,
    entryTransfer: {
      type: 'SIN_TRASLADO',
      label: 'Sin traslado',
      origin: 'N/A',
      destination: 'N/A',
      estimatedWindow: 'Por cuenta propia',
    },
    exitTransfer: {
      type: 'SIN_TRASLADO',
      label: 'Sin traslado',
      origin: 'N/A',
      destination: 'N/A',
      estimatedWindow: 'Por cuenta propia',
    },
    color: {
      bg: 'bg-emerald-600',
      border: 'border-emerald-500',
      text: 'text-emerald-800',
      badge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      light: 'bg-emerald-50',
      accent: '#059669',
    },
    rules: {
      requiredImpresion: 0,
      minRouter: 0,
      maxRouter: 5,
      ruleDescription: 'Taller central de apoyo',
    },
  },
};

export const WEEK_DAYS: { id: string; name: string; short: string }[] = [
  { id: 'lunes', name: 'Lunes', short: 'Lun' },
  { id: 'martes', name: 'Martes', short: 'Mar' },
  { id: 'miercoles', name: 'Miércoles', short: 'Mié' },
  { id: 'jueves', name: 'Jueves', short: 'Jue' },
  { id: 'viernes', name: 'Viernes', short: 'Vie' },
];

/**
 * Default initial week schedule.
 * Exactly assigns all 9 workers compliant with:
 * - AM (3): 1 Impresión (Edgardo) + 2 Router (Ezequiel, Alexander)
 * - PM (2): 1 Impresión (Edinson) + 1 Router (Camilo)
 * - NOCHE (3): 1 Impresión (Segundo) + 2 Router (Carlos, Ricardo)
 * - NORMAL (1): 1 Impresión (Lennart)
 */
export const DEFAULT_CURRENT_WEEK: WeekPlan = {
  id: '2026-W41',
  weekNumber: 41,
  year: 2026,
  startDate: '2026-10-12',
  endDate: '2026-10-16',
  label: 'Semana 41 (12 - 16 Octubre 2026)',
  notes: 'Planificación estándar de producción Lunes a Viernes',
  assignments: {
    AM: ['w4', 'w1', 'w2'],       // Edgardo (IMP), Ezequiel (ROUTER), Alexander (ROUTER)
    PM: ['w5', 'w3'],             // Edinson (IMP), Camilo (ROUTER)
    NOCHE: ['w6', 'w7', 'w8'],    // Segundo (IMP), Carlos (ROUTER), Ricardo (ROUTER)
    NORMAL: ['w9'],               // Lennart (IMP)
  },
};

/**
 * Suggested rotated next week plan (e.g. operators advance one shift cycle)
 */
export const DEFAULT_NEXT_WEEK: WeekPlan = {
  id: '2026-W42',
  weekNumber: 42,
  year: 2026,
  startDate: '2026-10-19',
  endDate: '2026-10-23',
  label: 'Semana 42 (19 - 23 Octubre 2026)',
  notes: 'Rotación recomendada para balancear turnos nocturnos',
  assignments: {
    AM: ['w6', 'w7', 'w8'],       // Segundo (IMP), Carlos (ROUTER), Ricardo (ROUTER)
    PM: ['w4', 'w1'],             // Edgardo (IMP), Ezequiel (ROUTER)
    NOCHE: ['w9', 'w2', 'w3'],    // Lennart (IMP), Alexander (ROUTER), Camilo (ROUTER)
    NORMAL: ['w5'],               // Edinson (IMP)
  },
};
