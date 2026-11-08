import { Book } from '../../models/Book';
import { Validation } from '../../utils/validators';
import { buildForm } from './FormBuilder';

interface BookFormData extends Record<string, string> {
  title: string;
  author: string;
  year: string;
}

export function renderBookForm(container: HTMLElement, onSubmit: (book: Book) => void): void {
  const form = buildForm<BookFormData>({
    title: 'Додати Книгу',
    fields: [
      { name: 'title', label: 'Назва книги', type: 'text' },
      { name: 'author', label: 'Автор', type: 'text' },
      { name: 'year', label: 'Рік видання', type: 'text' },
    ],
    submitLabel: 'Додати Книгу',
    validate: Validation.validateBookForm,
    onValid: (data) => onSubmit(new Book(data.title, data.author, Number(data.year))),
  });

  container.append(form);
}
