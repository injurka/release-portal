<script setup lang="ts">
import type { Release } from '../shared/types/release'
import { computed } from 'vue'

const props = defineProps<{
  release: Release
}>()

const envClass = computed(() => {
  const env = props.release.environment.toLowerCase()
  if (['test', 'staging'].includes(env))
    return 'env-test'
  if (['prod', 'production'].includes(env))
    return 'env-prod'
  if (['dev', 'development'].includes(env))
    return 'env-dev'
  return ''
})

const formattedDate = computed(() => {
  return new Date(props.release.created_at).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
})
</script>

<template>
  <article class="release-card">
    <header class="card-header">
      <span class="project-name">{{ release.project }}</span>
      <span class="env-badge" :class="[envClass]">
        {{ release.environment }}
      </span>
    </header>

    <div class="card-body">
      <h2 class="tag">
        {{ release.tag }}
      </h2>
      <div class="meta-info">
        <p class="meta-item">
          <span class="label">Сравнение:</span>
          <code class="code-pill">{{ release.prev_tag || 'Начало' }}</code>
        </p>
        <p v-if="release.branch" class="meta-item">
          <span class="label">Ветка:</span>
          <code class="code-pill branch-pill">{{ release.branch }}</code>
        </p>
        <p class="meta-item">
          <span class="label">Автор:</span>
          <span class="value">{{ release.trigger_user }}</span>
        </p>
        <p class="meta-item date">
          {{ formattedDate }}
        </p>
      </div>
    </div>

    <footer class="tickets-section">
      <ul v-if="release.jira_tickets.length" class="ticket-list">
        <li v-for="ticket in release.jira_tickets" :key="ticket">
          <a :href="`https://jira.prosebya.ru/browse/${ticket}`" target="_blank" class="ticket-link">
            {{ ticket }}
          </a>
        </li>
      </ul>
      <p v-else class="no-tickets">
        Задач не найдено
      </p>
    </footer>
  </article>
</template>

<style scoped lang="scss">
@use 'sass:map';

.release-card {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  height: 100%;

  &:hover {
    border-color: var(--border-focus-color);
    background-color: var(--bg-hover-color);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  .project-name {
    font-weight: 600;
    font-size: map.get($font-sizes, 'small');
    color: var(--fg-secondary-color);
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
}

.env-badge {
  padding: 4px 10px;
  border-radius: 20px;
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
  &.env-prod {
    background-color: var(--bg-success-color);
    color: var(--fg-success-color);
    border-color: var(--border-success-color);
  }
}

.card-body {
  margin-bottom: 24px;
  flex-grow: 1;

  .tag {
    margin: 0 0 16px 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--fg-primary-color);
  }
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .meta-item {
    margin: 0;
    font-size: map.get($font-sizes, 'small');
    display: flex;
    align-items: center;
    gap: 8px;

    .label {
      color: var(--fg-tertiary-color);
    }
    .value {
      color: var(--fg-primary-color);
      font-weight: 500;
    }
    &.date {
      margin-top: 4px;
      color: var(--fg-secondary-color);
    }
  }

  .code-pill {
    background-color: var(--bg-tertiary-color);
    border: 1px solid var(--border-secondary-color);
    padding: 2px 6px;
    border-radius: 6px;
    font-family: 'Maple Mono CN', monospace;
    font-size: 0.8rem;
    color: var(--fg-muted-color);

    &.branch-pill {
      color: var(--fg-info-color);
      border-color: var(--border-info-color);
    }
  }
}

.tickets-section {
  padding-top: 16px;
  border-top: 1px solid var(--border-primary-color);

  .ticket-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .ticket-link {
    display: inline-block;
    background-color: var(--bg-accent-color);
    color: var(--fg-accent-color);
    border: 1px solid var(--border-accent-color);
    padding: 4px 10px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 0.8rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--bg-action-hover-color);
      color: var(--fg-primary-color);
    }
  }

  .no-tickets {
    margin: 0;
    font-size: map.get($font-sizes, 'small');
    color: var(--fg-tertiary-color);
  }
}
</style>
