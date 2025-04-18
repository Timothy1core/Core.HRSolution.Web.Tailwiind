import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { MENU_SIDEBAR } from '@/app/config';
import { useScrollPosition } from '@/_metronic/hooks/useScrollPosition';
import { useMenus } from '@/_metronic/providers';
import { useLayout } from '@/_metronic/providers';
import { deepMerge } from '@/_metronic/utils';
import { useMenuChildren } from '@/_metronic/components';
import { Demo9LayoutConfig } from './';

// Interface defining the properties of the layout provider context

// Initial layout provider properties, using Demo9 layout configuration as the default
const initalLayoutProps = {
  layout: Demo9LayoutConfig,
  // Default layout configuration
  headerSticky: false,
  // Header is not sticky by default
  mobileMegaMenuOpen: false,
  // Mobile sidebar is closed by default
  setMobileMegaMenuOpen: open => {
    console.log(`${open}`);
  }
};

// Create a context to manage the layout-related state and logic for Demo9 layout
const Demo9LayoutContext = createContext(initalLayoutProps);

// Custom hook to access the layout context in other components
const useDemo9Layout = () => useContext(Demo9LayoutContext);

// Provider component that sets up the layout state and context for Demo9 layout
const Demo9LayoutProvider = ({
  children
}) => {
  const {
    pathname
  } = useLocation(); // Gets the current path
  const {
    getLayout,
    setCurrentLayout
  } = useLayout(); // Hook to get and set layout configuration
  const {
    setMenuConfig
  } = useMenus(); // Accesses menu configuration methods
  const secondaryMenu = useMenuChildren(pathname, MENU_SIDEBAR, 0); // Retrieves the secondary menu

  // Sets the primary and secondary menu configurations
  setMenuConfig('primary', MENU_SIDEBAR);
  setMenuConfig('secondary', secondaryMenu);

  // Merge the Demo9 layout configuration with the current layout configuration fetched via getLayout
  const layoutConfig = deepMerge(Demo9LayoutConfig, getLayout(Demo9LayoutConfig.name));

  // Set the initial state for layout and mobile sidebar
  const [layout] = useState(layoutConfig); // Layout configuration is stored in state
  const [mobileMegaMenuOpen, setMobileMegaMenuOpen] = useState(false); // Manage state for mobile sidebar

  // Get the current scroll position using a custom hook
  const scrollPosition = useScrollPosition();

  // Calculate whether the header should be sticky based on the scroll position and the layout's sticky offset
  const headerSticky = scrollPosition > layout.options.header.stickyOffset;

  // When the layout state changes, set the current layout configuration in the layout provider
  useEffect(() => {
    setCurrentLayout(layout); // Update the current layout in the global layout state
  }, [layout, setCurrentLayout]); // Re-run this effect if layout or setCurrentLayout changes

  // Provide the layout state, sticky header state, and sidebar state to children components via context
  return <Demo9LayoutContext.Provider value={{
    layout,
    // The current layout configuration
    headerSticky,
    // Whether the header should be sticky based on the scroll position
    mobileMegaMenuOpen,
    // Whether the mobile sidebar is currently open
    setMobileMegaMenuOpen // Function to toggle the mobile sidebar state
  }}>
      {children} {/* Render child components that consume this context */}
    </Demo9LayoutContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export { Demo9LayoutProvider, useDemo9Layout };