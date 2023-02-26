import { useEffect, useState } from 'react'
import AddSportGroundForm from 'src/components/AddSportGroundForm/AddSportGroundForm'
import MapComponent from 'src/components/MapComponent/MapComponent'

function Home() {
  const [marker, setMarker] = useState<null | [number, number]>(null)

  useEffect(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
  }, [marker])
  
  return (
    <div>
      <h1>Find the nearest sports ground to you</h1>
      <MapComponent setMarker={setMarker} />
      {marker ? <AddSportGroundForm marker={marker} /> : <></>}
    </div>
  )
}

export default Home
