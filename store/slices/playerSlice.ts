import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Track } from '@/types/track';

interface PlayerState {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isShuffled: boolean;
  isRepeated: boolean;
}

const initialState: PlayerState = {
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 50,
  isShuffled: false,
  isRepeated: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlaylist: (state, action: PayloadAction<Track[]>) => {
      state.playlist = action.payload;
    },
    setCurrentTrack: (state, action: PayloadAction<Track>) => {
      state.currentTrack = action.payload;
      state.isPlaying = true;
      state.currentTime = 0;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    toggleShuffle: (state) => {
      state.isShuffled = !state.isShuffled;
    },
    toggleRepeat: (state) => {
      state.isRepeated = !state.isRepeated;
    },
    updateTrackLike: (
      state,
      action: PayloadAction<{ trackId: number; userId: string; liked: boolean }>,
    ) => {
      const { trackId, userId, liked } = action.payload;
      const updateStared = (track: Track) => {
        if (track._id !== trackId) return track;
        const stared = track.stared_user ?? [];
        const hasUser = stared.includes(userId);
        if (liked && !hasUser) {
          return { ...track, stared_user: [...stared, userId] };
        }
        if (!liked && hasUser) {
          return { ...track, stared_user: stared.filter((id) => id !== userId) };
        }
        return track;
      };
      if (state.currentTrack) {
        state.currentTrack = updateStared(state.currentTrack) as Track;
      }
      state.playlist = state.playlist.map((t) => updateStared(t) as Track);
    },
  },
});

export const {
  setPlaylist,
  setCurrentTrack,
  togglePlay,
  setCurrentTime,
  setDuration,
  setVolume,
  toggleShuffle,
  toggleRepeat,
  updateTrackLike,
} = playerSlice.actions;

export default playerSlice.reducer;
