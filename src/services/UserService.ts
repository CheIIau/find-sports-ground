import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { getAuth, createUserWithEmailAndPassword, User } from 'firebase/auth'

export const userApi = createApi({
  reducerPath: 'user',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['User'],
  endpoints: (build) => ({
    register: build.query<
      User,
      {
        email: string
        password: string
      }
    >({
      async queryFn({ email, password }) {
        try {
          const auth = getAuth()
          const user = (
            await createUserWithEmailAndPassword(auth, email, password)
          ).user
          return { data: user }
        } catch (error: any) {
          return { error: { message: error.message } }
        }
      },
      providesTags: ['User']
      // keepUnusedDataFor: 180
    })
  })
})

export const { useRegisterQuery } = userApi
