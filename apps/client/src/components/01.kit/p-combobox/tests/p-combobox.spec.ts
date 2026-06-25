import { flushPromises, mount } from '@vue/test-utils'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import PCombobox from '../p-combobox.vue'

class IntersectionObserverMock {
  static lastInstance: any = null
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
  takeRecords = vi.fn()

  constructor(public callback: IntersectionObserverCallback) {
    IntersectionObserverMock.lastInstance = this
  }
}

beforeAll(() => {
  window.IntersectionObserver = IntersectionObserverMock as unknown as typeof window.IntersectionObserver

  HTMLElement.prototype.hasPointerCapture = () => false
  HTMLElement.prototype.releasePointerCapture = () => { }
  HTMLElement.prototype.setPointerCapture = () => { }
  Element.prototype.scrollIntoView = vi.fn()
})

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]

describe('p-combobox', () => {
  it('renders label when provided', () => {
    const wrapper = mount(PCombobox, {
      props: { options, label: 'Fruit', modelValue: null },
    })
    expect(wrapper.find('.p-combobox-label').text()).toBe('Fruit')
  })

  it('shows placeholder', () => {
    const wrapper = mount(PCombobox, {
      props: { options, placeholder: 'Search...', modelValue: null },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Search...')
  })

  it('displays selected option label when modelValue is set', () => {
    const wrapper = mount(PCombobox, {
      props: { options, modelValue: 'banana' },
    })
    expect(wrapper.find('input').element.value).toBe('Banana')
  })

  it('clears model when input changes', async () => {
    const wrapper = mount(PCombobox, {
      props: { options, modelValue: 'banana' },
    })
    await wrapper.find('input').setValue('A')
    expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
  })

  it('emits search event after debounce', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PCombobox, {
      props: { options, modelValue: null },
    })
    const input = wrapper.find('input')
    await input.setValue('app')
    vi.advanceTimersByTime(800)
    expect(wrapper.emitted('search')).toEqual([['app']])
    vi.useRealTimers()
  })

  it('opens dropdown when search term reaches minSearchLength', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PCombobox, {
      props: { options, modelValue: null, minSearchLength: 3 },
    })
    await wrapper.find('input').setValue('ap')
    vi.advanceTimersByTime(800)
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as unknown as { isOpen: boolean }).isOpen).toBe(false)

    await wrapper.find('input').setValue('app')
    vi.advanceTimersByTime(800)
    await wrapper.vm.$nextTick()
    expect((wrapper.vm as unknown as { isOpen: boolean }).isOpen).toBe(true)
    vi.useRealTimers()
  })

  it('renders dropdown items when opened', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PCombobox, {
      props: { options, modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('input').setValue('app')
    vi.advanceTimersByTime(800)
    await flushPromises()
    vi.useRealTimers()
    const items = document.body.querySelectorAll('.p-combobox-item')
    expect(items.length).toBe(2)
    expect(items[0]!.textContent).toContain('Apple')
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('shows empty message when options list is empty and opened', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PCombobox, {
      props: { options: [], modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('input').setValue('query')
    vi.advanceTimersByTime(800)
    await flushPromises()
    vi.useRealTimers()
    expect(document.body.querySelector('.p-combobox-message')).not.toBeNull()
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('renders loading state when opened', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PCombobox, {
      props: { options, loading: true, modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('input').setValue('app')
    vi.advanceTimersByTime(800)
    await flushPromises()
    vi.useRealTimers()
    expect(document.body.querySelector('.p-combobox-loading')).not.toBeNull()
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('emits loadMore when sentinel intersects and dropdown is open', async () => {
    IntersectionObserverMock.lastInstance = null
    vi.useFakeTimers()
    const wrapper = mount(PCombobox, {
      props: { options, hasNextPage: true, modelValue: null },
      attachTo: document.body,
    })
    await wrapper.find('input').setValue('app')
    vi.advanceTimersByTime(800)
    await flushPromises()
    vi.useRealTimers()

    expect(IntersectionObserverMock.lastInstance).not.toBeNull()
    IntersectionObserverMock.lastInstance?.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    expect(wrapper.emitted('loadMore')).toHaveLength(1)
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('does not emit loadMore when hasNextPage is false', () => {
    IntersectionObserverMock.lastInstance = null
    mount(PCombobox, {
      props: { options, hasNextPage: false, modelValue: null },
    })
    IntersectionObserverMock.lastInstance?.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    expect(IntersectionObserverMock.lastInstance).toBeNull()
  })

  it('does not emit search when query is below minSearchLength', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PCombobox, {
      props: { options, modelValue: null, minSearchLength: 3 },
    })
    await wrapper.find('input').setValue('ap')
    vi.advanceTimersByTime(800)
    expect(wrapper.emitted('search')).toBeUndefined()
    vi.useRealTimers()
  })

  it('keeps input value when query is below minSearchLength', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PCombobox, {
      props: { options, modelValue: null, minSearchLength: 3 },
    })
    await wrapper.find('input').setValue('ap')
    vi.advanceTimersByTime(800)
    await flushPromises()
    expect(wrapper.find('input').element.value).toBe('ap')
    vi.useRealTimers()
  })

  it('keeps input value when query is below minSearchLength after selecting a value', async () => {
    vi.useFakeTimers()
    const wrapper = mount(PCombobox, {
      props: { options, modelValue: 'banana', minSearchLength: 3 },
    })
    await wrapper.find('input').setValue('ap')
    vi.advanceTimersByTime(800)
    await flushPromises()
    expect(wrapper.find('input').element.value).toBe('ap')
    vi.useRealTimers()
  })
})
