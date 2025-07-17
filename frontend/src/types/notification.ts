import { type VariantType } from "notistack";

export interface NotificationOptions {
  variant?: VariantType;
  autoHideDuration?: number;
  preventDuplicate?: boolean;
  persist?: boolean;
  action?: React.ReactNode;
}

export interface NotificationContextType {
  showNotification: (message: string, options?: NotificationOptions) => void;
  showSuccess: (
    message: string,
    options?: Omit<NotificationOptions, "variant">
  ) => void;
  showError: (
    message: string,
    options?: Omit<NotificationOptions, "variant">
  ) => void;
  showWarning: (
    message: string,
    options?: Omit<NotificationOptions, "variant">
  ) => void;
  showInfo: (
    message: string,
    options?: Omit<NotificationOptions, "variant">
  ) => void;
  closeNotification: (key?: string | number) => void;
}
