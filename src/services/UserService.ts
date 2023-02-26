import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'firebase/auth'
import { app } from 'src/hooks/boot'
import { userSlice } from 'src/store/reducers/UserSlice'

const auth = getAuth(app)

export const userApi = createApi({
  reducerPath: 'user',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['User'],
  endpoints: (build) => ({
    register: build.mutation<RegistrationResponse, RegistrationRequest>({
      async queryFn({ email, password }) {
        try {
          const user = (
            await createUserWithEmailAndPassword(auth, email, password)
          ).user
          return { data: { email: user.email!, uid: user.uid } }
        } catch (error: any) {
          return { error: { message: error?.message } }
        }
      }
      // invalidatesTags: ['User']
    }),
    login: build.query<RegistrationResponse, RegistrationRequest>({
      async queryFn({ email, password }) {
        try {
          const user = (await signInWithEmailAndPassword(auth, email, password))
            .user
          return { data: { email: user.email!, uid: user.uid } }
        } catch (error: any) {
          return { error: { message: error?.message } }
        }
      }
      // providesTags: ['User']
    }),
    autoLogin: build.query<RegistrationResponse | undefined, void>({
      async queryFn(_, { dispatch }) {
        try {
          onAuthStateChanged(auth, (user) => {
            if (user) {
              dispatch(
                userSlice.actions.setUser({ uid: user.uid, email: user.email! })
              )
            }
            dispatch(userSlice.actions.setLoading(false))
          })
          return { data: undefined }
        } catch (error: any) {
          return { error: { message: error?.message } }
        }
      }
    }),
    logout: build.query<RegistrationResponse, void>({
      async queryFn() {
        try {
          await signOut(auth)
          return { data: { email: '', uid: '' } }
        } catch (error: any) {
          return { error: { message: error?.message } }
        }
      }
    })
  })
})

export const {
  useRegisterMutation,
  useLazyLoginQuery,
  useLazyAutoLoginQuery,
  useLazyLogoutQuery
} = userApi

interface RegistrationResponse {
  email: string
  uid: string
}

interface RegistrationRequest {
  email: string
  password: string
}
