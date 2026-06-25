<script setup lang="ts">
withDefaults(defineProps<{
  type?: 'primary' | 'secondary' | 'ghost' | 'danger'
  disabled?: boolean
  htmlType?: 'button' | 'submit' | 'reset'
}>(), {
  type: 'primary',
  disabled: false,
  htmlType: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="p-btn"
    :class="`p-btn--${type}`"
    :type="htmlType"
    :disabled="disabled"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style>
.p-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  height: 36px;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
}

.p-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.p-btn--primary {
  background: var(--bg-accent-color);
  color: var(--fg-inverted-primary-color);
  border-color: var(--bg-accent-color);
}
.p-btn--primary:hover:not(:disabled) {
  background: var(--bg-inverted-color);
  border-color: var(--bg-inverted-color);
}
.p-btn--primary:active:not(:disabled) {
  background: var(--bg-inverted-color);
  box-shadow: 0 0 0 2px var(--bg-accent-overlay-color);
}

.p-btn--secondary {
  background: var(--bg-primary-color);
  color: var(--fg-accent-color);
  border-color: var(--border-button-secondary-color);
}
.p-btn--secondary:hover:not(:disabled) {
  background: var(--bg-secondary-color);
}
.p-btn--secondary:active:not(:disabled) {
  background: var(--bg-secondary-color);
  box-shadow: 0 0 0 2px var(--bg-accent-overlay-color);
}

.p-btn--ghost {
  background: transparent;
  color: var(--fg-accent-color);
  border-color: transparent;
}
.p-btn--ghost:hover:not(:disabled) {
  background: var(--bg-accent-overlay-color);
}
.p-btn--ghost:active:not(:disabled) {
  background: var(--bg-pressed-color);
}

.p-btn--danger {
  background: var(--bg-feedback-negative-color);
  color: var(--fg-inverted-primary-color);
  border-color: var(--bg-feedback-negative-color);
}
.p-btn--danger:hover:not(:disabled) {
  filter: brightness(0.9);
}
.p-btn--danger:active:not(:disabled) {
  filter: brightness(0.85);
  box-shadow: 0 0 0 2px var(--bg-feedback-negative-overlay-color);
}
</style>
