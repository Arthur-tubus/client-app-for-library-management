// Validation namespace
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Validation {
  export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    fieldErrors: Record<string, string>;
  }

  const REQUIRED_MESSAGE = "Це поле є обов'язковим";
  const DIGITS_REGEX = /^\d+$/;
  // рік від 1000 до 2099
  const YEAR_REGEX = /^(1\d{3}|20\d{2})$/;

  export function isRequired(value: string): boolean {
    return value.trim().length > 0;
  }

  export function isDigitsOnly(value: string): boolean {
    return DIGITS_REGEX.test(value.trim());
  }

  export function isYear(value: string): boolean {
    const trimmed = value.trim();
    return YEAR_REGEX.test(trimmed) && Number(trimmed) <= new Date().getFullYear();
  }

  const buildResult = (fieldErrors: Record<string, string>): ValidationResult => {
    const errors = Object.values(fieldErrors);
    return { isValid: errors.length === 0, errors, fieldErrors };
  };

  export function validateBookForm(data: {
    title: string;
    author: string;
    year: string;
  }): ValidationResult {
    const fieldErrors: Record<string, string> = {};

    if (!isRequired(data.title)) {
      fieldErrors.title = REQUIRED_MESSAGE;
    }
    if (!isRequired(data.author)) {
      fieldErrors.author = REQUIRED_MESSAGE;
    }
    if (!isRequired(data.year)) {
      fieldErrors.year = REQUIRED_MESSAGE;
    } else if (!isDigitsOnly(data.year)) {
      fieldErrors.year = 'Рік має містити лише цифри';
    } else if (!isYear(data.year)) {
      fieldErrors.year = 'Введіть коректний рік (наприклад, 2004)';
    }

    return buildResult(fieldErrors);
  }

  export function validateUserForm(data: { name: string; email: string }): ValidationResult {
    const fieldErrors: Record<string, string> = {};

    if (!isRequired(data.name)) {
      fieldErrors.name = REQUIRED_MESSAGE;
    }
    if (!isRequired(data.email)) {
      fieldErrors.email = REQUIRED_MESSAGE;
    }

    return buildResult(fieldErrors);
  }

  export function validateUserId(value: string): ValidationResult {
    const fieldErrors: Record<string, string> = {};

    if (!isRequired(value)) {
      fieldErrors.id = REQUIRED_MESSAGE;
    } else if (!isDigitsOnly(value)) {
      fieldErrors.id = 'ID має містити лише цифри';
    }

    return buildResult(fieldErrors);
  }
}
