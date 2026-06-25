export interface Release {
  id: number
  project: string
  tag: string
  prev_tag: string | null
  branch: string | null
  environment: 'dev' | 'test' | 'staging' | 'prod' | 'production' | string
  trigger_user: string
  created_at: string
  jira_tickets: string[]
  type?: 'frontend' | 'backend' | string
  meta?: Record<string, any> | null
}

export interface DashboardStats {
  total: number
  by_environment: { environment: string, count: number }[]
  top_users: { user: string, count: number }[]
}

export interface ReleaseFilters {
  environment?: string
  project?: string
  trigger_user?: string
  branch?: string
  start_date?: string
  end_date?: string
  limit?: number
}

export interface DigestReport {
  dateRange: string
  data: Record<string, Release[]>
}
