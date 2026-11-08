export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';

export function createButton(
  label: string,
  variant: ButtonVariant = 'primary',
  type: 'button' | 'submit' = 'button',
  onClick?: () => void,
): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = type;
  button.className = `btn btn-${variant}`;
  button.textContent = label;

  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
}
