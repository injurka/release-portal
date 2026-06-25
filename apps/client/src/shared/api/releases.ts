import type { DashboardStats, Release, ReleaseFilters, WeeklyReportResponse } from '../types/release'

const API_BASE = import.meta.env.VITE_API_URL || 'https://release-portal-api.trip-scheduler.ru/api/releases'

export const releasesApi = {
  // Получение релизов с фильтрацией
  async getReleases(filters?: ReleaseFilters): Promise<Release[]> {
    const url = new URL(API_BASE)

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          url.searchParams.append(key, String(value))
        }
      })
    }

    const res = await fetch(url.toString())
    if (!res.ok)
      throw new Error('Failed to fetch releases')
    return res.json()
  },

  // Статистика для дашборда
  async getStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`)
    if (!res.ok)
      throw new Error('Failed to fetch stats')
    return res.json()
  },

  // Еженедельный дайджест сгруппированный по проектам и неделям
  async getWeekly(env?: string): Promise<WeeklyReportResponse> {
    const url = new URL(`${API_BASE}/weekly`)
    if (env)
      url.searchParams.append('environment', env)

    const res = await fetch(url.toString())
    if (!res.ok)
      throw new Error('Failed to fetch weekly report')
    return res.json()
  },

  // Поиск всех выкаток по конкретной Jira задаче
  async getByTicket(ticket: string): Promise<Release[]> {
    const res = await fetch(`${API_BASE}/tickets/${ticket}`)
    if (!res.ok)
      throw new Error('Failed to fetch ticket')
    return res.json()
  },

  // Релизы конкретного пользователя
  async getByUser(username: string): Promise<Release[]> {
    const res = await fetch(`${API_BASE}/users/${username}`)
    if (!res.ok)
      throw new Error('Failed to fetch user releases')
    return res.json()
  },

  // Релизы конкретного проекта
  async getByProject(project: string): Promise<Release[]> {
    const res = await fetch(`${API_BASE}/projects/${project}`)
    if (!res.ok)
      throw new Error('Failed to fetch project releases')
    return res.json()
  },

  // Получить список уникальных проектов
  async getProjectsList(): Promise<string[]> {
    const res = await fetch(`${API_BASE}/projects`)
    if (!res.ok)
      throw new Error('Failed to fetch projects list')
    return res.json()
  },
}
