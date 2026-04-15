
import React, { memo } from 'react';
import { Modal } from './Modal';
import { PlusIcon, SearchIcon, ChevronRightIcon } from './Icons';

interface RepoModalProps {
  repoModal: any;
  setRepoModal: (modal: any) => void;
  availableTags: string[];
  toggleTag: (tag: string, targetModal: any, setModal: any) => void;
  addCustomTag: (e: React.FormEvent, targetModal: any, setModal: any) => void;
  customTagInput: string;
  setCustomTagInput: (val: string) => void;
  handleSaveRepoExercise: () => void;
  librarySearch: string;
  setLibrarySearch: (val: string) => void;
  filteredLibrary: any[];
  addFromLibrary: (repoEx: any) => void;
}

export const RepoModal = memo(({ 
  repoModal, 
  setRepoModal, 
  availableTags, 
  toggleTag, 
  addCustomTag, 
  customTagInput, 
  setCustomTagInput, 
  handleSaveRepoExercise,
  librarySearch,
  setLibrarySearch,
  filteredLibrary,
  addFromLibrary
}: RepoModalProps) => {
  if (!repoModal) return null;

  return (
    <Modal 
        title={repoModal.isEditingInstance ? "Edit Exercise" : "Add Exercise"} 
        onClose={() => setRepoModal(null)} 
        onAction={handleSaveRepoExercise} 
        actionLabel={repoModal.isEditingInstance ? "Update" : "Add Move"}
        showAction={repoModal.activeTab === 'new'}
    >
      <div className="space-y-4">
        {!repoModal.isEditingInstance && repoModal.targetWorkoutId && (
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-2">
            <button 
              onClick={() => setRepoModal({...repoModal, activeTab: 'new'})}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${repoModal.activeTab === 'new' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              New Movement
            </button>
            <button 
              onClick={() => setRepoModal({...repoModal, activeTab: 'library'})}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${repoModal.activeTab === 'library' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              From Library
            </button>
          </div>
        )}

        {repoModal.activeTab === 'new' ? (
          <div className="space-y-4 animate-in">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Move Name</label>
              <input autoFocus type="text" value={repoModal.name} onChange={(e) => setRepoModal({...repoModal, name: e.target.value})} placeholder="e.g. Bench Press" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:bg-white outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tags</label>
              <div className="flex flex-wrap gap-2 pt-1">
                {availableTags.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag, repoModal, setRepoModal)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${repoModal.tags.includes(tag) ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>{tag}</button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-3.5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
               <input type="checkbox" className="w-4 h-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500" checked={repoModal.tags.includes('anchor')} onChange={(e) => { const tags = e.target.checked ? [...repoModal.tags, 'anchor'] : repoModal.tags.filter((t:string) => t !== 'anchor'); setRepoModal({...repoModal, tags}); }} />
               <span className="text-sm font-black text-indigo-700">Set as Anchor Exercise</span>
            </div>

            <form onSubmit={(e) => addCustomTag(e, repoModal, setRepoModal)} className="flex gap-2">
                <input type="text" value={customTagInput} onChange={e => setCustomTagInput(e.target.value)} placeholder="Add custom tag..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 font-bold" />
                <button type="submit" className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors shadow-sm"><PlusIcon /></button>
            </form>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cues / Notes</label>
              <textarea value={repoModal.notes} onChange={(e) => setRepoModal({...repoModal, notes: e.target.value})} placeholder="Optional tips for form..." className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24 resize-none outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 font-bold" />
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <SearchIcon />
                </div>
                <input 
                    type="text" 
                    placeholder="Search your library..." 
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium"
                />
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {filteredLibrary.map(ex => (
                <button key={ex.id} onClick={() => addFromLibrary(ex)} className="w-full text-left p-4 bg-white border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 rounded-2xl transition-all group flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{ex.name}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(ex.tags || []).map(t => <span key={t} className="text-[8px] uppercase font-black text-slate-400">{t}</span>)}
                    </div>
                  </div>
                  <ChevronRightIcon />
                </button>
              ))}
              {filteredLibrary.length === 0 && (
                <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-bold italic px-6">Empty library matches.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
});
