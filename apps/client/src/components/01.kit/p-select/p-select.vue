<script setup lang="ts">
import { Icon } from '@iconify/vue'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { computed } from 'vue'

interface Option {
  label: string
  value: string
}

const props = withDefaults(defineProps<{
  options: Option[]
  placeholder?: string
  multiple?: boolean
  label?: string
  clearable?: boolean
}>(), {
  placeholder: 'Выберите...',
  multiple: false,
  clearable: false,
})

const emit = defineEmits<{
  input: [value: string | string[] | null]
}>()

const model = defineModel<string | string[] | null>({ required: true })

const selectedLabel = computed(() => {
  if (props.multiple) {
    if (!Array.isArray(model.value) || model.value.length === 0)
      return ''
    return props.options
      .filter(o => (model.value as string[]).includes(o.value))
      .map(o => o.label)
      .join(', ')
  }

  if (model.value == null || model.value === '')
    return ''
  const found = props.options.find(o => o.value === model.value)
  return found ? found.label : ''
})

function onUpdate(val: string | string[] | undefined) {
  model.value = val ?? null
  emit('input', val ?? null)
}

function clear() {
  model.value = null
  emit('input', null)
}
</script>

<template>
  <div class="p-select-wrapper">
    <label v-if="label" class="p-select-label">{{ label }}</label>
    <div style="position: relative; width: 100%;">
      <SelectRoot
        :model-value="model ?? undefined"
        :multiple="multiple"
        @update:model-value="onUpdate"
      >
        <SelectTrigger class="p-select-trigger" :class="{ 'p-select-trigger--clearable': clearable && model }">
          <SelectValue :placeholder="placeholder" class="p-select-value">
            <!-- Передаем свой текст в слот, чтобы отключить DOM-сканирование Reka UI -->
            <span v-if="selectedLabel">{{ selectedLabel }}</span>
          </SelectValue>
          <SelectIcon class="p-select-arrow">
            <Icon icon="lucide:chevron-down" />
          </SelectIcon>
        </SelectTrigger>

        <SelectPortal>
          <SelectContent
            class="p-select-dropdown"
            position="popper"
            :side-offset="4"
          >
            <SelectScrollUpButton class="p-select-scroll-btn">
              <Icon icon="lucide:chevron-up" />
            </SelectScrollUpButton>
            <SelectViewport class="p-select-list">
              <SelectItem
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                class="p-select-item"
              >
                <SelectItemIndicator class="p-select-checkbox">
                  <Icon icon="lucide:check" />
                </SelectItemIndicator>
                <SelectItemText>{{ option.label }}</SelectItemText>
              </SelectItem>
              <div v-if="!options.length" class="p-select-empty">
                Ничего не найдено
              </div>
            </SelectViewport>
            <SelectScrollDownButton class="p-select-scroll-btn">
              <Icon icon="lucide:chevron-down" />
            </SelectScrollDownButton>
          </SelectContent>
        </SelectPortal>
      </SelectRoot>

      <button
        v-if="clearable && model"
        type="button"
        class="p-select-clear"
        @click.stop="clear"
        @pointerdown.stop="clear"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<style>
.p-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.p-select-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--fg-secondary-color);
  user-select: none;
}

.p-select-trigger {
  display: flex;
  align-items: center;
  padding: 0 12px;
  border: 1px solid var(--border-primary-color);
  border-radius: 6px;
  cursor: pointer;
  background: var(--bg-primary-color);
  font-size: 14px;
  width: 100%;
  height: 36px;
  user-select: none;
}

.p-select-value {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.p-select-trigger--clearable .p-select-value {
  padding-right: 28px;
}

.p-select-trigger[data-state='open'] {
  border-color: var(--border-accent-color);
  box-shadow: 0 0 0 2px var(--bg-accent-overlay-color);
}

.p-select-trigger[data-placeholder] .p-select-value {
  color: var(--fg-muted-color);
}

.p-select-arrow {
  flex-shrink: 0;
  color: var(--fg-tertiary-color);
  font-size: 16px;
  margin-left: 8px;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
}

.p-select-trigger[data-state='open'] .p-select-arrow {
  transform: rotate(180deg);
}

.p-select-clear {
  position: absolute;
  right: 34px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--fg-muted-color);
  font-size: 12px;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    color 0.15s,
    background 0.15s;
}

.p-select-clear:hover {
  color: var(--fg-primary-color);
  background: var(--bg-tertiary-color);
}

.p-select-dropdown {
  background: var(--bg-primary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: var(--reka-select-trigger-width);
  max-height: var(--reka-select-content-available-height);
  z-index: 1050;
}

.p-select-list {
  padding: 4px 0;
}

.p-select-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--fg-primary-color);
  transition: background 0.15s;
  outline: none;
}

.p-select-item:hover,
.p-select-item[data-highlighted] {
  background: var(--bg-tertiary-color);
}

.p-select-item[data-state='checked'] {
  background: var(--bg-accent-overlay-color);
  color: var(--fg-accent-color);
  font-weight: 500;
}

.p-select-item[data-disabled] {
  opacity: 0.4;
  cursor: not-allowed;
}

.p-select-checkbox {
  font-size: 14px;
  width: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--fg-accent-color);
}

.p-select-empty {
  padding: 10px 12px;
  font-size: 14px;
  color: var(--fg-muted-color);
}

.p-select-scroll-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  cursor: default;
  color: var(--fg-tertiary-color);
  font-size: 12px;
}
</style>
