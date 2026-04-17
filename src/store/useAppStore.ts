import { create } from "zustand";

export type FitResult = {
  ticker: string;
  success: boolean;
  message: string;
  aic?: number;
  bic?: number;
  p?: number;
  q?: number;
  n_observations?: number;
  timestamp: string;
};

export type PredictResult = {
  ticker: string;
  n_days: number;
  success: boolean;
  forecast: Record<string, number>;
  message: string;
  timestamp: string;
};

interface AppState {
  fitHistory: FitResult[];
  predictHistory: PredictResult[];
  lastFit: FitResult | null;
  lastPrediction: PredictResult | null;
  addFitResult: (result: FitResult) => void;
  addPredictResult: (result: PredictResult) => void;
  clearHistory: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  fitHistory: [],
  predictHistory: [],
  lastFit: null,
  lastPrediction: null,

  addFitResult: (result) =>
    set((state) => ({
      fitHistory: [result, ...state.fitHistory].slice(0, 20),
      lastFit: result,
    })),

  addPredictResult: (result) =>
    set((state) => ({
      predictHistory: [result, ...state.predictHistory].slice(0, 20),
      lastPrediction: result,
    })),

  clearHistory: () =>
    set({ fitHistory: [], predictHistory: [], lastFit: null, lastPrediction: null }),
}));