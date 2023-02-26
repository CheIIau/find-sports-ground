import { getAnalytics } from 'firebase/analytics'
import { useEffect } from 'react'
import { useLazyAutoLoginQuery } from 'src/services/UserService'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../config'

export const app = initializeApp(firebaseConfig, 'find-sports-ground')
export const useBoot = () => {
  const [autoLogin] = useLazyAutoLoginQuery()
  useEffect(() => {
    getAnalytics(app)
    autoLogin()
  }, [])
}
