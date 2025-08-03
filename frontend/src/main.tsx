import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { darkThemeOptions, lightThemeOptions } from "./styles/theme";
import { CssBaseline } from "@mui/material";
import { AppProviders } from "./providers/AppProviders";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { persistor, store } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppError } from "./utils/errors";

// Create a new router instance
const router = createRouter({ routeTree });
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount, error) {
        if (error instanceof AppError) {
          if (error.statusCode == 404 || failureCount > 2) return false;
          return true;
        }
        return false;
      },
    }
  }
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  const theme = createTheme({
    colorSchemes: {
      light: lightThemeOptions,
      dark: darkThemeOptions,
    },
  });
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate persistor={persistor} loading={null}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppProviders>
                <RouterProvider router={router} />
              </AppProviders>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </StrictMode>
  );
}
