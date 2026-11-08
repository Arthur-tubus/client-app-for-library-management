import { ButtonVariant, createButton } from './Button';

export interface FieldConfig<T> {
  name: keyof T;
  label: string;
  type: 'text' | 'number';
}

export interface FormValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors?: Record<string, string>;
}

export interface FormBuilderOptions<T> {
  title?: string;
  fields: FieldConfig<T>[];
  submitLabel: string;
  submitVariant?: ButtonVariant;
  validate: (data: T) => FormValidationResult;
  onValid: (data: T) => void;
}

export function buildForm<T extends Record<string, string>>(
  options: FormBuilderOptions<T>,
): HTMLFormElement {
  const form = document.createElement('form');
  form.className = 'card p-3 mb-4';
  form.noValidate = true;

  if (options.title) {
    const heading = document.createElement('h2');
    heading.className = 'h5 mb-3';
    heading.textContent = options.title;
    form.append(heading);
  }

  const inputs = new Map<keyof T, HTMLInputElement>();
  const errorEls = new Map<keyof T, HTMLDivElement>();

  options.fields.forEach((field) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'mb-2';

    const input = document.createElement('input');
    input.type = field.type;
    input.className = 'form-control';
    input.name = String(field.name);
    input.placeholder = field.label;
    input.setAttribute('aria-label', field.label);

    const error = document.createElement('div');
    error.className = 'text-danger small';

    inputs.set(field.name, input);
    errorEls.set(field.name, error);
    wrapper.append(input, error);
    form.append(wrapper);
  });

  form.append(createButton(options.submitLabel, options.submitVariant ?? 'success', 'submit'));

  const clearErrors = (): void => {
    inputs.forEach((input) => input.classList.remove('is-invalid'));
    errorEls.forEach((el) => {
      el.textContent = '';
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const data = {} as T;
    inputs.forEach((input, key) => {
      data[key] = input.value as T[typeof key];
    });

    const result = options.validate(data);
    if (!result.isValid) {
      Object.entries(result.fieldErrors ?? {}).forEach(([name, message]) => {
        const key = name as keyof T;
        inputs.get(key)?.classList.add('is-invalid');
        const el = errorEls.get(key);
        if (el) {
          el.textContent = message;
        }
      });
      return;
    }

    options.onValid(data);
    form.reset();
  });

  return form;
}
