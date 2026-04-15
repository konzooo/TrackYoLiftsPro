
import React, { memo } from 'react';
import { Workout, ViewState } from '../types';
import { ActivityIcon, PlusIcon, MenuIcon, TrashIcon, ChevronRightIcon } from './Icons';
import { Button } from './Button';

interface WorkoutsViewProps {
  workouts: Workout[];
  setView: (view: ViewState) => void;
  deleteWorkout: (id: string) => void;
  setIsAddingWorkout: (isAdding: boolean) => void;
  setMenuOpen: (isOpen: boolean) => void;
  formatDateCompact: (date: string) => string;
  getLatestDate: (entries: any[]) => string | null;
}

export const WorkoutsView = memo(({ workouts, setView, deleteWorkout, setIsAddingWorkout, setMenuOpen, formatDateCompact, getLatestDate }: WorkoutsViewProps) => {
  return (
    <div className="max-w-md mx-auto min-h-screen pb-24 view-transition">
      <header className="px-6 pt-12 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <ActivityIcon />
            </div>
            <span className="text-xl font-black tracking-tighter italic">
              <span className="text-indigo-600">Track</span>
              <span className="text-slate-900">YoLifts</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsAddingWorkout(true)}
              className="p-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all shadow-sm active:scale-90"
            >
              <PlusIcon />
            </button>
            <button 
              onClick={() => setMenuOpen(true)}
              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm active:scale-90"
            >
              <MenuIcon />
            </button>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Training Plan</h1>
        <p className="text-slate-500 mt-2 font-medium">Pick a day to start your workout</p>
      </header>
      <div className="px-6 space-y-4">
        {(workouts || []).map((w: Workout) => {
          const allEntries = w.exercises.flatMap(ex => ex.entries || []);
          const lastDate = getLatestDate(allEntries);

          return (
            <div 
              key={w.id} 
              onClick={() => setView({ type: 'workout-detail', workoutId: w.id })} 
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{w.name}</h3>
                <div className="flex items-center justify-between mt-1.5">
                    <p className="text-sm text-slate-400 font-bold">
                        {w.exercises?.length || 0} exercises
                    </p>
                    {lastDate && (
                    <p className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">
                        LAST: {formatDateCompact(lastDate)}
                    </p>
                    )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 border-l border-slate-50 pl-2 self-stretch">
                <button 
                  onClick={(e) => { e.stopPropagation(); if(window.confirm('Delete workout?')) deleteWorkout(w.id); }} 
                  className="p-1.5 text-slate-200 hover:text-rose-400 transition-colors"
                >
                  <TrashIcon />
                </button>
                <div className="text-indigo-300"><ChevronRightIcon /></div>
              </div>
            </div>
          );
        })}
        <Button 
          variant="secondary" 
          fullWidth 
          onClick={() => setIsAddingWorkout(true)} 
          className="mt-6 border-dashed border-2 bg-transparent py-8 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200"
        >
          <PlusIcon /> <span className="ml-2 font-bold">Create New Workout</span>
        </Button>
      </div>
    </div>
  );
});
