<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { PBtn } from '~/components/01.kit/p-btn'
import { PInput } from '~/components/01.kit/p-input'
import { PSelect } from '~/components/01.kit/p-select'
import { ReleaseCard, ReleaseCardSkeleton } from '~/components/05.modules/release-card'
import { useReleases } from '~/composables/use-releases'

const {
  releases,
  filters,
  loading,
  projectList,
  fetchReleases,
  fetchProjectsList,
} = useReleases()

const envOptions = [
  { label: 'Dev', value: 'dev' },
  { label: 'Test', value: 'test' },
]

const projectOptions = computed(() =>
  projectList.value.map(p => ({ label: p, value: p })),
)

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
      <div class="filter-item">
        <PSelect
          v-model="filters.environment"
          :options="envOptions"
          placeholder="Все стенды"
          clearable
        />
      </div>

      <div class="filter-item">
        <PSelect
          v-model="filters.project"
          :options="projectOptions"
          placeholder="Все проекты"
          clearable
        />
      </div>

      <div class="filter-item">
        <PInput
          v-model="filters.trigger_user"
          placeholder="Автор (alice.dev)"
        />
      </div>

      <PBtn type="primary" class="fetch-btn" @click="fetchReleases">
        Применить
      </PBtn>
    </div>

    <!-- Анимация переключения данных/загрузки -->
    <Transition name="fade" mode="out-in">
      <div v-if="loading" key="loading" class="releases-grid">
        <ReleaseCardSkeleton v-for="i in 12" :key="i" />
      </div>

      <div v-else-if="releases.length === 0" key="empty" class="empty-state">
        Ничего не найдено
      </div>

      <div v-else key="content" class="releases-grid">
        <ReleaseCard
          v-for="release in releases"
          :key="release.id"
          :release="release"
        />
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.filters-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-item {
  flex: 1;
  min-width: 200px;
}

.fetch-btn {
  height: 36px;
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
