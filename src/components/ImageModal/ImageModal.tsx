import { Fade, Modal } from '@mui/material'
import { type FunctionComponent } from 'react'
import { Close as CloseIcon } from '@mui/icons-material'

interface Props {
  openedImage: string
  setOpenedImage: React.Dispatch<React.SetStateAction<string>>
}

const imageModal: FunctionComponent<Props> = ({
  openedImage,
  setOpenedImage
}) => {
  return (
    <Modal
      open={!!openedImage}
      onClose={() => {
        setOpenedImage('')
      }}
    >
      <Fade in={!!openedImage}>
        <div
          className="modal__image-wrapper"
          onClick={() => {
            setOpenedImage('')
          }}
        >
          <img
            style={{ maxWidth: '100vw', maxHeight: '100vh' }}
            src={openedImage}
            onClick={(e) => e.stopPropagation()}
          />
          <CloseIcon
            onClick={() => {
              setOpenedImage('')
            }}
            className="modal__close-icon"
          />
        </div>
      </Fade>
    </Modal>
  )
}

export default imageModal
