import { Track } from '@/types/track';
import {
  getApiBase,
  type SignupRequest,
  type SignupResponse,
  type LoginRequest,
  type LoginUserResponse,
  type TokenResponse,
  type RefreshTokenResponse,
  type ApiErrorResponse,
  type TracksResponse,
  type TracksResponseWrapped,
  type Selection,
  type SelectionsResponse,
  type SelectionResponse,
} from './types';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@/lib/auth/token';

const BASE = getApiBase();

export function getAuthHeaders(): HeadersInit {
  const access = getAccessToken();
  if (!access) return {};
  return { Authorization: `Bearer ${access}` };
}

export async function refreshToken(): Promise<string> {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('Нет refresh токена');
  const res = await fetch(`${BASE}/user/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as ApiErrorResponse;
    throw new Error(err.detail ?? err.message ?? 'Ошибка обновления токена');
  }
  const { access } = data as RefreshTokenResponse;
  if (access) setTokens(access, refresh);
  return access;
}

export async function withReAuth<T>(
  fn: (headers: HeadersInit) => Promise<T>,
): Promise<T> {
  try {
    return await fn(getAuthHeaders());
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('401') || message.includes('Токен') || message.includes('токен')) {
      await refreshToken();
      return fn(getAuthHeaders());
    }
    throw err;
  }
}

function normalizeTrackFile(track: Track): Track {
  if (track.track_file && !track.track_file.startsWith('http')) {
    return {
      ...track,
      track_file: `${BASE}${track.track_file.startsWith('/') ? '' : '/'}${track.track_file}`,
    };
  }
  return track;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as ApiErrorResponse;
    throw new Error(err.message ?? err.detail ?? `Ошибка ${res.status}`);
  }
  return data as T;
}

export async function signup(body: SignupRequest): Promise<SignupResponse> {
  const res = await fetch(`${BASE}/user/signup/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<SignupResponse>(res);
}

export async function login(body: LoginRequest): Promise<LoginUserResponse> {
  const res = await fetch(`${BASE}/user/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<LoginUserResponse>(res);
}

export async function getToken(body: LoginRequest): Promise<TokenResponse> {
  const res = await fetch(`${BASE}/user/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleResponse<TokenResponse>(res);
}

export async function fetchAllTracks(): Promise<TracksResponse> {
  const res = await fetch(`${BASE}/catalog/track/all/`);
  const raw = await handleResponse<TracksResponse | TracksResponseWrapped>(res);
  const data = Array.isArray(raw) ? raw : (raw as TracksResponseWrapped).data;
  return Array.isArray(data) ? data.map(normalizeTrackFile) : [];
}

export async function fetchSelections(): Promise<Selection[]> {
  const res = await fetch(`${BASE}/catalog/selection/all`);
  const json = await handleResponse<SelectionsResponse>(res);
  return Array.isArray(json.data) ? json.data : [];
}

export async function fetchSelectionById(id: string): Promise<Selection> {
  const res = await fetch(`${BASE}/catalog/selection/${id}/`);
  const json = await handleResponse<SelectionResponse>(res);
  if (json.data) return json.data;
  throw new Error('Подборка не найдена');
}

export async function fetchSelectionTracks(
  id: string,
): Promise<{ name: string; tracks: Track[] }> {
  const [selection, allTracks] = await Promise.all([
    fetchSelectionById(id),
    fetchAllTracks(),
  ]);
  const name = selection.name ?? 'Подборка';
  const itemIds = Array.isArray(selection.items) ? selection.items : [];
  const tracks = itemIds
    .map((trackId) => allTracks.find((t) => t._id === trackId))
    .filter((t): t is Track => t != null)
    .map(normalizeTrackFile);
  return { name, tracks };
}

export async function fetchFavoriteTracks(): Promise<Track[]> {
  return withReAuth(async (headers) => {
    const res = await fetch(`${BASE}/catalog/track/favorite/all/`, {
      headers: { ...headers },
    });
    const raw = await handleResponse<TracksResponse | TracksResponseWrapped>(res);
    const data = Array.isArray(raw) ? raw : (raw as TracksResponseWrapped).data;
    return Array.isArray(data) ? data.map(normalizeTrackFile) : [];
  });
}

export async function addToFavorites(trackId: number): Promise<void> {
  return withReAuth(async (headers) => {
    const res = await fetch(`${BASE}/catalog/track/${trackId}/favorite/`, {
      method: 'POST',
      headers: { ...headers },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const err = data as ApiErrorResponse;
      throw new Error(err.message ?? err.detail ?? `Ошибка ${res.status}`);
    }
  });
}

export async function removeFromFavorites(trackId: number): Promise<void> {
  return withReAuth(async (headers) => {
    const res = await fetch(`${BASE}/catalog/track/${trackId}/favorite/`, {
      method: 'DELETE',
      headers: { ...headers },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const err = data as ApiErrorResponse;
      throw new Error(err.message ?? err.detail ?? `Ошибка ${res.status}`);
    }
  });
}
