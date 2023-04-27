import { useState } from 'react'
import MapComponent from 'src/components/MapComponent/MapComponent'

import { useParams } from 'react-router-dom'
import SportsGroundModalComponent from 'src/components/SportsGroundModal/SportsGroundModal'
import ImageModalComponent from 'src/components/ImageModal/ImageModal'
import {
  useGetSportsGrounds,
  useGetComments,
  useAddComments
} from 'src/hooks/sportsground'
type AboutProps = {
  key?: string
}

function Home() {
  const [openedImage, setOpenedImage] = useState('')
  const { key } = useParams<AboutProps>()
  const {
    selectedSportsGround,
    selectedSportsGroundKey,
    setSelectedSportsGroundKey,
    sportsGrounds,
    chosenSportsGroundCoords
  } = useGetSportsGrounds(key)
  const { comments, isLoading: isCommentsLoading } = useGetComments(selectedSportsGroundKey)
  const { addComment } = useAddComments(selectedSportsGroundKey)

  return (
    <div>
      <h1>Find The Nearest Sports Ground To You</h1>
      <MapComponent
        sportsGrounds={sportsGrounds!}
        buttonClickHandler={setSelectedSportsGroundKey}
        interactionType="read"
        chosenSportsGroundCoords={chosenSportsGroundCoords}
      />
      <SportsGroundModalComponent
        selectedSportsGround={selectedSportsGround}
        selectedSportsGroundKey={selectedSportsGroundKey}
        setOpenedImage={setOpenedImage}
        setSelectedSportsGroundKey={setSelectedSportsGroundKey}
        comments={comments}
        isCommentsLoading={isCommentsLoading}
        addComment={addComment}
      />
      <ImageModalComponent
        openedImage={openedImage}
        setOpenedImage={setOpenedImage}
      />
    </div>
  )
}

export default Home
