export interface IBookData {
  id: string;
  title: string;
  author: string;
  year: number;
  borrowedBy: string | null;
}

export interface IBook {
  getId(): string;
  getTitle(): string;
  getAuthor(): string;
  getYear(): number;
  isBorrowed(): boolean;
  getBorrowedBy(): string | null;
  borrow(userId: string): void;
  returnBook(): void;
  toJSON(): IBookData;
}
