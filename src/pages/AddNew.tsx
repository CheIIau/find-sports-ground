import { useEffect, useState } from 'react'
import AddSportGroundForm from 'src/components/AddSportGroundForm/AddSportGroundForm'
import MapComponent from 'src/components/MapComponent/MapComponent'
import { useFetchSportsGroundsQuery } from 'src/services/MapService'

function Home() {
  const [marker, setMarker] = useState<null | [number, number]>(null)
  const { data: sportsGrounds } = useFetchSportsGroundsQuery()
  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }, [marker])

  return (
    <div>
      <h1>Add New Sports Ground To The Map</h1>
      <MapComponent
        sportsGrounds={sportsGrounds!}
        buttonClickHandler={setMarker}
        interactionType="add"
      />
      {marker && <AddSportGroundForm marker={marker} />}
    </div>
  )
}

export default Home
