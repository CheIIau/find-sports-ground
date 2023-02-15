import { AlertColor } from '@mui/material'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SnackbarType {
  message: string
  type?: AlertColor
}

interface GeneralState {
  snackbar: SnackbarType
}

const initialState: GeneralState = {
  snackbar: { message: '', type: undefined }
}

export const generalSlice = createSlice({
  name: 'general',
  initialState,
  reducers: {
    showSnackbar(
      state,
      action: PayloadAction<SnackbarType>
    ) {
      state.snackbar = action.payload
    }
  }
})

export default generalSlice.reducer
