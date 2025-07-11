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
