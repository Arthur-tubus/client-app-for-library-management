// generic-клас Library<T>

export interface Identifiable {
  getId(): string;
}

export class Library<T extends Identifiable> {
  private items: T[];

  constructor(items: T[] = []) {
    this.items = [...items];
  }

  add(item: T): void {
    if (this.findById(item.getId())) {
      throw new Error(`Елемент з id ${item.getId()} вже існує`);
    }
    this.items.push(item);
  }

  remove(id: string): boolean {
    const index = this.items.findIndex((item) => item.getId() === id);
    if (index === -1) {
      return false;
    }
    this.items.splice(index, 1);
    return true;
  }

  findById(id: string): T | undefined {
    return this.items.find((item) => item.getId() === id);
  }

  find(predicate: (item: T) => boolean): T[] {
    return this.items.filter(predicate);
  }

  getAll(): T[] {
    return [...this.items];
  }

  get count(): number {
    return this.items.length;
  }
}
