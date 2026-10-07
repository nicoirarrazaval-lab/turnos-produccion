import React, { useState } from 'react';
import { Worker, WeekPlan, ShiftId } from '../types';
import { SHIFT_DEFINITIONS } from '../data/initialData';
import { RoleBadge } from './ShiftBadge';
import {
  Truck,
  Copy,
  Check,
  MapPin,
  Clock,
  ArrowRight,
  Home,
  Train,
  Building2,
  Users,
  ShieldCheck,
  Send
} from 'lucide-react';

interface TransfersLogisticsProps {
  currentWeek: WeekPlan;
  workers: Worker[];
}

export const TransfersLogistics: React.FC<TransfersLogisticsProps> = ({
  currentWeek,
  workers,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const getWorker = (id: string) => workers.find((w) => w.id === id);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Build the list of transfers
  const amWorkers = (currentWeek.assignments.AM || []).map(getWorker).filter((w): w is Worker => Boolean(w));
  const pmWorkers = (currentWeek.assignments.PM || []).map(getWorker).filter((w): w is Worker => Boolean(w));
  const nocheWorkers = (currentWeek.assignments.NOCHE || []).map(getWorker).filter((w): w is Worker => Boolean(w));
  const normalWorkers = (currentWeek.assignments.NORMAL || []).map(getWorker).filter((w): w is Worker => Boolean(w));

  // WhatsApp formatted generator
  const generateWhatsAppFullReport = () => {
    let report = `🚐 *PROGRAMACIÓN DE TRASLADOS - ${currentWeek.label.toUpperCase()}*\n`;
    report += `📅 *Vigencia:* Lunes a Viernes (Semanal)\n\n`;

    report += `🟢 *1. ENTRADAS A PLANTA*\n`;
    report += `▪ *Turno AM (05:45 - 06:50)*\n   Ruta: Domicilio ➔ Planta\n   Pasajeros (${amWorkers.length}): ${amWorkers.map(w => `${w.name} (${w.role})`).join(', ')}\n\n`;
    report += `▪ *Turno PM (14:15 - 14:45)*\n   Ruta: Estación Metro ➔ Planta\n   Pasajeros (${pmWorkers.length}): ${pmWorkers.map(w => `${w.name} (${w.role})`).join(', ')}\n\n`;
    report += `▪ *Turno NOCHE (21:45 - 22:45)*\n   Ruta: Domicilio ➔ Planta\n   Pasajeros (${nocheWorkers.length}): ${nocheWorkers.map(w => `${w.name} (${w.role})`).join(', ')}\n\n`;

    report += `🔴 *2. SALIDAS DESDE PLANTA*\n`;
    report += `▪ *Turno AM (15:10 - 15:40)*\n   Ruta: Planta ➔ Estación Metro\n   Pasajeros (${amWorkers.length}): ${amWorkers.map(w => `${w.name} (${w.role})`).join(', ')}\n\n`;
    report += `▪ *Turno PM (23:15 - 00:30)*\n   Ruta: Planta ➔ Domicilio\n   Pasajeros (${pmWorkers.length}): ${pmWorkers.map(w => `${w.name} (${w.role})`).join(', ')}\n\n`;
    report += `▪ *Turno NOCHE (07:10 - 07:45 (+1))*\n   Ruta: Planta ➔ Estación Metro\n   Pasajeros (${nocheWorkers.length}): ${nocheWorkers.map(w => `${w.name} (${w.role})`).join(', ')}\n\n`;

    report += `ℹ️ *Horario Normal (08:45 - 18:00):* Sin traslado (${normalWorkers.map(w => w.name).join(', ') || 'N/A'})\n`;
    return report;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            <Truck className="w-4 h-4 text-amber-600" />
            <span>Coordinación de Móviles y Rutas de Transporte</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Logística Separada de Traslados (Entrada y Salida)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Control de rutas, puntos de recogida y retorno para choferes y personal de planta.
          </p>
        </div>

        <button
          onClick={() => copyToClipboard(generateWhatsAppFullReport(), 'full')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs self-start md:self-auto"
        >
          {copiedKey === 'full' ? (
            <>
              <Check className="w-4 h-4 text-emerald-200" />
              <span>¡Copiado al Portapapeles!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar Resumen para WhatsApp</span>
            </>
          )}
        </button>
      </div>

      {/* Grid: 2 Distinct Sections - Entradas & Salidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: TRASLADOS DE ENTRADA */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                1. Traslados de ENTRADA (Hacia Planta)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              3 Rutas Programadas
            </span>
          </div>

          {/* AM Entrada */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Turno AM · Pre-Turno
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-blue-600" />
                  <span>Domicilio → Planta</span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-slate-700 block">
                  05:45 - 06:50
                </span>
                <span className="text-[10px] text-slate-400">Entrada 07:00</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Recogida puerta a puerta en los domicilios del personal de Turno AM.
            </p>

            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Pasajeros a Bordo ({amWorkers.length}):</span>
                <span className="font-mono text-blue-700 text-[10px]">1 IMP + 2 ROUTER</span>
              </div>
              <div className="space-y-1">
                {amWorkers.map((w) => (
                  <div key={w.id} className="flex items-center justify-between text-xs bg-white p-1.5 rounded border border-slate-200/60">
                    <span className="font-medium text-slate-900">{w.name}</span>
                    <RoleBadge role={w.role} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PM Entrada */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Turno PM (Tarde) · Pre-Turno
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 flex items-center gap-1.5">
                  <Train className="w-4 h-4 text-amber-600" />
                  <span>Metro → Planta</span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-slate-700 block">
                  14:15 - 14:45
                </span>
                <span className="text-[10px] text-slate-400">Entrada 15:00</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Punto de encuentro en Estación de Metro para traslado en van hasta la planta.
            </p>

            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Pasajeros a Bordo ({pmWorkers.length}):</span>
                <span className="font-mono text-amber-700 text-[10px]">Turno Tarde</span>
              </div>
              <div className="space-y-1">
                {pmWorkers.map((w) => (
                  <div key={w.id} className="flex items-center justify-between text-xs bg-white p-1.5 rounded border border-slate-200/60">
                    <span className="font-medium text-slate-900">{w.name}</span>
                    <RoleBadge role={w.role} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NOCHE Entrada */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded">
                  Turno NOCHE · Pre-Turno
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 flex items-center gap-1.5">
                  <Home className="w-4 h-4 text-indigo-900" />
                  <span>Domicilio → Planta</span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-slate-700 block">
                  21:45 - 22:45
                </span>
                <span className="text-[10px] text-slate-400">Entrada 23:00</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Recogida nocturna a domicilio para ingreso de turno nocturno.
            </p>

            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Pasajeros a Bordo ({nocheWorkers.length}):</span>
                <span className="font-mono text-indigo-900 text-[10px]">1 IMP + 2 ROUTER</span>
              </div>
              <div className="space-y-1">
                {nocheWorkers.map((w) => (
                  <div key={w.id} className="flex items-center justify-between text-xs bg-white p-1.5 rounded border border-slate-200/60">
                    <span className="font-medium text-slate-900">{w.name}</span>
                    <RoleBadge role={w.role} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: TRASLADOS DE SALIDA */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <h3 className="font-bold text-slate-900 text-base">
                2. Traslados de SALIDA (Desde Planta)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-semibold">
              3 Rutas Programadas
            </span>
          </div>

          {/* AM Salida */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Turno AM · Post-Turno
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 flex items-center gap-1.5">
                  <Train className="w-4 h-4 text-blue-600" />
                  <span>Planta → Metro</span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-slate-700 block">
                  15:10 - 15:40
                </span>
                <span className="text-[10px] text-slate-400">Salida 15:00</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Móvil de retorno desde planta hacia la Estación de Metro más cercana.
            </p>

            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Pasajeros a Bordo ({amWorkers.length}):</span>
                <span className="font-mono text-blue-700 text-[10px]">Turno AM</span>
              </div>
              <div className="space-y-1">
                {amWorkers.map((w) => (
                  <div key={w.id} className="flex items-center justify-between text-xs bg-white p-1.5 rounded border border-slate-200/60">
                    <span className="font-medium text-slate-900">{w.name}</span>
                    <RoleBadge role={w.role} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PM Salida */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  Turno PM · Post-Turno
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Planta → Domicilio</span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-slate-700 block">
                  23:15 - 00:30
                </span>
                <span className="text-[10px] text-slate-400">Salida 23:00</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Retorno seguro nocturno directo a domicilio para los operadores que finalizan a las 23:00.
            </p>

            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Pasajeros a Bordo ({pmWorkers.length}):</span>
                <span className="font-mono text-amber-700 text-[10px]">Turno PM</span>
              </div>
              <div className="space-y-1">
                {pmWorkers.map((w) => (
                  <div key={w.id} className="flex items-center justify-between text-xs bg-white p-1.5 rounded border border-slate-200/60">
                    <span className="font-medium text-slate-900">{w.name}</span>
                    <RoleBadge role={w.role} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NOCHE Salida */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded">
                  Turno NOCHE · Post-Turno
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1 flex items-center gap-1.5">
                  <Train className="w-4 h-4 text-indigo-900" />
                  <span>Planta → Metro</span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-semibold text-slate-700 block">
                  07:10 - 07:45 (+1)
                </span>
                <span className="text-[10px] text-slate-400">Salida 07:00</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Traslado de la cuadrilla nocturna saliente desde planta hacia la estación de Metro en la mañana.
            </p>

            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
              <div className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center justify-between">
                <span>Pasajeros a Bordo ({nocheWorkers.length}):</span>
                <span className="font-mono text-indigo-900 text-[10px]">Turno Noche</span>
              </div>
              <div className="space-y-1">
                {nocheWorkers.map((w) => (
                  <div key={w.id} className="flex items-center justify-between text-xs bg-white p-1.5 rounded border border-slate-200/60">
                    <span className="font-medium text-slate-900">{w.name}</span>
                    <RoleBadge role={w.role} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horario Normal Note */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-950">
        <Building2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-bold text-sm text-emerald-900 mb-0.5">
            Horario NORMAL (08:45 a 18:00) · Sin Traslado
          </h4>
          <p className="text-emerald-800 leading-relaxed">
            El personal asignado a Horario Normal se moviliza por medios propios. No requiere asignación
            de móviles ni chofer.
            {normalWorkers.length > 0 && (
              <span className="block mt-1 font-semibold">
                Personal en Horario Normal: {normalWorkers.map((w) => w.name).join(', ')}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
