<script setup lang="ts">
import type { ViewSwitcherItem } from '~/components/01.kit/p-kit-view-switcher'
import type { Release } from '~/shared/types/release'
import { Icon } from '@iconify/vue'
import { onMounted, reactive } from 'vue'
import { KitViewSwitcher } from '~/components/01.kit/p-kit-view-switcher'
import { ReleaseCard, ReleaseCardSkeleton } from '~/components/05.modules/release-card'
import { useReleases } from '~/composables/use-releases'

const { stats, digest, digestPeriod, loading, fetchDashboard, fetchDigest } = useReleases()

const periodItems: ViewSwitcherItem<'today' | 'week' | 'two-weeks'>[] = [
  { id: 'today', label: 'Сегодня', icon: 'mdi:white-balance-sunny' },
  { id: 'week', label: 'Текущая неделя', icon: 'mdi:calendar-week' },
  { id: 'two-weeks', label: 'Две недели', icon: 'mdi:calendar-multiple' },
]

const collapsedProjects = reactive<Record<string, boolean>>({})

function toggleProject(project: string) {
  collapsedProjects[project] = !collapsedProjects[project]
}

function getProjectBumps(projectReleases: Release[]) {
  const envMap = new Map<string, { from: string, to: string, branch: string }>()

  for (const release of projectReleases) {
    if (!envMap.has(release.environment)) {
      envMap.set(release.environment, {
        to: release.tag,
        from: release.prev_tag || release.tag,
        branch: release.branch || '',
      })
    }
    else {
      envMap.get(release.environment)!.from = release.prev_tag || release.tag
    }
  }
  return Array.from(envMap.entries()).map(([env, data]) => ({ env, ...data }))
}

onMounted(() => {
  if (!stats.value)
    fetchDashboard()
})
</script>

<template>
  <div class="dashboard-view">
    <div v-if="loading && !stats">
      <div class="stats-cards">
        <div v-for="i in 3" :key="i" class="stat-card skeleton-card" />
      </div>
      <div class="releases-grid">
        <ReleaseCardSkeleton v-for="i in 6" :key="i" />
      </div>
    </div>

    <template v-else>
      <div v-if="stats" class="stats-cards">
        <div class="stat-card stat-total">
          <div class="stat-info">
            <h3>Всего релизов</h3>
            <span class="stat-number">{{ stats.total }}</span>
          </div>
          <Icon icon="lucide:activity" class="stat-icon" />
        </div>

        <div v-for="env in stats.by_environment" :key="env.environment" class="stat-card">
          <div class="stat-info">
            <h3>Стенд: {{ env.environment }}</h3>
            <span class="stat-number">{{ env.count }}</span>
          </div>
          <Icon icon="lucide:server" class="stat-icon" />
        </div>
      </div>

      <div class="dashboard-controls">
        <KitViewSwitcher
          v-model="digestPeriod"
          :items="periodItems"
          @change="fetchDigest"
        />
        <span v-if="digest" class="date-range">{{ digest.dateRange }}</span>
      </div>

      <Transition name="fade" mode="out-in">
        <div v-if="loading && stats" key="loading" class="loading-digest">
          <Icon icon="lucide:loader-2" class="spin-icon" /> Загрузка отчета...
        </div>

        <div v-else-if="digest" :key="digestPeriod" class="digest-container">
          <div v-if="Object.keys(digest.data).length === 0" class="empty-state">
            За выбранный период релизов не найдено
          </div>

          <div v-for="(projectReleases, projectName) in digest.data" :key="projectName" class="project-group">
            <div class="project-header" @click="toggleProject(String(projectName))">
              <Icon icon="mdi:chevron-down" class="toggle-icon" :class="{ rotated: collapsedProjects[String(projectName)] }" />
              <h3 class="project-title">
                {{ projectName }}
              </h3>
              <span class="release-count">{{ projectReleases.length }}</span>
            </div>

            <div v-show="!collapsedProjects[String(projectName)]" class="project-content">
              <div class="project-bumps">
                <div v-for="bump in getProjectBumps(projectReleases)" :key="bump.env" class="bump-item">
                  <span class="env-badge" :class="`env-${bump.env.toLowerCase()}`">{{ bump.env }}</span>
                  <span v-if="bump.branch" class="branch-pill">{{ bump.branch }}</span>
                  <div class="bump-versions">
                    <span class="version prev">{{ bump.from }}</span>
                    <Icon icon="lucide:arrow-right" class="version-arrow" />
                    <span class="version current">{{ bump.to }}</span>
                  </div>
                </div>
              </div>

              <div class="releases-grid">
                <ReleaseCard
                  v-for="release in projectReleases"
                  :key="release.id"
                  :release="release"
                />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </template>
  </div>
