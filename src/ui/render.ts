// точки монтування, оновлення DOM
import { Book } from '../models/Book';
import { User } from '../models/User';
import { renderBookForm } from './components/BookForm';
import { renderBookList } from './components/BookList';
import { renderUserForm } from './components/UserForm';
import { renderUserList } from './components/UserList';

export interface AppHandlers {
  onAddBook: (book: Book) => void;
  onAddUser: (user: User) => void;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
}

export function renderApp(
  root: HTMLElement,
  books: Book[],
  users: User[],
  handlers: AppHandlers,
): void {
  root.replaceChildren();

  const container = document.createElement('div');
  container.className = 'container py-3';

  const title = document.createElement('h1');
  title.className = 'text-center my-4';
  title.textContent = 'Система Управління Бібліотекою';
  container.append(title);

  renderBookForm(container, handlers.onAddBook);
  renderUserForm(container, handlers.onAddUser);
  renderBookList(container, books, { onBorrow: handlers.onBorrow, onReturn: handlers.onReturn });
  renderUserList(container, users);

  root.append(container);
}
