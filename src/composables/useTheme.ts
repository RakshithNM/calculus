import { ref, watchEffect } from 'vue'

const theme = ref<'dark' | 'light'>(
  typeof window !== 'undefined' && matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark',
)

export function useTheme() {
  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', theme.value)
  })

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggle }
}
