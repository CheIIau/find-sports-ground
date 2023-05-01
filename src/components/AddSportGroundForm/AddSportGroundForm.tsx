import { type FunctionComponent, useMemo, useState } from 'react'
import {
  Button,
  Fade,
  FormControl,
  ImageList,
  ImageListItem,
  Modal,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import InputComponent from '../InputComponent/InputComponent'
import { useValidation } from 'src/hooks/validation'
import addSportGroundForm from './addSportGroundForm.module.scss'
import { readAllFiles } from 'src/utils'
import CloseIcon from '@mui/icons-material/Close'
import { useAddSportsGroundMutation } from 'src/services/MapService'
import { useNavigate } from 'react-router-dom'
import { generalSlice } from 'src/store/reducers/GeneralSlice'
import { store } from 'src/store/store'

interface Props {
  marker: [number, number]
}

const AddSportGroundForm: FunctionComponent<Props> = ({ marker }) => {
  const [description, setDescription] = useState('')
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [selectedImage, setSelectedImage] = useState<string>('')
  const { validateInput } = useValidation()
  const [errorMessage, setErrorMessage] = useState('')
  const [addSportsGround] = useAddSportsGroundMutation()
  const navigate = useNavigate()
  const { dispatch } = store
  const { showSnackbar } = generalSlice.actions

  const descriptionRules = [
    (val: string) =>
      val.length < 301 ? false : 'Max number of characters is 300'
  ]
  const validateDescription = useMemo(
    () => validateInput(description, descriptionRules),
    [description]
  )
  const disabledButton = useMemo(() => !!validateDescription, [description])

  async function addPhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files?.length) return
    if (files?.length + photoFiles.length > 3) {
      setErrorMessage('You cannot upload more than 3 photos')
      return
    }
    const filesArr = Array.from(files)
    // if (limitedPhotos.length > 3) {
    //   limitedPhotos = limitedPhotos.slice(0, 3)
    // }
    setPhotoFiles([...photoFiles, ...filesArr])
    const photos = await readAllFiles(filesArr)
    setPhotoUrls([...photoUrls, ...photos])
  }
  function openImage(src: string) {
    setSelectedImage(src)
  }
  function deleteImage(
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    i: number
  ) {
    e.stopPropagation()
    const newPhotoUrls = [...photoUrls]
    newPhotoUrls.splice(i, 1)
    setPhotoUrls(newPhotoUrls)
    const newPhotoFiles = [...photoFiles]
    newPhotoFiles.splice(i, 1)
    setPhotoFiles(newPhotoFiles)
  }
  async function onSportGroundAdd() {
    if (!description.length && !photoFiles.length) {
      setErrorMessage(
        'You should add either description or photos to add sports ground'
      )
      return
    }
    await addSportsGround({ description, files: photoFiles, marker })
    dispatch(
      showSnackbar({
        message: 'Your Sports Ground has been added',
        type: 'success'
      })
    )
    navigate('/')
  }
  return (
    <>
      <FormControl
        className={addSportGroundForm.form}
        fullWidth
        sx={{ marginTop: '50px' }}
      >
        <Typography variant="h6" align="center" sx={{ marginBottom: '25px' }}>
          You can add a description and photos of the sports ground
        </Typography>
        <InputComponent
          setValue={setDescription}
          value={description}
          multiline
          fullWidth
          minRows={3}
          error={!!description ? !!validateDescription : false}
          helperText={description.length ? validateDescription : ''}
          style={{ marginBottom: '10px', width: '100%' }}
          label="Description"
        />
        {!!photoUrls.length && (
          <Fade in={!!photoUrls.length} timeout={500}>
            <ImageList
              className={addSportGroundForm['image-list']}
              sx={{
                height: { xs: '150px', sm: '300px', md: '400px' },
                marginBottom: { sm: '30px' }
              }}
              gap={6}
              cols={photoUrls.length}
            >
              {photoUrls.map((src, i) => (
                <ImageListItem
                  className={addSportGroundForm.img}
                  key={i}
                  onClick={() => openImage(src)}
                >
                  <img src={src} />
                  <CloseIcon
                    onClick={(e) => deleteImage(e, i)}
                    className={addSportGroundForm['delete-button']}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Fade>
        )}
        <Button
          variant="contained"
          component="label"
          sx={{
            '&.Mui-disabled': {
              backgroundColor: '#A0A0A0'
            },
            marginTop: '20px',
            padding: '10px',
            width: { xs: '200px', sm: '350px' },
            alignSelf: 'center'
          }}
        >
          Add Photos
          <input
            hidden
            accept="image/*"
            multiple
            type="file"
            onChange={addPhotos}
          />
        </Button>
        <Button
          variant="outlined"
          disabled={disabledButton}
          sx={{
            '&.Mui-disabled': {
              backgroundColor: '#A0A0A0'
            },
            marginTop: '20px',
            padding: '10px',
            width: { xs: '200px', sm: '350px' },
            alignSelf: 'center'
          }}
          onClick={onSportGroundAdd}
        >
          Add Sport Ground
        </Button>
      </FormControl>

      <Modal
        open={!!selectedImage}
        onClose={() => {
          setSelectedImage('')
        }}
      >
        <Fade in={!!selectedImage}>
          <div
            className="modal__image-wrapper"
            onClick={() => {
              setSelectedImage('')
            }}
          >
            <img
              className="modal__image"
              src={selectedImage}
              onClick={(e) => e.stopPropagation()}
            />
            <CloseIcon
              onClick={() => {
                setSelectedImage('')
              }}
              className="modal__close-icon"
            />
          </div>
        </Fade>
      </Modal>
      <Dialog
        open={!!errorMessage}
        TransitionComponent={Fade}
        onClose={() => setErrorMessage('')}
      >
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorMessage('')}>Ok</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AddSportGroundForm
