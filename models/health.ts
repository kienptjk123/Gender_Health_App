// Health Data Types
export interface PeriodData {
  id: string;
  userId: string;
  startDate: string;
  endDate?: string;
  cycleLength: number;
  flow: 'light' | 'medium' | 'heavy';
  symptoms: string[];
}

export interface MoodData {
  id: string;
  userId: string;
  date: string;
  mood: 'happy' | 'sad' | 'anxious' | 'angry' | 'calm' | 'energetic';
  notes?: string;
}

export interface SymptomData {
  id: string;
  userId: string;
  date: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

// Health API Request/Response Types
export interface PeriodRequest {
  startDate: string;
  endDate?: string;
  flow: 'light' | 'medium' | 'heavy';
  symptoms?: string[];
}

export interface MoodRequest {
  date: string;
  mood: 'happy' | 'sad' | 'anxious' | 'angry' | 'calm' | 'energetic';
  notes?: string;
}

export interface SymptomRequest {
  date: string;
  symptoms: string[];
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}
