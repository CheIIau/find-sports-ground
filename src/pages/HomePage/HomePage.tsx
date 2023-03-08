import { Backdrop, DialogContent, Fade, Modal, Slide } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import MapComponent from 'src/components/MapComponent/MapComponent'
import { useFetchSportsGroundsQuery } from 'src/services/MapService'
import Carousel from 'react-material-ui-carousel'
import homepageStyles from './HomePage.module.scss'
import { useParams } from 'react-router-dom'
import { Marker } from 'src/models'
import { Close as CloseIcon } from '@mui/icons-material'

type AboutProps = {
  key?: string
}

function Home() {
  const { data: sportsGrounds } = useFetchSportsGroundsQuery()
  const [selectedSportsGroundKey, setSelectedSportsGroundKey] = useState('')
  const [chosenSportsGroundCoords, setChosenSportsGroundCoords] = useState<
    undefined | Marker
  >()
  const { key } = useParams<AboutProps>()
  const [openedImage, setOpenedImage] = useState('')

  useEffect(() => {
    if (sportsGrounds?.length) {
      setChosenSportsGroundCoords(
        sportsGrounds.find((sg) => sg.sportsGroundKey === key)?.marker
      )
    }
  }, [sportsGrounds])

  useEffect(() => {
    if (selectedSportsGroundKey) {
      history.replaceState(null, '', selectedSportsGroundKey)
    }
  }, [selectedSportsGroundKey])

  const selectedSportsGround = useMemo(
    () =>
      sportsGrounds?.find(
        (sg) => sg.sportsGroundKey === selectedSportsGroundKey
      ),
    [selectedSportsGroundKey]
  )

  return (
    <div>
      <h1>Find The Nearest Sports Ground To You</h1>
      <MapComponent
        sportsGrounds={sportsGrounds!}
        buttonClickHandler={setSelectedSportsGroundKey}
        interactionType="read"
        chosenSportsGroundCoords={chosenSportsGroundCoords}
      />
      <Modal
        open={
          !!selectedSportsGroundKey &&
          (!!selectedSportsGround?.description ||
            !!selectedSportsGround?.fileUrls?.length)
        }
        onClose={() => {
          setSelectedSportsGroundKey('')
        }}
        sx={{ width: '100%' }}
      >
        <Backdrop
          open={!!selectedSportsGroundKey}
          onClick={(e) => {
            if ((e.target as Element).classList.contains('MuiBackdrop-root')) {
              setSelectedSportsGroundKey('')
            }
          }}
        >
          <Slide
            direction="up"
            in={!!selectedSportsGroundKey}
            appear={window.innerWidth > 900}
          >
            <div>
              <div className={homepageStyles.carousel__wrapper}>
                {selectedSportsGround?.fileUrls?.length && (
                  <Carousel
                    animation="fade"
                    autoPlay={false}
                    className={homepageStyles.carousel__carousel}
                  >
                    {selectedSportsGround?.fileUrls?.map((img) => (
                      <img
                        className={homepageStyles.carousel__img}
                        src={img}
                        key={img}
                        onClick={() => setOpenedImage(img)}
                      />
                    ))}
                  </Carousel>
                )}
                {selectedSportsGround?.description && (
                  <DialogContent className={homepageStyles.carousel__text}>
                    {selectedSportsGround?.description}
                  </DialogContent>
                )}
              </div>
            </div>
          </Slide>
        </Backdrop>
      </Modal>
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
    </div>
  )
}

export default Home