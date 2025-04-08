import {SidebarMenuItemWithSub} from './SidebarMenuItemWithSub'
import {SidebarMenuItem} from './SidebarMenuItem'
import { getUserMenus } from '../../../../../app/modules/auth/core/requests/_requests'
import React, { useEffect, useState } from 'react'

const SidebarMenuMain = () => {
  const [menuData, setMenuData] = useState({ leftSideBarMenus: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUserMenus()
      .then(response => {
        setMenuData(response.data); // Assuming response.data contains the menu data
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderMenuItems = (menuItem) => {
    if (menuItem.subMenus && menuItem.subMenus.length > 0) {
      return (
        <SidebarMenuItemWithSub
          key={menuItem.menuId}
          to={menuItem.menuPath}
          title={menuItem.menuName}
          icon={menuItem.icon}
          hasBullet={menuItem.isParent?false:true}
        >
          {menuItem.subMenus.map((subMenuItem) => renderMenuItems(subMenuItem))}
        </SidebarMenuItemWithSub>
      );
    } else {
      return (
        <SidebarMenuItem
          key={menuItem.menuId}
          to={menuItem.menuPath}
          icon={menuItem.icon}
          title={menuItem.menuName}
          hasBullet={menuItem.isParent?false:true}
        />
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loader component
  }

  if (error) {
    return <div>Error loading menus</div>; // Handle error appropriately
  }

  return (
    <>
      {menuData.leftSideBarMenus.map((section, index) => (
        <div key={index}>
          <div className='menu-item pt-5'>
            <div className='menu-content'>
              <span className='menu-heading fw-bold text-uppercase fs-7'>
                {section.sectionName}
              </span>
            </div>
          </div>
          {section.menus.map((menuItem) => renderMenuItems(menuItem))}
        </div>
      ))}
    </>
  );
};

export { SidebarMenuMain };