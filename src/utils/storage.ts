import { Worker, WeekPlan, ShiftDefinition } from '../types';
import { INITIAL_WORKERS, DEFAULT_CURRENT_WEEK, DEFAULT_NEXT_WEEK, SHIFT_DEFINITIONS } from '../data/initialData';

const WORKERS_KEY = 'prod_turnos_workers_v1';
const WEEKS_KEY = 'prod_turnos_weeks_v1';
const ACTIVE_WEEK_KEY = 'prod_turnos_active_week_v1';
const SHIFTS_KEY = 'prod_turnos_shifts_def_v1';

export function loadShiftDefinitions(): Record<string, ShiftDefinition> {
  try {
    const raw = localStorage.getItem(SHIFTS_KEY);
    if (!raw) {
      saveShiftDefinitions(SHIFT_DEFINITIONS);
      return SHIFT_DEFINITIONS;
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : SHIFT_DEFINITIONS;
  } catch (e) {
    console.error('Error loading shift definitions', e);
    return SHIFT_DEFINITIONS;
  }
}

export function saveShiftDefinitions(definitions: Record<string, ShiftDefinition>): void {
  try {
    localStorage.setItem(SHIFTS_KEY, JSON.stringify(definitions));
  } catch (e) {
    console.error('Error saving shift definitions', e);
  }
}

export function loadWorkers(): Worker[] {
  try {
    const raw = localStorage.getItem(WORKERS_KEY);
    if (!raw) {
      saveWorkers(INITIAL_WORKERS);
      return INITIAL_WORKERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_WORKERS;
  } catch (e) {
    console.error('Error loading workers from storage', e);
    return INITIAL_WORKERS;
  }
}

export function saveWorkers(workers: Worker[]): void {
  try {
    localStorage.setItem(WORKERS_KEY, JSON.stringify(workers));
  } catch (e) {
    console.error('Error saving workers to storage', e);
  }
}

export function loadWeeks(): WeekPlan[] {
  try {
    const raw = localStorage.getItem(WEEKS_KEY);
    if (!raw) {
      const initialWeeks = [DEFAULT_CURRENT_WEEK, DEFAULT_NEXT_WEEK];
      saveWeeks(initialWeeks);
      return initialWeeks;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_CURRENT_WEEK, DEFAULT_NEXT_WEEK];
  } catch (e) {
    console.error('Error loading weeks from storage', e);
    return [DEFAULT_CURRENT_WEEK, DEFAULT_NEXT_WEEK];
  }
}

export function saveWeeks(weeks: WeekPlan[]): void {
  try {
    localStorage.setItem(WEEKS_KEY, JSON.stringify(weeks));
  } catch (e) {
    console.error('Error saving weeks to storage', e);
  }
}

export function loadActiveWeekId(): string {
  try {
    const raw = localStorage.getItem(ACTIVE_WEEK_KEY);
    return raw || DEFAULT_CURRENT_WEEK.id;
  } catch (e) {
    return DEFAULT_CURRENT_WEEK.id;
  }
}

export function saveActiveWeekId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_WEEK_KEY, id);
  } catch (e) {
    console.error('Error saving active week id', e);
  }
}

export function resetToDefaults(): {
  workers: Worker[];
  weeks: WeekPlan[];
  activeWeekId: string;
  shiftDefinitions: Record<string, ShiftDefinition>;
} {
  const workers = INITIAL_WORKERS;
  const weeks = [DEFAULT_CURRENT_WEEK, DEFAULT_NEXT_WEEK];
  const activeWeekId = DEFAULT_CURRENT_WEEK.id;
  const shiftDefinitions = SHIFT_DEFINITIONS;
  saveWorkers(workers);
  saveWeeks(weeks);
  saveActiveWeekId(activeWeekId);
  saveShiftDefinitions(shiftDefinitions);
  return { workers, weeks, activeWeekId, shiftDefinitions };
}
