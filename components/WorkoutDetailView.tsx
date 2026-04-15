
import React, { memo, useState } from 'react';
import { Workout, Exercise, ViewState, Entry } from '../types';
import { ChevronLeftIcon, MoreIcon, EditIcon, TrashIcon, PlusIcon } from './Icons';
import { Button } from './Button';

interface WorkoutDetailViewProps {
  workoutId: string;
  workouts: Workout[];
  setView: (view: ViewState) => void;
  deleteExercise: (workoutId: string, exerciseId: string) => void;
  setRepoModal: (modal: any) => void;
  getLatestDate: (entries: any[]) => string | null;
  formatDateCompact: (date: string) => string;
  FeelingIndicator: React.FC<{ feeling?: Entry['feeling'] }>;
}

export const WorkoutDetailView = memo(({ workoutId, workouts, setView, deleteExercise, setRepoModal, getLatestDate, formatDateCompact, FeelingIndicator }: WorkoutDetailViewProps) => {
  const workout = (workouts || []).find((w: Workout) => w.id === workoutId);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (!workout) return <div className="p-10 text-center">Workout not found. <Button onClick={() => setView({type: 'workouts'})}>Go Back</Button></div>;

  return (
    <div className="max-w-md mx-auto min-h-screen pb-24 view-transition">
      <header className="px-6 py-8 flex items-center gap-4 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 border-b border-slate-100">
        <button onClick={() => setView({ type: 'workouts' })} className="p-2 -ml-2 text-slate-600 hover:bg-white rounded-full transition-colors"><ChevronLeftIcon /></button>
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">{workout.name}</h1>
      </header>
      <div className="px-6 py-4 space-y-3">
        {(workout.exercises || []).map((ex: Exercise) => {
          const lastEntry = (ex.entries || [])[0];
          const latestEntryDate = getLatestDate(ex.entries);
          const isAnchor = (ex.tags || []).some(t => t.toLowerCase() === 'anchor');
          return (
            <div 
              key={ex.id} 
              onClick={() => setView({ type: 'exercise-detail', workoutId, exerciseId: ex.id })} 
              className={`relative bg-white p-5 rounded-2xl border transition-all active:scale-[0.98] cursor-pointer ${isAnchor ? 'border-indigo-100 shadow-indigo-50 shadow-md' : 'border-slate-100 shadow-sm'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{ex.name}</h3>
                    {isAnchor && <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded tracking-wider shadow-sm">Anchor</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(ex.tags || []).filter(t => t.toLowerCase() !== 'anchor').map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-tight">{tag}</span>
                    ))}
                  </div>
                </div>
                
                <div className="relative">
                    <button 
                    onClick={(e) => { 
                        e.preventDefault();
                        e.stopPropagation(); 
                        setActiveMenu(activeMenu === ex.id ? null : ex.id);
                    }} 
                    className="p-3 -m-3 text-slate-400 hover:text-indigo-600 transition-colors z-[10]"
                    >
                        <MoreIcon />
                    </button>
                    {activeMenu === ex.id && (
                        <div className="absolute right-0 top-10 w-44 bg-white border border-slate-100 shadow-2xl rounded-2xl z-[500] py-1 overflow-hidden animate-in">
                             <button 
                                onClick={(e) => { 
                                    e.preventDefault();
                                    e.stopPropagation(); 
                                    setActiveMenu(null); 
                                    setRepoModal({ isOpen: true, workoutId, exerciseId: ex.id, name: ex.name, tags: ex.tags, notes: ex.notes, isEditingInstance: true, activeTab: 'new' }); 
                                }}
                                className="w-full text-left px-4 py-4 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                             >
                                <EditIcon /> Edit Exercise Info
                             </button>
                             <button 
                                onClick={(e) => { 
                                    e.preventDefault();
                                    e.stopPropagation(); 
                                    setActiveMenu(null); 
                                    deleteExercise(workoutId, ex.id); 
                                }}
                                className="w-full text-left px-4 py-4 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-50"
                             >
                                <TrashIcon /> Remove from Day
                             </button>
                        </div>
                    )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-50 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  {lastEntry ? (
                    <div className="flex items-baseline gap-2 text-sm">
                      <span className="font-bold text-slate-900">{lastEntry.sets}x{lastEntry.reps}</span>
                      <span className="text-slate-400 font-medium">at</span>
                      <span className="font-black text-indigo-600">{lastEntry.weight}kg</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-300 font-bold italic">No entries yet</div>
                  )}
                  <FeelingIndicator feeling={lastEntry?.feeling} />
                </div>
                
                {latestEntryDate && (
                  <div className="text-[9px] font-black text-slate-400 tracking-tight border border-slate-200 px-1.5 py-0.5 rounded-md bg-white uppercase">
                    LAST: {formatDateCompact(latestEntryDate)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <Button 
          variant="secondary" 
          fullWidth 
          onClick={() => setRepoModal({ isOpen: true, name: '', tags: [], notes: '', targetWorkoutId: workoutId, activeTab: 'new' })} 
          className="mt-6 border-dashed border-2 bg-transparent py-8 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200"
        >
          <PlusIcon /> <span className="ml-2 font-bold">Add Exercise</span>
        </Button>
      </div>
      {activeMenu && <div className="fixed inset-0 z-[450]" onClick={() => setActiveMenu(null)} />}
    </div>
  );
});
