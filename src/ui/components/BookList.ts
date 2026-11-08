import { Book } from '../../models/Book';
import { formatBook } from '../../utils/formatters';
import { createButton } from './Button';

export interface BookListHandlers {
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
}

export function renderBookList(
  container: HTMLElement,
  books: Book[],
  handlers: BookListHandlers,
): void {
  const card = document.createElement('div');
  card.className = 'card shadow-sm p-3 mb-4';

  const heading = document.createElement('h2');
  heading.className = 'h5 mb-3';
  heading.textContent = 'Список Книг';
  card.append(heading);

  if (books.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-muted mb-0';
    empty.textContent = 'Книг ще немає';
    card.append(empty);
    container.append(card);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'list-group list-group-flush';

  books.forEach((book) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';

    const text = document.createElement('span');
    text.textContent = formatBook(book);

    const button = createButton(
      book.isBorrowed() ? 'Повернути' : 'Позичити',
      book.isBorrowed() ? 'warning' : 'primary',
      'button',
      () => (book.isBorrowed() ? handlers.onReturn(book.getId()) : handlers.onBorrow(book.getId())),
    );
    button.classList.add('btn-sm');

    item.append(text, button);
    list.append(item);
  });

  card.append(list);
  container.append(card);
}
