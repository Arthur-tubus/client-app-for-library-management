// точка входу, збирає все разом

import { Book } from './models/Book';
import { User } from './models/User';
import { LibraryService, MAX_BORROWED_BOOKS } from './services/LibraryService';
import { NotificationService } from './services/NotificationService';
import { Storage } from './services/Storage';
import { confirmModal, promptModal, showModal } from './ui/components/Modal';
import { AppView, mountApp } from './ui/render';
import { formatBook, formatUser } from './utils/formatters';
import { paginate } from './utils/pagination';
import { Validation } from './utils/validators';

const PAGE_SIZE = 5;

class App {
  private readonly service = new LibraryService(new Storage());
  private readonly notifications = new NotificationService();
  private readonly view: AppView;
  private searchQuery = '';
  private bookPage = 1;
  private userPage = 1;

  constructor() {
    const root = document.getElementById('app');
    if (!root) {
      throw new Error('Не знайдено елемент #app');
    }

    this.notifications.subscribe((notification) => {
      void showModal({
        title: notification.title,
        message: notification.message,
        type: notification.type,
      });
    });

    this.view = mountApp(root, {
      onAddBook: (book) => this.handleAddBook(book),
      onAddUser: (user) => this.handleAddUser(user),
      onSearch: (query) => this.handleSearch(query),
      onBorrow: (bookId) => void this.handleBorrow(bookId),
      onReturn: (bookId) => this.handleReturn(bookId),
      onDeleteBook: (bookId) => void this.handleDeleteBook(bookId),
      onDeleteUser: (userId) => void this.handleDeleteUser(userId),
      onBookPageChange: (page) => {
        this.bookPage = page;
        this.refresh();
      },
      onUserPageChange: (page) => {
        this.userPage = page;
        this.refresh();
      },
    });

    this.refresh();
  }

  private refresh(): void {
    const books = paginate(this.service.searchBooks(this.searchQuery), this.bookPage, PAGE_SIZE);
    const users = paginate(this.service.getUsers(), this.userPage, PAGE_SIZE);

    // paginate обмежує номер сторінки, тож запам'ятовуємо реальний
    this.bookPage = books.page;
    this.userPage = users.page;

    this.view.updateLists({ books, users, isSearching: this.searchQuery.trim() !== '' });
  }

  private handleAddBook(book: Book): void {
    this.service.addBook(book);
    this.bookPage = Infinity; // перейти на останню сторінку, де зʼявилась нова книга
    this.refresh();
  }

  private handleAddUser(user: User): void {
    this.service.addUser(user);
    this.userPage = Infinity;
    this.refresh();
  }

  private handleSearch(query: string): void {
    this.searchQuery = query;
    this.bookPage = 1;
    this.refresh();
  }

  private async handleBorrow(bookId: string): Promise<void> {
    const userId = await promptModal({
      title: 'Введіть ID користувача для позичення книги:',
      placeholder: 'ID',
      validate: (value) => Validation.validateUserId(value).fieldErrors.id ?? null,
    });
    if (userId === null) {
      return;
    }

    const result = this.service.borrowBook(bookId, userId);

    switch (result.status) {
      case 'success':
        this.refresh();
        this.notifications.success(
          '',
          `${formatBook(result.book)} has been borrowed by ${formatUser(result.user)}.`,
        );
        break;
      case 'limit-reached':
        this.notifications.error(
          'Ліміт перевищено',
          `Користувач ${formatUser(result.user)} вже позичив максимальну кількість книг (${MAX_BORROWED_BOOKS}). Спершу потрібно повернути одну з них.`,
        );
        break;
      case 'user-not-found':
        this.notifications.error('Користувача не знайдено', `Користувача з ID ${userId} не існує.`);
        break;
      case 'already-borrowed':
        this.refresh();
        this.notifications.error('Книга недоступна', 'Цю книгу вже позичено.');
        break;
      case 'book-not-found':
        this.refresh();
        this.notifications.error('Помилка', 'Книгу не знайдено.');
        break;
    }
  }

  private handleReturn(bookId: string): void {
    const book = this.service.returnBook(bookId);
    if (!book) {
      return;
    }
    this.refresh();
    this.notifications.success('', `${formatBook(book)} has been returned.`);
  }

  private async handleDeleteBook(bookId: string): Promise<void> {
    const book = this.service.getBooks().find((b) => b.getId() === bookId);
    if (!book) {
      return;
    }

    const confirmed = await confirmModal(`Видалити книгу «${formatBook(book)}»?`);
    if (!confirmed) {
      return;
    }

    this.service.deleteBook(bookId);
    this.refresh();
  }

  private async handleDeleteUser(userId: string): Promise<void> {
    const user = this.service.getUsers().find((u) => u.getId() === userId);
    if (!user) {
      return;
    }

    const confirmed = await confirmModal(`Видалити користувача ${formatUser(user)}?`);
    if (!confirmed) {
      return;
    }

    const result = this.service.deleteUser(userId);
    if (result === 'has-borrowed-books') {
      this.notifications.error(
        'Не можна видалити',
        `Користувач ${formatUser(user)} має позичені книги. Спершу їх треба повернути.`,
      );
      return;
    }
    this.refresh();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
