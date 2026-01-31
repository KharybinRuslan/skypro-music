import { Track } from '@/types/track';

const API_BASE = 'https://webdev-music-003b5b991590.herokuapp.com';

export const getApiBase = () => API_BASE;

// Auth
export interface SignupRequest {
  email: string;
  password: string;
  username: string;
}

export interface SignupResponse {
  success?: boolean;
  message?: string;
  result?: { username: string; email: string; _id: number };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  email: string;
  username: string;
  _id: number;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface ApiErrorResponse {
  message?: string;
  detail?: string;
  code?: string;
}

// Catalog
export interface Selection {
  _id: number;
  name?: string;
  items?: number[];
}

export interface SelectionsResponse {
  success?: boolean;
  data?: Selection[];
}

export interface SelectionResponse {
  success?: boolean;
  data?: Selection;
}

export type TracksResponse = Track[];

export interface TracksResponseWrapped {
  success?: boolean;
  data?: Track[];
}
