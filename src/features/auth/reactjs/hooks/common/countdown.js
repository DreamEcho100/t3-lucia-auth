// An implementation of a countdown timer using React hooks

import { useCallback, useEffect, useState } from "react";

/**
 * @param {number} seconds
 * @returns {number}
 */
function countdown(seconds) {
  return Math.max(0, seconds - 1);
}

/**
 * @typedef {{
 * 	count: number;
 * 	isRunning: boolean;
 * 	startCountdown: () => void;
 * 	stopCountdown: () => void;
 * 	resetCountdown: () => void;
 * }} UseCountdownReturn
 */

/**
 * @param {{
 * 	countStart: number;
 *  intervalMs?: number;
 *	countStop?: number;
 *	isIncrement?: boolean;
 * }} params
 * @returns {UseCountdownReturn}
 */

export function useCountdown({
  countStart,
  intervalMs = 1000,
  countStop = 0,
  isIncrement = false,
}) {
  const [count, setCount] = useState(countStart);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setCount((prev) => {
          if (isIncrement) {
            if (prev >= countStop) {
              clearInterval(timer);
              setIsRunning(false);
              return prev;
            }

            return prev + 1;
          }

          if (prev <= countStop) {
            clearInterval(timer);
            setIsRunning(false);
            return prev;
          }
          return prev - 1;
        });
      }, intervalMs);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isRunning, intervalMs, countStop, isIncrement]);

  const startCountdown = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopCountdown = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetCountdown = useCallback(() => {
    setIsRunning(false);
    setCount(countStart);
  }, [countStart]);

  return { count, isRunning, startCountdown, stopCountdown, resetCountdown };
}

export default useCountdown;
