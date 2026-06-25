<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'
import { computed } from 'vue'

type CheckboxColor = 'accent' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error'

interface Props {
  label?: string
  disabled?: boolean
  readonly?: boolean
  color?: CheckboxColor
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  readonly: false,
  color: 'accent',
})

const model = defineModel<boolean>()

const colorClass = computed(() => `is-color-${props.color}`)

const id = `p-checkbox-${Math.random().toString(36).substring(2, 9)}`
</script>

<template>
  <label
    :for="id"
    class="p-checkbox-wrapper"
    :class="{ 'is-disabled': disabled, 'is-readonly': readonly }"
  >
    <CheckboxRoot
      :id="id"
      v-model="model"
      class="p-checkbox-root"
      :class="colorClass"
      :disabled="disabled"
    >
      <CheckboxIndicator class="p-checkbox-indicator">
        <Icon icon="lucide:check" class="p-checkbox-icon" />
      </CheckboxIndicator>
    </CheckboxRoot>

    <span v-if="label || $slots.default" class="p-checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<style scoped lang="scss">
.p-checkbox-wrapper {
  display: inline-flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s ease-out;

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &.is-readonly {
    pointer-events: none;
  }
}

.p-checkbox-root {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: 2px solid var(--border-primary-color);
  background-color: var(--bg-primary-color);
  border-radius: 4px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin-top: 2px; // выравнивание по тексту

  &:hover:not([data-disabled]) {
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--bg-accent-overlay-color);
  }

  &.is-color-accent {
    &:hover:not([data-disabled]) {
      border-color: var(--border-accent-color);
    }
    &[data-state='checked'] {
      background-color: var(--bg-accent-color);
      border-color: var(--bg-accent-color);
    }
  }

  &.is-color-primary {
    &:hover:not([data-disabled]) {
      border-color: var(--border-primary-color);
    }
    &[data-state='checked'] {
      background-color: var(--bg-primary-color);
      border-color: var(--border-primary-color);
    }
  }

  &.is-color-secondary {
    &:hover:not([data-disabled]) {
      border-color: var(--border-secondary-color, #eaeaea);
    }
    &[data-state='checked'] {
      background-color: var(--bg-secondary-color, #f5f5f5);
      border-color: var(--bg-secondary-color, #f5f5f5);
    }
  }

  &.is-color-tertiary {
    &:hover:not([data-disabled]) {
      border-color: var(--border-tertiary-color, #e0e0e0);
    }
    &[data-state='checked'] {
      background-color: var(--bg-tertiary-color, #f0f0f0);
      border-color: var(--bg-tertiary-color, #f0f0f0);
    }
  }

  &.is-color-success {
    &:hover:not([data-disabled]) {
      border-color: var(--bg-success-color, #2e7d32);
    }
    &[data-state='checked'] {
      background-color: var(--bg-success-color, #2e7d32);
      border-color: var(--bg-success-color, #2e7d32);
    }
  }

  &.is-color-warning {
    &:hover:not([data-disabled]) {
      border-color: var(--bg-warning-color, #f57f17);
    }
    &[data-state='checked'] {
      background-color: var(--bg-warning-color, #f57f17);
      border-color: var(--bg-warning-color, #f57f17);
    }
  }

  &.is-color-error {
    &:hover:not([data-disabled]) {
      border-color: var(--bg-feedback-negative-color, #d32f2f);
    }
    &[data-state='checked'] {
      background-color: var(--bg-feedback-negative-color, #d32f2f);
      border-color: var(--bg-feedback-negative-color, #d32f2f);
    }
  }

  &[data-state='checked'] {
    transform: scale(1.02);
  }

  &:active:not([data-disabled]) {
    transform: scale(0.98);
  }
}

.p-checkbox-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

.p-checkbox-icon {
  color: var(--fg-inverted-primary-color, #ffffff);
  font-size: 14px;
  transform: scale(0);
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;

  [data-state='checked'] & {
    transform: scale(1);
  }

  [data-state='unchecked'] & {
    transform: scale(0);
  }
}

.p-checkbox-label {
  color: var(--fg-primary-color);
  font-size: 14px;
  line-height: 24px;
  font-weight: 400;
  transition: color 0.2s ease-out;
}
</style>
