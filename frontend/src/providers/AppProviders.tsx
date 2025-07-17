// src/AppProviders.tsx

import React from "react";
import { SnackbarProvider } from "notistack";
import { NotificationProvider } from "@app/providers/NotificationProvider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const notistackRef = React.useRef<any>(null);

  const onClickDismiss = (key: string | number) => () => {
    notistackRef.current?.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      ref={notistackRef}
      maxSnack={5}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      preventDuplicate
      autoHideDuration={3000}
      action={(key) => (
        <IconButton onClick={onClickDismiss(key)} color="inherit" size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    >
      <NotificationProvider>{children}</NotificationProvider>
    </SnackbarProvider>
  );
};
