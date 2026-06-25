<script setup lang="ts">
import { useReleases } from '~/composables/use-releases'
import ReleaseCard from '~/components/release-card.vue'

const { searchTicket, searchResults, loading, doSearch } = useReleases()
</script>

<template>
  <div class="search-view">
    <div class="search-bar">
      <input 
        v-model="searchTicket" 
        @keyup.enter="doSearch"
        placeholder="Введите номер задачи, например PSB-1234..." 
        class="base-input large" 
      />
      <button class="btn-primary large" @click="doSearch">Найти</button>
    </div>

    <div v-if="searchResults.length > 0" class="releases-grid">
      <ReleaseCard
        v-for="release in searchResults"
        :key="release.id"
        :release="release"
      />
    </div>
    
    <div v-else-if="searchTicket && !loading && searchResults.length === 0" class="empty-state">
      По вашему запросу релизов не найдено
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  max-width: 800px;
  margin-inline: auto;
}

.base-input {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-primary-color);
  color: var(--fg-primary-color);
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: var(--border-focus-color);
  }

  &.large {
    flex-grow: 1;
    font-size: 1.2rem;
    padding: 16px 24px;
  }
}

.btn-primary {
  background-color: var(--bg-accent-color);
  color: var(--fg-primary-color);
  border: 1px solid var(--border-accent-color);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: var(--bg-action-hover-color);
  }

  &.large {
    padding: 16px 32px;
    font-size: 1.2rem;
  }
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
