import mapComponentStyles from './mapComponent.module.scss'
import useMap from 'src/hooks/map'

function mapComponent() {
  useMap()
  return (
    <div className={mapComponentStyles.mapWrapper}>
      <div id="map" className={mapComponentStyles.map}></div>
    </div>
  )
}

export default mapComponent
