import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'
import { generalSlice } from './reducers/GeneralSlice'
import { store } from './store'

export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    const { dispatch } = store
    const { showSnackbar } = generalSlice.actions
    if (isRejectedWithValue(action)) {
      // console.warn('We got a rejected action!')
      dispatch(
        showSnackbar({
          message: action.payload?.message || 'Something went wrong',
          type: 'error'
        })
      )
    }

    return next(action)
  }
