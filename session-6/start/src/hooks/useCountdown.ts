import { useEffect, useRef, useState } from "react";

// Nedtelling som rydder opp etter seg. onDone kalles én gang når tiden er ute.
export function useCountdown(seconds: number, onDone?: () => void): number {
  const [left, setLeft] = useState(seconds);

  // Husk siste versjon av onDone uten å starte timeren på nytt hver gang den endres.
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    // Math.max: går aldri under null. Når left allerede er 0, endres ikke state, og React rendrer ikke på nytt.
    const id = setInterval(() => setLeft((s) => Math.max(s - 1, 0)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (left === 0) onDoneRef.current?.();
  }, [left]);

  return left;
}
