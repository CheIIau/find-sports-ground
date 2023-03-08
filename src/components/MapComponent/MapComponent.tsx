import mapComponentStyles from './mapComponent.module.scss'
/// @ts-expect-error
import useMap from 'src/hooks/map.tsx'
import React, { FunctionComponent } from 'react'
import { Fab } from '@mui/material'
import { LocationOn } from '@mui/icons-material'
import { Marker, SportsGroundWithKey } from 'src/models'
interface Props {
  buttonClickHandler?:
    | ((args: any) => any)
    | React.Dispatch<React.SetStateAction<any>>
  interactionType: 'read' | 'add'
  sportsGrounds: SportsGroundWithKey[]
  chosenSportsGroundCoords?: Marker
}

const mapComponent: FunctionComponent<Props> = ({
  buttonClickHandler,
  interactionType,
  sportsGrounds,
  chosenSportsGroundCoords
}) => {
  const { locateNearest } = useMap({
    buttonClickHandler,
    interactionType,
    sportsGrounds,
    chosenSportsGroundCoords
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
