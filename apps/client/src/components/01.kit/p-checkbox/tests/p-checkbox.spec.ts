import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PCheckbox from '../p-checkbox.vue'

describe('p-checkbox', () => {
  it('renders label text', () => {
    const wrapper = mount(PCheckbox, {
      props: { label: 'Accept terms', modelValue: false },
    })
    expect(wrapper.find('.p-checkbox-label').text()).toBe('Accept terms')
  })

  it('renders default slot content instead of label', () => {
    const wrapper = mount(PCheckbox, {
      props: { label: 'Hidden' },
      slots: { default: 'Slot label' },
    })
    expect(wrapper.find('.p-checkbox-label').text()).toBe('Slot label')
  })

  it('applies disabled class and attribute', () => {
    const wrapper = mount(PCheckbox, {
      props: { disabled: true, modelValue: false },
    })
    expect(wrapper.find('.p-checkbox-wrapper').classes()).toContain('is-disabled')
    expect(wrapper.find('[role="checkbox"]').attributes('data-disabled')).toBeDefined()
  })

  it('applies readonly class', () => {
    const wrapper = mount(PCheckbox, {
      props: { readonly: true, modelValue: false },
    })
    expect(wrapper.find('.p-checkbox-wrapper').classes()).toContain('is-readonly')
  })

  it.each(['accent', 'primary', 'secondary', 'tertiary', 'success', 'warning', 'error'] as const)(
    'applies %s color class',
    (color) => {
      const wrapper = mount(PCheckbox, {
        props: { color, modelValue: false },
      })
      expect(wrapper.find('.p-checkbox-root').classes()).toContain(`is-color-${color}`)
    },
  )

  it('updates modelValue when clicked', async () => {
    const wrapper = mount(PCheckbox, {
      props: { modelValue: false },
    })
    await wrapper.find('[role="checkbox"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
  })
})
