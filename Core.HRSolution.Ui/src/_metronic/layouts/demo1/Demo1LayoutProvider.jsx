/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { useMenuChildren } from '@/_metronic/components/menu'
import { MENU_SIDEBAR } from '@/app/config/menu.config'
import { getUserMenus } from '@/app/modules/auth/core/requests/_requests'
import { useScrollPosition } from '@/_metronic/hooks/useScrollPosition'
import { useMenus } from '@/_metronic/providers'
import { useLayout } from '@/_metronic/providers'
import { deepMerge } from '@/_metronic/utils'
import { demo1LayoutConfig } from './'

// Default layout properties
const initialLayoutProps = {
  layout: demo1LayoutConfig,
  megaMenuEnabled: false,
  headerSticky: false,
  mobileSidebarOpen: false,
  mobileMegaMenuOpen: false,
  sidebarMouseLeave: false,
  setSidebarMouseLeave: (state) => console.log(`${state}`),
  setMobileMegaMenuOpen: (open) => console.log(`${open}`),
  setMobileSidebarOpen: (open) => console.log(`${open}`),
  setMegaMenuEnabled: (enabled) => console.log(`${enabled}`),
  setSidebarCollapse: (collapse) => console.log(`${collapse}`),
  setSidebarTheme: (mode) => console.log(`${mode}`),
}

const Demo1LayoutContext = createContext(initialLayoutProps)

const useDemo1Layout = () => useContext(Demo1LayoutContext)

const Demo1LayoutProvider = ({ children }) => {
  const { pathname } = useLocation()
  const { setMenuConfig } = useMenus()
  const { getLayout, updateLayout, setCurrentLayout } = useLayout()

  const [layout, setLayout] = useState(() => deepMerge(demo1LayoutConfig, getLayout(demo1LayoutConfig.name)))
  const [megaMenuEnabled, setMegaMenuEnabled] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mobileMegaMenuOpen, setMobileMegaMenuOpen] = useState(false)
  const [sidebarMouseLeave, setSidebarMouseLeave] = useState(false)
  const scrollPosition = useScrollPosition()
  const headerSticky = scrollPosition > 0

  const [menuData, setMenuData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  const transformMenuData = (sections) => {
    const transformed = []
  
    for (const section of sections) {
      // Push a heading
      transformed.push({
        heading: section.sectionName,
      })
  
      for (const menu of section.menus) {
        const parentItem = {
          title: menu.menuName,
          icon: menu.icon || undefined,
          path: menu.menuPath !== '#' ? menu.menuPath : undefined,
          children: [],
        }
  
        if (menu.subMenus && menu.subMenus.length > 0) {
          parentItem.children = menu.subMenus.map((sub) => ({
            title: sub.menuName,
            path: sub.menuPath !== '#' ? sub.menuPath : undefined,
            hidden: sub.isParent === false && sub.isSubParent === false,
          }))
        }
  
        transformed.push(parentItem)
      }
    }
  
    return transformed
  }
  
  const secondaryMenu = useMenuChildren(pathname, MENU_SIDEBAR, 0)
  useEffect(() => {
    getUserMenus().then((response) => {
      const transformed = transformMenuData(response.data.leftSideBarMenus)
      setMenuData(response.data.leftSideBarMenus)
      setMenuConfig('primary', transformed)
    })
  }, [])
  // Set menu config when pathname changes
  useEffect(() => {
    // setMenuConfig('primary', menuData)
    setMenuConfig('secondary', secondaryMenu)
  }, [pathname, setMenuConfig, secondaryMenu])

  // Fetch menus on mount
  

  // Sync layout state with layout provider
  useEffect(() => {
    setCurrentLayout(layout)
  }, [layout, setCurrentLayout])

  const setSidebarCollapse = (collapse) => {
    const updatedLayout = {
      options: {
        sidebar: {
          collapse,
        },
      },
    }
    updateLayout(demo1LayoutConfig.name, updatedLayout)
    setLayout(() => deepMerge(demo1LayoutConfig, getLayout(demo1LayoutConfig.name)))
  }

  const setSidebarTheme = (mode) => {
    const updatedLayout = {
      options: {
        sidebar: {
          theme: mode,
        },
      },
    }
    setLayout((prev) => deepMerge(prev, updatedLayout))
  }

  return (
    <Demo1LayoutContext.Provider
      value={{
        layout,
        headerSticky,
        mobileSidebarOpen,
        mobileMegaMenuOpen,
        megaMenuEnabled,
        sidebarMouseLeave,
        setMobileSidebarOpen,
        setMegaMenuEnabled,
        setSidebarMouseLeave,
        setMobileMegaMenuOpen,
        setSidebarCollapse,
        setSidebarTheme,
      }}
    >
      {children}
    </Demo1LayoutContext.Provider>
  )
}

export { Demo1LayoutProvider, useDemo1Layout }
