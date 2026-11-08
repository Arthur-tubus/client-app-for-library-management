import { Book } from '../models/Book';
import { User } from '../models/User';
import { IBookData } from '../models/interfaces/IBook';
import { IUserData } from '../models/interfaces/IUser';
import { Library } from './Library';
import { Storage } from './Storage';

export const MAX_BORROWED_BOOKS = 3;

const BOOKS_KEY = 'library:books';
const USERS_KEY = 'library:users';

export type BorrowResult =
  | { status: 'success'; book: Book; user: User }
  | { status: 'book-not-found' }
  | { status: 'already-borrowed' }
  | { status: 'user-not-found' }
  | { status: 'limit-reached'; user: User };

export class LibraryService {
  private readonly books: Library<Book>;
  private readonly users: Library<User>;

  constructor(private readonly storage: Storage) {
    const bookData = storage.load<IBookData[]>(BOOKS_KEY) ?? [];
    const userData = storage.load<IUserData[]>(USERS_KEY) ?? [];

    this.books = new Library<Book>(bookData.map((data) => Book.fromJSON(data)));
    this.users = new Library<User>(userData.map((data) => User.fromJSON(data)));
  }

  getBooks(): Book[] {
    return this.books.getAll();
  }

  getUsers(): User[] {
    return this.users.getAll();
  }

  addBook(book: Book): void {
    this.books.add(book);
    this.saveBooks();
  }

  addUser(user: User): void {
    this.users.add(user);
    this.saveUsers();
  }

  countBorrowedBy(userId: string): number {
    return this.books.find((book) => book.getBorrowedBy() === userId).length;
  }

  borrowBook(bookId: string, userId: string): BorrowResult {
    const book = this.books.findById(bookId);
    if (!book) {
      return { status: 'book-not-found' };
    }
    if (book.isBorrowed()) {
      return { status: 'already-borrowed' };
    }

    const user = this.users.findById(userId);
    if (!user) {
      return { status: 'user-not-found' };
    }
    if (this.countBorrowedBy(userId) >= MAX_BORROWED_BOOKS) {
      return { status: 'limit-reached', user };
    }

    book.borrow(userId);
    this.saveBooks();
    return { status: 'success', book, user };
  }

  returnBook(bookId: string): Book | undefined {
    const book = this.books.findById(bookId);
    if (!book || !book.isBorrowed()) {
      return undefined;
    }

    book.returnBook();
    this.saveBooks();
    return book;
  }

  private saveBooks(): void {
    this.storage.save(
      BOOKS_KEY,
      this.books.getAll().map((book) => book.toJSON()),
    );
  }

  private saveUsers(): void {
    this.storage.save(
      USERS_KEY,
      this.users.getAll().map((user) => user.toJSON()),
    );
  }
}
