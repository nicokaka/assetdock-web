import { useEffect } from 'react'

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — AssetDock` : 'AssetDock'
    return () => {
      document.title = 'AssetDock'
    }
  }, [title])
}
