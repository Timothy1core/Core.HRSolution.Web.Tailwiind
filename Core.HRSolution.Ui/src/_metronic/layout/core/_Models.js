// Layout Types
const LayoutType = ['dark-sidebar', 'light-sidebar', 'dark-header', 'light-header'];

// CSS Classes Type
const CSSClassesType = {
  // This object can have any number of keys, each with an array of strings as its value
};

// HTML Attributes Type
const HTMLAttributesType = {

};

// Base Layout Component Interface
const ILayoutComponent = {
  componentName: ''
};

// Page Loader Interface
const IPageLoader = {
  ...ILayoutComponent,
  componentName: 'page-loader',
  type: 'none' | 'default' | 'spinner-message' | 'spinner-logo',
  logoImage: '',
  logoClass: ''
};

// Scroll Top Interface
const IScrollTop = {
  ...ILayoutComponent,
  display: false
};

// Header Interface
const IHeader = {
  ...ILayoutComponent,
  componentName: 'header',
  display: false,
  default: {
    container: 'fluid' | 'fixed',
    containerClass: '',
    fixed: {
      desktop: false,
      mobile: false
    },
    content: '',
    menu: {
      display: false,
      iconType: 'svg' | 'font'
    },
    stacked: false,
    sticky: {
      enabled: false,
      attributes: {}
    },
    minimize: {
      enabled: false,
      attributes: {}
    }
  }
};

// Sidebar Interface
const ISidebar = {
  ...ILayoutComponent,
  componentName: 'sidebar',
  display: false,
  default: {
    class: '',
    push: {
      header: false,
      toolbar: false,
      footer: false
    },
    drawer: {
      enabled: false,
      attributes: {}
    },
    sticky: {
      enabled: false,
      attributes: {}
    },
    fixed: {
      desktop: false
    },
    minimize: {
      desktop: {
        enabled: false,
        default: false,
        hoverable: false
      },
      mobile: {
        enabled: false,
        default: false,
        hoverable: false
      }
    },
    menu: {
      iconType: 'svg' | 'font'
    },
    collapse: {
      desktop: {
        enabled: false,
        default: false
      },
      mobile: {
        enabled: false,
        default: false
      }
    },
    stacked: false
  },
  toggle: false
};

// Toolbar Types
const ToolbarType = ['classic', 'accounting', 'extended', 'reports', 'saas'];

// Toolbar Interface
const IToolbar = {
  ...ILayoutComponent,
  componentName: 'toolbar',
  display: false,
  layout: '',
  class: '',
  container: 'fixed' | 'fluid',
  containerClass: '',
  fixed: {
    desktop: false,
    mobile: false
  },
  swap: {
    enabled: false,
    attributes: {}
  },
  sticky: {
    enabled: false,
    attributes: {}
  },
  minimize: {
    enabled: false,
    attributes: {}
  },
  filterButton: false,
  daterangepickerButton: false,
  primaryButton: false,
  primaryButtonLabel: '',
  primaryButtonModal: '',
  secondaryButton: false
};

// Main Interface
const IMain = {
  ...ILayoutComponent,
  type: 'blank' | 'default' | 'none',
  pageBgWhite: false,
  iconType: 'duotone' | 'solid' | 'outline'
};

// Illustrations Interface
const IIllustrations = {
  ...ILayoutComponent,
  componentName: 'illustrations',
  set: 'dozzy-1' | 'sigma-1' | 'sketchy-1' | 'unitedpalms-1'
};

// General Interface
const IGeneral = {
  ...ILayoutComponent,
  componentName: 'general',
  evolution: false,
  layoutType: 'default' | 'blank',
  mode: 'light' | 'dark' | 'system',
  rtl: false,
  primaryColor: '',
  pageBgWhite: false,
  pageWidth: 'default' | 'fluid' | 'fixed'
};

// Mega Menu Interface
const IMegaMenu = {
  ...ILayoutComponent,
  display: false
};

// Sidebar Panel Interface
const ISidebarPanel = {
  ...ILayoutComponent,
  componentName: 'sidebar-panel',
  display: false
};

// Content Interface
const IContent = {
  ...ILayoutComponent,
  componentName: 'content',
  container: 'fixed' | 'fluid',
  class: ''
};

// Footer Interface
const IFooter = {
  ...ILayoutComponent,
  componentName: 'footer',
  display: false,
  container: 'fluid' | 'fixed',
  containerClass: '',
  placement: '',
  fixed: {
    desktop: false,
    mobile: false
  }
};

// Page Title Interface
const IPageTitle = {
  ...ILayoutComponent,
  componentName: 'page-title',
  display: false,
  breadCrumb: false,
  description: false,
  direction: 'row' | 'column',
  class: ''
};

// Engage Interface
const IEngage = {
  ...ILayoutComponent,
  componentName: 'engage',
  demos: {
    enabled: false
  },
  purchase: {
    enabled: false
  }
};

// App Interface
const IApp = {
  general: IGeneral,
  header: IHeader,
  sidebar: ISidebar,
  sidebarPanel: ISidebarPanel,
  toolbar: IToolbar,
  pageTitle: IPageTitle,
  content: IContent,
  footer: IFooter,
  pageLoader: IPageLoader
};

// Layout Interface
const ILayout = {
  layoutType: '',
  main: IMain,
  app: IApp,
  illustrations: IIllustrations,
  scrolltop: IScrollTop,
  engage: IEngage
};

// Layout CSS Classes Interface
const ILayoutCSSClasses = {
  header: [],
  headerContainer: [],
  headerMobile: [],
  headerMenu: [],
  aside: [],
  asideMenu: [],
  asideToggle: [],
  sidebar: [],
  toolbar: [],
  toolbarContainer: [],
  content: [],
  contentContainer: [],
  footerContainer: [],
  pageTitle: [],
  pageContainer: []
};

// Layout HTML Attributes Interface
const ILayoutHTMLAttributes = {
  asideMenu: new Map(),
  headerMobile: new Map(),
  headerMenu: new Map(),
  headerContainer: new Map(),
  pageTitle: new Map()
};

// Layout CSS Variables Interface
const ILayoutCSSVariables = {
  body: new Map()
};

export {
  LayoutType,
  CSSClassesType,
  HTMLAttributesType,
  ILayoutComponent,
  IPageLoader,
  IScrollTop,
  IHeader,
  ISidebar,
  ToolbarType,
  IToolbar,
  IMain,
  IIllustrations,
  IGeneral,
  IMegaMenu,
  ISidebarPanel,
  IContent,
  IFooter,
  IPageTitle,
  IEngage,
  IApp,
  ILayout,
  ILayoutCSSClasses,
  ILayoutHTMLAttributes,
  ILayoutCSSVariables
};

