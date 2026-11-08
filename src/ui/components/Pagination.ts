export function renderPagination(
  container: HTMLElement,
  page: number,
  totalPages: number,
  onChange: (page: number) => void,
): void {
  if (totalPages <= 1) {
    return;
  }

  const nav = document.createElement('nav');
  nav.className = 'mt-3';
  nav.setAttribute('aria-label', 'Пагінація');

  const list = document.createElement('ul');
  list.className = 'pagination pagination-sm justify-content-center mb-0';

  const addItem = (label: string, target: number, disabled = false, active = false): void => {
    const item = document.createElement('li');
    item.className = `page-item${disabled ? ' disabled' : ''}${active ? ' active' : ''}`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'page-link';
    button.textContent = label;
    if (!disabled) {
      button.addEventListener('click', () => onChange(target));
    }

    item.append(button);
    list.append(item);
  };

  addItem('«', page - 1, page === 1);
  for (let i = 1; i <= totalPages; i++) {
    addItem(String(i), i, false, i === page);
  }
  addItem('»', page + 1, page === totalPages);

  nav.append(list);
  container.append(nav);
}
