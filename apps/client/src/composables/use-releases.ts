import type { DashboardStats, DigestReport, Release, ReleaseFilters } from '~/shared/types/release'
import { ref } from 'vue'
import { releasesApi } from '~/shared/api/releases'

// Глобальный стейт
const stats = ref<DashboardStats | null>(null)
const digest = ref<DigestReport | null>(null)
const releases = ref<Release[]>([])
const searchResults = ref<Release[]>([])
const projectList = ref<string[]>([])

const loading = ref(false)
const filters = ref<ReleaseFilters>({ limit: 50, environment: '', project: '' })
const searchTicket = ref('')
const digestPeriod = ref<'today' | 'week' | 'two-weeks'>('week')

export function useReleases() {
  async function fetchDashboard() {
    loading.value = true
    try {
      const [statsData, digestData] = await Promise.all([
        releasesApi.getStats(),
        releasesApi.getDigest(digestPeriod.value),
      ])
      stats.value = statsData
      digest.value = digestData
    }
    catch (e) {
      console.error('Ошибка загрузки дашборда', e)
    }
    finally {
      loading.value = false
    }
  }

  async function fetchDigest() {
    loading.value = true
    try {
      digest.value = await releasesApi.getDigest(digestPeriod.value)
    }
    catch (e) {
      console.error('Ошибка загрузки дайджеста', e)
    }
    finally {
      loading.value = false
    }
  }

  async function fetchProjectsList() {
    try {
      projectList.value = await releasesApi.getProjectsList()
    }
    catch (e) {
      console.error('Ошибка загрузки списка проектов', e)
    }
  }

  async function fetchReleases() {
    loading.value = true
    try {
      releases.value = await releasesApi.getReleases(filters.value)
    }
    catch (e) {
      console.error('Ошибка загрузки релизов', e)
    }
    finally {
      loading.value = false
    }
  }

  async function doSearch() {
    if (!searchTicket.value)
      return
    loading.value = true
    try {
      searchResults.value = await releasesApi.getByTicket(searchTicket.value)
    }
    catch (e) {
      console.error('Ошибка поиска', e)
    }
    finally {
      loading.value = false
    }
  }

  return {
    stats,
    digest,
    digestPeriod,
    releases,
    searchResults,
    projectList,
    loading,
    filters,
    searchTicket,
    fetchDashboard,
    fetchDigest,
    fetchReleases,
    doSearch,
    fetchProjectsList,
  }
}
