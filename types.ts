
export interface Entry {
  id: string;
  date: string;
  sets: number;
  reps: number;
  weight: number;
  feeling?: 'heavy' | 'easy' | 'up';
}

export interface Exercise {
  id: string;
  name: string;
  tags: string[];
  notes?: string;
  entries: Entry[];
}

export interface Workout {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface RepoExercise {
  id: string;
  name: string;
  tags: string[];
  notes?: string;
}

export type ViewState = 
  | { type: 'workouts' }
  | { type: 'workout-detail', workoutId: string }
  | { type: 'exercise-detail', workoutId: string, exerciseId: string }
  | { type: 'manage-exercises' };
