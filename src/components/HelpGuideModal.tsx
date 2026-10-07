import React from 'react';
import { X, Users, CalendarPlus, RotateCw, Truck, Sliders, Printer, CheckCircle2 } from 'lucide-react';

interface HelpGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToTeams: () => void;
  onGoToSettings: () => void;
}

export const HelpGuideModal: React.FC<HelpGuideModalProps> = ({
  isOpen,
  onClose,
  onGoToTeams,
  onGoToSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Guía Paso a Paso: ¿Cómo configurar los turnos y equipos?
              </h3>
              <p className="text-xs text-slate-500">
                Instrucciones claras para organizar al personal de producción semana a semana.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6 text-xs text-slate-700">
          {/* Step 1 */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 text-sm">
              1
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Configurar y Reasignar Equipos de la Semana</span>
              </h4>
              <p className="leading-relaxed">
                Ingresa a la pestaña <strong>Equipos y Reglas</strong>. En cada tarjeta de turno (AM, PM, NOCHE, NORMAL):
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>
                  Usa el menú <strong>"Mover a:"</strong> al lado de cada operario para cambiarlo de turno inmediatamente.
                </li>
                <li>
                  Si haces clic en el icono de papelera, el trabajador pasa a la bandeja de <strong>"Personal Disponible sin Asignar"</strong>.
                </li>
                <li>
                  Verifica el distintivo verde <strong>"Regla Cumplida"</strong>: cada turno debe tener <strong>1 Impresión + 2 Router</strong> (en Turno PM se acepta 1 Router).
                </li>
              </ul>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-sm">
              2
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <RotateCw className="w-4 h-4 text-amber-600" />
                <span>Planificar la Semana Siguiente</span>
              </h4>
              <p className="leading-relaxed">
                El sistema mantiene fijo al equipo durante toda la semana de Lunes a Viernes. Para programar la semana entrante, tienes dos opciones rápidas arriba en <strong>Equipos y Reglas</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Clonar a Siguiente Semana</strong>
                  <span>Copia los mismos equipos exactos si no habrá rotación para la nueva semana.</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <strong className="text-slate-900 block mb-1">Rotar Equipos Semana Siguiente</strong>
                  <span>Avanza los turnos de manera justa y equitativa (AM → PM → NOCHE → NORMAL) para rotar los turnos de noche.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-sm">
              3
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Personalizar Horarios y Rutas de Traslado</span>
              </h4>
              <p className="leading-relaxed">
                Haz clic en el botón <strong>"⚙️ Configurar Turnos"</strong> en la cabecera superior para editar:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Horas exactas de entrada y salida de cada turno (ej: cambiar 07:00 por 07:30).</li>
                <li>Puntos de origen y destino de traslados (ej: especificar estación de metro o dirección).</li>
                <li>Ventana horaria de recogida o retorno de los móviles.</li>
              </ul>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-900 font-bold flex items-center justify-center shrink-0 text-sm">
              4
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-900" />
                <span>Coordinar Móviles y Choferes (Traslados)</span>
              </h4>
              <p className="leading-relaxed">
                Ve a la pestaña <strong>Logística Traslados</strong>:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Observa por separado los traslados de <strong>Entrada</strong> y de <strong>Salida</strong>.</li>
                <li>
                  Haz clic en <strong>"Copiar Resumen para WhatsApp"</strong> para generar el mensaje listo para el grupo de choferes o jefatura.
                </li>
              </ul>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0 text-sm">
              5
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-slate-700" />
                <span>Imprimir Planilla para la Cartelera de Planta</span>
              </h4>
              <p className="leading-relaxed">
                Haz clic en el botón <strong>"Imprimir"</strong> en la parte superior para generar la hoja oficial con tabla de turnos, nómina de operadores y hoja de ruta para colgar en la pizarra de la planta.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onGoToSettings();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5" />
            Abrir Parámetros de Horarios
          </button>

          <button
            onClick={() => {
              onClose();
              onGoToTeams();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <Users className="w-3.5 h-3.5" />
            Ir a Configurar Equipos Ahora
          </button>
        </div>
      </div>
    </div>
  );
};
