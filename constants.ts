
import { Workout } from './types';

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'plan-day-1',
    name: 'Day 1 – Upper (Strength bias)',
    exercises: [
      {
        id: 'd1-ex1',
        name: 'Straight-Arm Pulldown',
        tags: ['Back', 'warm-up'],
        notes: 'Note: RIR 4–5, focus on lat patterning (not fatigue) — 2×12–15',
        entries: []
      },
      {
        id: 'd1-ex2',
        name: 'Incline Dumbbell Bench Press',
        tags: ['Chest', 'anchor'],
        notes: 'Note: RIR 2, long rest, stop when rep speed slows — 4×4–6',
        entries: [{ id: 'log-d1-2', date: '2026-01-09', sets: 3, reps: 6, weight: 30 }]
      },
      {
        id: 'd1-ex3',
        name: 'Supinated Lat Pulldown',
        tags: ['Back', 'anchor'],
        notes: 'Note: RIR 2, elbows down & slightly back — 4×4–6',
        entries: [{ id: 'log-d1-3', date: '2026-01-06', sets: 4, reps: 6, weight: 59 }]
      },
      {
        id: 'd1-ex4',
        name: 'Cable Row (neutral / medium grip)',
        tags: ['Back', 'anchor'],
        notes: 'Note: RIR 2, chest tall, 1s squeeze — 3×6–8',
        entries: [{ id: 'log-d1-4', date: '2026-01-06', sets: 3, reps: 8, weight: 45 }]
      },
      {
        id: 'd1-ex5',
        name: 'Machine Dips (chest focus)',
        tags: ['Chest', 'Triceps'],
        notes: 'Note: RIR 2, slight forward lean - 3×6–8',
        entries: [{ id: 'log-d1-5', date: '2026-01-09', sets: 3, reps: 8, weight: 63 }]
      },
      {
        id: 'd1-ex6',
        name: 'Tricep Cable Extension',
        tags: ['Triceps'],
        notes: 'Note: RIR 1 - 3 × 8–12',
        entries: [{ id: 'log-d1-6', date: '2026-01-09', sets: 3, reps: 8, weight: 36 }]
      },
      {
        id: 'd1-ex7',
        name: 'Incline DB Curl',
        tags: ['Biceps'],
        notes: 'Note: RIR 1–2 — 3×8–12',
        entries: [{ id: 'log-d1-7', date: '2026-01-06', sets: 3, reps: 8, weight: 10 }]
      }
    ]
  },
  {
    id: 'plan-day-2',
    name: 'Day 2 – Lower + Shoulders + Health',
    exercises: [
      {
        id: 'd2-ex1',
        name: 'Leg Press',
        tags: ['Legs', 'anchor'],
        notes: 'Note: RIR 2, controlled descent — 4×4–6',
        entries: []
      },
      {
        id: 'd2-ex2',
        name: 'Leg extensions',
        tags: ['Legs'],
        notes: 'Note: — 3×6–8',
        entries: []
      },
      {
        id: 'd2-ex3',
        name: 'Lateral Raise',
        tags: ['Shoulders', 'anchor'],
        notes: 'Note: RIR 1–2, slow and controlled — 4×12–15',
        entries: []
      },
      {
        id: 'd2-ex4',
        name: 'Rear Prone Ys',
        tags: ['Shoulders', 'Back'],
        notes: 'Note: RIR 2–3, clean scapular movement — 3×12–15',
        entries: [{ id: 'log-d2-4', date: '2026-01-06', sets: 2, reps: 12, weight: 3 }]
      },
      {
        id: 'd2-ex5',
        name: 'Face Pull',
        tags: ['Shoulders', 'Back'],
        notes: 'Note: RIR 3, pause with external rotation — 2×12–15',
        entries: []
      },
      {
        id: 'd2-ex6',
        name: 'Cable/Band External Rotation',
        tags: ['Shoulders'],
        notes: 'Note: RIR 4, very light, shoulder health — 2×15–20',
        entries: []
      }
    ]
  }
];

export const PREDEFINED_TAGS = ['chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'abs', 'warm-up'];
