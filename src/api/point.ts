import type { PointRequest, PointRequestStatus } from '../types'
import client from './client'

export const createPointRequest = (amount: number) =>
  client.post<PointRequest>('/points/requests', { amount }).then((r) => r.data)

export const getMyPointRequests = () =>
  client.get<PointRequest[]>('/points/requests/me').then((r) => r.data)

export const getAllPointRequests = (status?: PointRequestStatus) =>
  client.get<PointRequest[]>('/points/requests', { params: { status } }).then((r) => r.data)

export const approvePointRequest = (id: number) =>
  client.patch<PointRequest>(`/points/requests/${id}/approve`).then((r) => r.data)

export const rejectPointRequest = (id: number) =>
  client.patch<PointRequest>(`/points/requests/${id}/reject`).then((r) => r.data)
