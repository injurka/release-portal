<script lang="ts" setup>
import type { PointerDownOutsideEvent } from 'reka-ui'
import { Icon } from '@iconify/vue'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  VisuallyHidden,
} from 'reka-ui'
import { computed } from 'vue'

interface Props {
  maxWidth?: number
  title?: string
  icon?: string
  persistent?: boolean
  description?: string
  contentClass?: string | Record<string, boolean> | string[]
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: 700,
  persistent: false,
})

const model = defineModel<boolean>()

const maxWidthPx = computed(() => `${props.maxWidth}px`)

function handlePointerDownOutside(event: PointerDownOutsideEvent) {
  if (props.persistent) {
    event.preventDefault()
    return
  }

  const originalEvent = event.detail.originalEvent
  const target = originalEvent.target as HTMLElement

  if (originalEvent.offsetX > target.clientWidth || originalEvent.offsetY > target.clientHeight) {
    event.preventDefault()
  }
}
</script>

<template>
  <DialogRoot v-model:open="model">
    <DialogPortal>
      <DialogOverlay class="p-dialog-overlay" />
      <DialogContent
        class="p-dialog-content-wrapper"
        :class="contentClass"
        :style="{ maxWidth: maxWidthPx }"
        @pointer-down-outside="handlePointerDownOutside"
      >
        <div class="p-dialog-header">
          <slot v-if="$slots.header" name="header" />
          <template v-else>
            <div class="p-dialog-title-container">
              <Icon v-if="icon" :icon="icon" class="p-dialog-title-icon" />
              <DialogTitle v-if="title" class="p-dialog-title">
                {{ title }}
              </DialogTitle>
            </div>
          </template>
          <DialogClose as-child>
            <button class="p-dialog-close-button" :aria-label="`Закрыть диалог ${title ?? ''}`">
              <Icon icon="lucide:close" />
            </button>
          </DialogClose>
        </div>

        <!-- Render a visually hidden DialogTitle if the header slot is used or title is empty -->
        <VisuallyHidden v-if="$slots.header || !title" as-child>
          <DialogTitle>
            {{ title || 'Диалоговое окно' }}
          </DialogTitle>
        </VisuallyHidden>

        <DialogDescription v-if="description" class="p-dialog-description">
          {{ description }}
        </DialogDescription>
        <DialogDescription v-else class="sr-only">
          {{ title || 'Диалоговое окно' }}
        </DialogDescription>

        <div class="p-dialog-body custom-scroll">
          <slot />
        </div>

        <div v-if="$slots.footer" class="p-dialog-footer">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss" scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.p-dialog-overlay {
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  inset: 0;
  z-index: 1000;
  top: env(safe-area-inset-top);

  &[data-state='open'] {
    animation: p-dialog-overlay-show 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  &[data-state='closed'] {
    animation: p-dialog-overlay-hide 200ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
  }
}

.p-dialog-content-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--bg-primary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  width: 90vw;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 85vh;

  &:focus {
    outline: none;
  }

  &[data-state='open'] {
    animation: p-dialog-content-warp-in 250ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  &[data-state='closed'] {
    animation: p-dialog-content-warp-out 200ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
  }

  @include media-down(sm) {
    padding: 16px;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    transform: none;
    width: 100%;
    max-width: 100% !important;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    max-height: 92dvh;

    &[data-state='open'] {
      animation: p-dialog-content-slide-up 300ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    &[data-state='closed'] {
      animation: p-dialog-content-slide-down 200ms cubic-bezier(0.7, 0, 0.84, 0) forwards;
    }
  }
}

.p-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.p-dialog-title-container {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--fg-primary-color);
}

.p-dialog-title-icon {
  font-size: 1.25rem;
}

.p-dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.p-dialog-description {
  font-size: 0.875rem;
  color: var(--fg-secondary-color);
  margin-top: -8px;
}

.p-dialog-close-button {
  background: transparent;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--fg-muted-color);
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    background-color: var(--bg-secondary-color);
    color: var(--fg-primary-color);
  }
}

.p-dialog-body {
  flex-grow: 1;
  overflow-y: auto;
}

.p-dialog-footer {
  flex-shrink: 0;
  padding-top: 16px;
  border-top: 1px solid var(--border-primary-color);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@keyframes p-dialog-overlay-show {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes p-dialog-overlay-hide {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes p-dialog-content-warp-in {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.9) rotateX(10deg) skewX(3deg);
    filter: blur(6px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotateX(0) skewX(0);
    filter: blur(0);
  }
}
@keyframes p-dialog-content-warp-out {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotateX(0) skewX(0);
    filter: blur(0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.85) rotateX(10deg) skewX(4deg);
    filter: blur(8px);
  }
}

@keyframes p-dialog-content-slide-up {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes p-dialog-content-slide-down {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
}
</style>
