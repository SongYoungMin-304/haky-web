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

export type TeamApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type TeamPaymentStatus = 'PAID' | 'FAILED'

export interface Team {
  id: number
  coachId: number
  coachName: string
  name: string
  description: string
  monthlyPointCost: number
  activeMemberCount: number
  createdAt: string
}

export interface TeamApplication {
  id: number
  teamId: number
  teamName: string
  userId: number
  userName: string
  userLoginId: string
  phone: string
  message: string
  status: TeamApplicationStatus
  appliedAt: string
  processedAt: string | null
}

export interface MyTeamStatus {
  teamId: number
  applicationStatus: TeamApplicationStatus | null
  isMember: boolean
}

export interface TeamMember {
  userId: number
  userName: string
  joinedAt: string
}

export interface MyMembership {
  teamId: number
  teamName: string
  coachName: string
  monthlyPointCost: number
  joinedAt: string
  thisMonthStatus: TeamPaymentStatus | null
  thisMonthPaidAt: string | null
}

export interface TeamPayment {
  id: number
  membershipId: number
  userName: string
  year: number
  month: number
  amount: number
  status: TeamPaymentStatus
  paidAt: string
}

export interface TeamPaymentStatusRow {
  userId: number
  userName: string
  membershipId: number
  paymentStatus: TeamPaymentStatus | null
  paidAt: string | null
}

export interface TeamPaymentStatusResponse {
  year: number
  month: number
  members: TeamPaymentStatusRow[]
}

export interface TokenResponse {
  token: string
}

export interface ErrorResponse {
  message: string
}
