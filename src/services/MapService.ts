import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { get, getDatabase, ref } from 'firebase/database'
import { app } from 'src/boot'

export const markersApi = createApi({
  reducerPath: 'markers',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Marker'],
  refetchOnMountOrArgChange: 30,
  keepUnusedDataFor: 10,
  endpoints: (build) => ({
    fetchMarkers: build.query<Marker[], void>({
      async queryFn() {
        try {
          const db = getDatabase(app)
          const sportsGroundsRef = ref(db, 'sportsGrounds')
          let snapshot: Marker[] = (await get(sportsGroundsRef)).val()
          snapshot = snapshot.filter((v) => v)
          return { data: snapshot }
        } catch (error: any) {
          return { error: { message: error.message } }
        }
      },
      providesTags: ['Marker']
    })
  })
})

interface Marker {
  x: string
  y: string
}

export const { useFetchMarkersQuery } = markersApi
