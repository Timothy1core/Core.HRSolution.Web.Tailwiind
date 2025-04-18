import { createContext, useContext, useEffect, useState } from 'react';
import { MENU_SIDEBAR } from '@/app/config';
import { useScrollPosition } from '@/_metronic/hooks/useScrollPosition';
import { useMenus } from '@/_metronic/providers';
import { useLayout } from '@/_metronic/providers';
import { deepMerge } from '@/_metronic/utils';
import { Demo2LayoutConfig } from './';

// Interface defining the properties of the layout provider context

// Initial layout provider properties, using Demo2 layout configuration as the default
const initalLayoutProps = {
  layout: Demo2LayoutConfig,
  // Default layout configuration
  headerSticky: false,
  // Header is not sticky by default
  mobileSidebarOpen: false,
  // Mobile sidebar is closed by default
  setMobileSidebarOpen: open => {
    console.log(`${open}`);
  }
};

// Create a context to manage the layout-related state and logic for Demo2 layout
const Demo2LayoutContext = createContext(initalLayoutProps);

// Custom hook to access the layout context in other components
const useDemo2Layout = () => useContext(Demo2LayoutContext);

// Provider component that sets up the layout state and context for Demo2 layout
const Demo2LayoutProvider = ({
  children
}) => {
  const {
    setMenuConfig
  } = useMenus(); // Hook to manage menu configurations
  const {
    getLayout,
    setCurrentLayout
  } = useLayout(); // Hook to get and set layout configuration

  // Merge the Demo2 layout configuration with the current layout configuration fetched via getLayout
  const layoutConfig = deepMerge(Demo2LayoutConfig, getLayout(Demo2LayoutConfig.name));

  // Set the initial state for layout and mobile sidebar
  const [layout] = useState(layoutConfig); // Layout configuration is stored in state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // Manage state for mobile sidebar

  // Get the current scroll position using a custom hook
  const scrollPosition = useScrollPosition();

  // Calculate whether the header should be sticky based on the scroll position and the layout's sticky offset
  const headerSticky = scrollPosition > layout.options.header.stickyOffset;

  // Set the menu configuration for the primary menu using the provided MENU_SIDEBAR configuration
  setMenuConfig('primary', MENU_SIDEBAR);

  // When the layout state changes, set the current layout configuration in the layout provider
  useEffect(() => {
    setCurrentLayout(layout); // Update the current layout in the global layout state
  }, [layout, setCurrentLayout]); // Re-run this effect if layout or setCurrentLayout changes

  // Provide the layout state, sticky header state, and sidebar state to children components via context
  return <Demo2LayoutContext.Provider value={{
    layout,
    // The current layout configuration
    headerSticky,
    // Whether the header should be sticky based on the scroll position
    mobileSidebarOpen,
    // Whether the mobile sidebar is currently open
    setMobileSidebarOpen // Function to toggle the mobile sidebar state
  }}>
      {children} {/* Render child components that consume this context */}
    </Demo2LayoutContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export { Demo2LayoutProvider, useDemo2Layout };