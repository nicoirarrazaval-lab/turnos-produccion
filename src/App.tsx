import React, { useState, useEffect } from 'react';
import { Worker, WeekPlan, ShiftId, ShiftDefinition } from './types';
import {
  loadWorkers,
  saveWorkers,
  loadWeeks,
  saveWeeks,
  loadActiveWeekId,
  saveActiveWeekId,
  loadShiftDefinitions,
  saveShiftDefinitions,
  resetToDefaults,
} from './utils/storage';
import { Header, NavTab } from './components/Header';
import { GanttView } from './components/GanttView';
import { WeeklyOverview } from './components/WeeklyOverview';
import { TeamManager } from './components/TeamManager';
import { TransfersLogistics } from './components/TransfersLogistics';
import { WorkersDirectory } from './components/WorkersDirectory';
import { PrintViewModal } from './components/PrintViewModal';
import { SettingsModal } from './components/SettingsModal';
import { HelpGuideModal } from './components/HelpGuideModal';
import {
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Users,
  Printer,
  ChevronRight,
  Truck
} from 'lucide-react';

export default function App() {
  const [workers, setWorkers] = useState<Worker[]>(() => loadWorkers());
  const [weeks, setWeeks] = useState<WeekPlan[]>(() => loadWeeks());
  const [activeWeekId, setActiveWeekId] = useState<string>(() => loadActiveWeekId());
  const [shiftDefinitions, setShiftDefinitions] = useState<Record<string, ShiftDefinition>>(() =>
    loadShiftDefinitions()
  );
  const [currentTab, setCurrentTab] = useState<NavTab>('gantt');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Sync to storage on state changes
  useEffect(() => {
    saveWorkers(workers);
  }, [workers]);

  useEffect(() => {
    saveWeeks(weeks);
  }, [weeks]);

  useEffect(() => {
    saveActiveWeekId(activeWeekId);
  }, [activeWeekId]);

  useEffect(() => {
    saveShiftDefinitions(shiftDefinitions);
  }, [shiftDefinitions]);

  // Find active week, fallback to first
  const currentWeek = weeks.find((w) => w.id === activeWeekId) || weeks[0];
  const nextWeekIndex = weeks.findIndex((w) => w.id === activeWeekId) + 1;
  const nextWeek = nextWeekIndex < weeks.length ? weeks[nextWeekIndex] : undefined;

  // Handlers
  const handleUpdateWeekAssignments = (
    weekId: string,
    assignments: Record<ShiftId, string[]>
  ) => {
    setWeeks((prev) =>
      prev.map((w) => (w.id === weekId ? { ...w, assignments } : w))
    );
  };

  const handleAddNextWeek = (newWeek: WeekPlan) => {
    setWeeks((prev) => {
      // Check if already exists by id
      const existingIdx = prev.findIndex((w) => w.id === newWeek.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newWeek;
        return copy;
      }
      return [...prev, newWeek];
    });
  };

  const handleAddWorker = (newWorker: Worker) => {
    setWorkers((prev) => [...prev, newWorker]);
  };

  const handleUpdateWorker = (updated: Worker) => {
    setWorkers((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  const handleSaveShiftDefinitions = (defs: Record<string, ShiftDefinition>) => {
    setShiftDefinitions(defs);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        '¿Desea restablecer todos los turnos, semanas y el personal a los valores originales predeterminados?'
      )
    ) {
      const reset = resetToDefaults();
      setWorkers(reset.workers);
      setWeeks(reset.weeks);
      setActiveWeekId(reset.activeWeekId);
      setShiftDefinitions(reset.shiftDefinitions);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans flex flex-col">
      {/* 3-Zone Header Contract */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        currentWeek={currentWeek}
        allWeeks={weeks}
        onSelectWeek={setActiveWeekId}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onResetDefaults={handleResetDefaults}
      />

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* Quick Context Strip */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-white px-4 py-2.5 rounded-lg border border-slate-200">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentWeek.label}</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Jornada: Lunes a Viernes</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Dotación: {workers.length} Operarios (4 Impresión · 5 Router)</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors"
            >
              Guía de Configuración
            </button>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded">
              Equipo Estable Semanal
            </span>
          </div>
        </div>

        {/* Dynamic Views */}
        {currentTab === 'gantt' && (
          <GanttView
            currentWeek={currentWeek}
            workers={workers}
            onOpenTeamEditor={() => setCurrentTab('teams')}
            onOpenTransfers={() => setCurrentTab('transfers')}
          />
        )}

        {currentTab === 'overview' && (
          <WeeklyOverview
            currentWeek={currentWeek}
            workers={workers}
            onOpenTeamEditor={() => setCurrentTab('teams')}
          />
        )}

        {currentTab === 'teams' && (
          <TeamManager
            currentWeek={currentWeek}
            allWeeks={weeks}
            workers={workers}
            onUpdateWeekAssignments={handleUpdateWeekAssignments}
            onAddNextWeek={handleAddNextWeek}
            onSetActiveWeek={setActiveWeekId}
          />
        )}

        {currentTab === 'transfers' && (
          <TransfersLogistics
            currentWeek={currentWeek}
            workers={workers}
          />
        )}

        {currentTab === 'workers' && (
          <WorkersDirectory
            workers={workers}
            currentWeek={currentWeek}
            nextWeek={nextWeek}
            onAddWorker={handleAddWorker}
            onUpdateWorker={handleUpdateWorker}
          />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            <span>Sistema de Planificación de Turnos de Planta · Lunes a Viernes</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="hover:text-blue-600 transition-colors"
            >
              ¿Cómo configurar?
            </button>
            <button
              onClick={() => setCurrentTab('transfers')}
              className="hover:text-slate-900 transition-colors"
            >
              Logística de Móviles
            </button>
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="hover:text-slate-900 transition-colors"
            >
              Imprimir Cartelera
            </button>
          </div>
        </div>
      </footer>

      {/* Print Modal */}
      <PrintViewModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        currentWeek={currentWeek}
        workers={workers}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        shiftDefinitions={shiftDefinitions}
        onSaveDefinitions={handleSaveShiftDefinitions}
      />

      {/* Help Guide Modal */}
      <HelpGuideModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onGoToTeams={() => setCurrentTab('teams')}
        onGoToSettings={() => setIsSettingsModalOpen(true)}
      />
    </div>
  );
}

