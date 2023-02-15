/* eslint-disable @typescript-eslint/promise-function-async */
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import App from 'src/pages/App'
const About = lazy(() => import('src/pages/AboutPage'))
const Home = lazy(() => import('src/pages/HomePage'))
const LoginPage = lazy(() => import('src/pages/LoginPage'))
const NotFound = lazy(() => import('src/pages/404'))
const Error = lazy(() => import('src/pages/Error'))

const isAuth = true
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/about',
        element: isAuth ? <About /> : <Navigate to="/" />,
        children: [
          {
            path: '/about/:id',
            element: <About />
          }
        ]
      },
      {
        path: '/*',
        element: <NotFound />
      }
    ]
  }
])

export { router }
