export type Role = 'USER' | 'COACH' | 'ADMIN'
export type PointRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type BookingStatus = 'CONFIRMED' | 'CANCELLED'

export interface User {
  id: number
  loginId: string
  name: string
  role: Role
  point: number
}

export interface PointRequest {
  id: number
  userId: number
  userName: string
  amount: number
  status: PointRequestStatus
  requestedAt: string
  processedAt: string | null
}

export interface HakyClass {
  id: number
  coachId: number
  coachName: string
  title: string
  description: string
  schedule: string
  capacity: number
  pointCost: number
  createdAt: string
}

export interface Booking {
  id: number
  userId: number
  classId: number
  classTitle: string
  usedPoint: number
  status: BookingStatus
  bookedAt: string
  cancelledAt: string | null
}

export interface TokenResponse {
  token: string
}

export interface ErrorResponse {
  message: string
}
