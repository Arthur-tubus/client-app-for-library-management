export type NotificationType = 'info' | 'success' | 'error';

export interface AppNotification {
  title: string;
  message: string;
  type: NotificationType;
}

type Listener = (notification: AppNotification) => void;

export class NotificationService {
  private listeners: Listener[] = [];

  subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify(notification: AppNotification): void {
    this.listeners.forEach((listener) => listener(notification));
  }

  info(title: string, message: string): void {
    this.notify({ title, message, type: 'info' });
  }

  success(title: string, message: string): void {
    this.notify({ title, message, type: 'success' });
  }

  error(title: string, message: string): void {
    this.notify({ title, message, type: 'error' });
  }
}
