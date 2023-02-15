import { getAnalytics } from 'firebase/analytics'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from '../configs'

export const app = initializeApp(firebaseConfig, 'find-sports-ground')
getAnalytics(app)
