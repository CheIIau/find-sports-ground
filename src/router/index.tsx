/* eslint-disable @typescript-eslint/promise-function-async */
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { FunctionComponent, lazy } from 'react'
import App from 'src/pages/App'
import { useAppSelector } from 'src/hooks/redux'
const About = lazy(() => import('src/pages/AboutPage'))
const Home = lazy(() => import('src/pages/HomePage'))
const LoginPage = lazy(() => import('src/pages/LoginPage'))
const NotFound = lazy(() => import('src/pages/404'))
const Error = lazy(() => import('src/pages/Error'))
const AddNew = lazy(() => import('src/pages/AddNew'))

const PrivateWrapper: FunctionComponent<PrivateWrapperType> = ({
  children,
  ...props
}) => {
  const { uid } = useAppSelector((state) => state.rootReducer.userReducer.user)
  if (!props.getAccessToAuthUser) {
    return uid ? <Navigate to="/" replace /> : children
  }
  return uid ? children : <Navigate to="/" replace />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: '',
        element: <Home />,
        children: [
          {
            path: '/:key',
            element: <Home />
          }
        ]
      },
      {
        path: '/login',
        element: (
          <PrivateWrapper getAccessToAuthUser={false}>
            <LoginPage />
          </PrivateWrapper>
        )
      },
      {
        path: '/add-new',
        element: (
          <PrivateWrapper getAccessToAuthUser={true}>
            <AddNew />
          </PrivateWrapper>
        )
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/*',
        element: <NotFound />
      }
    ]
  }
])

interface PrivateWrapperType {
  getAccessToAuthUser: boolean
  children: JSX.Element
}
export { router }
