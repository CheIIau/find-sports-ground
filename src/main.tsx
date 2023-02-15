import './styles/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import CircularProgress from '@mui/material/CircularProgress'
import { Provider } from 'react-redux'
import { setupStore } from './store/store'
import { theme } from 'src/styles/theme'
import { ThemeProvider, CssBaseline } from '@mui/material'
import Snackbar from './UI/Snackbar/Snackbar'

const store = setupStore()
createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider
          router={router}
          fallbackElement={<CircularProgress />}
        />
        <Snackbar />
      </ThemeProvider>
    </Provider>
  </StrictMode>
)
