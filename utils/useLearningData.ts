"use client";

import { useEffect, useState } from "react";

export function useLearningData<T>(items: T[]) {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setData(items);
        setError(null);
      } catch {
        setError("We could not load this lesson. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [items]);

  return { data, isLoading, error };
}
