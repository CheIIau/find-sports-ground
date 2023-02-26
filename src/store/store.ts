import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './reducers/UserSlice'
import mapReducer from './reducers/MapSlice'
import generalReducer from './reducers/GeneralSlice'
import { userApi } from 'src/services/UserService'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { markersApi } from 'src/services/MapService'
import { rtkQueryErrorLogger as logger } from './middlewares'

const rootReducer = combineReducers({
  userReducer,
  mapReducer,
  generalReducer
})

export const store = configureStore({
  reducer: {
    rootReducer,
    [userApi.reducerPath]: userApi.reducer,
    [markersApi.reducerPath]: markersApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(markersApi.middleware)
      .concat(logger)
})

export const setupStore = () => {
  return store
}

setupListeners(setupStore().dispatch)

// for typization
export type RootState = ReturnType<typeof store.getState>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
