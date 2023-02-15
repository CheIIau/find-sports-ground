// import { AppDispatch } from '../store'
// import { get, getDatabase, ref } from 'firebase/database'
// import { mapSlice, Marker } from './MapSlice'
// import { app } from 'src/boot'
// import { createAsyncThunk } from '@reduxjs/toolkit'

// export const fetchMarkers = createAsyncThunk('markers', async (_, thunkApi) => {
//   try {
//     const db = getDatabase(app)
//     const sportsGroundsRef = ref(db, 'sportsGrounds')
//     let snapshot: Marker[] = (await get(sportsGroundsRef)).val()
//     snapshot = snapshot.filter((v) => v)
//     return snapshot
//   } catch (error) {
//     return thunkApi.rejectWithValue('Не удалось загрузить маркеры карты')
//   }
// })
export {}
