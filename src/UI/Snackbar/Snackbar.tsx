import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { FunctionComponent, SyntheticEvent, useEffect, useState } from 'react'
import { Alert, Snackbar, SnackbarProps } from '@mui/material'
import { useAppSelector } from 'src/hooks/redux'
import Slide from '@mui/material/Slide'
import { generalSlice } from 'src/store/reducers/GeneralSlice'
import { store } from 'src/store/store'

const snackbar: FunctionComponent<SnackbarProps> = ({ ...props }) => {
  const [open, setOpen] = useState(false)
  const { dispatch } = store
  const { showSnackbar } = generalSlice.actions
  const { message, type } = useAppSelector(
    (state) => state.rootReducer.generalReducer.snackbar
  )
  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    setOpen(false)
  }
  useEffect(() => {
    if (!message.length) {
      setOpen(false)
    } else {
      setOpen(true)
      // setTimeout(() => {
      //   dispatch(showSnackbar({ message: '' }))
      // }, 4300)
    }
  }, [message])
  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>
    </>
  )

  useEffect(() => {
    const snackbarDiv = document.getElementsByClassName('snackbar')[0]
    const observer = new MutationObserver(() => {
      const children = Array.from(snackbarDiv.children)
      if (!children.length) {
        dispatch(showSnackbar({ message: '' }))
      }
    })
    observer.observe(snackbarDiv, { childList: true })
  }, [])

  return (
    <div className="snackbar">
      <Snackbar
        TransitionComponent={Slide}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        action={action}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        {...props}
      >
        <Alert
          variant="filled"
          onClose={handleClose}
          severity={type}
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default snackbar
