import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import { get, getDatabase, push, ref, set, update } from 'firebase/database'
import { app } from 'src/hooks/boot'
import { store } from 'src/store/store'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  StorageReference
} from 'firebase/storage'
import { Marker, SportsGround, SportsGroundWithKey } from 'src/models'

export const markersApi = createApi({
  reducerPath: 'markers',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Marker'],
  refetchOnMountOrArgChange: 30,
  keepUnusedDataFor: 10,
  endpoints: (build) => ({
    fetchSportsGrounds: build.query<SportsGroundWithKey[], void>({
      async queryFn() {
        try {
          const db = getDatabase(app)
          const sportsGroundsRef = ref(db, 'sportsGrounds')
          const snapshot: FetchSportsGroundsResponse = (
            await get(sportsGroundsRef)
          ).val()
          const markers = Object.entries(snapshot).map(([key, value]) => ({
            ...value,
            sportsGroundKey: key
          }))
          return { data: markers }
        } catch (error: any) {
          return { error: { message: error.message } }
        }
      },
      providesTags: ['Marker']
    }),
    addSportsGround: build.mutation<void, AddSportsGroundRequest>({
      async queryFn({ description, marker, files }) {
        try {
          const db = getDatabase(app)
          const sportsGroundsRef = ref(db, 'sportsGrounds')
          const newSportsGroundsRef = await push(sportsGroundsRef)
          const state = store.getState()
          await set(newSportsGroundsRef, {
            marker,
            description,
            authorId: state.rootReducer.userReducer.user.uid
          })
          if (!files.length) return { data: undefined }
          const fileStorage = getStorage(app)
          const filesRef: StorageReference[] = []
          files.forEach((file, i) => {
            const imageExt = file.name.slice(file.name.lastIndexOf('.'))
            filesRef.push(
              storageRef(
                fileStorage,
                `sportsGrounds/${newSportsGroundsRef.key!}/${i}${imageExt}`
              )
            )
          })
          await Promise.all(
            files.map(async (file, i) => await uploadBytes(filesRef[i], file))
          )
          const fileUrls = await Promise.all(
            filesRef.map(async (fileRef) => await getDownloadURL(fileRef))
          )
          await update(newSportsGroundsRef, { fileUrls })
          return { data: undefined }
        } catch (error: any) {
          return { error: { message: error.message } }
        }
      },
      invalidatesTags: ['Marker']
    })
  })
})

interface FetchSportsGroundsResponse {
  [key: string]: SportsGround
}
interface AddSportsGroundRequest {
  description: string
  marker: Marker
  files: File[]
}

export const { useFetchSportsGroundsQuery, useAddSportsGroundMutation } = markersApi
