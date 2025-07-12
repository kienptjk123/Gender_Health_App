export interface CycleInputProps {
  onNext?: (cycleId: number) => void; // Changed to pass cycleId
}

export interface FormData {
  startDate: string;
  cycleLength: number;
  periodLength: number;
}

export interface CreateMenstrualCycleData {
  customer_profile_id: number;
  startDate: string;
  cycleLength: number;
  periodLength: number;
}

export interface MenstrualCycleResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    customer_profile_id: string;
    startDate: string;
    cycleLength: number;
    periodLength: number;
    createdAt: string;
    updatedAt: string;
  };
}
export interface FertilityProps {
  menstrualCycleId: number | null;
  onNext?: () => void;
  onSkipAll?: () => void;
}

export interface FertilityData {
  menstrual_cycle_id: number;
  temperature: number;
  weight: number;
  description: string;
  cervicalMucus: string;
}
export interface MedicationProps {
  menstrualCycleId: number | null;
  onNext?: () => void;
  onSkipAll?: () => void;
}

export interface MedicationData {
  menstrual_cycle_id: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes: string;
}
export interface MoodProps {
  menstrualCycleId: number | null;
  onNext?: () => void;
  onSkipAll?: () => void;
}

export interface MoodData {
  menstrual_cycle_id: number;
  moodType: string;
  description: string;
}
export interface PredictionData {
  prediction: {
    id: number;
    predictedStartDate: string;
    predictedEndDate: string;
    cycleLength: number;
    createdAt: string;
    customerProfileId: number;
  };
  pregnancyAbility: {
    fertileWindowStart: string;
    fertileWindowEnd: string;
    pregnancyPercent: number;
  };
}

export interface Prediction {
  message: string;
  data: PredictionData;
}
export interface SymptomsProps {
  menstrualCycleId: number | null;
  onNext?: () => void;
  onSkipAll?: () => void;
}

export interface SymptomData {
  menstrual_cycle_id: number;
  date: string;
  symptomType: string;
  description: string;
}

export interface CreateSymptomData {
  menstrual_cycle_id: number;
  date: string;
  symptomType: string;
  description?: string;
}

export interface CreateFertilityData {
  menstrual_cycle_id: number;
  temperature: number;
  weight: number;
  description?: string;
  cervicalMucus?: string;
}

export interface CreateMedicationData {
  menstrual_cycle_id: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface CreateMoodData {
  menstrual_cycle_id: number;
  moodType: string;
  description: string;
}

export interface DailySymptomResponse {
  message: string;
  data: {
    id: number;
    menstrualCycleId: number;
  };
}
