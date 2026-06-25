<script setup lang="ts">
import type { TabItem } from '~/components/01.kit/p-kit-tabs'
import { markRaw, ref } from 'vue'
import { KitTabs } from '~/components/01.kit/p-kit-tabs'
import DashboardView from '~/views/dashboard-view.vue'
import ReleasesView from '~/views/releases-view.vue'
import SearchView from '~/views/search-view.vue'

const activeTab = ref<'dashboard' | 'all' | 'search'>('dashboard')

const tabItems: TabItem<'dashboard' | 'all' | 'search'>[] = [
  {
    id: 'dashboard',
    label: 'Дашборд',
    component: markRaw(DashboardView),
  },
  {
    id: 'all',
    label: 'Все релизы',
    component: markRaw(ReleasesView),
  },
  {
    id: 'search',
    label: 'Поиск задачи',
    component: markRaw(SearchView),
  },
]
</script>

<template>
  <div class="app-layout">
    <header class="header">
      <div class="header-content">
        <h1>Release Portal</h1>
      </div>
    </header>

    <main class="main-content">
      <!-- Теперь слоты не нужны, KitTabs сам отрендерит нужный компонент и закэширует его -->
      <KitTabs v-model="activeTab" :items="tabItems" :cache="true" />
    </main>
  </div>
</template>

<style scoped lang="scss">
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: var(--bg-tertiary-color);
  border-bottom: 1px solid var(--border-primary-color);
  padding: 32px 20px;
  text-align: center;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;

    h1 {
      margin: 0;
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--fg-primary-color);
    }
  }
}

.main-content {
  flex-grow: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
}
</style>
