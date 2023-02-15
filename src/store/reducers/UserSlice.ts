import { createSlice } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'
import { userApi } from 'src/services/UserService'

interface UserState {
  user: User | Record<string, never>
}

const initialState: UserState = {
  user: {}
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      userApi.endpoints.register.matchFulfilled,
      (state, action) => {
        if (action.payload) {
          state.user = action.payload
        }
      }
    )
  }
})

export default userSlice.reducer
