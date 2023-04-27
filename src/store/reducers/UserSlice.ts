import { createSlice, isAnyOf, type PayloadAction } from '@reduxjs/toolkit'
import { userApi } from 'src/services/UserService'

interface UserState {
  user: UserData | Record<string, never>
  loading: boolean
}
interface UserData {
  email: string
  uid: string
}

const initialState: UserState = {
  user: {},
  loading: false
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData>) {
      state.user = action.payload
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // .addMatcher(
      //   userApi.endpoints.register.matchFulfilled,
      //   (state, action) => {
      //     if (action.payload) {
      //       state.user = action.payload
      //     }
      //   }
      // )
      // .addMatcher(
      //   userApi.endpoints.autoLogin.matchFulfilled,
      //   (state, action) => {
      //     if (action.payload) {
      //       state.user = action.payload
      //     }
      //   }
      // )
      .addMatcher(
        isAnyOf(
          userApi.endpoints.autoLogin.matchPending,
          userApi.endpoints.login.matchPending,
          userApi.endpoints.register.matchPending,
          userApi.endpoints.logout.matchPending
        ),
        (state) => {
          state.loading = true
        }
      )
      .addMatcher(
        isAnyOf(
          userApi.endpoints.login.matchFulfilled,
          userApi.endpoints.register.matchFulfilled,
          userApi.endpoints.logout.matchFulfilled
        ),
        (state, action) => {
          state.loading = false
          if (action.payload) {
            state.user = action.payload
          }
        }
      )
  }
})

export const { setLoading, setUser } = userSlice.actions

export default userSlice.reducer
