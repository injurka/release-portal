<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, reactive } from 'vue'
import { ReleaseCard, ReleaseCardSkeleton } from '~/components/05.modules/release-card'
import { useReleases } from '~/composables/use-releases'

const { stats, weekly, loading, fetchDashboard } = useReleases()

const collapsedWeeks = reactive({
  current: false,
  previous: false,
})

const collapsedProjects = reactive<Record<string, boolean>>({})

function toggleWeek(week: 'current' | 'previous') {
  collapsedWeeks[week] = !collapsedWeeks[week]
}

function toggleProject(week: 'current' | 'previous', project: string) {
  const key = `${week}-${project}`
  collapsedProjects[key] = !collapsedProjects[key]
}

onMounted(() => {
  if (!stats.value)
    fetchDashboard()
})
</script>

<template>
  <div class="dashboard-view">
    <!-- Скелетоны для дашборда -->
    <div v-if="loading && !stats">
      <div class="stats-cards">
        <div class="stat-card skeleton-card" />
        <div class="stat-card skeleton-card" />
      </div>
      <div class="releases-grid">
        <ReleaseCardSkeleton v-for="i in 6" :key="i" />
      </div>
    </div>

    <template v-else>
      <div v-if="stats" class="stats-cards">
        <div class="stat-card">
          <h3>Всего релизов</h3>
          <span class="huge-number">{{ stats.total }}</span>
        </div>
        <div class="stat-card">
          <h3>Топ проектов</h3>
          <ul>
            <li v-for="p in stats.top_projects" :key="p.project">
              {{ p.project }} ({{ p.count }})
            </li>
          </ul>
        </div>
      </div>

      <div v-if="weekly" class="weeks-container">
        <!-- ТЕКУЩАЯ НЕДЕЛЯ -->
        <div class="week-section">
          <div class="section-header" @click="toggleWeek('current')">
            <Icon icon="mdi:chevron-down" class="toggle-icon" :class="{ rotated: collapsedWeeks.current }" />
            <h2 class="section-title">
              Текущая неделя
            </h2>
            <span class="date-range">{{ weekly.currentWeek.dateRange }}</span>
          </div>

          <div v-show="!collapsedWeeks.current" class="section-content">
            <div v-if="Object.keys(weekly.currentWeek.data).length === 0" class="empty-state">
              На этой неделе пока не было релизов
            </div>

            <div v-for="(projectReleases, projectName) in weekly.currentWeek.data" :key="projectName" class="project-group">
              <div class="project-header" @click="toggleProject('current', String(projectName))">
                <Icon icon="mdi:chevron-down" class="toggle-icon small" :class="{ rotated: collapsedProjects[`current-${String(projectName)}`] }" />
                <h3 class="project-title">
                  {{ projectName }}
                </h3>
                <span class="release-count">{{ projectReleases.length }}</span>
              </div>

              <div v-show="!collapsedProjects[`current-${String(projectName)}`]" class="releases-grid">
                <ReleaseCard
                  v-for="release in projectReleases"
                  :key="release.id"
                  :release="release"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ПРОШЛАЯ НЕДЕЛЯ -->
        <div class="week-section">
          <div class="section-header" @click="toggleWeek('previous')">
            <Icon icon="mdi:chevron-down" class="toggle-icon" :class="{ rotated: collapsedWeeks.previous }" />
            <h2 class="section-title">
              Прошлая неделя
            </h2>
            <span class="date-range">{{ weekly.previousWeek.dateRange }}</span>
          </div>

          <div v-show="!collapsedWeeks.previous" class="section-content">
            <div v-if="Object.keys(weekly.previousWeek.data).length === 0" class="empty-state">
              На прошлой неделе релизов не найдено
            </div>

            <div v-for="(projectReleases, projectName) in weekly.previousWeek.data" :key="projectName" class="project-group">
              <div class="project-header" @click="toggleProject('previous', String(projectName))">
                <Icon icon="mdi:chevron-down" class="toggle-icon small" :class="{ rotated: collapsedProjects[`previous-${String(projectName)}`] }" />
                <h3 class="project-title">
                  {{ projectName }}
                </h3>
                <span class="release-count">{{ projectReleases.length }}</span>
              </div>

              <div v-show="!collapsedProjects[`previous-${String(projectName)}`]" class="releases-grid">
                <ReleaseCard
                  v-for="release in projectReleases"
                  :key="release.id"
                  :release="release"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
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
  min-height: 140px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 40px;

  .stat-card {
    background-color: var(--bg-secondary-color);
    border: 1px solid var(--border-primary-color);
    border-radius: 12px;
    padding: 24px;

    h3 {
      margin: 0 0 16px 0;
      color: var(--fg-tertiary-color);
      font-size: 1rem;
      text-transform: uppercase;
    }

    .huge-number {
      font-size: 3rem;
      font-weight: 700;
      color: var(--fg-primary-color);
    }

    ul {
      margin: 0;
      padding-left: 20px;
      color: var(--fg-primary-color);

      li {
        margin-bottom: 8px;
      }
    }
  }
}

.week-section {
  margin-bottom: 60px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border-primary-color);
  padding-bottom: 12px;
  cursor: pointer;
  user-select: none;
  transition: border-color 0.2s ease;

  &:hover {
    border-bottom-color: var(--border-focus-color);

    .section-title {
      color: var(--fg-action-hover-color);
    }
  }

  .section-title {
    font-size: 1.5rem;
    margin: 0;
    color: var(--fg-primary-color);
    transition: color 0.2s ease;
  }

  .date-range {
    font-size: 0.9rem;
    color: var(--fg-tertiary-color);
    background-color: var(--bg-tertiary-color);
    padding: 4px 12px;
    border-radius: 20px;
    border: 1px solid var(--border-secondary-color);
  }
}

.project-group {
  margin-bottom: 40px;
}

.project-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  cursor: pointer;
  user-select: none;
  width: fit-content;

  &:hover {
    .project-title {
      color: var(--fg-action-hover-color);
    }
  }

  .project-title {
    font-size: 1.2rem;
    color: var(--fg-accent-color);
    margin: 0;
    transition: color 0.2s ease;
  }

  .release-count {
    font-size: 0.8rem;
    color: var(--fg-secondary-color);
    background-color: var(--bg-tertiary-color);
    padding: 2px 8px;
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

  &.small {
    font-size: 1.5rem;
    color: var(--fg-tertiary-color);
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
