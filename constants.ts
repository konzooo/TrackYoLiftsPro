
import { Workout, RepoExercise } from './types';

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
        notes: 'Number 3 incline - Note: RIR 2, long rest, stop when rep speed slows — 4×4–6',
        entries: [
          { date: '2026-04-04', sets: 3, reps: 7, weight: 32, id: '1775632232186' },
          { date: '2026-03-28', sets: 3, reps: 6, weight: 32, id: '1774699513668' },
          { date: '2026-03-20', sets: 3, reps: 8, weight: 30, id: '1774020744447' },
          { date: '2026-02-02', sets: 3, reps: 7, weight: 30, id: '1770032528597' },
          { date: '2026-01-25', sets: 3, reps: 6, weight: 30, id: '1769354907399' },
          { date: '2026-01-16', sets: 3, reps: 6, weight: 30, id: '1768582539969' },
          { id: 'log-d1-2', date: '2026-01-09', sets: 3, reps: 6, weight: 30 }
        ]
      },
      {
        id: 'd1-ex3',
        name: 'Supinated Lat Pulldown',
        tags: ['Back', 'anchor'],
        notes: 'Note: RIR 2, elbows down & slightly back — 4×4–8',
        entries: [
          { date: '2026-04-04', sets: 3, reps: 8, weight: 66, id: '1775632252936' },
          { date: '2026-03-28', sets: 3, reps: 8, weight: 66, id: '1774698764842' },
          { date: '2026-03-20', sets: 3, reps: 7, weight: 66, id: '1774020768335' },
          { date: '2026-03-16', sets: 3, reps: 6, weight: 66, id: '1773657495807' },
          { date: '2026-02-02', sets: 3, reps: 6, weight: 66, id: '1770031447514' },
          { date: '2026-01-25', sets: 3, reps: 6, weight: 66, id: '1769354297805' },
          { date: '2026-01-16', sets: 4, reps: 5, weight: 66, id: '1768565314270' },
          { id: 'log-d1-3', date: '2026-01-06', sets: 4, reps: 6, weight: 59 }
        ]
      },
      {
        id: 'd1-ex4',
        name: 'Cable Row (neutral / medium grip)',
        tags: ['Back', 'anchor'],
        notes: 'Note: RIR 2, chest tall, 1s squeeze — 3×6–8',
        entries: [
          { date: '2026-04-04', sets: 3, reps: 8, weight: 52, id: '1775632278652' },
          { date: '2026-03-28', sets: 3, reps: 8, weight: 52, feeling: 'up', id: '1774700392151' },
          { date: '2026-03-20', sets: 3, reps: 8, weight: 52, id: '1774020796531' },
          { date: '2026-03-16', sets: 3, reps: 8, weight: 52, id: '1773657499360' },
          { date: '2026-02-02', sets: 3, reps: 8, weight: 52, id: '1770033050188' },
          { date: '2026-01-25', sets: 3, reps: 8, weight: 52, id: '1769355331740' },
          { date: '2026-01-16', sets: 3, reps: 8, weight: 52, id: '1768563330619' },
          { id: 'log-d1-4', date: '2026-01-06', sets: 3, reps: 8, weight: 45 }
        ]
      },
      {
        id: 'd1-ex5',
        name: 'Machine Dips (chest focus)',
        tags: ['Chest', 'Triceps'],
        notes: 'Note: RIR 2, slight forward lean - 3×6–8',
        entries: [
          { date: '2026-04-04', sets: 3, reps: 6, weight: 78, id: '1775632322279' },
          { date: '2026-03-28', sets: 3, reps: 8, weight: 63, id: '1774701164884' },
          { date: '2026-03-20', sets: 3, reps: 6, weight: 70, id: '1774020804665' },
          { date: '2026-02-02', sets: 3, reps: 6, weight: 70, id: '1770033404704' },
          { date: '2026-01-25', sets: 3, reps: 6, weight: 70, id: '1769355638197' },
          { date: '2026-01-16', sets: 3, reps: 10, weight: 63, id: '1768565501442' },
          { id: 'log-d1-5', date: '2026-01-09', sets: 3, reps: 8, weight: 63 }
        ]
      },
      {
        id: 'd1-ex6',
        name: 'Tricep Cable Extension',
        tags: ['Triceps'],
        notes: 'Note: RIR 1 - 3 × 8–12',
        entries: [
          { date: '2026-04-04', sets: 3, reps: 9, weight: 17, id: '1775632334550' },
          { date: '2026-03-28', sets: 3, reps: 9, weight: 17, id: '1774701221386' },
          { date: '2026-03-16', sets: 3, reps: 9, weight: 17, id: '1773657514908' },
          { date: '2026-02-02', sets: 3, reps: 9, weight: 17, id: '1770034466213' },
          { date: '2026-01-25', sets: 3, reps: 8, weight: 17, id: '1769356770659' },
          { date: '2026-01-16', sets: 3, reps: 8, weight: 17, id: '1768566085239' },
          { id: 'log-d1-6', date: '2026-01-09', sets: 3, reps: 8, weight: 14.7 }
        ]
      },
      {
        id: 'd1-ex7',
        name: 'Incline DB Curl',
        tags: ['Biceps'],
        notes: 'Level 6 incline - Note: RIR 1–2 — 3×8–12',
        entries: [
          { date: '2026-04-04', sets: 3, reps: 10, weight: 10, id: '1775632362253' },
          { date: '2026-03-28', sets: 3, reps: 10, weight: 10, id: '1774701448623' },
          { date: '2026-03-20', sets: 3, reps: 10, weight: 10, id: '1774021007388' },
          { date: '2026-03-16', sets: 3, reps: 10, weight: 10, id: '1773657524290' },
          { date: '2026-02-02', sets: 3, reps: 10, weight: 10, feeling: 'up', id: '1770033911495' },
          { date: '2026-01-25', sets: 3, reps: 8, weight: 10, id: '1769356793196' },
          { date: '2026-01-16', sets: 3, reps: 8, weight: 10, id: '1769356790016' },
          { id: 'log-d1-7', date: '2026-01-06', sets: 3, reps: 8, weight: 10 }
        ]
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
        notes: '40kg squat= 86 machine.\nNote: RIR 2, controlled descent — 4×4–6',
        entries: [
          { date: '2026-04-02', sets: 3, reps: 8, weight: 109, id: '1775632143596' },
          { date: '2026-01-29', sets: 3, reps: 8, weight: 109, id: '1769705665463' },
          { date: '2026-01-21', sets: 3, reps: 10, weight: 97, id: '1768986095064' },
          { date: '2026-01-14', sets: 3, reps: 8, weight: 40, id: '1768417921264' }
        ]
      },
      {
        id: 'd2-ex2',
        name: 'Leg extensions',
        tags: ['Legs'],
        notes: 'Note: — 3×6–8',
        entries: [
          { date: '2026-04-02', sets: 3, reps: 10, weight: 67, id: '1775632151716' },
          { date: '2026-03-25', sets: 3, reps: 10, weight: 67, id: '1774460601204' },
          { date: '2026-02-04', sets: 3, reps: 12, weight: 52, id: '1770227128945' },
          { date: '2026-01-29', sets: 3, reps: 12, weight: 43, id: '1769704728095' },
          { date: '2026-01-21', sets: 3, reps: 10, weight: 43, id: '1768988116314' },
          { date: '2026-01-14', sets: 3, reps: 10, weight: 40, id: '1768417266709' }
        ]
      },
      {
        id: 'd2-ex3',
        name: 'Lateral Raise',
        tags: ['Shoulders', 'anchor'],
        notes: 'Note: RIR 1–2, slow and controlled — 4×12–15',
        entries: [
          { date: '2026-04-02', sets: 3, reps: 15, weight: 4, id: '1775632163657' },
          { date: '2026-02-04', sets: 3, reps: 15, weight: 4, feeling: 'up', id: '1770228408972' },
          { date: '2026-01-29', sets: 3, reps: 15, weight: 4, feeling: 'up', id: '1769706200345' },
          { date: '2026-01-21', sets: 3, reps: 12, weight: 4, id: '1768987678344' },
          { date: '2026-01-14', sets: 3, reps: 10, weight: 4, id: '1768416824934' }
        ]
      },
      {
        id: 'd2-ex4',
        name: 'Rear Prone Ys',
        tags: ['Shoulders', 'Back'],
        notes: 'Level4.   Note: RIR 2–3, clean scapular movement — 3×12–15',
        entries: [
          { date: '2026-04-02', sets: 2, reps: 13, weight: 3, id: '1775632170465' },
          { date: '2026-02-04', sets: 2, reps: 13, weight: 3, id: '1770226613084' },
          { date: '2026-01-29', sets: 2, reps: 13, weight: 3, id: '1769705137041' },
          { date: '2026-01-21', sets: 2, reps: 8, weight: 4, feeling: 'heavy', id: '1768987935380' },
          { id: 'log-d2-4', date: '2026-01-06', sets: 2, reps: 12, weight: 3 }
        ]
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
        entries: [
          { date: '2026-01-21', sets: 3, reps: 10, weight: 7.5, id: '1768987689672' },
          { date: '2026-01-14', sets: 3, reps: 10, weight: 7.5, id: '1768417146414' }
        ]
      },
      {
        id: '1769704176788',
        name: 'Shoulder press ',
        tags: [],
        notes: '',
        entries: [
          { date: '2026-04-02', sets: 3, reps: 8, weight: 30, id: '1775632213042' },
          { date: '2026-03-18', sets: 3, reps: 8, weight: 30, id: '1775632203885' },
          { date: '2026-02-04', sets: 3, reps: 8, weight: 30, id: '1770228424897' },
          { date: '2026-01-29', sets: 3, reps: 8, weight: 30, id: '1769704200887' }
        ]
      }
    ]
  },
  {
    id: 'plan-day-3',
    name: 'Day 3 – Upper (Hypertrophy bias)',
    exercises: [
      {
        id: 'd3-ex1',
        name: 'Straight-Arm Pulldown',
        tags: ['Back', 'warm-up'],
        notes: 'Note: RIR 4, smooth and controlled — 2×15',
        entries: [
          { date: '2026-01-12', sets: 2, reps: 14, weight: 14, id: '1768219352263' }
        ]
      },
      {
        id: 'd3-ex2',
        name: 'Machine Chest Press',
        tags: ['Chest', 'anchor'],
        notes: 'Note: RIR 0–1, last set can reach failure, controlled tempo — 3×8–12',
        entries: [
          { date: '2026-04-14', sets: 3, reps: 10, weight: 30, id: '1776177018613' },
          { date: '2026-04-08', sets: 3, reps: 10, weight: 30, id: '1776175794983' },
          { date: '2026-03-23', sets: 3, reps: 12, weight: 25, id: '1774268401081' },
          { date: '2026-03-16', sets: 3, reps: 12, weight: 25, id: '1773658869616' },
          { date: '2026-02-17', sets: 3, reps: 12, weight: 25, id: '1771310196063' },
          { date: '2026-02-06', sets: 3, reps: 12, weight: 25, id: '1770379938998' },
          { date: '2026-01-28', sets: 3, reps: 12, weight: 25, id: '1769599263169' },
          { date: '2026-01-19', sets: 3, reps: 12, weight: 20, feeling: 'up', id: '1768828107010' },
          { date: '2026-01-12', sets: 3, reps: 12, weight: 20, id: '1768220395556' }
        ]
      },
      {
        id: 'd3-ex3',
        name: 'Neutral-Grip Lat Pulldown',
        tags: ['Back', 'anchor'],
        notes: 'Note: RIR 2, slow eccentric, full stretch — 3×8–12',
        entries: [
          { date: '2026-04-14', sets: 3, reps: 12, weight: 45, id: '1776177690443' },
          { date: '2026-03-31', sets: 3, reps: 12, weight: 45, id: '1774959830549' },
          { date: '2026-03-23', sets: 3, reps: 10, weight: 45, feeling: 'easy', id: '1774267514866' },
          { date: '2026-03-16', sets: 3, reps: 10, weight: 45, id: '1773657971027' },
          { date: '2026-02-06', sets: 3, reps: 10, weight: 45, id: '1770378349025' },
          { date: '2026-01-28', sets: 3, reps: 10, weight: 45, id: '1769598560704' },
          { date: '2026-01-19', sets: 3, reps: 10, weight: 45, feeling: 'heavy', id: '1768826789998' },
          { date: '2026-01-12', sets: 3, reps: 10, weight: 45, id: '1768219817422' }
        ]
      },
      {
        id: 'd3-ex4',
        name: 'Isolation Lat Machine (slight rotation)',
        tags: ['Back'],
        notes: 'Note: RIR 1–2, deep stretch, lat focus — 3×10–14\n\n35kg(free)= 43kg (guided)',
        entries: [
          { date: '2026-04-14', sets: 2, reps: 12, weight: 45, id: '1776175888962' },
          { date: '2026-03-31', sets: 2, reps: 12, weight: 45, id: '1774960556347' },
          { date: '2026-03-23', sets: 2, reps: 12, weight: 45, id: '1774268720445' },
          { date: '2026-03-16', sets: 2, reps: 12, weight: 45, id: '1773659684857' },
          { date: '2026-02-17', sets: 2, reps: 12, weight: 40, id: '1771310206141' },
          { date: '2026-02-06', sets: 2, reps: 12, weight: 40, id: '1770379242464' },
          { date: '2026-01-28', sets: 2, reps: 12, weight: 40, id: '1769599684634' },
          { date: '2026-01-19', sets: 3, reps: 13, weight: 35, feeling: 'up', id: '1768827520960' },
          { date: '2026-01-12', sets: 3, reps: 12, weight: 43, id: '1768221078468' }
        ]
      },
      {
        id: 'd3-ex5',
        name: 'Chest Fly (machine)',
        tags: ['Chest'],
        notes: 'Note: RIR 1, stop when form becomes unclear — 2–3×8–10\n(Shourlers back, Hugging tree)',
        entries: [
          { date: '2026-04-14', sets: 3, reps: 12, weight: 50, id: '1776177006370' },
          { date: '2026-04-08', sets: 3, reps: 12, weight: 50, id: '1776177004471' },
          { date: '2026-03-31', sets: 3, reps: 12, weight: 50, id: '1774960464728' },
          { date: '2026-03-23', sets: 3, reps: 11, weight: 50, id: '1774269089328' },
          { date: '2026-03-16', sets: 3, reps: 11, weight: 50, id: '1773657458248' },
          { date: '2026-02-17', sets: 3, reps: 11, weight: 50, id: '1771310210774' },
          { date: '2026-02-06', sets: 3, reps: 11, weight: 50, id: '1770378943430' },
          { date: '2026-01-28', sets: 3, reps: 11, weight: 50, id: '1769598061129' },
          { date: '2026-01-19', sets: 2, reps: 10, weight: 50, id: '1768827103465' },
          { date: '2026-01-12', sets: 2, reps: 10, weight: 50, id: '1768219560017' },
          { id: 'log-d3-5', date: '2026-01-09', sets: 3, reps: 8, weight: 57 }
        ]
      },
      {
        id: 'd3-ex6',
        name: 'Triceps overhead Extension',
        tags: ['Triceps'],
        notes: 'Note: RIR 0–1 — 2×12–15\n(14=10)',
        entries: [
          { date: '2026-04-14', sets: 3, reps: 14, weight: 12, id: '1776177598750' },
          { date: '2026-03-31', sets: 3, reps: 14, weight: 12, id: '1774962149790' },
          { date: '2026-03-23', sets: 3, reps: 12, weight: 12, id: '1774269579917' },
          { date: '2026-03-16', sets: 3, reps: 12, weight: 12, id: '1773659310989' },
          { date: '2026-02-17', sets: 3, reps: 12, weight: 12, id: '1771310220401' },
          { date: '2026-02-06', sets: 3, reps: 12, weight: 12, id: '1770380676522' },
          { date: '2026-01-28', sets: 3, reps: 14, weight: 10, id: '1769600509415' },
          { date: '2026-01-19', sets: 3, reps: 14, weight: 10, id: '1768828821531' },
          { date: '2026-01-12', sets: 3, reps: 14, weight: 7.9, id: '1768221636563' }
        ]
      },
      {
        id: 'd3-ex7',
        name: 'Cable Curl (long length)',
        tags: ['Biceps'],
        notes: 'Note: RIR 0–1 — 2×12–15',
        entries: [
          { date: '2026-03-31', sets: 3, reps: 12, weight: 17, id: '1774961822618' },
          { date: '2026-03-23', sets: 3, reps: 12, weight: 17, id: '1774269996585' },
          { date: '2026-03-16', sets: 3, reps: 12, weight: 17, id: '1774017187311' },
          { date: '2026-02-17', sets: 3, reps: 12, weight: 17, id: '1771310228466' },
          { date: '2026-02-06', sets: 3, reps: 12, weight: 17, id: '1770379321756' },
          { date: '2026-01-28', sets: 3, reps: 12, weight: 17, id: '1769600533054' },
          { date: '2026-01-19', sets: 3, reps: 10, weight: 17, id: '1768828603548' },
          { date: '2026-01-12', sets: 3, reps: 10, weight: 17, id: '1768221443243' }
        ]
      }
    ]
  }
];

