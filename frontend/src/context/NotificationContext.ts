import { createContext } from "react";
import type { NotificationContextType } from "@app/types/notification";

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
