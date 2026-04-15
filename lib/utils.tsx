
import React from 'react';
import { Entry } from '../types';

export const safeParse = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === '[object Object]') return fallback;
    const parsed = JSON.parse(item);
    if (key === 'workouts' && !Array.isArray(parsed)) return fallback;
    return parsed ?? fallback;
  } catch (e) {
    console.warn(`Local storage parsing failed for ${key}, using defaults.`);
    return fallback;
  }
};

export const formatDateCompact = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }).toUpperCase();
};

export const getLatestDate = (entries: Entry[]) => {
  if (!entries || entries.length === 0) return null;
  const dates = entries.map(e => new Date(e.date).getTime());
  return new Date(Math.max(...dates)).toISOString().split('T')[0];
};

export const FeelingIndicator = ({ feeling }: { feeling?: Entry['feeling'] }) => {
  if (!feeling) return null;
  switch (feeling) {
    case 'heavy':
      return <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200" title="Felt heavy" />;
    case 'easy':
      return <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" title="Felt easy" />;
    case 'up':
      return (
        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-50 text-blue-600 border border-blue-100" title="Go up next">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5"></line>
            <polyline points="5 12 12 5 19 12"></polyline>
          </svg>
        </div>
      );
    default:
      return null;
  }
};
