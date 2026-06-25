<script setup lang="ts">
import { onMounted } from 'vue'
import ReleaseCard from '~/components/release-card.vue'
import { useReleases } from '~/composables/use-releases'

const { stats, weekly, loading, fetchDashboard } = useReleases()

onMounted(() => {
  if (!stats.value)
    fetchDashboard()
})
</script>

<template>
  <div class="dashboard-view">
    <div v-if="loading" />

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
        <div class="stat-card">
          <h3>Активные авторы</h3>
          <ul>
            <li v-for="u in stats.top_users" :key="u.user">
              {{ u.user }} ({{ u.count }})
            </li>
          </ul>
        </div>
      </div>

      <div v-if="weekly" class="sprints-container">
        <!-- ТЕКУЩИЙ СПРИНТ -->
        <div class="sprint-section">
          <h2 class="section-title">
            Текущий спринт
            <span class="date-range">({{ weekly.currentSprint.dateRange }})</span>
          </h2>

          <div v-if="Object.keys(weekly.currentSprint.data).length === 0" class="empty-state">
            В текущем спринте пока не было релизов
          </div>

          <div v-for="(projectReleases, projectName) in weekly.currentSprint.data" :key="projectName" class="project-group">
            <h3 class="project-title">
              {{ projectName }}
            </h3>
            <div class="releases-grid">
              <ReleaseCard
                v-for="release in projectReleases"
                :key="release.id"
                :release="release"
              />
            </div>
          </div>
        </div>

        <!-- ПРОШЛЫЙ СПРИНТ -->
        <div class="sprint-section">
          <h2 class="section-title">
            Прошлый спринт
            <span class="date-range">({{ weekly.previousSprint.dateRange }})</span>
          </h2>

          <div v-if="Object.keys(weekly.previousSprint.data).length === 0" class="empty-state">
            В прошлом спринте релизов не найдено
          </div>

          <div v-for="(projectReleases, projectName) in weekly.previousSprint.data" :key="projectName" class="project-group">
            <h3 class="project-title">
              {{ projectName }}
            </h3>
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
    </template>
  </div>
</template>

<style scoped lang="scss">
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

.sprint-section {
  margin-bottom: 60px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: var(--fg-primary-color);
  border-bottom: 1px solid var(--border-primary-color);
  padding-bottom: 12px;
  display: flex;
  align-items: baseline;
  gap: 12px;

  .date-range {
    font-size: 1rem;
    color: var(--fg-tertiary-color);
    font-weight: 500;
  }
}

.project-group {
  margin-bottom: 40px;

  .project-title {
    font-size: 1.2rem;
    color: var(--fg-accent-color);
    margin-bottom: 16px;
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
