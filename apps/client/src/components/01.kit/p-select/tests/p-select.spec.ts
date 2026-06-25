import { mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it } from 'vitest'
import PSelect from '../p-select.vue'

beforeAll(() => {
  HTMLElement.prototype.hasPointerCapture = () => false
  HTMLElement.prototype.releasePointerCapture = () => {}
  HTMLElement.prototype.setPointerCapture = () => {}
})

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
]

describe('p-select', () => {
  it('renders label when provided', () => {
    const wrapper = mount(PSelect, {
      props: { options, label: 'Choose', modelValue: null },
    })
    expect(wrapper.find('.p-select-label').text()).toBe('Choose')
  })

  it('shows placeholder when no value selected', () => {
    const wrapper = mount(PSelect, {
      props: { options, placeholder: 'Pick one', modelValue: null },
    })
    expect(wrapper.find('.p-select-value').text()).toBe('Pick one')
  })

  it('displays selected label for single select', () => {
    const wrapper = mount(PSelect, {
      props: { options, modelValue: '2' },
    })
    expect(wrapper.find('.p-select-value').text()).toBe('Option 2')
  })

  it('displays comma separated labels for multiple select', () => {
    const wrapper = mount(PSelect, {
      props: { options, multiple: true, modelValue: ['1', '2'] },
    })
    expect(wrapper.find('.p-select-value').text()).toBe('Option 1, Option 2')
  })

  it('renders empty state when options list is empty', async () => {
    const wrapper = mount(PSelect, {
      props: { options: [], modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('.p-select-trigger').trigger('pointerdown')
    expect(document.body.querySelector('.p-select-empty')).not.toBeNull()
    wrapper.unmount()
  })

  it('shows clear button when clearable and value is present', () => {
    const wrapper = mount(PSelect, {
      props: { options, clearable: true, modelValue: '1' },
    })
    expect(wrapper.find('.p-select-clear').exists()).toBe(true)
  })

  it('clears value when clear button is clicked', async () => {
    const wrapper = mount(PSelect, {
      props: { options, clearable: true, modelValue: '1' },
    })
    await wrapper.find('.p-select-clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
    expect(wrapper.emitted('input')).toEqual([[null]])
  })
})