</template>

<style scoped lang="scss">
@keyframes skeleton-pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

.skeleton-card {
  background-color: var(--bg-tertiary-color);
  animation: skeleton-pulse 1.5s ease-in-out infinite;
  min-height: 80px;
}

.stats-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 40px;

  .stat-card {
    background-color: var(--bg-secondary-color);
    border: 1px solid var(--border-primary-color);
    border-radius: 12px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 220px;
    flex: 1;

    &.stat-total {
      background-color: var(--bg-accent-overlay-color);
      border-color: var(--border-accent-color);

      .stat-icon {
        color: var(--fg-accent-color);
      }
    }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    h3 {
      margin: 0;
      color: var(--fg-secondary-color);
      font-size: 0.85rem;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .stat-number {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--fg-primary-color);
      line-height: 1;
    }

    .stat-icon {
      font-size: 2.2rem;
      color: var(--fg-tertiary-color);
      opacity: 0.5;
    }
  }
}

.dashboard-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;

  .date-range {
    font-size: 0.9rem;
    color: var(--fg-tertiary-color);
    background-color: var(--bg-tertiary-color);
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid var(--border-secondary-color);
  }
}

.loading-digest {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--fg-secondary-color);
  padding: 20px 0;

  .spin-icon {
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.digest-container {
  margin-bottom: 60px;
}

.project-group {
  margin-bottom: 40px;
  background-color: transparent;
  border-radius: 12px;
}

.project-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  cursor: pointer;
  user-select: none;
  width: fit-content;

  &:hover {
    .project-title {
      color: var(--fg-action-hover-color);
    }
  }

  .project-title {
    font-size: 1.5rem;
    color: var(--fg-accent-color);
    margin: 0;
    transition: color 0.2s ease;
  }

  .release-count {
    font-size: 0.9rem;
    color: var(--fg-secondary-color);
    background-color: var(--bg-tertiary-color);
    padding: 2px 10px;
    border-radius: 12px;
    border: 1px solid var(--border-secondary-color);
  }
}

.toggle-icon {
  font-size: 1.8rem;
  color: var(--fg-secondary-color);
  transition:
    transform 0.2s ease,
    color 0.2s ease;

  &.rotated {
    transform: rotate(-90deg);
  }
}

.project-content {
  padding-left: 8px;
}

.project-bumps {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.bump-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-secondary-color);
  border: 1px solid var(--border-primary-color);
  padding: 10px 16px;
  border-radius: 8px;

  .env-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    padding: 0 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    border: 1px solid transparent;

    &.env-dev {
      background-color: var(--bg-info-color);
      color: var(--fg-info-color);
      border-color: var(--border-info-color);
    }
    &.env-test {
      background-color: var(--bg-warning-color);
      color: var(--fg-warning-color);
      border-color: var(--border-warning-color);
    }
    &.env-prod,
    &.env-production {
      background-color: var(--bg-success-color);
      color: var(--fg-success-color);
      border-color: var(--border-success-color);
    }
  }

  .branch-pill {
    display: flex;
    align-items: center;
    height: 24px;
    background-color: var(--bg-tertiary-color);
    border: 1px solid var(--border-secondary-color);
    padding: 0 8px;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--fg-info-color);
    border-color: var(--border-info-color);
  }

  .version-arrow {
    color: var(--fg-muted-color);
    margin: 0 6px;
  }

  .bump-versions {
    display: flex;
    align-items: center;
    font-family: monospace;
    font-size: 1.1rem;
    font-weight: 600;

    .prev {
      color: var(--fg-tertiary-color);
    }
    .current {
      color: var(--fg-primary-color);
    }
  }
}

.releases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  align-items: stretch;
}

.empty-state {
  color: var(--fg-secondary-color);
  font-style: italic;
  padding: 10px 0 30px;
}
</style>
