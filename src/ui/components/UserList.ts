import { User } from '../../models/User';
import { Page } from '../../utils/pagination';
import { formatUser } from '../../utils/formatters';
import { createButton } from './Button';
import { renderPagination } from './Pagination';

export interface UserListHandlers {
  onDelete: (userId: string) => void;
  onPageChange: (page: number) => void;
}

export function renderUserList(
  container: HTMLElement,
  page: Page<User>,
  handlers: UserListHandlers,
): void {
  const card = document.createElement('div');
  card.className = 'card shadow-sm p-3 mb-4';

  const heading = document.createElement('h2');
  heading.className = 'h5 mb-3';
  heading.textContent = 'Список Користувачів';
  card.append(heading);

  if (page.totalItems === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-muted mb-0';
    empty.textContent = 'Користувачів ще немає';
    card.append(empty);
    container.append(card);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'list-group list-group-flush';

  page.items.forEach((user) => {
    const item = document.createElement('li');
    item.className = 'list-group-item d-flex justify-content-between align-items-center';

    const text = document.createElement('span');
    text.textContent = formatUser(user);

    const deleteBtn = createButton('Видалити', 'danger', 'button', () =>
      handlers.onDelete(user.getId()),
    );
    deleteBtn.classList.add('btn-sm');

    item.append(text, deleteBtn);
    list.append(item);
  });

  card.append(list);
  renderPagination(card, page.page, page.totalPages, handlers.onPageChange);
  container.append(card);
}
