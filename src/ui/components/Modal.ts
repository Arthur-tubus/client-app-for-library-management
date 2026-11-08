import { Modal as BootstrapModal } from 'bootstrap';
import { createButton } from './Button';

export type ModalType = 'info' | 'success' | 'error';

export interface ModalOptions {
  title?: string;
  message: string;
  type?: ModalType;
  buttonLabel?: string;
}

export interface PromptOptions {
  title: string;
  placeholder: string;
  validate: (value: string) => string | null;
}

interface ModalParts {
  element: HTMLDivElement;
  body: HTMLDivElement;
  footer: HTMLDivElement;
}

function createModalShell(title?: string): ModalParts {
  const element = document.createElement('div');
  element.className = 'modal fade';
  element.tabIndex = -1;

  const dialog = document.createElement('div');
  dialog.className = 'modal-dialog modal-dialog-centered';

  const content = document.createElement('div');
  content.className = 'modal-content';

  if (title) {
    const header = document.createElement('div');
    header.className = 'modal-header';

    const heading = document.createElement('h5');
    heading.className = 'modal-title';
    heading.textContent = title;

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close';
    closeBtn.setAttribute('data-bs-dismiss', 'modal');
    closeBtn.setAttribute('aria-label', 'Закрити');

    header.append(heading, closeBtn);
    content.append(header);
  }

  const body = document.createElement('div');
  body.className = 'modal-body';

  const footer = document.createElement('div');
  footer.className = 'modal-footer';

  content.append(body, footer);
  dialog.append(content);
  element.append(dialog);

  return { element, body, footer };
}

function openModal(element: HTMLElement): { instance: BootstrapModal; closed: Promise<void> } {
  document.body.append(element);
  const instance = new BootstrapModal(element);

  const closed = new Promise<void>((resolve) => {
    element.addEventListener(
      'hidden.bs.modal',
      () => {
        instance.dispose();
        element.remove();
        resolve();
      },
      { once: true },
    );
  });

  instance.show();
  return { instance, closed };
}

export function showModal(options: ModalOptions): Promise<void> {
  const { element, body, footer } = createModalShell(options.title);

  const text = document.createElement('p');
  text.className = options.type === 'error' ? 'mb-0 text-danger' : 'mb-0';
  text.style.whiteSpace = 'pre-line';
  text.textContent = options.message;
  body.append(text);

  const okBtn = createButton(options.buttonLabel ?? 'Зрозуміло!', 'primary');
  okBtn.setAttribute('data-bs-dismiss', 'modal');
  footer.append(okBtn);

  return openModal(element).closed;
}

export function promptModal(options: PromptOptions): Promise<string | null> {
  const { element, body, footer } = createModalShell(options.title);

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control form-control-lg';
  input.placeholder = options.placeholder;

  const error = document.createElement('div');
  error.className = 'text-danger small mt-1';

  body.append(input, error);

  let result: string | null = null;

  const submit = (): void => {
    const value = input.value.trim();
    const message = options.validate(value);
    if (message) {
      error.textContent = message;
      input.classList.add('is-invalid');
      return;
    }
    result = value;
    instance.hide();
  };

  const cancelBtn = createButton('Скасувати', 'secondary');
  cancelBtn.setAttribute('data-bs-dismiss', 'modal');
  const saveBtn = createButton('Зберегти', 'primary', 'button', submit);
  footer.append(cancelBtn, saveBtn);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      submit();
    }
  });
  element.addEventListener('shown.bs.modal', () => input.focus());

  const { instance, closed } = openModal(element);
  return closed.then(() => result);
}
