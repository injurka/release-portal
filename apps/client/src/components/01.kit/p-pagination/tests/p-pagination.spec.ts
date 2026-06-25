import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PPagination from '../p-pagination.vue'

describe('p-pagination', () => {
  it('does not render when max is 1', () => {
    const wrapper = mount(PPagination, {
      props: { max: 1, modelValue: 1 },
    })
    expect(wrapper.find('nav').exists()).toBe(false)
  })

  it('renders all pages when total is small', () => {
    const wrapper = mount(PPagination, {
      props: { max: 5, modelValue: 1 },
    })
    const buttons = wrapper.findAll('.p-pagination-page-btn')
    expect(buttons).toHaveLength(5)
    expect(buttons.map(b => b.text())).toEqual(['1', '2', '3', '4', '5'])
  })

  it('renders ellipsis for large page counts', () => {
    const wrapper = mount(PPagination, {
      props: { max: 20, modelValue: 10 },
    })
    expect(wrapper.findAll('.p-pagination-ellipsis')).toHaveLength(2)
  })

  it('marks current page as active', () => {
    const wrapper = mount(PPagination, {
      props: { max: 5, modelValue: 3 },
    })
    const active = wrapper.find('.p-pagination-btn--active')
    expect(active.text()).toBe('3')
  })

  it('emits update:modelValue when page button clicked', async () => {
    const wrapper = mount(PPagination, {
      props: { max: 5, modelValue: 1 },
    })
    await wrapper.findAll('.p-pagination-page-btn')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[3]])
  })

  it('decrements current page on prev click', async () => {
    const wrapper = mount(PPagination, {
      props: { max: 5, modelValue: 3 },
    })
    await wrapper.findAll('.p-pagination-nav-btn')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[2]])
  })

  it('increments current page on next click', async () => {
    const wrapper = mount(PPagination, {
      props: { max: 5, modelValue: 3 },
    })
    await wrapper.findAll('.p-pagination-nav-btn')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[4]])
  })

  it('disables prev button on first page', () => {
    const wrapper = mount(PPagination, {
      props: { max: 5, modelValue: 1 },
    })
    expect(wrapper.findAll('.p-pagination-nav-btn')[0]!.attributes('disabled')).toBeDefined()
  })

  it('disables next button on last page', () => {
    const wrapper = mount(PPagination, {
      props: { max: 5, modelValue: 5 },
    })
    expect(wrapper.findAll('.p-pagination-nav-btn')[1]!.attributes('disabled')).toBeDefined()
  })

  it('ignores ellipsis clicks', async () => {
    const wrapper = mount(PPagination, {
      props: { max: 20, modelValue: 10 },
    })
    await wrapper.find('.p-pagination-ellipsis').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })
})
