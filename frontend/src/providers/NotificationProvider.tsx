import { useSnackbar } from "notistack";
import { NotificationContext } from "@app/context/NotificationContext";
import type { ReactNode } from "react";
import type { NotificationOptions } from "@app/types/notification";

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showNotification = (
    message: string,
    options: NotificationOptions = {}
  ) => {
    enqueueSnackbar(message, {
      variant: options.variant,
      autoHideDuration: options.autoHideDuration,
      preventDuplicate: options.preventDuplicate,
      persist: options.persist,
      action: options.action,
    });
  };

  const showSuccess = (
    message: string,
    options: Omit<NotificationOptions, "variant"> = {}
  ) => {
    showNotification(message, { ...options, variant: "success" });
  };

  const showError = (
    message: string,
    options: Omit<NotificationOptions, "variant"> = {}
  ) => {
    showNotification(message, { ...options, variant: "error" });
  };

  const showWarning = (
    message: string,
    options: Omit<NotificationOptions, "variant"> = {}
  ) => {
    showNotification(message, { ...options, variant: "warning" });
  };

  const showInfo = (
    message: string,
    options: Omit<NotificationOptions, "variant"> = {}
  ) => {
    showNotification(message, { ...options, variant: "info" });
  };

  const closeNotification = (key?: string | number) => {
    if (key) {
      closeSnackbar(key);
    } else {
      closeSnackbar();
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        closeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
