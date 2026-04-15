
import React, { memo, useState, useMemo } from 'react';
import { RepoExercise, ViewState } from '../types';
import { ChevronLeftIcon, SearchIcon, PlusIcon, EditIcon, TrashIcon } from './Icons';
import { Button } from './Button';

interface ManageExercisesViewProps {
  repository: RepoExercise[];
  setView: (view: ViewState) => void;
  deleteFromRepo: (id: string) => void;
  setRepoModal: (modal: any) => void;
}

export const ManageExercisesView = memo(({ repository, setView, deleteFromRepo, setRepoModal }: ManageExercisesViewProps) => {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() => repository.filter((e: RepoExercise) => e.name.toLowerCase().includes(search.toLowerCase())), [repository, search]);

  return (
    <div className="max-w-md mx-auto min-h-screen pb-24 view-transition">
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-slate-50/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setView({ type: 'workouts' })} className="p-2 -ml-2 text-slate-600 hover:bg-white rounded-full transition-colors"><ChevronLeftIcon /></button>
          <h1 className="text-2xl font-bold text-slate-900">Exercise Library</h1>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <SearchIcon />
            </div>
            <input 
              type="text" 
              placeholder="Search your library..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all shadow-sm font-medium"
            />
          </div>
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={() => setRepoModal({ isOpen: true, name: '', tags: [], notes: '', activeTab: 'new' })} 
            className="border-dashed border-2 bg-white py-4 rounded-2xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
          >
            <PlusIcon /> <span className="ml-2 font-bold">Create New Exercise</span>
          </Button>
        </div>
      </header>

      <div className="px-6 space-y-3 mt-4">
        {filtered.map((ex: RepoExercise) => (
          <div key={ex.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between group">
            <div className="flex-1">
              <h3 className="font-bold text-slate-800">{ex.name}</h3>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {(ex.tags || []).map(t => (
                  <span key={t} className={`px-2 py-0.5 text-[9px] font-bold rounded-md uppercase tracking-tight ${t.toLowerCase() === 'anchor' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{t}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setRepoModal({ isOpen: true, ...ex, activeTab: 'new' })} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg"><EditIcon /></button>
              <button onClick={() => { if(window.confirm('Delete from library?')) deleteFromRepo(ex.id); }} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><TrashIcon /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
