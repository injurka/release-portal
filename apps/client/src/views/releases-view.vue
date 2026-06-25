<script setup lang="ts">
import { onMounted } from 'vue'
import ReleaseCard from '~/components/release-card.vue'
import { useReleases } from '~/composables/use-releases'

const {
  releases,
  filters,
  loading,
  projectList,
  fetchReleases,
  fetchProjectsList,
} = useReleases()

onMounted(() => {
  if (releases.value.length === 0)
    fetchReleases()
  if (projectList.value.length === 0)
    fetchProjectsList()
})
</script>

<template>
  <div class="releases-view">
    <div class="filters-bar">
      <select v-model="filters.environment" class="base-input">
        <option value="">
          Все стенды
        </option>
        <option value="dev">
          Dev
        </option>
        <option value="test">
          Test
        </option>
        <option value="prod">
          Prod
        </option>
      </select>

      <!-- Заменили текстовый инпут на select -->
      <select v-model="filters.project" class="base-input">
        <option value="">
          Все проекты
        </option>
        <option v-for="p in projectList" :key="p" :value="p">
          {{ p }}
        </option>
      </select>

      <input v-model="filters.trigger_user" placeholder="Автор (alice.dev)" class="base-input">
      <button class="btn-primary" @click="fetchReleases">
        Применить
      </button>
    </div>

    <!-- Показываем лоадер только для контента -->
    <div v-if="loading">
      Загрузка...
    </div>

    <template v-else>
      <div v-if="releases.length === 0" class="empty-state">
        Ничего не найдено
      </div>
      <div v-else class="releases-grid">
        <ReleaseCard
          v-for="release in releases"
          :key="release.id"
          :release="release"
        />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.filters-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}
.base-input {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-primary-color);
  color: var(--fg-primary-color);
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
}
.base-input:focus {
  border-color: var(--border-focus-color);
}
.btn-primary {
  background-color: var(--bg-accent-color);
  color: var(--fg-primary-color);
  border: 1px solid var(--border-accent-color);
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: var(--bg-action-hover-color);
}
.releases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}
.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--fg-secondary-color);
}
</style>
