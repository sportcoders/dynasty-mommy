import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { Provider } from "react-redux"
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { darkThemeOptions, lightThemeOptions } from './styles/theme'
import { CssBaseline } from '@mui/material'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { persistor, store } from './store/store'
import { PersistGate } from 'redux-persist/integration/react'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  const theme = createTheme({
    colorSchemes: {
      light: lightThemeOptions,
      dark: darkThemeOptions,
    },
  })
  root.render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </StrictMode>,
  )
}