import type { Booking } from '../types'
import client from './client'

export const createBooking = (classId: number) =>
  client.post<Booking>('/bookings', { classId }).then((r) => r.data)

export const getMyBookings = () => client.get<Booking[]>('/bookings/me').then((r) => r.data)

export const cancelBooking = (id: number) => client.delete(`/bookings/${id}`)

export const getAllBookings = () => client.get<Booking[]>('/bookings').then((r) => r.data)
