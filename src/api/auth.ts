import type { TokenResponse, User } from '../types'
import client from './client'

export const signup = (data: { email: string; password: string; name: string; role: string }) =>
  client.post<User>('/auth/signup', data).then((r) => r.data)

export const login = (data: { email: string; password: string }) =>
  client.post<TokenResponse>('/auth/login', data).then((r) => r.data)

export const getMe = () => client.get<User>('/auth/me').then((r) => r.data)
