import { AppData } from '../types';
import { seedData } from '../data/seed';

const STORAGE_KEY = 'intern-energy-lite-data-v1';

export function loadData(): AppData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }

  try {
    return JSON.parse(raw) as AppData;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
