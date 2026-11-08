import { IBook } from '../models/interfaces/IBook';
import { IUser } from '../models/interfaces/IUser';

export function formatBook(book: IBook): string {
  return `${book.getTitle()} by ${book.getAuthor()} (${book.getYear()})`;
}

export function formatUser(user: IUser): string {
  return `${user.getId()} ${user.getName()} (${user.getEmail()})`;
}
