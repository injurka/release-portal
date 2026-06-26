<script setup lang="ts">
import type { Release } from '~/shared/types/release'
import { Icon } from '@iconify/vue'
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'
import { computed } from 'vue'
import { useReleaseCard } from '../composables/use-release-card'

const props = defineProps<{
  release: Release
}>()

const { envClass, formattedDate, showBranch } = useReleaseCard(() => props.release)

const projectIcon = computed(() => {
  if (props.release.type === 'frontend')
    return 'lucide:layout'
  if (props.release.type === 'backend')
    return 'lucide:server'

  return 'lucide:layers'
})

const hasMetaInfo = computed(() => {
  return props.release.meta && Object.keys(props.release.meta).length > 0
})
</script>

<template>
  <article class="release-card">
    <PopoverRoot>
      <PopoverTrigger as-child>
        <button class="card-header" :class="{ clickable: hasMetaInfo }">
          <div class="project-info">
            <Icon :icon="projectIcon" class="project-icon" />
            <span class="project-name">{{ release.project }}</span>
            <Icon v-if="hasMetaInfo" icon="lucide:info" class="info-indicator" />
          </div>
          <span class="env-badge" :class="[envClass]">
            {{ release.environment }}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverPortal>
        <PopoverContent v-if="hasMetaInfo" class="meta-popover-content" side="bottom" :side-offset="6">
          <div class="meta-popover-inner">
            <h4 class="meta-title">
              Дополнительная информация
            </h4>

            <div v-if="release.meta?.description" class="meta-row description">
              <span class="meta-label">Описание:</span>
              <p>{{ release.meta.description }}</p>
            </div>

            <div class="meta-links">
              <a v-if="release.meta?.repository_url" :href="release.meta.repository_url" target="_blank" class="meta-link">
                <Icon icon="lucide:github" /> Репозиторий
              </a>
              <a v-if="release.meta?.pipeline_url" :href="release.meta.pipeline_url" target="_blank" class="meta-link">
                <Icon icon="lucide:activity" /> Пайплайн
              </a>
            </div>
          </div>
          <PopoverArrow class="meta-popover-arrow" />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>

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
      <ul v-if="release.jira_tickets?.length" class="ticket-list">
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
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;

  &.clickable {
    cursor: pointer;
    border-radius: 6px;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
      .info-indicator {
        color: var(--fg-accent-color);
      }
    }
  }

  .project-info {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--fg-secondary-color);

    .project-icon {
      font-size: 1.2rem;
      color: var(--fg-primary-color);
    }

    .project-name {
      font-weight: 600;
      font-size: 0.9rem;
      line-height: 1;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: var(--fg-primary-color);
    }

    .info-indicator {
      font-size: 1rem;
      color: var(--fg-tertiary-color);
      transition: color 0.2s;
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

<style lang="scss">
.meta-popover-content {
  background-color: var(--bg-primary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  width: 300px;
  z-index: var(--z-popover, 1300);
  animation: popover-fade-in 0.2s ease;
  outline: none;
}

.meta-popover-inner {
  padding: 16px;

  .meta-title {
    margin: 0 0 12px 0;
    font-size: 0.9rem;
    color: var(--fg-secondary-color);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid var(--border-secondary-color);
    padding-bottom: 8px;
  }

  .meta-row {
    margin-bottom: 12px;

    .meta-label {
      font-size: 0.8rem;
      color: var(--fg-tertiary-color);
      display: block;
      margin-bottom: 4px;
    }

    p {
      margin: 0;
      font-size: 0.85rem;
      color: var(--fg-primary-color);
      line-height: 1.4;
      white-space: pre-wrap;
    }
  }

  .meta-links {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-top: 16px;

    .meta-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      color: var(--fg-inverted-color);
      background-color: var(--bg-hover-color);
      padding: 6px 12px;
      border-radius: 6px;
      text-decoration: none;
      transition: background 0.2s;

      &:hover {
        background-color: var(--bg-tertiary-color);
      }
    }
  }
}

.meta-popover-arrow {
  fill: var(--bg-primary-color);
  stroke: var(--border-primary-color);
  stroke-width: 1px;
}

@keyframes popover-fade-in {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
