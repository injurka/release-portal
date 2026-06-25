import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PBtn from '../p-btn.vue'

describe('p-btn', () => {
  it('renders default slot content', () => {
    const wrapper = mount(PBtn, {
      slots: { default: 'Click me' },
    })
    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('applies primary type class by default', () => {
    const wrapper = mount(PBtn)
    expect(wrapper.find('button').classes()).toContain('p-btn--primary')
  })

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)('applies %s type class', (type) => {
    const wrapper = mount(PBtn, { props: { type } })
    expect(wrapper.find('button').classes()).toContain(`p-btn--${type}`)
  })

  it('sets button type attribute', () => {
    const wrapper = mount(PBtn, { props: { htmlType: 'submit' } })
    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })

  it('disables button when disabled is true', () => {
    const wrapper = mount(PBtn, { props: { disabled: true } })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('emits click event on button click', async () => {
    const wrapper = mount(PBtn, { slots: { default: 'Click' } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
