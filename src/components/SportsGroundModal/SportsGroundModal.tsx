import { Backdrop, DialogContent, Modal, Slide } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import sportsGroundStyles from './SportsGroundModal.module.scss'
import { type FunctionComponent } from 'react'
import { type SportsGroundWithKey, type Comment } from 'src/models'
import CommentSection from '../Comments/CommentSection/CommentSection'

interface Props {
  selectedSportsGroundKey: string
  selectedSportsGround: SportsGroundWithKey | undefined
  setSelectedSportsGroundKey: React.Dispatch<React.SetStateAction<string>>
  setOpenedImage: React.Dispatch<React.SetStateAction<string>>
  comments: Comment[] | undefined
  addComment: (comment: string) => void,
  isCommentsLoading: boolean
}

const sportsGroundModal: FunctionComponent<Props> = ({
  selectedSportsGroundKey,
  selectedSportsGround,
  setSelectedSportsGroundKey,
  setOpenedImage,
  comments,
  addComment,
  isCommentsLoading
}) => {
  return (
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
            <div
              className={`${sportsGroundStyles.carousel__wrapper} ${
                !!selectedSportsGround?.fileUrls?.length
                  ? `${sportsGroundStyles.carousel__wrapper_width}`
                  : ''
              }`}
            >
              {selectedSportsGround?.fileUrls?.length && (
                <Carousel
                  animation="fade"
                  autoPlay={false}
                  className={sportsGroundStyles.carousel__carousel}
                >
                  {selectedSportsGround?.fileUrls?.map((img) => (
                    <img
                      className={sportsGroundStyles.carousel__img}
                      src={img}
                      key={img}
                      onClick={() => setOpenedImage(img)}
                    />
                  ))}
                </Carousel>
              )}
              {selectedSportsGround?.description && (
                <div className={sportsGroundStyles.description}>
                  <DialogContent
                    className={sportsGroundStyles.description__text}
                  >
                    {selectedSportsGround?.description}
                  </DialogContent>
                  <CommentSection isLoading={isCommentsLoading} comments={comments} addComment={addComment} />
                </div>
              )}
            </div>
          </div>
        </Slide>
      </Backdrop>
    </Modal>
  )
}

export default sportsGroundModal
