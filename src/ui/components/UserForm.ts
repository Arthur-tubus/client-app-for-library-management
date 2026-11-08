import { User } from '../../models/User';
import { Validation } from '../../utils/validators';
import { buildForm } from './FormBuilder';

interface UserFormData extends Record<string, string> {
  name: string;
  email: string;
}

export function renderUserForm(container: HTMLElement, onSubmit: (user: User) => void): void {
  const form = buildForm<UserFormData>({
    title: 'Додати Користувача',
    fields: [
      { name: 'name', label: "Ім'я", type: 'text' },
      { name: 'email', label: 'Email', type: 'text' },
    ],
    submitLabel: 'Додати Користувача',
    validate: Validation.validateUserForm,
    onValid: (data) => onSubmit(new User(data.name, data.email)),
  });

  container.append(form);
}
