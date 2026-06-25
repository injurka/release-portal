import type { MaybeRefOrGetter } from 'vue'
import type { Release } from '~/shared/types/release'
import { computed, toValue } from 'vue'

export function useReleaseCard(releaseRef: MaybeRefOrGetter<Release>) {
  const release = computed(() => toValue(releaseRef))

  const envClass = computed(() => {
    const env = release.value.environment.toLowerCase()
    if (['test'].includes(env))
      return 'env-test'
    if (['dev'].includes(env))
      return 'env-dev'
    return ''
  })

  const formattedDate = computed(() => {
    return new Date(release.value.created_at).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  })

  const showBranch = computed(() => {
    if (!release.value.branch)
      return false
    const b = release.value.branch.toLowerCase().trim()
    const e = release.value.environment.toLowerCase().trim()
    return b !== e
  })

  return {
    envClass,
    formattedDate,
    showBranch,
  }
}
