import { useEffect, useState } from 'react';
import { BASE_URL } from '@/lib/api';

interface ModelStatus {
  status: 'ready' | 'no_models' | 'error';
  modelType: string | null;
  lastTrained: string | null;
  availableModels: string[];
  totalModels: number;
}

interface SystemStatus {
  api: {
    status: 'online' | 'offline' | 'degraded';
    latency: number;
    lastChecked: string;
  };
  model: ModelStatus;
  engine: {
    status: 'running' | 'degraded' | 'error';
    currentModel: string | null;
    version: string;
    cpu_usage: number;
    memory_usage: number;
  };
}

export function useSystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/system/status`);
        if (!response.ok) throw new Error('Failed to fetch status');
        const data = await response.json();
        setStatus(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        
        setStatus({
          api: { status: 'offline', latency: 0, lastChecked: new Date().toISOString() },
          model: { status: 'error', modelType: null, lastTrained: null, availableModels: [], totalModels: 0 },
          engine: { status: 'error', currentModel: null, version: 'unknown', cpu_usage: 0, memory_usage: 0 }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return { status, loading, error };
}