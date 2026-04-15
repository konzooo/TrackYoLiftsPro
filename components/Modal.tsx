
import React, { memo } from 'react';
import { XIcon } from './Icons';
import { Button } from './Button';

interface ModalProps {
  title: string;
  onClose: () => void;
  onAction?: () => void;
  actionLabel?: string;
  children: React.ReactNode;
  showAction?: boolean;
}

export const Modal = memo(({ title, onClose, onAction, actionLabel, children, showAction = true }: ModalProps) => (
  <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white w-full max-sm rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in overflow-hidden">
      <div className="flex justify-between items-center px-6 pt-6 pb-2">
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
          <XIcon />
        </button>
      </div>
      <div className="px-6 py-2 overflow-y-auto flex-grow space-y-4">
        {children}
      </div>
      <div className="px-6 pb-6 pt-4 flex gap-3 border-t border-slate-50">
        <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        {showAction && onAction && <Button className="flex-1" onClick={onAction}>{actionLabel}</Button>}
      </div>
    </div>
  </div>
));
