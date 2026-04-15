
import React, { useState, useEffect, useRef, memo } from 'react';
import { Entry } from '../types';

interface FeelingSelectorProps {
  value?: Entry['feeling'];
  onChange: (v: Entry['feeling']) => void;
}

export const FeelingSelector = memo(({ value, onChange }: FeelingSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options: { id: Entry['feeling'], label: string, colorClass: string, icon?: React.ReactNode }[] = [
    { id: 'heavy', label: 'Felt heavy', colorClass: 'text-rose-600' },
    { id: 'easy', label: 'Felt easy', colorClass: 'text-emerald-600' },
    { id: 'up', label: 'Go up next', colorClass: 'text-blue-600', icon: (
      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 ml-2 shadow-sm">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"></line>
          <polyline points="5 12 12 5 19 12"></polyline>
        </svg>
      </div>
    )},
  ];

  const selectedOption = options.find(o => o.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-white transition-all shadow-sm"
      >
        <span className={selectedOption?.colorClass || 'text-slate-400'}>
          {selectedOption?.label || 'Select feeling...'}
        </span>
        <div className="flex items-center">
          {selectedOption?.icon}
          <svg className={`ml-2 w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-[600] bottom-full mb-2 w-full bg-white border border-slate-100 rounded-2xl shadow-2xl py-2 animate-in">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => { onChange(opt.id); setIsOpen(false); }}
              className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-slate-50 flex items-center justify-between transition-colors"
            >
              <span className={opt.colorClass}>{opt.label}</span>
              {opt.icon}
            </button>
          ))}
          <button
            type="button"
            onClick={() => { onChange(undefined); setIsOpen(false); }}
            className="w-full text-left px-4 py-3 text-xs font-bold text-slate-400 hover:bg-slate-50 transition-colors border-t border-slate-50"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
});
