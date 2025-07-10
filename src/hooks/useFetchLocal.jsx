// src/hooks/useFetchLocal.js
import { useState, useEffect, useCallback } from "react";

export const useFetchLocal = (fetchFunction, params = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useCallback untuk memastikan fetcher function tidak berubah setiap render
  const memoizedFetchFunction = useCallback(async () => {
    try {
      setLoading(true);
      setError(null); // Reset error on new fetch
      const result = await fetchFunction(params);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, params]); // Dependency array: re-run if fetchFunction or params change

  useEffect(() => {
    memoizedFetchFunction();
  }, [memoizedFetchFunction]);

  return { data, loading, error };
};
