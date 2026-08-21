
import React, { memo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

type ChartMode = 'weight' | 'weight_reps' | 'volume';
type ChartSeries = {
  id: string;
  name: string;
  entries: Entry[];
  color: string;
  mutedColor: string;
  primary?: boolean;
};

const CHART_MODES: { key: ChartMode; label: string }[] = [
  { key: 'weight', label: 'Weight' },
  { key: 'weight_reps', label: 'W × R' },
  { key: 'volume', label: 'W × R × S' },
];

function getValue(entry: Entry, mode: ChartMode): number {
  if (mode === 'weight') return entry.weight;
  if (mode === 'weight_reps') return entry.weight * entry.reps;
  return entry.weight * entry.reps * entry.sets;
}

function getLabel(mode: ChartMode): string {
  if (mode === 'weight') return 'kg';
  if (mode === 'weight_reps') return 'kg × reps';
  return 'total volume kg';
}

function sortEntries(entries: Entry[]) {
  return [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getChartRevision(series: ChartSeries[]): string {
  return series
    .map(item => `${item.id}:${(item.entries || [])
      .map(entry => `${entry.id}:${entry.date}:${entry.sets}:${entry.reps}:${entry.weight}`)
      .join(',')}`)
    .join('|');
}

function ProgressChart({ series, mode }: { series: ChartSeries[]; mode: ChartMode }) {
  const visibleSeries = series
    .map(item => ({ ...item, entries: sortEntries(item.entries || []) }))
    .filter(item => item.entries.length > 0);
  const allPoints = visibleSeries.flatMap(item => item.entries.map(entry => ({ entry, value: getValue(entry, mode) })));
  if (!allPoints.length) return null;

  const values = allPoints.map(p => p.value);
  const dates = allPoints.map(p => new Date(p.entry.date).getTime()).filter(Number.isFinite);
  if (!dates.length) return null;

  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const range = maxVal - minVal || 1;
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const dateRange = maxDate - minDate || 1;
  const W = 320, H = 160, PAD_X = 8, PAD_Y = 16;
  const primarySeries = visibleSeries.find(item => item.primary) || visibleSeries[0];
  const primaryEntries = primarySeries?.entries || [];
  const primaryValues = primaryEntries.map(e => getValue(e, mode));

  if (!visibleSeries.length || !primaryValues.length) return null;

  const getPoint = (entry: Entry) => {
    const date = new Date(entry.date).getTime();
    const dateOffset = Number.isFinite(date) ? (date - minDate) / dateRange : 0;
    const value = getValue(entry, mode);
    return {
      x: PAD_X + dateOffset * (W - PAD_X * 2),
      y: PAD_Y + (1 - (value - minVal) / range) * (H - PAD_Y * 2),
      v: value,
      entry,
    };
  };

  const seriesPoints = visibleSeries.map(item => ({
    ...item,
    points: item.entries.map(getPoint)
  }));
  const primaryPoints = seriesPoints.find(item => item.id === primarySeries.id)?.points || [];
  const primaryPathD = primaryPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaD = primaryPoints.length > 1
    ? `${primaryPathD} L ${primaryPoints[primaryPoints.length - 1].x.toFixed(1)} ${H} L ${primaryPoints[0].x.toFixed(1)} ${H} Z`
    : '';
  const peak = Math.max(...primaryValues);
  const latest = primaryValues[primaryValues.length - 1];
  const first = primaryValues[0];
  const trend = latest >= first ? '+' : '';
  const pct = first > 0 ? Math.round(((latest - first) / first) * 100) : 0;
  const linkedCount = Math.max(visibleSeries.length - 1, 0);

  return (
    <div>
      <div className="flex justify-between items-end mb-4 px-1">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latest</p>
          <p className="text-2xl font-black text-slate-900">{latest.toFixed(1)}<span className="text-sm font-bold text-slate-400 ml-1">{getLabel(mode)}</span></p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">vs. first</p>
          <p className={`text-lg font-black ${pct >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{trend}{pct}%</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peak</p>
          <p className="text-lg font-black text-indigo-600">{peak.toFixed(1)}</p>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 160 }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
          </linearGradient>
        </defs>
        {areaD && <path d={areaD} fill="url(#chartGrad)" />}
        {seriesPoints.map(item => {
          const pathD = item.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
          return (
            <g key={item.id}>
              {item.points.length > 1 && (
                <path d={pathD} fill="none" stroke={item.color} strokeWidth={item.primary ? 2.8 : 2.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={item.primary ? undefined : '5 4'} />
              )}
              {item.points.map((p, i) => (
                <circle key={`${item.id}-${p.entry.id}-${i}`} cx={p.x} cy={p.y} r={i === item.points.length - 1 ? 5 : 3} fill={i === item.points.length - 1 ? item.color : item.mutedColor}>
                  <title>{`${item.name}: ${p.v.toFixed(1)} ${getLabel(mode)} on ${p.entry.date}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>

      <div className="flex justify-between mt-1 px-1">
        <span className="text-[10px] text-slate-400 font-bold">{new Date(minDate).toISOString().split('T')[0]}</span>
        <span className="text-[10px] text-slate-400 font-bold">{new Date(maxDate).toISOString().split('T')[0]}</span>
      </div>

      {linkedCount > 0 && (
        <div className="mt-5 space-y-2">
          <div className="flex flex-wrap gap-2">
            {visibleSeries.map(item => (
              <div key={item.id} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] font-black text-slate-500 truncate max-w-32">{item.name}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
            Linked exercises are shown as separate raw lines; bodyweight moves use the weight you log.
          </p>
        </div>
      )}
    </div>
  );
}

export const ExerciseDetailView = memo(({ workoutId, exerciseId, workouts, setView, commitEntry, deleteEntry, updateEntry, setRepoModal, formatDateCompact, FeelingIndicator, FeelingSelector }: ExerciseDetailViewProps) => {
  const workout = (workouts || []).find((w: Workout) => w.id === workoutId);
  const exercise = workout?.exercises?.find((e: Exercise) => e.id === exerciseId);
  const [draft, setDraft] = useState<any>(null);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showChart, setShowChart] = useState(false);
  const [chartMode, setChartMode] = useState<ChartMode>('weight');

  if (!exercise) return <div className="p-10 text-center">Exercise not found. <Button onClick={() => setView({type: 'workout-detail', workoutId})}>Go Back</Button></div>;
  const allExercises = (workouts || []).flatMap(w => w.exercises || []);
  const linkedExercises = allExercises.filter(ex => (exercise.linkedExerciseIds || []).includes(ex.id));
  const chartSeries: ChartSeries[] = [
    { id: exercise.id, name: exercise.name, entries: exercise.entries || [], color: '#4f46e5', mutedColor: '#818cf8', primary: true },
    ...linkedExercises.map((ex, index) => {
      const colors = [
        { color: '#ef4444', mutedColor: '#fca5a5' },
        { color: '#059669', mutedColor: '#6ee7b7' },
        { color: '#d97706', mutedColor: '#fbbf24' },
        { color: '#7c3aed', mutedColor: '#c4b5fd' },
      ];
      return { id: ex.id, name: ex.name, entries: ex.entries || [], ...colors[index % colors.length] };
    })
  ];
  const lastEntry = (exercise.entries || [])[0];
  const hasEnoughEntries = chartSeries.some(item => (item.entries || []).length > 1) || chartSeries.reduce((count, item) => count + (item.entries || []).length, 0) > 1;
  const chartRevision = getChartRevision(chartSeries);

  const handleSaveLog = () => {
    if (!draft) return;
    commitEntry(workoutId, exerciseId, {
      ...draft,
      sets: parseInt(draft.sets || '0') || 0,
      reps: parseInt(draft.reps || '0') || 0,
      weight: parseFloat(draft.weight || '0') || 0,
      id: Date.now().toString()
    });
    setDraft(null);
  };

  const handleUpdateLog = () => {
    if (!editingEntry) return;
    updateEntry(workoutId, exerciseId, {
      ...editingEntry,
      sets: parseInt(editingEntry.sets || '0') || 0,
      reps: parseInt(editingEntry.reps || '0') || 0,
      weight: parseFloat(editingEntry.weight || '0') || 0
    });
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
          <button
            onClick={() => hasEnoughEntries && setShowChart(true)}
            className={`w-full mt-8 bg-white p-6 rounded-2xl border border-indigo-50 shadow-sm flex items-center justify-between text-left transition-all ${hasEnoughEntries ? 'active:scale-[0.98] hover:border-indigo-200' : ''}`}
          >
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
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <TrendingUpIcon />
              </div>
              {hasEnoughEntries && (
                <span className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">Analytics</span>
              )}
            </div>
          </button>
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
                <input type="text" value={draft.sets} onChange={e => setDraft({...draft, sets: e.target.value})} className="w-full bg-white rounded-xl px-3 py-2 text-sm font-black border-none outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm" placeholder="0" inputMode="numeric" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Reps</label>
                <input type="text" value={draft.reps} onChange={e => setDraft({...draft, reps: e.target.value})} className="w-full bg-white rounded-xl px-3 py-2 text-sm font-black border-none outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm" placeholder="0" inputMode="numeric" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Weight</label>
                <input type="text" value={draft.weight} onChange={e => setDraft({...draft, weight: e.target.value})} className="w-full bg-white rounded-xl px-3 py-2 text-sm font-black border-none outline-none focus:ring-2 focus:ring-indigo-300 shadow-sm" placeholder="0.0" inputMode="decimal" />
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
                <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === ent.id ? null : ent.id); }} className="p-3 -m-3 text-slate-300 hover:text-indigo-600 transition-all z-[10]">
                  <MoreIcon />
                </button>
                {activeMenu === ent.id && (
                  <div className="absolute right-0 top-10 w-44 bg-white border border-slate-100 shadow-2xl rounded-2xl z-[500] py-1 overflow-hidden animate-in">
                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(null); setEditingEntry({ ...ent, sets: ent.sets.toString(), reps: ent.reps.toString(), weight: ent.weight.toString() }); }} className="w-full text-left px-4 py-4 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                      <EditIcon /> Edit Entry
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(null); if(window.confirm('Delete log?')) deleteEntry(workoutId, exerciseId, ent.id); }} className="w-full text-left px-4 py-4 text-xs font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-50">
                      <TrashIcon /> Delete Entry
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analytics Bottom Sheet */}
      <AnimatePresence>
        {showChart && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[600]"
              onClick={() => setShowChart(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={{ top: 0, bottom: 0.4 }}
              onDragEnd={(_, info) => { if (info.offset.y > 80) setShowChart(false); }}
              className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white rounded-t-3xl z-[700] px-6 pt-4 pb-10 shadow-2xl"
            >
              {/* drag handle */}
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-6" />

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{exercise.name}</h3>
                  <p className="text-xs text-slate-400 font-bold mt-0.5">All-time progression</p>
                </div>
                <button onClick={() => setShowChart(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                  <XIcon />
                </button>
              </div>

              {/* Segment control */}
              <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
                {CHART_MODES.map(m => (
                  <button
                    key={m.key}
                    onClick={() => setChartMode(m.key)}
                    className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${chartMode === m.key ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div key={chartRevision}>
                <ProgressChart series={chartSeries} mode={chartMode} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
                <input type="text" value={editingEntry.sets} onChange={e => setEditingEntry({...editingEntry, sets: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black focus:bg-white outline-none shadow-sm" inputMode="numeric" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Reps</label>
                <input type="text" value={editingEntry.reps} onChange={e => setEditingEntry({...editingEntry, reps: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black focus:bg-white outline-none shadow-sm" inputMode="numeric" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Weight</label>
                <input type="text" value={editingEntry.weight} onChange={e => setEditingEntry({...editingEntry, weight: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-black focus:bg-white outline-none shadow-sm" inputMode="decimal" />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {activeMenu && <div className="fixed inset-0 z-[450]" onClick={() => setActiveMenu(null)} />}
    </div>
  );
});
