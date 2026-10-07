export type WorkerRole = 'ROUTER' | 'IMPRESION';

export interface Worker {
  id: string;
  name: string;
  role: WorkerRole;
  phone?: string;
  notes?: string;
}

export type ShiftId = 'AM' | 'PM' | 'NOCHE' | 'NORMAL';

export interface TransferRoute {
  type: 'DOMICILIO_PLANTA' | 'PLANTA_METRO' | 'METRO_PLANTA' | 'PLANTA_DOMICILIO' | 'SIN_TRASLADO';
  label: string;
  origin: string;
  destination: string;
  estimatedWindow: string; // e.g. "06:00 - 06:50"
}

export interface ShiftDefinition {
  id: ShiftId;
  name: string;
  code: string;
  startTime: string; // e.g. "07:00"
  endTime: string;   // e.g. "15:00"
  startHourDecimal: number; // 7
  endHourDecimal: number;   // 15
  spansNextDay?: boolean;   // true for NOCHE (23:00 to 07:00)
  entryTransfer: TransferRoute;
  exitTransfer: TransferRoute;
  color: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    light: string;
    accent: string;
  };
  rules: {
    requiredImpresion: number;
    minRouter: number;
    maxRouter: number;
    ruleDescription: string;
  };
}

export type DayOfWeek = 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes';

export interface ShiftAssignment {
  shiftId: ShiftId;
  workerIds: string[];
}

export interface WeekPlan {
  id: string; // e.g. "2026-W41"
  weekNumber: number;
  year: number;
  startDate: string; // ISO date of Monday, e.g. "2026-10-12"
  endDate: string;   // ISO date of Friday, e.g. "2026-10-16"
  label: string;     // e.g. "Semana 41 (12 - 16 Oct)"
  notes?: string;
  // Shifts are constant Monday to Friday for the week as required by prompt
  assignments: Record<ShiftId, string[]>; // shiftId -> list of workerIds
}

export interface ValidationStatus {
  isValid: boolean;
  impresionCount: number;
  routerCount: number;
  impresionDiff: number; // positive = excess, negative = missing
  routerDiff: number;
  messages: string[];
}
