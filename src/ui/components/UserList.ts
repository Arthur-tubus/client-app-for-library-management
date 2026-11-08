import { User } from '../../models/User';
import { formatUser } from '../../utils/formatters';

export function renderUserList(container: HTMLElement, users: User[]): void {
  const card = document.createElement('div');
  card.className = 'card shadow-sm p-3 mb-4';

  const heading = document.createElement('h2');
  heading.className = 'h5 mb-3';
  heading.textContent = 'Список Користувачів';
  card.append(heading);

  if (users.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-muted mb-0';
    empty.textContent = 'Користувачів ще немає';
    card.append(empty);
    container.append(card);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'list-group list-group-flush';

  users.forEach((user) => {
    const item = document.createElement('li');
    item.className = 'list-group-item';
    item.textContent = formatUser(user);
    list.append(item);
  });

  card.append(list);
  container.append(card);
}
