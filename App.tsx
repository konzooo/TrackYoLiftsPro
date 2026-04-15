
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Workout, Exercise, ViewState, Entry, RepoExercise } from './types';
import { INITIAL_WORKOUTS, PREDEFINED_TAGS } from './constants';
import { safeParse, formatDateCompact, getLatestDate, FeelingIndicator } from './lib/utils';

// Components
import { Modal } from './components/Modal';
import { MenuDrawer } from './components/MenuDrawer';
import { WorkoutsView } from './components/WorkoutsView';
import { WorkoutDetailView } from './components/WorkoutDetailView';
import { ExerciseDetailView } from './components/ExerciseDetailView';
import { ManageExercisesView } from './components/ManageExercisesView';
import { RepoModal } from './components/RepoModal';
import { FeelingSelector } from './components/FeelingSelector';
import GeminiCoach from './components/GeminiCoach';

const App: React.FC = () => {
  // --- State ---
  const [workouts, setWorkouts] = useState<Workout[]>(() => safeParse('workouts', INITIAL_WORKOUTS));
  const [exerciseRepository, setExerciseRepository] = useState<RepoExercise[]>(() => safeParse('exercise_repo', []));
  const [availableTags, setAvailableTags] = useState<string[]>(() => safeParse('available_tags', PREDEFINED_TAGS));
  const [view, setView] = useState<ViewState>({ type: 'workouts' });
  
  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState('');
  const [repoModal, setRepoModal] = useState<any>(null);
  const [customTagInput, setCustomTagInput] = useState('');
  const [librarySearch, setLibrarySearch] = useState('');

// --- Persistence & Data Handling ---
  useEffect(() => { localStorage.setItem('workouts', JSON.stringify(workouts)); }, [workouts]);
  useEffect(() => { localStorage.setItem('exercise_repo', JSON.stringify(exerciseRepository)); }, [exerciseRepository]);
  useEffect(() => { localStorage.setItem('available_tags', JSON.stringify(availableTags)); }, [availableTags]);

  // --- Actions ---
  const resetToPlan = useCallback(() => {
    localStorage.clear();
    setWorkouts(INITIAL_WORKOUTS);
    setExerciseRepository([]);
    setAvailableTags(PREDEFINED_TAGS);
    setView({ type: 'workouts' });
  }, []);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  }, []);

  const deleteExercise = useCallback((workoutId: string, exerciseId: string) => {
    if(!window.confirm('Remove from your workout?')) return;
    setWorkouts(prev => prev.map(w => w.id === workoutId ? { ...w, exercises: w.exercises.filter(ex => ex.id !== exerciseId) } : w));
  }, []);

  const deleteFromRepo = useCallback((id: string) => {
    setExerciseRepository(prev => prev.filter(ex => ex.id !== id));
  }, []);

  const commitEntry = useCallback((workoutId: string, exerciseId: string, entry: Entry) => {
    setWorkouts(prev => prev.map(w => w.id === workoutId ? {
      ...w,
      exercises: w.exercises.map(ex => ex.id === exerciseId ? { ...ex, entries: [entry, ...(ex.entries || [])] } : ex)
    } : w));
  }, []);

  const updateEntry = useCallback((workoutId: string, exerciseId: string, updatedEntry: Entry) => {
    setWorkouts(prev => prev.map(w => w.id === workoutId ? {
      ...w,
      exercises: w.exercises.map(ex => ex.id === exerciseId ? { 
          ...ex, 
          entries: (ex.entries || []).map(ent => ent.id === updatedEntry.id ? updatedEntry : ent) 
      } : ex)
    } : w));
  }, []);

  const deleteEntry = useCallback((workoutId: string, exerciseId: string, entryId: string) => {
    setWorkouts(prev => prev.map(w => w.id === workoutId ? {
      ...w,
      exercises: w.exercises.map(ex => ex.id === exerciseId ? { ...ex, entries: (ex.entries || []).filter(ent => ent.id !== entryId) } : ex)
    } : w));
  }, []);

  const downloadData = useCallback(() => {
    const data = { workouts, exerciseRepository, availableTags, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trackyolifts-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }, [workouts, exerciseRepository, availableTags]);

  const importData = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event: any) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.workouts && data.exerciseRepository && data.availableTags) {
            if (window.confirm('This will overwrite your current data. Continue?')) {
              setWorkouts(data.workouts);
              setExerciseRepository(data.exerciseRepository);
              setAvailableTags(data.availableTags);
              setIsMenuOpen(false);
            }
          } else {
            alert('Invalid data format.');
          }
        } catch (err) {
          alert('Error parsing JSON file.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const handleSaveRepoExercise = () => {
    if (!repoModal.name.trim()) return;
    const { name, tags, notes, targetWorkoutId, isEditingInstance, workoutId, exerciseId } = repoModal;
    
    if (isEditingInstance && workoutId && exerciseId) {
        setWorkouts(prev => prev.map(w => w.id === workoutId ? { 
            ...w, 
            exercises: w.exercises.map(ex => ex.id === exerciseId ? { ...ex, name, tags, notes } : ex) 
        } : w));
        setRepoModal(null);
        return;
    }

    const newExId = Date.now().toString();
    const newRepoItem: RepoExercise = { id: newExId, name, tags, notes };
    setExerciseRepository(prev => [newRepoItem, ...prev]);

    if (targetWorkoutId) {
        setWorkouts(prev => prev.map(w => w.id === targetWorkoutId ? { 
            ...w, 
            exercises: [...w.exercises, { ...newRepoItem, entries: [] }] 
        } : w));
    }
    
    setRepoModal(null);
  };

  const addFromLibrary = (repoEx: RepoExercise) => {
    if (!repoModal?.targetWorkoutId) return;
    const workoutId = repoModal.targetWorkoutId;
    setWorkouts(prev => prev.map(w => w.id === workoutId ? {
      ...w,
      exercises: [...w.exercises, { ...repoEx, id: Date.now().toString(), entries: [] }]
    } : w));
    setRepoModal(null);
  };

  const toggleTag = (tag: string, targetModal: any, setModal: any) => {
    const currentTags = targetModal.tags || [];
    setModal({ ...targetModal, tags: currentTags.includes(tag) ? currentTags.filter((t: string) => t !== tag) : [...currentTags, tag] });
  };

  const addCustomTag = (e: React.FormEvent, targetModal: any, setModal: any) => {
    e.preventDefault();
    const tag = customTagInput.trim().toLowerCase();
    if (!tag || availableTags.includes(tag)) return;
    setAvailableTags(prev => [...prev, tag]);
    toggleTag(tag, targetModal, setModal);
    setCustomTagInput('');
  };

  const filteredLibrary = useMemo(() => {
    return exerciseRepository.filter(ex => ex.name.toLowerCase().includes(librarySearch.toLowerCase()));
  }, [exerciseRepository, librarySearch]);

  return (
    <div className="min-h-screen bg-slate-50">
      {view.type === 'workouts' && (
        <WorkoutsView 
          workouts={workouts} 
          setView={setView} 
          deleteWorkout={deleteWorkout} 
          setIsAddingWorkout={setIsAddingWorkout} 
          setMenuOpen={setIsMenuOpen} 
          formatDateCompact={formatDateCompact}
          getLatestDate={getLatestDate}
        />
      )}
      {view.type === 'workout-detail' && (
        <WorkoutDetailView 
          workoutId={view.workoutId} 
          workouts={workouts} 
          setView={setView} 
          deleteExercise={deleteExercise} 
          setRepoModal={setRepoModal} 
          getLatestDate={getLatestDate}
          formatDateCompact={formatDateCompact}
          FeelingIndicator={FeelingIndicator}
        />
      )}
      {view.type === 'exercise-detail' && (
        <ExerciseDetailView 
          workoutId={view.workoutId} 
          exerciseId={view.exerciseId} 
          workouts={workouts} 
          setView={setView} 
          commitEntry={commitEntry} 
          updateEntry={updateEntry} 
          deleteEntry={deleteEntry} 
          setRepoModal={setRepoModal} 
          formatDateCompact={formatDateCompact}
          FeelingIndicator={FeelingIndicator}
          FeelingSelector={FeelingSelector}
        />
      )}
      {view.type === 'manage-exercises' && (
        <ManageExercisesView 
          repository={exerciseRepository} 
          setView={setView} 
          deleteFromRepo={deleteFromRepo} 
          setRepoModal={setRepoModal} 
        />
      )}
      
      <MenuDrawer 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onNavigate={setView} 
        onDownload={downloadData} 
        onImport={importData}
        onReset={resetToPlan} 
      />
      
      {isAddingWorkout && (
        <Modal 
          title="New Workout Day" 
          onClose={() => setIsAddingWorkout(false)} 
          onAction={() => { if(newWorkoutName) { setWorkouts([...workouts, {id: Date.now().toString(), name: newWorkoutName, exercises: []}]); setNewWorkoutName(''); setIsAddingWorkout(false); } }} 
          actionLabel="Create"
        >
          <input autoFocus type="text" value={newWorkoutName} onChange={(e) => setNewWorkoutName(e.target.value)} placeholder="e.g. Upper Body Power" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:bg-white outline-none focus:ring-2 focus:ring-indigo-100" />
        </Modal>
      )}

      {repoModal && (
        <RepoModal 
          repoModal={repoModal}
          setRepoModal={setRepoModal}
          availableTags={availableTags}
          toggleTag={toggleTag}
          addCustomTag={addCustomTag}
          customTagInput={customTagInput}
          setCustomTagInput={setCustomTagInput}
          handleSaveRepoExercise={handleSaveRepoExercise}
          librarySearch={librarySearch}
          setLibrarySearch={setLibrarySearch}
          filteredLibrary={filteredLibrary}
          addFromLibrary={addFromLibrary}
        />
      )}

      <GeminiCoach 
        workouts={workouts}
        exerciseRepository={exerciseRepository}
        availableTags={availableTags}
      />
    </div>
  );
};

export default App;
