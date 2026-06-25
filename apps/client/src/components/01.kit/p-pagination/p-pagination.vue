<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

interface Props {
  max: number
}

const props = defineProps<Props>()

const model = defineModel<number>({ required: true })

const pages = computed(() => {
  const pagesToShow = []
  const total = props.max
  const current = model.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pagesToShow.push(i)
    }
  }
  else {
    pagesToShow.push(1)
    if (current > 4) {
      pagesToShow.push('...')
    }

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pagesToShow.push(i)
    }

    if (current < total - 3) {
      pagesToShow.push('...')
    }
    pagesToShow.push(total)
  }

  return pagesToShow
})

function goToPage(page: number | string) {
  if (typeof page === 'number' && page >= 1 && page <= props.max) {
    model.value = page
  }
}

function prevPage() {
  if (model.value > 1) {
    model.value--
  }
}

function nextPage() {
  if (model.value < props.max) {
    model.value++
  }
}
</script>

<template>
  <nav v-if="max > 1" class="p-pagination">
    <button
      class="p-pagination-btn p-pagination-nav-btn"
      :disabled="model === 1"
      @click="prevPage"
    >
      <Icon icon="lucide:chevron-left" />
    </button>

    <ul class="p-pagination-list">
      <li v-for="(page, index) in pages" :key="index">
        <span v-if="page === '...'" class="p-pagination-ellipsis">...</span>
        <button
          v-else
          class="p-pagination-btn p-pagination-page-btn"
          :class="{ 'p-pagination-btn--active': model === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </li>
    </ul>

    <button
      class="p-pagination-btn p-pagination-nav-btn"
      :disabled="model === max"
      @click="nextPage"
    >
      <Icon icon="lucide:chevron-right" />
    </button>
  </nav>
</template>

<style scoped lang="scss">
.p-pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  user-select: none;
  padding: 12px 0;
}

.p-pagination-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 4px;
}

.p-pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border-radius: 6px;
  border: 1px solid var(--border-primary-color);
  background-color: var(--bg-primary-color);
  color: var(--fg-primary-color);
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled):not(.p-pagination-btn--active) {
    background-color: var(--bg-tertiary-color);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.p-pagination-btn--active {
  background-color: var(--bg-accent-color);
  color: var(--fg-inverted-primary-color);
  border-color: var(--bg-accent-color);
  font-weight: 600;
}

.p-pagination-ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--fg-muted-color);
  font-size: 14px;
}
</style>
