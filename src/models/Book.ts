import { generateId } from '../utils/idGenerator';
import { IBook, IBookData } from './interfaces/IBook';

export class Book implements IBook {
  constructor(
    private readonly title: string,
    private readonly author: string,
    private readonly year: number,
    private readonly id: string = generateId(),
    private borrowedBy: string | null = null,
  ) {}

  static fromJSON(data: IBookData): Book {
    return new Book(data.title, data.author, data.year, data.id, data.borrowedBy);
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getAuthor(): string {
    return this.author;
  }

  getYear(): number {
    return this.year;
  }

  isBorrowed(): boolean {
    return this.borrowedBy !== null;
  }

  getBorrowedBy(): string | null {
    return this.borrowedBy;
  }

  borrow(userId: string): void {
    if (this.isBorrowed()) {
      throw new Error('Книгу вже позичено');
    }
    this.borrowedBy = userId;
  }

  returnBook(): void {
    this.borrowedBy = null;
  }

  toJSON(): IBookData {
    return {
      id: this.id,
      title: this.title,
      author: this.author,
      year: this.year,
      borrowedBy: this.borrowedBy,
    };
  }
}
