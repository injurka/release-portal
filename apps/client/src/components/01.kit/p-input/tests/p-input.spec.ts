import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PInput from '../p-input.vue'

describe('p-input', () => {
  it('renders label when provided', () => {
    const wrapper = mount(PInput, {
      props: { label: 'Username', modelValue: '' },
    })
    expect(wrapper.find('.p-input-label').text()).toBe('Username')
  })

  it('binds model value to input', async () => {
    const wrapper = mount(PInput, {
      props: { modelValue: 'hello' },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('hello')

    await input.setValue('world')
    expect(wrapper.emitted('update:modelValue')).toEqual([['world']])
  })

  it.each(['text', 'password', 'email'] as const)('sets input type to %s', (type) => {
    const wrapper = mount(PInput, {
      props: { type, modelValue: '' },
    })
    expect(wrapper.find('input').attributes('type')).toBe(type)
  })

  it('sets inputmode attribute', () => {
    const wrapper = mount(PInput, {
      props: { inputmode: 'numeric', modelValue: '' },
    })
    expect(wrapper.find('input').attributes('inputmode')).toBe('numeric')
  })

  it('shows placeholder', () => {
    const wrapper = mount(PInput, {
      props: { placeholder: 'Enter value', modelValue: '' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter value')
  })

  it('applies error class and message when error is provided', () => {
    const wrapper = mount(PInput, {
      props: { error: 'Required field', modelValue: '' },
    })
    expect(wrapper.classes()).toContain('p-input--error')
    expect(wrapper.find('.p-input-error').text()).toBe('Required field')
  })

  it('sets readonly attribute', () => {
    const wrapper = mount(PInput, {
      props: { readonly: true, modelValue: '' },
    })
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('emits blur and input events', async () => {
    const wrapper = mount(PInput, {
      props: { modelValue: '' },
    })
    const input = wrapper.find('input')
    await input.trigger('blur')
    await input.trigger('input')
    expect(wrapper.emitted('blur')).toHaveLength(1)
    expect(wrapper.emitted('input')).toHaveLength(1)
  })

  it('exposes focus method', () => {
    const wrapper = mount(PInput, {
      props: { modelValue: '' },
      attachTo: document.body,
    })
    const vm = wrapper.vm as unknown as { focus: () => void }
    expect(typeof vm.focus).toBe('function')
    vm.focus()
    expect(wrapper.find('input').element).toBe(document.activeElement)
    wrapper.unmount()
  })
})
