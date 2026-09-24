import { useMemo, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
// Keeps ticks for the session when localStorage is unavailable (private mode, blocked storage)
const memory = new Map<string, string>();

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    memory.set(key, value);
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function parse(raw: string | null, count: number): boolean[] {
  const empty = Array<boolean>(count).fill(false);
  if (!raw) {
    return empty;
  }
  try {
    const value: unknown = JSON.parse(raw);
    const isValid =
      Array.isArray(value) &&
      value.length === count &&
      value.every((v) => typeof v === "boolean");
    return isValid ? value : empty;
  } catch {
    return empty;
  }
}

/** Ticked cells of a grid, persisted in localStorage under `key`. */
export function useTicks(key: string, count: number) {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const ticked = useMemo(() => parse(raw, count), [raw, count]);

  function toggle(index: number) {
    write(
      key,
      JSON.stringify(
        ticked.map((isTicked, i) => (i === index ? !isTicked : isTicked)),
      ),
    );
  }

  return { ticked, toggle };
}
