import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  child,
  get,
  getDatabase,
  push,
  ref,
  set,
  update
} from 'firebase/database'
import { app } from 'src/hooks/boot'
import { store } from 'src/store/store'
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  StorageReference
} from 'firebase/storage'
import { Marker, SportsGround, SportsGroundWithKey, Comment } from 'src/models'

export const markersApi = createApi({
  reducerPath: 'markers',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Marker', 'Comment'],
  refetchOnMountOrArgChange: 30,
  keepUnusedDataFor: 10,
  endpoints: (build) => ({
    fetchSportsGrounds: build.query<SportsGroundWithKey[], void>({
      async queryFn() {
        try {
          const db = getDatabase(app)
          const sportsGroundsRef = ref(db, 'sportsGrounds')
          const snapshot: SportsGroundResponse = (
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
    }),
    addComment: build.mutation<void, AddCommentRequest>({
      async queryFn({ sportsGroundKey, commentText, userName }) {
        try {
          const db = getDatabase(app)
          const commentsRef = ref(db, 'comments')
          const commentKey = push(child(commentsRef, sportsGroundKey)).key
          const comment = {
            [`${commentKey}/body`]: commentText,
            [`${commentKey}/time`]: Date.now(),
            [`${commentKey}/userName`]: userName
          }
          const sporttGroundCommentRef = ref(db, `comments/${sportsGroundKey}`)
          await update(sporttGroundCommentRef, comment)
          return { data: undefined }
        } catch (error: any) {
          return { error: { message: error.message } }
        }
      },
      invalidatesTags: ['Comment']
    }),
    fetchComments: build.query<Comment[], string>({
      async queryFn(sportsGroundKey) {
        try {
          const db = getDatabase(app)
          const commentsRef = ref(db, `comments/${sportsGroundKey}`)
          const snapshot: Comment[] = (await get(commentsRef)).val()
          if (snapshot === null) {
            return { data: [] }
          }
          return { data: snapshot }
        } catch (error: any) {
          return { error: { message: error.message } }
        }
      },
      providesTags: ['Comment']
    })
  })
})

type SportsGroundResponse = Record<string, SportsGround>
type SportsGroundCommentsResponse = Record<string, SportsGround>

interface AddSportsGroundRequest {
  description: string
  marker: Marker
  files: File[]
}

interface AddCommentRequest {
  sportsGroundKey: string
  commentText: string
  userName: string
}

export const {
  useFetchSportsGroundsQuery,
  useAddSportsGroundMutation,
  useLazyFetchCommentsQuery,
  useAddCommentMutation
} = markersApi
