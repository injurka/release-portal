<script setup lang="ts">
import { PBtn } from '~/components/01.kit/p-btn'
import { PInput } from '~/components/01.kit/p-input'
import { ReleaseCard, ReleaseCardSkeleton } from '~/components/05.modules/release-card'
import { useReleases } from '~/composables/use-releases'

const { searchTicket, searchResults, loading, doSearch } = useReleases()
</script>

<template>
  <div class="search-view">
    <div class="search-bar">
      <PInput
        v-model="searchTicket"
        placeholder="Введите номер задачи, например PSB-1234..."
        class="search-input"
        @keyup.enter="doSearch"
      />
      <PBtn type="primary" class="search-btn" @click="doSearch">
        Найти
      </PBtn>
    </div>

    <!-- Анимация переключения данных/загрузки -->
    <Transition name="fade" mode="out-in">
      <div v-if="loading" key="loading" class="releases-grid">
        <ReleaseCardSkeleton v-for="i in 6" :key="i" />
      </div>

      <div v-else-if="searchResults.length > 0" key="content" class="releases-grid">
        <ReleaseCard
          v-for="release in searchResults"
          :key="release.id"
          :release="release"
        />
      </div>

      <div v-else-if="searchTicket && searchResults.length === 0" key="empty" class="empty-state">
        По вашему запросу релизов не найдено
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  max-width: 800px;
  margin-inline: auto;
  align-items: center;
}

.search-input {
  flex-grow: 1;
}

.search-btn {
  height: 40px;
  padding: 0 32px;
  font-size: 1.1rem;
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
