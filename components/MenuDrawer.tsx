
import React, { memo } from 'react';
import { DownloadIcon, RotateCcwIcon, XIcon, UploadIcon } from './Icons';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: any) => void;
  onDownload: () => void;
  onImport: () => void;
  onReset: () => void;
}

export const MenuDrawer = memo(({ isOpen, onClose, onNavigate, onDownload, onImport, onReset }: MenuDrawerProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[500] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-72 bg-white h-full shadow-2xl drawer-slide flex flex-col">
        <div className="p-6 flex items-center justify-between border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Menu</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
            <XIcon />
          </button>
        </div>
        
        <div className="flex-1 py-4">
          <button 
            onClick={() => { onNavigate({ type: 'manage-exercises' }); onClose(); }}
            className="w-full text-left px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <RotateCcwIcon />
            </div>
            Exercise Library
          </button>
          
          <div className="px-6 py-4">
            <div className="h-px bg-slate-50 w-full" />
          </div>
          
          <button 
            onClick={onDownload}
            className="w-full text-left px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <DownloadIcon />
            </div>
            Export Data (JSON)
          </button>

          <button 
            onClick={onImport}
            className="w-full text-left px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <UploadIcon />
            </div>
            Import Data (JSON)
          </button>
          
          <button 
            onClick={() => { if(window.confirm('Reset all data to default plan?')) onReset(); onClose(); }}
            className="w-full text-left px-6 py-4 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-rose-50 text-rose-500 rounded-lg flex items-center justify-center">
              <RotateCcwIcon />
            </div>
            Reset to Default
          </button>
        </div>
        
        <div className="p-6 border-t border-slate-50">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">TrackYoLifts Pro v1.0</p>
        </div>
      </div>
    </div>
  );
});
