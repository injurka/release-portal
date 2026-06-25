import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import PDialog from '../p-dialog.vue'

describe('p-dialog', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('does not render content when closed', async () => {
    const wrapper = mount(PDialog, {
      props: { modelValue: false },
      slots: { default: 'Dialog body' },
      attachTo: document.body,
    })
    await flushPromises()
    expect(document.body.textContent).not.toContain('Dialog body')
    wrapper.unmount()
  })

  it('renders content when open', async () => {
    const wrapper = mount(PDialog, {
      props: { modelValue: true, title: 'Dialog' },
      slots: { default: 'Dialog body' },
      attachTo: document.body,
    })
    await flushPromises()
    expect(document.body.textContent).toContain('Dialog body')
    wrapper.unmount()
  })

  it('renders title and icon', async () => {
    const wrapper = mount(PDialog, {
      props: { modelValue: true, title: 'Confirm', icon: 'lucide:alert-circle' },
      attachTo: document.body,
    })
    await flushPromises()
    expect(document.body.textContent).toContain('Confirm')
    expect(document.body.querySelector('.p-dialog-title-icon')).not.toBeNull()
    wrapper.unmount()
  })

  it('renders description', async () => {
    const wrapper = mount(PDialog, {
      props: { modelValue: true, title: 'Dialog', description: 'Are you sure?' },
      attachTo: document.body,
    })
    await flushPromises()
    expect(document.body.textContent).toContain('Are you sure?')
    wrapper.unmount()
  })

  it('applies custom max width style', async () => {
    const wrapper = mount(PDialog, {
      props: { modelValue: true, title: 'Dialog', maxWidth: 400 },
      attachTo: document.body,
    })
    await flushPromises()
    const content = document.body.querySelector('.p-dialog-content-wrapper') as HTMLElement
    expect(content?.style.maxWidth).toBe('400px')
    wrapper.unmount()
  })

  it('renders header slot content', async () => {
    const wrapper = mount(PDialog, {
      props: { modelValue: true },
      slots: { header: '<div class="custom-header">Custom</div>' },
      attachTo: document.body,
    })
    await flushPromises()
    expect(document.body.querySelector('.custom-header')).not.toBeNull()
    wrapper.unmount()
  })

  it('renders footer slot content', async () => {
    const wrapper = mount(PDialog, {
      props: { modelValue: true, title: 'Dialog' },
      slots: { footer: '<button>Save</button>' },
      attachTo: document.body,
    })
    await flushPromises()
    expect(document.body.textContent).toContain('Save')
    wrapper.unmount()
  })

  it('closes when close button is clicked', async () => {
    const wrapper = mount(PDialog, {
      props: { modelValue: true, title: 'Dialog' },
      attachTo: document.body,
    })
    await flushPromises()
    const closeButton = document.body.querySelector('.p-dialog-close-button') as HTMLElement
    closeButton?.click()
    await flushPromises()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
    wrapper.unmount()
  })
})
