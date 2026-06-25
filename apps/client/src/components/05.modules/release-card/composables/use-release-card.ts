import type { MaybeRefOrGetter } from 'vue'
import type { Release } from '~/shared/types/release'
import { computed, toValue } from 'vue'

export function useReleaseCard(releaseRef: MaybeRefOrGetter<Release>) {
  const envClass = computed(() => {
    const release = toValue(releaseRef)
    const env = release.environment.toLowerCase()
    if (['test'].includes(env))
      return 'env-test'
    if (['dev'].includes(env))
      return 'env-dev'
    return ''
  })

  const formattedDate = computed(() => {
    const release = toValue(releaseRef)
    return new Date(release.created_at).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  })

  return {
    envClass,
    formattedDate,
  }
}
