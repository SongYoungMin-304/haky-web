import type {
  MyMembership,
  MyTeamStatus,
  Team,
  TeamApplication,
  TeamMember,
  TeamPayment,
  TeamPaymentStatusResponse,
} from '../types'
import client from './client'

export interface TeamForm {
  name: string
  description: string
  monthlyPointCost: number
}

export const getTeams = () => client.get<Team[]>('/teams').then((r) => r.data)

export const getTeam = (id: number) => client.get<Team>(`/teams/${id}`).then((r) => r.data)

export const getMyTeams = () => client.get<Team[]>('/teams/my').then((r) => r.data)

export const createTeam = (data: TeamForm) => client.post<Team>('/teams', data).then((r) => r.data)

export const applyTeam = (teamId: number, data: { phone: string; message: string }) =>
  client.post<TeamApplication>(`/teams/${teamId}/join`, data).then((r) => r.data)

export const getApplications = (teamId: number) =>
  client.get<TeamApplication[]>(`/teams/${teamId}/applications`).then((r) => r.data)

export const approveApplication = (teamId: number, applicationId: number) =>
  client
    .patch<TeamApplication>(`/teams/${teamId}/applications/${applicationId}/approve`)
    .then((r) => r.data)

export const rejectApplication = (teamId: number, applicationId: number) =>
  client
    .patch<TeamApplication>(`/teams/${teamId}/applications/${applicationId}/reject`)
    .then((r) => r.data)

export const leaveTeam = (teamId: number) => client.delete(`/teams/${teamId}/leave`)

export const getMyApplications = () =>
  client.get<TeamApplication[]>('/teams/my-applications').then((r) => r.data)

export const getMyMemberships = () =>
  client.get<MyMembership[]>('/teams/my-memberships').then((r) => r.data)

export const payMonthly = (teamId: number) =>
  client.post<TeamPayment>(`/teams/${teamId}/pay`).then((r) => r.data)

export const getMyPaymentHistory = (teamId: number) =>
  client.get<TeamPayment[]>(`/teams/${teamId}/my-payments`).then((r) => r.data)

export const getTeamMembers = (teamId: number) =>
  client.get<TeamMember[]>(`/teams/${teamId}/members`).then((r) => r.data)

export const getMyTeamStatus = (teamId: number) =>
  client.get<MyTeamStatus>(`/teams/${teamId}/my-status`).then((r) => r.data)

export const getTeamPaymentStatus = (teamId: number, year: number, month: number) =>
  client
    .get<TeamPaymentStatusResponse>(`/teams/${teamId}/payments`, { params: { year, month } })
    .then((r) => r.data)
