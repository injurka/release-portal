<script setup lang="ts">
import DashboardView from '~/views/dashboard-view.vue'
import ReleasesView from '~/views/releases-view.vue'
import SearchView from '~/views/search-view.vue'

const activeTab = ref<'dashboard' | 'all' | 'search'>('dashboard')

// Сопоставляем ключи табов с самими компонентами
const views = {
  dashboard: DashboardView,
  all: ReleasesView,
  search: SearchView,
}
</script>

<template>
  <div class="app-layout">
    <header class="header">
      <div class="header-content">
        <h1>Release Portal</h1>
        <nav class="nav-tabs">
          <button
            :class="{ active: activeTab === 'dashboard' }"
            @click="activeTab = 'dashboard'"
          >
            Дашборд
          </button>
          <button
            :class="{ active: activeTab === 'all' }"
            @click="activeTab = 'all'"
          >
            Все релизы
          </button>
          <button
            :class="{ active: activeTab === 'search' }"
            @click="activeTab = 'search'"
          >
            Поиск задачи
          </button>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <!--
        Transition обеспечивает плавную анимацию (используя классы .fade из normalize.scss),
        mode="out-in" ждет завершения скрытия старого таба перед показом нового.
        KeepAlive сохраняет состояние компонентов в памяти (как было при v-show).
      -->
      <Transition name="fade" mode="out-in">
        <KeepAlive>
          <component :is="views[activeTab]" />
        </KeepAlive>
      </Transition>
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
  padding: 40px 20px 0;
  text-align: center;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;

    h1 {
      margin: 0 0 24px 0;
      font-size: 2.5rem;
      font-weight: 600;
      color: var(--fg-primary-color);
    }
  }
}

.nav-tabs {
  display: flex;
  justify-content: center;
  gap: 16px;

  button {
    padding: 12px 24px;
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--fg-secondary-color);
    border-bottom: 3px solid transparent;
    transition: all 0.2s ease;

    &:hover {
      color: var(--fg-primary-color);
      background-color: var(--bg-hover-color);
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    &.active {
      color: var(--fg-accent-color);
      border-bottom-color: var(--border-focus-color);
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
