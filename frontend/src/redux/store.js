import { configureStore } from '@reduxjs/toolkit';
import roomsReducer from '../redux/slice/roomsSlice';

export const store = configureStore({
  reducer: {
    rooms: roomsReducer,   
  },
});
