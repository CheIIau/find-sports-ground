import { useEffect, useMemo, useState } from 'react'
import { type Marker } from 'src/models'
import {
  useAddCommentMutation,
  useFetchSportsGroundsQuery,
  useLazyFetchCommentsQuery
} from 'src/services/MapService'
import { useAppSelector } from './redux'

export const useGetSportsGrounds = (sportsGroundKey: string | undefined) => {
  const { data: sportsGrounds } = useFetchSportsGroundsQuery()
  const [selectedSportsGroundKey, setSelectedSportsGroundKey] = useState('')
  const [chosenSportsGroundCoords, setChosenSportsGroundCoords] = useState<
    undefined | Marker
  >()

  useEffect(() => {
    if (sportsGrounds?.length) {
      setChosenSportsGroundCoords(
        sportsGrounds.find((sg) => sg.sportsGroundKey === sportsGroundKey)
          ?.marker
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
  return {
    sportsGrounds,
    selectedSportsGroundKey,
    selectedSportsGround,
    chosenSportsGroundCoords,
    setSelectedSportsGroundKey,
    setChosenSportsGroundCoords
  }
}
export const useGetComments = (selectedSportsGroundKey: string) => {
  const [triggerFetchComments, comments] = useLazyFetchCommentsQuery()

  useEffect(() => {
    if (selectedSportsGroundKey) {
      triggerFetchComments(selectedSportsGroundKey)
    }
  }, [selectedSportsGroundKey])
  return { comments: comments.data, isLoading: comments.isLoading }
}
export const useAddComments = (sportsGroundKey: string | undefined) => {
  const [addCommentMutation] = useAddCommentMutation()
  const { email } = useAppSelector(
    (state) => state.rootReducer.userReducer.user
  )

  function addComment(comment: string) {
    const username = email.split('@')[0]
    if (!(username && sportsGroundKey && comment)) {
      return
    }
    addCommentMutation({ commentText: comment, sportsGroundKey, username })
  }
  return { addComment }
}
