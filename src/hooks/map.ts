import { useEffect } from 'react'
import ymaps from 'ymaps'
import YmapsTypes from 'yandex-maps'

type YmapsInstanse = typeof YmapsTypes
let constructor: YmapsInstanse
let map: YmapsTypes.Map

const useMap = () => {
  let i = 0
  useEffect(() => {
    async function setUpMap() {
      const mapRef = document.getElementById('map')!
      await initMap(mapRef)
    }
    console.log(i)
    if (i === 0) {
      i++
      setUpMap()
    }
    return () => {
      //
    }
  }, [])

  async function initMap(container: HTMLElement) {
    try {
      constructor = await ymaps.load(
        `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${
          import.meta.env.VITE_YMAPS_APIKEY as string
        }`
      )
    } catch {
      return await Promise.reject(new Error('Не удалось отобразить карту'))
    }
    map = new constructor.Map(
      container,
      {
        center: [55.76, 37.64],
        zoom: 12,
        controls: []
      },
      {
        suppressMapOpenBlock: true,
        yandexMapDisablePoiInteractivity: true,
        minZoom: 5
      }
    )
    await locateUser()
  }
  async function getGeolocation() {
    try {
      const { geoObjects } = await constructor.geolocation.get({
        provider: 'auto',
        autoReverseGeocode: false,
        timeout: 1000
      })
      return geoObjects
    } catch (e) {
      console.log('locationError', e)
      return await Promise.reject(new Error('e'))
    }
  }
  async function locateUser() {
    try {
      const geoObjects = await getGeolocation()
      map.panTo(geoObjects.position, { duration: 300 })
      geoObjects.options.set('preset', 'islands#yellowCircleIcon')
      const previousMarker = map.geoObjects.get(1)
      if (previousMarker) {
        map.geoObjects.remove(previousMarker)
      }
      map.geoObjects.add(geoObjects)
    } catch (e) {
      console.log('locate user error', e)
    }
  }
}

export default useMap
