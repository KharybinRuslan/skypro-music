import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  favoriteTrackIds: number[];
}

const initialState: FavoritesState = {
  favoriteTrackIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<number[]>) => {
      state.favoriteTrackIds = action.payload;
    },
    addFavorite: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      if (!state.favoriteTrackIds.includes(id)) {
        state.favoriteTrackIds.push(id);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favoriteTrackIds = state.favoriteTrackIds.filter(
        (id) => id !== action.payload,
      );
    },
  },
});

export const { setFavorites, addFavorite, removeFavorite } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
