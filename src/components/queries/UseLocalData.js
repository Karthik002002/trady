import { useEffect, useState } from "react";

export const useLocalUserData = () => {
  const [LocalData, setLocalData] = useState(() => {
    return JSON.parse(window.localStorage.getItem("user"));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = JSON.parse(window.localStorage.getItem("user"));
      setLocalData((prev) => {
        return JSON.stringify(prev) !== JSON.stringify(stored) ? stored : prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return LocalData;
};
