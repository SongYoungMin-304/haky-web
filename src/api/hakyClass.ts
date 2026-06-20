import type { HakyClass } from '../types'
import client from './client'

export interface ClassForm {
  title: string
  description: string
  schedule: string
  capacity: number
  pointCost: number
}

export const getClasses = () => client.get<HakyClass[]>('/classes').then((r) => r.data)

export const getClass = (id: number) => client.get<HakyClass>(`/classes/${id}`).then((r) => r.data)

export const getMyClasses = () => client.get<HakyClass[]>('/classes/my').then((r) => r.data)

export const createClass = (data: ClassForm) =>
  client.post<HakyClass>('/classes', data).then((r) => r.data)

export const updateClass = (id: number, data: ClassForm) =>
  client.patch<HakyClass>(`/classes/${id}`, data).then((r) => r.data)

export const deleteClass = (id: number) => client.delete(`/classes/${id}`)
