export function renderSearchBar(container: HTMLElement, onSearch: (query: string) => void): void {
  const card = document.createElement('div');
  card.className = 'card shadow-sm p-3 mb-4';

  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'form-control';
  input.placeholder = 'Пошук книг за автором або назвою';
  input.setAttribute('aria-label', 'Пошук книг');
  input.addEventListener('input', () => onSearch(input.value));

  card.append(input);
  container.append(card);
}
