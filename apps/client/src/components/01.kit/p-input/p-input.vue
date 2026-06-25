<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  label?: string
  type?: string
  inputmode?: 'text' | 'search' | 'email' | 'tel' | 'url' | 'none' | 'numeric' | 'decimal'
  placeholder?: string
  error?: string
  readonly?: boolean
  autofocus?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
})

const emit = defineEmits<{
  blur: []
  input: []
}>()

const model = defineModel<string | null>({ required: true })

const inputRef = ref<HTMLInputElement | null>(null)

function focus() {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="p-input" :class="{ 'p-input--error': !!error }">
    <label v-if="label" class="p-input-label">{{ label }}</label>
    <input
      ref="inputRef"
      v-model="model"
      class="p-input-field"
      :type="type"
      :inputmode="inputmode"
      :placeholder="placeholder"
      :readonly="readonly"
      :autofocus="autofocus"
      @blur="emit('blur')"
      @input="emit('input')"
    >
    <span v-if="error" class="p-input-error">{{ error }}</span>
  </div>
</template>

<style>
.p-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.p-input-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--fg-secondary-color);
  user-select: none;
}

.p-input-field {
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border-primary-color);
  border-radius: 6px;
  font-size: 14px;
  color: var(--fg-primary-color);
  background: var(--bg-primary-color);
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
  width: 100%;
}

.p-input-field:focus {
  border-color: var(--border-accent-color);
  box-shadow: 0 0 0 2px var(--bg-accent-overlay-color);
}

.p-input-field[readonly] {
  background: var(--bg-secondary-color);
  cursor: not-allowed;
  color: var(--fg-muted-color);
}

.p-input--error .p-input-field {
  border-color: var(--bg-feedback-negative-color);
}

.p-input--error .p-input-field:focus {
  box-shadow: 0 0 0 2px var(--bg-feedback-negative-overlay-color);
}

.p-input-error {
  font-size: 12px;
  color: var(--fg-feedback-negative-color, #b00020);
  line-height: 1.4;
}
</style>
