'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setFavorites } from '@/store/slices/favoritesSlice';
import { fetchFavoriteTracks } from '@/lib/api/client';
import { getAccessToken } from '@/lib/auth/token';

export default function FavoritesSync() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      dispatch(setFavorites([]));
      return;
    }
    fetchFavoriteTracks()
      .then((tracks) => {
        dispatch(setFavorites(tracks.map((t) => t._id)));
      })
      .catch(() => {
        dispatch(setFavorites([]));
      });
  }, [dispatch, pathname]);

  return null;
}
