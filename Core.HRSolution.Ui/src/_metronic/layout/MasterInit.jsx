import { useEffect, useState } from 'react'
import {
  MenuComponent,
  DrawerComponent,
  ScrollComponent,
  ScrollTopComponent,
  StickyComponent,
  ToggleComponent,
  SwapperComponent,
} from '@/_metronic/assets/ts/components'
import { ThemeModeComponent } from '@/_metronic/assets/ts/layout'
import { useLayout } from '@/_metronic/layout/core'

export function MasterInit() {
  const { config } = useLayout()
  const [initialized, setInitialized] = useState(false)

  const initializeMetronicComponents = () => {
    ThemeModeComponent.init()

    setTimeout(() => {
      ToggleComponent.bootstrap()
      ScrollTopComponent.bootstrap()
      DrawerComponent.bootstrap()
      StickyComponent.bootstrap()
      MenuComponent.bootstrap()
      ScrollComponent.bootstrap()
      SwapperComponent.bootstrap()
    }, 500)
  }

  useEffect(() => {
    if (!initialized) {
      setInitialized(true)
      initializeMetronicComponents()
    }
  }, [config, initialized])

  return null
}
