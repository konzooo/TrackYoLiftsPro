
import React, { memo, useEffect, useMemo, useState } from 'react';
import { Workout, Exercise, ViewState, Entry } from '../types';
import { ChevronLeftIcon, MoreIcon, EditIcon, TrashIcon, PlusIcon, LinkIcon, SearchIcon, XIcon } from './Icons';
import { Button } from './Button';
import { Modal } from './Modal';

interface WorkoutDetailViewProps {
  workoutId: string;
  workouts: Workout[];
  setView: (view: ViewState) => void;
  deleteExercise: (workoutId: string, exerciseId: string) => void;
  linkExercises: (sourceExerciseId: string, targetExerciseId: string) => void;
  unlinkExercises: (sourceExerciseId: string, targetExerciseId: string) => void;
  setRepoModal: (modal: any) => void;
  getLatestDate: (entries: any[]) => string | null;
  formatDateCompact: (date: string) => string;
  FeelingIndicator: React.FC<{ feeling?: Entry['feeling'] }>;
}

const getStringList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string');
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return [];
};

const getLinkedIds = (exercise: Exercise): string[] => getStringList(exercise.linkedExerciseIds);
const getTags = (exercise: Exercise): string[] => getStringList(exercise.tags);
const NON_MUSCLE_TAGS = new Set(['anchor', 'warm-up', 'warmup']);
const normalizeTag = (tag: string): string => tag.trim().toLowerCase();

