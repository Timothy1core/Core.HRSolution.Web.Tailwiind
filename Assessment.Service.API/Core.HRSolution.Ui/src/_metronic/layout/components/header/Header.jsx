import { useEffect } from 'react';
import { useLayout } from '../../core';
import { MenuInner } from './header-menus';

// Define Header component as a functional component
const Header = () => {
  const { config } = useLayout();

  useEffect(() => {
    updateDOM(config);
  }, [config]);

  return (
    <div
      className="
        menu
        menu-rounded
        menu-column
        menu-lg-row
        my-5
        my-lg-0
        align-items-stretch
        fw-semibold
        px-2 px-lg-0
      "
      id="kt_app_header_menu"
      data-kt-menu="true"
    >
      <MenuInner />
    </div>
  );
};

// Update DOM based on configuration
const updateDOM = (config) => {
  if (config.app?.header?.default?.fixed?.desktop) {
    document.body.setAttribute('data-kt-app-header-fixed', 'true');
  }

  if (config.app?.header?.default?.fixed?.mobile) {
    document.body.setAttribute('data-kt-app-header-fixed-mobile', 'true');
  }

  if (config.app?.header?.default?.stacked) {
    document.body.setAttribute('data-kt-app-header-stacked', 'true');
  }

  const appHeaderDefaultStickyEnabled = config.app?.header?.default?.sticky?.enabled;
  let appHeaderDefaultStickyAttributes = {};
  if (appHeaderDefaultStickyEnabled) {
    appHeaderDefaultStickyAttributes = config.app?.header?.default?.sticky?.attributes || {};
  }

  const appHeaderDefaultMinimizeEnabled = config.app?.header?.default?.minimize?.enabled;
  let appHeaderDefaultMinimizeAttributes = {};
  if (appHeaderDefaultMinimizeEnabled) {
    appHeaderDefaultMinimizeAttributes = config.app?.header?.default?.minimize?.attributes || {};
  }

  setTimeout(() => {
    const headerElement = document.getElementById('kt_app_header');
    // Set attributes on header element
    if (headerElement) {
      if (appHeaderDefaultStickyEnabled) {
        for (const key in appHeaderDefaultStickyAttributes) {
          if (Object.prototype.hasOwnProperty.call(appHeaderDefaultStickyAttributes, key)) {
            headerElement.setAttribute(key, appHeaderDefaultStickyAttributes[key]);
          }
        }
      }

      if (appHeaderDefaultMinimizeEnabled) {
        for (const key in appHeaderDefaultMinimizeAttributes) {
          if (Object.prototype.hasOwnProperty.call(appHeaderDefaultMinimizeAttributes, key)) {
            headerElement.setAttribute(key, appHeaderDefaultMinimizeAttributes[key]);
          }
        }
      }
    }
  }, 0);
};

export { Header };
