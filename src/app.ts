// точка входу, збирає все разом
import { Book } from './models/Book';
import { User } from './models/User';
import { LibraryService, MAX_BORROWED_BOOKS } from './services/LibraryService';
import { NotificationService } from './services/NotificationService';
import { Storage } from './services/Storage';
import { promptModal, showModal } from './ui/components/Modal';
import { renderApp } from './ui/render';
import { formatBook, formatUser } from './utils/formatters';
import { Validation } from './utils/validators';

class App {
  private readonly service = new LibraryService(new Storage());
  private readonly notifications = new NotificationService();
  private readonly root: HTMLElement;

  constructor() {
    const root = document.getElementById('app');
    if (!root) {
      throw new Error('Не знайдено елемент #app');
    }
    this.root = root;

    this.notifications.subscribe((notification) => {
      void showModal({
        title: notification.title,
        message: notification.message,
        type: notification.type,
      });
    });

    this.render();
  }

  private render(): void {
    renderApp(this.root, this.service.getBooks(), this.service.getUsers(), {
      onAddBook: (book) => this.handleAddBook(book),
      onAddUser: (user) => this.handleAddUser(user),
      onBorrow: (bookId) => void this.handleBorrow(bookId),
      onReturn: (bookId) => this.handleReturn(bookId),
    });
  }

  private handleAddBook(book: Book): void {
    this.service.addBook(book);
    this.render();
  }

  private handleAddUser(user: User): void {
    this.service.addUser(user);
    this.render();
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
        this.render();
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
        this.render();
        this.notifications.error('Книга недоступна', 'Цю книгу вже позичено.');
        break;
      case 'book-not-found':
        this.render();
        this.notifications.error('Помилка', 'Книгу не знайдено.');
        break;
    }
  }

  private handleReturn(bookId: string): void {
    const book = this.service.returnBook(bookId);
    if (!book) {
      return;
    }
    this.render();
    this.notifications.success('', `${formatBook(book)} has been returned.`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
