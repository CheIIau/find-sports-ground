import { Suspense } from 'react'
import '../styles/App.scss'
import Header from '../UI/Header/Header'
import { Outlet } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'

function App() {
  return (
    <div className="app">
      <Header />
      <div className={'outlet'}>
        <Suspense
          fallback={
            <div className="fallback-wrapper">
              <CircularProgress size="100px" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}

export default App
