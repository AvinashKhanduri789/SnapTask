// hooks/useApi.js
import { useState, useCallback } from "react";

export function useApi() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (axiosCall) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axiosCall;
      setData(res.data);
      return { ok: true, data: res.data };
    } catch (err) {
      setError(err);
      return { ok: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { request, data, isLoading, error };
}
