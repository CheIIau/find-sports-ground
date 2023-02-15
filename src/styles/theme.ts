import { createTheme } from '@mui/material'
import { yellow } from '@mui/material/colors'

export const theme = createTheme({
  palette: {
    primary: yellow,
    secondary: {
      main: '#43a047'
    },
    background: {
      default: '#363636'
    },
    text: {
      primary: '#fff'
    }
  }
})
