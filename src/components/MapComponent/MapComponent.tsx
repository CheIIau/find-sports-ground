import mapComponentStyles from './mapComponent.module.scss'
import useMap from 'src/hooks/map'
import { FunctionComponent } from 'react'
import { useFetchSportsGroundsQuery } from 'src/services/MapService'
import { Fab } from '@mui/material'
import { LocationOn } from '@mui/icons-material'

interface Props {
  setMarker: React.Dispatch<React.SetStateAction<[number, number] | null>>
}

const mapComponent: FunctionComponent<Props> = ({ setMarker }) => {
  const { data: sportsGrounds } = useFetchSportsGroundsQuery()
  const { locateNearest } = useMap({
    buttonClickHandler: setMarker,
    interactionType: 'read',
    sportsGrounds
  })

  return (
    <div className={mapComponentStyles.mapWrapper}>
      <div id="map" className={mapComponentStyles.map}></div>
      <Fab
        color="primary"
        aria-label="add"
        size="medium"
        className={mapComponentStyles['nearest-button']}
        onClick={locateNearest}
      >
        <LocationOn fontSize="medium" />
      </Fab>
    </div>
  )
}

export default mapComponent
