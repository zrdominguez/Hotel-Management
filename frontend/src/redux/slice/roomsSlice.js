// src/store/roomsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    rooms: [],
    reservations: [],
    loading: true,
    };

    const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {
        setRooms: (state, action) => {
        state.rooms = action.payload;
        },
        setReservations: (state, action) => {
        state.reservations = action.payload;
        },
        setLoading: (state, action) => {
        state.loading = action.payload;
        },
    },
});

export const { setRooms, setReservations, setLoading } = roomsSlice.actions;
export default roomsSlice.reducer;
