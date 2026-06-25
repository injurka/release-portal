<script setup lang="ts">
import type { Release } from '~/shared/types/release'
import { Icon } from '@iconify/vue'
import { useReleaseCard } from '../composables/use-release-card'

const props = defineProps<{
  release: Release
}>()

const { envClass, formattedDate, showBranch } = useReleaseCard(() => props.release)
</script>

<template>
  <article class="release-card">
    <header class="card-header">
      <div class="project-info">
        <Icon icon="lucide:layers" class="project-icon" />
        <span class="project-name">{{ release.project }}</span>
      </div>
      <span class="env-badge" :class="[envClass]">
        {{ release.environment }}
      </span>
    </header>

    <div class="card-body">
      <div class="version-info">
        <template v-if="release.prev_tag">
          <span class="version prev">{{ release.prev_tag }}</span>
          <Icon icon="lucide:arrow-right" class="version-arrow" />
        </template>
        <span class="version current">{{ release.tag }}</span>
      </div>

      <div class="meta-info">
        <div class="meta-item" title="Автор релиза">
          <Icon icon="lucide:user" class="meta-icon" />
          <span class="value">{{ release.trigger_user }}</span>
        </div>

        <div v-if="showBranch" class="meta-item" title="Ветка">
          <Icon icon="lucide:git-branch" class="meta-icon" />
          <code class="branch-pill">{{ release.branch }}</code>
        </div>

        <div class="meta-item date" title="Дата релиза">
          <Icon icon="lucide:clock" class="meta-icon" />
          <span>{{ formattedDate }}</span>
        </div>
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
.release-card {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: 12px;
  padding: 20px;
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
  margin-bottom: 20px;

  .project-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--fg-secondary-color);

    .project-icon {
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .project-name {
      font-weight: 600;
      font-size: 0.9rem;
      line-height: 1;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
  }
}

.env-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 12px;
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
}

.card-body {
  margin-bottom: 24px;
  flex-grow: 1;

  .version-info {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    margin-bottom: 20px;

    .version {
      font-family: monospace;
      font-weight: 700;
      line-height: 1;

      &.prev {
        font-size: 1.1rem;
        color: var(--fg-tertiary-color);
      }

      &.current {
        font-size: 1.4rem;
        color: var(--fg-primary-color);
      }
    }

    .version-arrow {
      color: var(--fg-muted-color);
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .meta-item {
    margin: 0;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--fg-secondary-color);
    line-height: 1;

    .meta-icon {
      font-size: 1.1rem;
      color: var(--fg-tertiary-color);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .value,
    .date span {
      color: var(--fg-primary-color);
      font-weight: 500;
    }

    &.date span {
      color: var(--fg-tertiary-color);
    }
  }

  .branch-pill {
    display: flex;
    align-items: center;
    height: 20px;
    background-color: var(--bg-tertiary-color);
    border: 1px solid var(--border-secondary-color);
    padding: 0 6px;
    border-radius: 6px;
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--fg-info-color);
    border-color: var(--border-info-color);
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
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    background-color: var(--bg-accent-color);
    color: var(--fg-accent-color);
    border: 1px solid var(--border-accent-color);
    padding: 0 10px;
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
    font-size: 0.85rem;
    color: var(--fg-tertiary-color);
    line-height: 1;
  }
}
</style>
