import { Book } from '../../models/Book';
import { Page } from '../../utils/pagination';
import { formatBook } from '../../utils/formatters';
import { createButton } from './Button';
import { renderPagination } from './Pagination';

export interface BookListHandlers {
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  onDelete: (bookId: string) => void;
  onPageChange: (page: number) => void;
}

export function renderBookList(
  container: HTMLElement,
  page: Page<Book>,
  handlers: BookListHandlers,
  isSearching: boolean,
): void {
  const card = document.createElement('div');
  card.className = 'card shadow-sm p-3 mb-4';

  const heading = document.createElement('h2');
  heading.className = 'h5 mb-3';
  heading.textContent = 'Список Книг';
  card.append(heading);

  if (page.totalItems === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-muted mb-0';
    empty.textContent = isSearching ? 'Нічого не знайдено' : 'Книг ще немає';
    card.append(empty);
    container.append(card);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'list-group list-group-flush';

  page.items.forEach((book) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';

    const text = document.createElement('span');
    text.textContent = formatBook(book);

    const borrowBtn = createButton(
      book.isBorrowed() ? 'Повернути' : 'Позичити',
      book.isBorrowed() ? 'warning' : 'primary',
      'button',
      () => (book.isBorrowed() ? handlers.onReturn(book.getId()) : handlers.onBorrow(book.getId())),
    );
    borrowBtn.classList.add('btn-sm');

    const deleteBtn = createButton('Видалити', 'danger', 'button', () =>
      handlers.onDelete(book.getId()),
    );
    deleteBtn.classList.add('btn-sm');

    const actions = document.createElement('div');
    actions.className = 'd-flex gap-2';
    actions.append(borrowBtn, deleteBtn);

    item.append(text, actions);
    list.append(item);
  });

  card.append(list);
  renderPagination(card, page.page, page.totalPages, handlers.onPageChange);
  container.append(card);
}
