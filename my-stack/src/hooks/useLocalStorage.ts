import { useEffect, useState } from "react";

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
  validate?: (value: unknown) => value is T
) => {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) {
        return initialValue;
      }

      const parsed = JSON.parse(stored) as unknown;
      if (validate && !validate(parsed)) {
        return initialValue;
      }

      return parsed as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write errors.
    }
  }, [key, value]);

  return [value, setValue] as const;
};