export const INITIAL_EXERCISE_REPO: RepoExercise[] = [
  { id: '1769704176788', name: 'Shoulder press ', tags: [], notes: '' },
  { id: 'd1-ex1', name: 'Straight-Arm Pulldown', tags: ['Back', 'warm-up'], notes: 'Note: RIR 4–5, focus on lat patterning (not fatigue) — 2×12–15' },
  { id: 'd1-ex2', name: 'Incline Dumbbell Bench Press', tags: ['Chest', 'anchor'], notes: 'Note: RIR 2, long rest, stop when rep speed slows — 4×4–6' },
  { id: 'd1-ex3', name: 'Supinated Lat Pulldown', tags: ['Back', 'anchor'], notes: 'Note: RIR 2, elbows down & slightly back — 4×4–6' },
  { id: 'd1-ex4', name: 'Cable Row (neutral / medium grip)', tags: ['Back', 'anchor'], notes: 'Note: RIR 2, chest tall, 1s squeeze — 3×6–8' },
  { id: 'd1-ex5', name: 'Machine Dips (chest focus)', tags: ['Chest', 'Triceps'], notes: 'Note: RIR 2, slight forward lean - 3×6–8' },
  { id: 'd1-ex6', name: 'Tricep Cable Extension', tags: ['Triceps'], notes: 'Note: RIR 1 - 3 × 8–12' },
  { id: 'd1-ex7', name: 'Incline DB Curl', tags: ['Biceps'], notes: 'Note: RIR 1–2 — 3×8–12' },
  { id: 'd2-ex1', name: 'Leg Press', tags: ['Legs', 'anchor'], notes: 'Note: RIR 2, controlled descent — 4×4–6' },
  { id: 'd2-ex2', name: 'Leg extensions', tags: ['Legs'], notes: 'Note: — 3×6–8' },
  { id: 'd2-ex3', name: 'Lateral Raise', tags: ['Shoulders', 'anchor'], notes: 'Note: RIR 1–2, slow and controlled — 4×12–15' },
  { id: 'd2-ex4', name: 'Rear Prone Ys', tags: ['Shoulders', 'Back'], notes: 'Note: RIR 2–3, clean scapular movement — 3×12–15' },
  { id: 'd2-ex5', name: 'Face Pull', tags: ['Shoulders', 'Back'], notes: 'Note: RIR 3, pause with external rotation — 2×12–15' },
  { id: 'd2-ex6', name: 'Cable/Band External Rotation', tags: ['Shoulders'], notes: 'Note: RIR 4, very light, shoulder health — 2×15–20' },
  { id: 'd3-ex2', name: 'Machine Chest Press', tags: ['Chest', 'anchor'], notes: 'Note: RIR 0–1, last set can reach failure, controlled tempo — 3×8–12' },
  { id: 'd3-ex3', name: 'Neutral-Grip Lat Pulldown', tags: ['Back', 'anchor'], notes: 'Note: RIR 2, slow eccentric, full stretch — 3×8–12' },
  { id: 'd3-ex4', name: 'Isolation Lat Machine (slight rotation)', tags: ['Back'], notes: 'Note: RIR 1–2, deep stretch, lat focus — 3×10–14' },
  { id: 'd3-ex5', name: 'Chest Fly (machine)', tags: ['Chest'], notes: 'Note: RIR 1, stop when form becomes unclear — 2–3×8–10' },
  { id: 'd3-ex6', name: 'Triceps overhead Extension', tags: ['Triceps'], notes: 'Note: RIR 0–1 — 2×12–15' },
  { id: 'd3-ex7', name: 'Cable Curl (long length)', tags: ['Biceps'], notes: 'Note: RIR 0–1 — 2×12–15' }
];

export const PREDEFINED_TAGS = ['chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'abs', 'warm-up'];
