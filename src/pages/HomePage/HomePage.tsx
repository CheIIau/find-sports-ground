import { useEffect, useMemo, useState } from 'react'
import MapComponent from 'src/components/MapComponent/MapComponent'
import { useFetchSportsGroundsQuery } from 'src/services/MapService'
import { useParams } from 'react-router-dom'
import { Marker } from 'src/models'
import SportsGroundModalComponent from 'src/components/SportsGroundModal/SportsGroundModal'
import ImageModalComponent from 'src/components/ImageModal/ImageModal'
import {
  useLazyFetchCommentsQuery,
  useAddCommentMutation
} from 'src/services/MapService'

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
  const [triggerFetchComments, comments] = useLazyFetchCommentsQuery()
  const [addCommentMutation] = useAddCommentMutation()

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
      triggerFetchComments(selectedSportsGroundKey)
      console.log(comments.data)
    }
  }, [selectedSportsGroundKey])

  const selectedSportsGround = useMemo(
    () =>
      sportsGrounds?.find(
        (sg) => sg.sportsGroundKey === selectedSportsGroundKey
      ),
    [selectedSportsGroundKey]
  )

  function addComment(comment: string) {
    console.log(comment)
  }

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
        comments={comments.data}
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
