import { Book } from '../models/Book';
import { User } from '../models/User';
import { Page } from '../utils/pagination';
import { renderBookForm } from './components/BookForm';
import { renderBookList } from './components/BookList';
import { renderSearchBar } from './components/SearchBar';
import { renderUserForm } from './components/UserForm';
import { renderUserList } from './components/UserList';

export interface AppHandlers {
  onAddBook: (book: Book) => void;
  onAddUser: (user: User) => void;
  onSearch: (query: string) => void;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  onDeleteBook: (bookId: string) => void;
  onDeleteUser: (userId: string) => void;
  onBookPageChange: (page: number) => void;
  onUserPageChange: (page: number) => void;
}

export interface ListsState {
  books: Page<Book>;
  users: Page<User>;
  isSearching: boolean;
}

export interface AppView {
  updateLists: (state: ListsState) => void;
}

export function mountApp(root: HTMLElement, handlers: AppHandlers): AppView {
  root.replaceChildren();

  const container = document.createElement('div');
  container.className = 'container py-3';

  const title = document.createElement('h1');
  title.className = 'text-center my-4';
  title.textContent = 'Система Управління Бібліотекою';
  container.append(title);

  renderBookForm(container, handlers.onAddBook);
  renderUserForm(container, handlers.onAddUser);
  renderSearchBar(container, handlers.onSearch);

  const bookSection = document.createElement('div');
  const userSection = document.createElement('div');
  container.append(bookSection, userSection);
  root.append(container);

  return {
    updateLists(state: ListsState): void {
      bookSection.replaceChildren();
      userSection.replaceChildren();

      renderBookList(
        bookSection,
        state.books,
        {
          onBorrow: handlers.onBorrow,
          onReturn: handlers.onReturn,
          onDelete: handlers.onDeleteBook,
          onPageChange: handlers.onBookPageChange,
        },
        state.isSearching,
      );
      renderUserList(userSection, state.users, {
        onDelete: handlers.onDeleteUser,
        onPageChange: handlers.onUserPageChange,
      });
    },
  };
}
