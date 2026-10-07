import React from 'react';
import { WeekPlan } from '../types';
import { Printer, Calendar, RefreshCcw, Sliders, HelpCircle } from 'lucide-react';

export type NavTab = 'gantt' | 'overview' | 'teams' | 'transfers' | 'workers';

interface HeaderProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  currentWeek: WeekPlan;
  allWeeks: WeekPlan[];
  onSelectWeek: (weekId: string) => void;
  onOpenPrint: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onResetDefaults: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  currentWeek,
  allWeeks,
  onSelectWeek,
  onOpenPrint,
  onOpenSettings,
  onOpenHelp,
  onResetDefaults,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onTabChange('gantt');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2 hover:opacity-90"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
            <span>Turnos Planta Industrial</span>
          </a>
        </div>

        {/* Zone 2: Clean Text Navigation Links (Single line) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <button
            onClick={() => onTabChange('gantt')}
            className={`transition-colors hover:text-slate-900 whitespace-nowrap pb-0.5 ${
              currentTab === 'gantt'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-600'
            }`}
          >
            Gantt Diario
          </button>

          <button
            onClick={() => onTabChange('overview')}
            className={`transition-colors hover:text-slate-900 whitespace-nowrap pb-0.5 ${
              currentTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-600'
            }`}
          >
            Matriz Semanal
          </button>

          <button
            onClick={() => onTabChange('teams')}
            className={`transition-colors hover:text-slate-900 whitespace-nowrap pb-0.5 ${
              currentTab === 'teams'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-600'
            }`}
          >
            Equipos y Reglas
          </button>

          <button
            onClick={() => onTabChange('transfers')}
            className={`transition-colors hover:text-slate-900 whitespace-nowrap pb-0.5 ${
              currentTab === 'transfers'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-600'
            }`}
          >
            Logística Traslados
          </button>

          <button
            onClick={() => onTabChange('workers')}
            className={`transition-colors hover:text-slate-900 whitespace-nowrap pb-0.5 ${
              currentTab === 'workers'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-600'
            }`}
          >
            Personal (9)
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Week Selector + Settings + Guide + Print) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Week Selector Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <select
              value={currentWeek.id}
              onChange={(e) => onSelectWeek(e.target.value)}
              className="text-xs font-semibold bg-transparent border-none text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {allWeeks.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.label}
                </option>
              ))}
            </select>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            title="Configurar horarios y parámetros de traslados"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Configurar</span>
          </button>

          {/* Help Guide Button */}
          <button
            onClick={onOpenHelp}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors whitespace-nowrap"
            title="Guía de ayuda paso a paso"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">¿Cómo configurar?</span>
          </button>

          {/* Print Button */}
          <button
            onClick={onOpenPrint}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
            title="Imprimir planilla de turnos"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Imprimir</span>
          </button>

          {/* Reset Defaults button */}
          <button
            onClick={onResetDefaults}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            title="Restablecer datos originales"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex items-center justify-between overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs font-semibold gap-3">
        <button
          onClick={() => onTabChange('gantt')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            currentTab === 'gantt' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-600'
          }`}
        >
          Gantt Diario
        </button>
        <button
          onClick={() => onTabChange('overview')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            currentTab === 'overview' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-600'
          }`}
        >
          Matriz Semanal
        </button>
        <button
          onClick={() => onTabChange('teams')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            currentTab === 'teams' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-600'
          }`}
        >
          Equipos
        </button>
        <button
          onClick={() => onTabChange('transfers')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            currentTab === 'transfers' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-600'
          }`}
        >
          Traslados
        </button>
        <button
          onClick={() => onTabChange('workers')}
          className={`whitespace-nowrap px-2 py-1 rounded ${
            currentTab === 'workers' ? 'bg-white shadow-2xs text-blue-600' : 'text-slate-600'
          }`}
        >
          Personal
        </button>
      </div>
    </header>
  );
};

