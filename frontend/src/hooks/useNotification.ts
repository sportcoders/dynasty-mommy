import { useContext } from "react";
import type { NotificationContextType } from "@app/types/notification";
import { NotificationContext } from "@app/context/NotificationContext";

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
