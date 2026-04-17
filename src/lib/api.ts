const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface FitPayload {
  ticker: string;
  use_new_data: boolean;
  n_observations: number;
  p: number;
  q: number;
}

export interface FitResponse {
  ticker: string;
  use_new_data: boolean;
  n_observations: number;
  p: number;
  q: number;
  success: boolean;
  message: string;
}

export interface PredictPayload {
  ticker: string;
  n_days: number;
}

export interface PredictResponse {
  ticker: string;
  n_days: number;
  success: boolean;
  forecast: Record<string, number>;
  message: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // hello: () => request<{ message: string }>("/hello"),

  fit: (payload: FitPayload) =>
    request<FitResponse>("/fit", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  predict: (payload: PredictPayload) =>
    request<PredictResponse>("/predict", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};