export const WorkoutDetailView = memo(({ workoutId, workouts, setView, deleteExercise, linkExercises, unlinkExercises, setRepoModal, getLatestDate, formatDateCompact, FeelingIndicator }: WorkoutDetailViewProps) => {
  const workout = (workouts || []).find((w: Workout) => w.id === workoutId);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [linkingExercise, setLinkingExercise] = useState<Exercise | null>(null);
  const [linkSearch, setLinkSearch] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');

  const muscleGroups = useMemo(() => {
    const groups = new Map<string, { label: string; count: number }>();

    (workout?.exercises || []).forEach(exercise => {
      const exerciseGroups = new Map<string, string>();

      getTags(exercise).forEach(tag => {
        const key = normalizeTag(tag);
        if (key && !NON_MUSCLE_TAGS.has(key) && !exerciseGroups.has(key)) {
          exerciseGroups.set(key, tag.trim());
        }
      });

      exerciseGroups.forEach((label, key) => {
        const existing = groups.get(key);
        groups.set(key, {
          label: existing?.label || label,
          count: (existing?.count || 0) + 1
        });
      });
    });

    return Array.from(groups, ([key, value]) => ({ key, ...value }));
  }, [workout]);

  useEffect(() => {
    if (selectedMuscleGroup !== 'all' && !muscleGroups.some(group => group.key === selectedMuscleGroup)) {
      setSelectedMuscleGroup('all');
    }
  }, [muscleGroups, selectedMuscleGroup]);

  const filteredExercises = useMemo(() => {
    const exercises = workout?.exercises || [];
    if (selectedMuscleGroup === 'all') return exercises;

    return exercises.filter(exercise =>
      getTags(exercise).some(tag => normalizeTag(tag) === selectedMuscleGroup)
    );
  }, [selectedMuscleGroup, workout]);

  if (!workout) return <div className="p-10 text-center">Workout not found. <Button onClick={() => setView({type: 'workouts'})}>Go Back</Button></div>;

  const allExercises = (workouts || []).flatMap(w => (w.exercises || []).map(ex => ({ ...ex, workoutName: w.name })));
  const linkedExercises = linkingExercise
    ? allExercises.filter(ex => getLinkedIds(linkingExercise).includes(ex.id))
    : [];
  const linkCandidates = linkingExercise
    ? allExercises.filter(ex => {
        const query = linkSearch.trim().toLowerCase();
        if (ex.id === linkingExercise.id) return false;
        if (getLinkedIds(linkingExercise).includes(ex.id)) return false;
        return !query || `${ex.name} ${ex.workoutName} ${getTags(ex).join(' ')}`.toLowerCase().includes(query);
      })
    : [];

  return (
    <div className="max-w-md mx-auto min-h-screen pb-24 view-transition">
      <header className="px-6 py-8 flex items-center gap-4 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 border-b border-slate-100">
        <button onClick={() => setView({ type: 'workouts' })} className="p-2 -ml-2 text-slate-600 hover:bg-white rounded-full transition-colors"><ChevronLeftIcon /></button>
        <h1 className="text-2xl font-bold text-slate-900 leading-tight">{workout.name}</h1>
      </header>
      {muscleGroups.length > 0 && (
        <section className="px-6 pt-5" aria-labelledby="muscle-filter-label">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 id="muscle-filter-label" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Filter by muscle
            </h2>
            <span className="text-[10px] font-bold text-slate-400" aria-live="polite">
              {filteredExercises.length} {filteredExercises.length === 1 ? 'exercise' : 'exercises'}
            </span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-6 px-6" role="group" aria-label="Muscle group filters">
            <button
              type="button"
              onClick={() => setSelectedMuscleGroup('all')}
              aria-pressed={selectedMuscleGroup === 'all'}
              className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[10px] font-bold transition-all active:scale-95 ${selectedMuscleGroup === 'all' ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-100' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600'}`}
            >
              All <span className={selectedMuscleGroup === 'all' ? 'text-indigo-200' : 'text-slate-300'}>{workout.exercises.length}</span>
            </button>
            {muscleGroups.map(group => {
              const isSelected = selectedMuscleGroup === group.key;
              return (
                <button
                  key={group.key}
                  type="button"
                  onClick={() => setSelectedMuscleGroup(group.key)}
                  aria-pressed={isSelected}
                  className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[10px] font-bold transition-all active:scale-95 ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-100' : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600'}`}
                >
                  {group.label} <span className={isSelected ? 'text-indigo-200' : 'text-slate-300'}>{group.count}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}
      <div className="px-6 py-4 space-y-3">
        {filteredExercises.map((ex: Exercise) => {
          const lastEntry = (ex.entries || [])[0];
          const latestEntryDate = getLatestDate(ex.entries);
          const tags = getTags(ex);
          const isAnchor = tags.some(t => t.toLowerCase() === 'anchor');
          return (
            <div
              key={ex.id}
              onClick={() => setView({ type: 'exercise-detail', workoutId, exerciseId: ex.id })}
              className={`relative bg-white p-5 rounded-2xl border transition-all active:scale-[0.98] cursor-pointer ${activeMenu === ex.id ? 'z-[600]' : ''} ${isAnchor ? 'border-indigo-100 shadow-indigo-50 shadow-md' : 'border-slate-100 shadow-sm'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 text-lg leading-tight">{ex.name}</h3>
                    {isAnchor && <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded tracking-wider shadow-sm">Anchor</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.filter(t => t.toLowerCase() !== 'anchor').map(tag => (
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
                        <div className="absolute right-0 top-10 w-56 bg-white border border-slate-100 shadow-2xl rounded-2xl z-[700] py-1 overflow-hidden animate-in">
                             <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setActiveMenu(null);
                                    setRepoModal({ isOpen: true, workoutId, exerciseId: ex.id, name: ex.name, tags, notes: ex.notes, isEditingInstance: true, activeTab: 'new' });
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
                                    setLinkSearch('');
                                    setLinkingExercise(ex);
                                }}
                                className="w-full text-left px-4 py-4 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-50"
                             >
                                <LinkIcon /> Link to Other Exercise
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

      {linkingExercise && (
        <Modal
          title="Link Other Exercise"
          onClose={() => setLinkingExercise(null)}
          showAction={false}
        >
          <div className="space-y-4">
            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Current Exercise</p>
              <p className="text-sm font-black text-indigo-900">{linkingExercise.name}</p>
              <p className="text-xs font-bold text-indigo-500 mt-1">Linked exercises appear as extra colored lines in analytics.</p>
            </div>

            {linkedExercises.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Linked Now</p>
                {linkedExercises.map(ex => (
                  <div key={ex.id} className="flex items-center justify-between gap-3 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-800 truncate">{ex.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 truncate">{ex.workoutName}</p>
                    </div>
                    <button
                      onClick={() => {
                        unlinkExercises(linkingExercise.id, ex.id);
                        setLinkingExercise({
                          ...linkingExercise,
                          linkedExerciseIds: getLinkedIds(linkingExercise).filter(linkedId => linkedId !== ex.id)
                        });
                      }}
                      className="p-2 text-rose-400 hover:bg-rose-50 rounded-xl transition-colors shrink-0"
                      aria-label={`Unlink ${ex.name}`}
                    >
                      <XIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Link to Other Exercise</p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <SearchIcon />
                </div>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search exercises..."
                  value={linkSearch}
                  onChange={e => setLinkSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium"
                />
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {linkCandidates.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => {
                      linkExercises(linkingExercise.id, ex.id);
                      setLinkingExercise({
                        ...linkingExercise,
                        linkedExerciseIds: Array.from(new Set([...getLinkedIds(linkingExercise), ex.id]))
                      });
                      setLinkSearch('');
                    }}
                    className="w-full text-left p-4 bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 rounded-2xl transition-all group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{ex.name}</span>
                    <div className="flex items-center justify-between gap-3 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 truncate">{ex.workoutName}</span>
                      {(ex.entries || []).length > 0 && (
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-tight">{ex.entries.length} logs</span>
                      )}
                    </div>
                  </button>
                ))}
                {linkCandidates.length === 0 && (
                  <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-400 font-bold italic px-6">No unlinked exercise matches.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
});
