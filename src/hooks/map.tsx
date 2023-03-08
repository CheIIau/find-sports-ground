/// @ts-nocheck
import { useEffect, useState } from 'react'
import MyBalloonLayout from 'src/components/MapComponent/MyBalloonLayout'
import MyBalloonMobileLayout from 'src/components/MapComponent/MyBalloonMobileLayout'
import { Marker, SportsGroundWithKey } from 'src/models'
import ymaps from 'ymaps'
import { renderToString } from 'react-dom/server'

type YmapsInstanse = typeof ymaps

interface useMapProps {
  buttonClickHandler?: ButtonHandlerType
  interactionType: InteractionType
  sportsGrounds?: SportsGroundWithKey[]
  chosenSportsGroundCoords?: Marker
}
type InteractionType = 'read' | 'add'
type ButtonHandlerType =
  | ((args: any) => any)
  | React.Dispatch<React.SetStateAction<any>>

const useMap = ({
  buttonClickHandler,
  interactionType,
  sportsGrounds,
  chosenSportsGroundCoords
}: useMapProps) => {
  let i = 0
  const myBalloonLayoutTemplate = renderToString(<MyBalloonLayout />)
  const MyBalloonMobileTemplate = renderToString(<MyBalloonMobileLayout />)

  // const [choosenMarker, setchoosenMarker] = useState<null | string>(null)
  const [constructor, setConstructor] = useState<YmapsInstanse>()
  const [map, setMap] = useState<ymaps.Map>()
  const [collectionQuery, setCollectionQuery] = useState<any>() // GeoQueryResult
  const [userPosition, setUserPosition] = useState<[number, number] | null>(
    null
  )
  const [markers, setMarkers] = useState<ymaps.Placemark[]>()
  // let markers:
  let placemark: null | ymaps.Placemark = null
  let collection: ymaps.GeoObjectCollection
  let previousChosenMarker: null | ymaps.Placemark = null
  // const [previousChosenMarker, setPreviousChosenMarker] = useState<null | ymaps.Placemark>(null)

  useEffect(() => {
    async function setUpMap() {
      const mapRef = document.getElementById('map')!
      const { map, constructor } = await initMap(mapRef)

      const { userPosition } = await locateUser(map, constructor)

      setUserPosition(userPosition)
      if (interactionType === 'add') {
        addOnMarkerAddHandler(map, constructor, buttonClickHandler)
      }
    }
    if (i === 0) {
      i++
      setUpMap()
    }
    return () => {
      //
    }
  }, [])

  useEffect(() => {
    if (sportsGrounds?.length && constructor) {
      populateMap(map!, constructor, sportsGrounds)
    }
  }, [sportsGrounds, constructor])

  useEffect(() => {
    if (markers?.length && constructor) {
      continueToSetUpMap()
    }
    async function continueToSetUpMap() {
      const { userPosition } = await locateUser(map!, constructor!)
      if (interactionType === 'read' && markers?.length) {
        addOnMarkerSelectHandler(map!, markers, buttonClickHandler)
      }
      if (chosenSportsGroundCoords?.length) {
        await map?.panTo(chosenSportsGroundCoords, { duration: 300 })
        if (collectionQuery) {
          locateNearest(chosenSportsGroundCoords)
        }
      } else {
        await map?.panTo(userPosition!, { duration: 300 })
      }
    }
  }, [markers, collectionQuery])

  async function initMap(container: HTMLElement) {
    let constructor: YmapsInstanse
    try {
      // @ts-expect-error
      constructor = (await ymaps.load(
        `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=${
          import.meta.env.VITE_YMAPS_APIKEY as string
        }`
      )) as YmapsInstanse
    } catch {
      return await Promise.reject(new Error('Не удалось отобразить карту'))
    }
    const map = new constructor.Map(
      container,
      {
        center: [55.76, 37.64],
        zoom: 13,
        controls: []
      },
      {
        suppressMapOpenBlock: true,
        yandexMapDisablePoiInteractivity: true,
        minZoom: 5
      }
    )
    setConstructor(constructor)
    setMap(map)
    container.querySelectorAll<HTMLElement>(
      '.ymaps-2-1-79-copyright'
    )[0].style.display = 'none'
    return { constructor, map }
  }

  async function getGeolocation(constructor: YmapsInstanse) {
    try {
      const { geoObjects } = await constructor.geolocation.get({
        provider: 'auto',
        autoReverseGeocode: false,
        timeout: 100
      })
      return geoObjects
    } catch (e) {
      console.log('locationError', e)
      return await Promise.reject(new Error('e'))
    }
  }

  async function locateUser(
    map: ymaps.Map,
    constructor: YmapsInstanse
  ): Promise<{ userPosition: [number, number] | null }> {
    try {
      const geoObjects = await getGeolocation(constructor)

      // @ts-expect-error
      geoObjects.options.set('preset', 'islands#yellowCircleIcon')
      const previousMarker = map.geoObjects.get(1)
      if (previousMarker) {
        map.geoObjects.remove(previousMarker)
      }
      map.geoObjects.add(geoObjects)
      return { userPosition: geoObjects.position }
    } catch (e) {
      console.log('locate user error', e)
    }
    return { userPosition: null }
  }

  function populateMap(
    map: ymaps.Map,
    constructor: YmapsInstanse,
    sportsGrounds: SportsGroundWithKey[]
  ) {
    const markers = sportsGrounds.map((sportsGround) => {
      const marker = new constructor.Placemark(
        sportsGround.marker,
        { key: sportsGround.sportsGroundKey },
        {
          iconLayout: 'default#image',
          iconImageHref: 'map/black-marker.png',
          iconImageSize: [50, 70],
          iconImageOffset: [-16, -64]
        }
      )
      return marker
    })

    collection = new constructor.GeoObjectCollection({
      children: markers
    })

    // map.geoObjects.add(collection) // for not removing markers when out of user view
    const collectionQuery = constructor.geoQuery(collection)
    collectionQuery.searchInside(map).addToMap(map)

    map.events.add('boundschange', () => {
      const visibleCollection = collectionQuery.searchInside(map).addToMap(map)
      setCollectionQuery(collectionQuery)
      collectionQuery.remove(visibleCollection).removeFromMap(map)
    })
    setMarkers(markers)
  }

  function addOnMarkerAddHandler(
    map: ymaps.Map,
    constructor: YmapsInstanse,
    cb?: ButtonHandlerType
  ) {
    map.events.add('click', (event) => {
      if (!map.balloon.isOpen()) {
        const coords = event.get('coords')
        const { MyBalloonLayout, MyBalloonMobileLayout } = _createAddLayout(
          map,
          constructor,
          cb
        )
        map.panTo(coords, { duration: 300 })
        map.geoObjects.remove(placemark!)
        placemark = new constructor.Placemark(
          coords,
          {
            baloonContent: 'Sport Ground Place'
          },
          {
            // preset: 'islands#blackSportIcon'
            iconLayout: 'default#image',
            iconImageHref: 'map/yellow-marker.png',
            iconImageSize: [50, 70],
            iconImageOffset: [-16, -64]
          }
        )
        map.geoObjects.add(placemark)
        map.balloon.open(
          coords,
          {},
          {
            closeButton: false,
            autoPan: true,
            contentLayout: MyBalloonMobileLayout,
            // options.panelContentLayout
            layout: MyBalloonLayout
          }
        )
      } else {
        map.balloon.close()
      }
    })
  }

  function addOnMarkerSelectHandler(
    map: ymaps.Map,
    markers: ymaps.Placemark[],
    cb?: ButtonHandlerType
  ) {
    markers.forEach((marker) => {
      marker.events.add('click', (event) => {
        // const coords = event.get('coords')
        // const coords = marker.geometry!._coordinates
        const data = event.get('target')!.properties._data as { key: string }

        if (cb) {
          cb(data.key)
        }

        if (previousChosenMarker) {
          previousChosenMarker?.options?.set({
            iconLayout: 'default#image',
            iconImageHref: 'map/black-marker.png',
            iconImageSize: [50, 70],
            iconImageOffset: [-16, -64]
          })
        }

        event.get('target')!.options.set({
          iconLayout: 'default#image',
          iconImageHref: 'map/yellow-marker.png',
          iconImageSize: [50, 70],
          iconImageOffset: [-16, -64]
        })
        map.panTo(marker.geometry!._coordinates, { duration: 300 })
        previousChosenMarker = marker
      })
    })
  }

  function locateNearest(position?: [number, number]) {
    let nearest
    if (position?.length === 2) {
      nearest = collectionQuery.getClosestTo(position)
    } else {
      nearest = collectionQuery.getClosestTo(userPosition)
    }
    previousChosenMarker?.options?.set({
      iconLayout: 'default#image',
      iconImageHref: 'map/black-marker.png',
      iconImageSize: [50, 70],
      iconImageOffset: [-16, -64]
    })
    nearest.options.set({
      iconLayout: 'default#image',
      iconImageHref: 'map/yellow-marker.png',
      iconImageSize: [50, 70],
      iconImageOffset: [-16, -64]
    })
    previousChosenMarker = nearest

    if (nearest) {
      map!.panTo(nearest.geometry!._coordinates, { duration: 300 })
    } else {
      console.log('Cannot find nearest sports ground')
    }
  }

  function _createAddLayout(
    map: ymaps.Map,
    constructor: YmapsInstanse,
    cb?: ButtonHandlerType
  ) {
    const MyBalloonMobileLayout = constructor.templateLayoutFactory.createClass(
      MyBalloonMobileTemplate,
      {
        build: function () {
          this.constructor.superclass.build.call(this)

          this.layout =
            this.getParentElement().getElementsByClassName('popover-mobile')[0]

          this.layout.closest(
            '.ymaps-2-1-79-balloon__content'
          ).style.backgroundColor = 'rgba(80, 80, 80, .5)'
          this.layout.closest(
            '.ymaps-2-1-79-balloon_layout_panel'
          ).style.backgroundColor = 'rgba(80, 80, 80, .5)'
          this.addButtonEventHandler(cb)
        },
        addButtonEventHandler(cb?: ButtonHandlerType) {
          this.layout.getElementsByClassName('add-button')[0].addEventListener(
            'click',
            (e: MouseEvent) => {
              if (cb) {
                cb(
                  map.geoObjects.get(map.geoObjects.getLength() - 1).geometry
                    ._coordinates
                )
              }
              this.onCloseClick(e)
            },
            { once: true }
          )
        },
        onCloseClick: function (e: MouseEvent) {
          e.preventDefault()

          this.events.fire('userclose')
        }
      }
    )

    const MyBalloonLayout = constructor.templateLayoutFactory.createClass(
      myBalloonLayoutTemplate,
      {
        build: function () {
          this.constructor.superclass.build.call(this)
          this.layout =
            this.getParentElement().getElementsByClassName('popover')[0]

          this.applyElementOffset()

          this.layout
            .getElementsByClassName('close')[0]
            .addEventListener('click', this.onCloseClick.bind(this))
          this.addButtonEventHandler(cb)
        },
        clear: function () {
          this.layout
            .getElementsByClassName('close')[0]
            .removeEventListener('click', this.onCloseClick)

          this.constructor.superclass.clear.call(this)
        },

        onSublayoutSizeChange: function (...args: any) {
          this.constructor.superclass.onSublayoutSizeChange.apply(this, args)
          if (!this._isElement(this.layout)) {
            return
          }
          this.applyElementOffset()
          this.events.fire('shapechange')
        },
        applyElementOffset: function () {
          this.layout.style.marginLeft = `${-(this.layout.offsetWidth / 2)}px`
          this.layout.style.marginTop = `${
            (this.layout.offsetHeight +
              this.layout.getElementsByClassName('arrow')[0].offsetHeight) /
            3
          }px`
        },
        onCloseClick: function (e: MouseEvent) {
          e.preventDefault()

          this.events.fire('userclose')
        },
        getShape: function () {
          if (!this._isElement(this.layout)) {
            return this.constructor.superclass.getShape.call(this)
          }

          const position = this.layout.position()

          return new ymaps.shape.Rectangle(
            new ymaps.geometry.pixel.Rectangle([
              [position.left, position.top],
              [
                position.left + this.layout[0].offsetWidth,
                position.top +
                  this.layout[0].offsetHeight +
                  this.layout.getElementsByClassName('arrow')[0].offsetHeight
              ]
            ])
          )
        },
        _isElement: function (element) {
          return element?.[0] && element.getElementsByClassName('arrow')[0]
        },
        addButtonEventHandler(cb?: () => void) {
          this.layout.getElementsByClassName('add-button')[0].addEventListener(
            'click',
            (e: MouseEvent) => {
              if (cb) {
                cb(
                  map.geoObjects.get(map.geoObjects.getLength() - 1).geometry
                    ._coordinates
                )
              }
              this.onCloseClick(e)
            },
            { once: true }
          )
        }
      }
    )
    return { MyBalloonMobileLayout, MyBalloonLayout }
  }

  return { locateNearest }
}

export default useMap
