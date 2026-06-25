<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useDebounceFn, useIntersectionObserver } from '@vueuse/core'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import { nextTick, ref, watch } from 'vue'

interface Option {
  label: string
  value: string
}

const props = withDefaults(defineProps<{
  options: Option[]
  placeholder?: string
  loading?: boolean
  hasNextPage?: boolean
  minSearchLength?: number
  label?: string
}>(), {
  placeholder: 'Поиск...',
  loading: false,
  hasNextPage: false,
  minSearchLength: 3,
})

const emit = defineEmits<{
  search: [query: string]
  loadMore: []
}>()

const model = defineModel<string | null>({ required: true })

const internalModel = ref<Option | undefined>()
const searchTerm = ref('')
const isOpen = ref(false)
const skipSearchTermClear = ref(false)
const loadMoreRef = ref<HTMLElement | null>(null)

const debouncedSearch = useDebounceFn(() => {
  if (searchTerm.value.trim().length >= props.minSearchLength) {
    emit('search', searchTerm.value)
  }
}, 800)

watch([() => model.value, () => props.options], ([newId, newOptions]) => {
  if (!newId) {
    internalModel.value = undefined
    if (!isOpen.value && !skipSearchTermClear.value) {
      searchTerm.value = ''
    }
    return
  }

  if (internalModel.value?.value === newId) {
    return
  }

  const foundOption = newOptions.find(o => o.value === newId)
  if (foundOption) {
    internalModel.value = foundOption
    searchTerm.value = foundOption.label
  }
}, { immediate: true, deep: true })

function handleSearchInput(event: Event) {
  const query = (event.target as HTMLInputElement).value
  searchTerm.value = query

  if (model.value) {
    skipSearchTermClear.value = true
    model.value = null
    internalModel.value = undefined
    nextTick(() => {
      skipSearchTermClear.value = false
    })
  }

  const trimmedLength = query.trim().length
  if (trimmedLength >= props.minSearchLength) {
    debouncedSearch()
    isOpen.value = true
  }
  else {
    isOpen.value = false
  }
}

function handleModelUpdate(selectedOption: Option | undefined) {
  internalModel.value = selectedOption
  isOpen.value = false
  if (selectedOption) {
    model.value = selectedOption.value
    searchTerm.value = selectedOption.label
  }
  else {
    model.value = null
  }
}

function onOpenChange(open: boolean) {
  isOpen.value = open
  if (open && searchTerm.value.trim().length < props.minSearchLength) {
    isOpen.value = false
  }
}

function getDisplayValue(item: Option | undefined) {
  return item?.label || ''
}

useIntersectionObserver(
  loadMoreRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting && props.hasNextPage && !props.loading) {
      emit('loadMore')
    }
  },
  { threshold: 0.1 },
)
</script>

<template>
  <div class="p-combobox-wrapper">
    <label v-if="label" class="p-combobox-label">{{ label }}</label>
    <ComboboxRoot
      :model-value="internalModel"
      :open="isOpen"
      :display-value="getDisplayValue"
      :ignore-filter="true"
      @update:model-value="handleModelUpdate"
      @update:open="onOpenChange"
    >
      <ComboboxAnchor class="p-combobox-anchor">
        <ComboboxInput
          class="p-combobox-input"
          :placeholder="placeholder"
          :value="searchTerm"
          @focus="$event.target.select()"
          @input="handleSearchInput"
        />
        <ComboboxTrigger class="p-combobox-trigger" tabindex="-1">
          <Icon icon="lucide:chevron-down" class="p-combobox-arrow" />
        </ComboboxTrigger>
      </ComboboxAnchor>

      <ComboboxPortal>
        <ComboboxContent
          class="p-combobox-dropdown"
          position="popper"
          :side-offset="4"
        >
          <ComboboxViewport class="p-combobox-viewport custom-scroll">
            <div v-if="!loading && !options.length && searchTerm.trim().length >= minSearchLength" class="p-combobox-message">
              Ничего не найдено
            </div>

            <template v-else>
              <ComboboxItem
                v-for="option in options"
                :key="option.value"
                :value="option"
                class="p-combobox-item"
              >
                <ComboboxItemIndicator class="p-combobox-checkbox">
                  <Icon icon="lucide:check" />
                </ComboboxItemIndicator>
                <span>{{ option.label }}</span>
              </ComboboxItem>

              <div ref="loadMoreRef" class="p-combobox-sentinel" />

              <div v-if="loading" class="p-combobox-loading">
                <Icon icon="lucide:loader-2" class="p-combobox-spinner" />
                <span>Загрузка...</span>
              </div>
            </template>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </div>
</template>

<style>
.p-combobox-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.p-combobox-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--fg-secondary-color);
  user-select: none;
}

.p-combobox-anchor {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

.p-combobox-input {
  width: 100%;
  height: 36px;
  padding: 8px 36px 8px 12px;
  border: 1px solid var(--border-primary-color);
  border-radius: 6px;
  font-size: 14px;
  color: var(--fg-primary-color);
  background: var(--bg-primary-color);
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.p-combobox-input:focus {
  border-color: var(--border-accent-color);
  box-shadow: 0 0 0 2px var(--bg-accent-overlay-color);
}

.p-combobox-input::placeholder {
  color: var(--fg-muted-color);
}

.p-combobox-trigger {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--fg-tertiary-color);
}

.p-combobox-arrow {
  font-size: 16px;
  transition: transform 0.2s;
}

.p-combobox-anchor[data-state='open'] .p-combobox-arrow {
  transform: rotate(180deg);
}

.p-combobox-dropdown {
  background: var(--bg-primary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: var(--reka-combobox-trigger-width);
  max-height: 250px;
  z-index: 1050;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.p-combobox-viewport {
  padding: 4px 0;
  overflow-y: auto;
  max-height: 100%;
}

.p-combobox-item {
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

.p-combobox-item:hover,
.p-combobox-item[data-highlighted] {
  background: var(--bg-tertiary-color);
}

.p-combobox-item[data-state='checked'] {
  background: var(--bg-accent-overlay-color);
  color: var(--fg-accent-color);
  font-weight: 500;
}

.p-combobox-checkbox {
  font-size: 14px;
  width: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--fg-accent-color);
}

.p-combobox-message {
  padding: 12px;
  font-size: 13px;
  color: var(--fg-muted-color);
  text-align: center;
}

.p-combobox-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  font-size: 13px;
  color: var(--fg-secondary-color);
}

.p-combobox-spinner {
  animation: spin 1s linear infinite;
}

.p-combobox-sentinel {
  height: 1px;
  width: 100%;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
