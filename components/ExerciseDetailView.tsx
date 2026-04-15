
import React, { memo, useState } from 'react';
import { Workout, Exercise, Entry, ViewState } from '../types';
import { ChevronLeftIcon, EditIcon, TrendingUpIcon, PlusIcon, CheckIcon, XIcon, MoreIcon, TrashIcon } from './Icons';
import { Button } from './Button';
import { Modal } from './Modal';

interface ExerciseDetailViewProps {
  workoutId: string;
  exerciseId: string;
  workouts: Workout[];
  setView: (view: ViewState) => void;
  commitEntry: (workoutId: string, exerciseId: string, entry: Entry) => void;
  deleteEntry: (workoutId: string, exerciseId: string, entryId: string) => void;
  updateEntry: (workoutId: string, exerciseId: string, updatedEntry: Entry) => void;
  setRepoModal: (modal: any) => void;
  formatDateCompact: (date: string) => string;
  FeelingIndicator: React.FC<{ feeling?: Entry['feeling'] }>;
  FeelingSelector: React.FC<{ value?: Entry['feeling'], onChange: (v: Entry['feeling']) => void }>;
}

export const ExerciseDetailView = memo(({ workoutId, exerciseId, workouts, setView, commitEntry, deleteEntry, updateEntry, setRepoModal, formatDateCompact, FeelingIndicator, FeelingSelector }: ExerciseDetailViewProps) => {
  const workout = (workouts || []).find((w: Workout) => w.id === workoutId);
  const exercise = workout?.exercises?.find((e: Exercise) => e.id === exerciseId);
  const [draft, setDraft] = useState<any>(null);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (!exercise) return <div className="p-10 text-center">Exercise not found. <Button onClick={() => setView({type: 'workout-detail', workoutId})}>Go Back</Button></div>;
  const lastEntry = (exercise.entries || [])[0];

  const handleSaveLog = () => {
    if (!draft) return;
    const entryToCommit = {
        ...draft,
        sets: parseInt(draft.sets || '0') || 0,
        reps: parseInt(draft.reps || '0') || 0,
        weight: parseFloat(draft.weight || '0') || 0,
        id: Date.now().toString()
    };
    commitEntry(workoutId, exerciseId, entryToCommit);
    setDraft(null);
  };

  const handleUpdateLog = () => {
    if (!editingEntry) return;
    const entryToUpdate = {
        ...editingEntry,
        sets: parseInt(editingEntry.sets || '0') || 0,
        reps: parseInt(editingEntry.reps || '0') || 0,
        weight: parseFloat(editingEntry.weight || '0') || 0
    };
    updateEntry(workoutId, exerciseId, entryToUpdate);
    setEditingEntry(null);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white view-transition">
      <div className="bg-slate-50 px-6 pb-8 border-b border-slate-100">
        <header className="py-6 flex items-center justify-between -mx-2">
          <button onClick={() => setView({ type: 'workout-detail', workoutId })} className="p-2 text-slate-500 hover:bg-white rounded-full transition-all"><ChevronLeftIcon /></button>
          <button 
            onClick={() => setRepoModal({ isOpen: true, workoutId, exerciseId: exercise.id, name: exercise.name, tags: exercise.tags, notes: exercise.notes, isEditingInstance: true, activeTab: 'new' })}
            className="p-2 text-indigo-600 hover:bg-white rounded-full transition-all"
          >
            <EditIcon />
          </button>
        </header>
        
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{exercise.name}</h1>
        <div className="flex flex-wrap gap-2 mt-4">
          {(exercise.tags || []).map(tag => (
            <span key={tag} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${tag.toLowerCase() === 'anchor' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'}`}>{tag}</span>
          ))}
        </div>

        {exercise.notes && (
          <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-900 leading-relaxed font-medium italic">
            {exercise.notes}
          </div>
        )}

        {lastEntry && (
          <div className="mt-8 bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.1em]">LATEST PERFORMANCE</p>
                <FeelingIndicator feeling={lastEntry.feeling} />
              </div>
              <div className="flex items-baseline gap-2 text-2xl font-black">
                <span className="text-slate-900">{lastEntry.sets}x{lastEntry.reps}</span>
                <span className="text-indigo-600">{lastEntry.weight}kg</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <TrendingUpIcon />
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-8 pb-32">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">History</h2>
          {!draft && (
            <Button size="sm" onClick={() => setDraft({ date: new Date().toISOString().split('T')[0], sets: (lastEntry?.sets ?? 3).toString(), reps: (lastEntry?.reps ?? 8).toString(), weight: (lastEntry?.weight ?? 0).toString(), feeling: undefined })}>
              <PlusIcon /> <span className="ml-1 font-bold">Add Set</span>
            </Button>
          )}
        </div>

        {draft && (
          <div className="bg-indigo-50 p-4 rounded-2xl mb-6 border border-indigo-100 animate-in space-y-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Date</label>
                <input type="date" value={draft.date} onChange={e => setDraft({...draft, date: e.target.value})} className="w-full bg-white rounded-xl px-3 py-2 text-xs font-bold border-none outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Felt like</label>
                <FeelingSelector value={draft.feeling} onChange={v => setDraft({...draft, feeling: v})} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Sets</label>
                <input 
                  type="text" 
                  value={draft.sets} 
                  onChange={e => setDraft({...draft, sets: e.target.value})} 
                  className="w-full bg-white rounded-xl px-3 py-2 text-sm font-black border-none outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm" 
                  placeholder="0"
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Reps</label>
                <input 
                  type="text" 
                  value={draft.reps} 
                  onChange={e => setDraft({...draft, reps: e.target.value})} 
                  className="w-full bg-white rounded-xl px-3 py-2 text-sm font-black border-none outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm" 
                  placeholder="0"
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Weight</label>
                <input 
                  type="text" 
                  value={draft.weight} 
                  onChange={e => setDraft({...draft, weight: e.target.value})} 
                  className="w-full bg-white rounded-xl px-3 py-2 text-sm font-black border-none outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm" 
                  placeholder="0.0"
                  inputMode="decimal"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button fullWidth onClick={handleSaveLog} className="font-bold"><CheckIcon /> <span className="ml-1">Save Log</span></Button>
              <Button variant="ghost" onClick={() => setDraft(null)} className="text-indigo-400"><XIcon /></Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {(exercise.entries || []).map(ent => (
            <div key={ent.id} className="group relative flex items-center justify-between p-4 bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 rounded-2xl transition-all">
              <div className="flex items-center gap-4">
                <div className="text-[10px] font-black text-slate-400 bg-white w-10 h-10 flex items-center justify-center rounded-xl border border-slate-100 text-center leading-tight uppercase shadow-sm">
                   {formatDateCompact(ent.date)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-700">{ent.sets}x{ent.reps}</span>
                    <span className="text-indigo-600 font-black">{ent.weight}kg</span>
                  </div>
                  <FeelingIndicator feeling={ent.feeling} />
                </div>
              </div>
              <div className="relative">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === ent.id ? null : ent.id); }} 
                  className="p-3 -m-3 text-slate-300 hover:text-indigo-600 transition-all z-[10]"
                >
                  <MoreIcon />
                </button>
                {activeMenu === ent.id && (
                  <div className="absolute right-0 top-10 w-44 bg-white border border-slate-100 shadow-2xl rounded-2xl z-[500] py-1 overflow-hidden animate-in">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setActiveMenu(null); 
                        setEditingEntry({ ...ent, sets: ent.sets.toString(), reps: ent.reps.toString(), weight: ent.weight.toString() }); 
                      }}
                      className="w-full text-left px-4 py-4 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <EditIcon /> Edit Entry
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setActiveMenu(null); 
                        if(window.confirm('Delete log?')) deleteEntry(workoutId, exerciseId, ent.id); 
                      }}
                      className="w-full text-left px-4 py-4 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-50"
                    >
                      <TrashIcon /> Delete Entry
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingEntry && (
        <Modal title="Edit Entry" onClose={() => setEditingEntry(null)} onAction={handleUpdateLog} actionLabel="Update">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Date</label>
                <input type="date" value={editingEntry.date} onChange={e => setEditingEntry({...editingEntry, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:bg-white outline-none shadow-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Felt like</label>
                <FeelingSelector value={editingEntry.feeling} onChange={v => setEditingEntry({...editingEntry, feeling: v})} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Sets</label>
                <input 
                  type="text" 
                  value={editingEntry.sets} 
                  onChange={e => setEditingEntry({...editingEntry, sets: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black focus:bg-white outline-none shadow-sm" 
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Reps</label>
                <input 
                  type="text" 
                  value={editingEntry.reps} 
                  onChange={e => setEditingEntry({...editingEntry, reps: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black focus:bg-white outline-none shadow-sm" 
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Weight</label>
                <input 
                  type="text" 
                  value={editingEntry.weight} 
                  onChange={e => setEditingEntry({...editingEntry, weight: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black focus:bg-white outline-none shadow-sm" 
                  inputMode="decimal"
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {activeMenu && <div className="fixed inset-0 z-[450]" onClick={() => setActiveMenu(null)} />}
    </div>
  );
});
