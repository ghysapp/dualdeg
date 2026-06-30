/**
 * Thin TTL cache on top of AsyncStorage. Each entry stores the value plus the
 * epoch-ms it was written, so callers can decide freshness against a TTL.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

interface Envelope<T> {
  t: number; // fetchedAt, epoch ms
  v: T;
}

export interface CacheHit<T> {
  value: T;
  fetchedAt: number;
  /** Age of the entry in ms at read time. */
  age: number;
}

export async function readCache<T>(key: string): Promise<CacheHit<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const env = JSON.parse(raw) as Envelope<T>;
    return { value: env.v, fetchedAt: env.t, age: Date.now() - env.t };
  } catch {
    return null;
  }
}

export async function writeCache<T>(key: string, value: T): Promise<void> {
  const env: Envelope<T> = { t: Date.now(), v: value };
  try {
    await AsyncStorage.setItem(key, JSON.stringify(env));
  } catch {
    // A cache write failure shouldn't break the app.
  }
}

export async function removeCache(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    // ignore
  }
}

// Generic JSON persistence (used for the saved-cities list).
export async function loadJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function saveJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}
