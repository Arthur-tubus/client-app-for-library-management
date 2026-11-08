// робота з LocalStorage

export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

export class Storage {
  constructor(private readonly store: KeyValueStore = localStorage) {}

  save<T>(key: string, value: T): void {
    this.store.setItem(key, JSON.stringify(value));
  }

  load<T>(key: string): T | null {
    const raw = this.store.getItem(key);
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    this.store.removeItem(key);
  }

  clear(): void {
    this.store.clear();
  }
}
