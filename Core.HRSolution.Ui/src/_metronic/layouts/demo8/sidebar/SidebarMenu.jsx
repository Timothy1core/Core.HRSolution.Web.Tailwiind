import { KeenIcon } from '@/_metronic/components/keenicons';
import { Menu, MenuArrow, MenuIcon, MenuItem, MenuLink, MenuSeparator, MenuSub, MenuTitle } from '@/_metronic/components/menu';
import { useMenus } from '@/_metronic/providers';
import { useResponsive } from '@/_metronic/hooks';

const SidebarMenu = () => {
  const isDesktop = useResponsive('up', 'lg');
  const {
    getMenuConfig
  } = useMenus();
  const primaryMenuConfig = getMenuConfig('primary');
  const megaMenuConfig = getMenuConfig('mega');
  
  const menuConfig = [{
    title: 'Boards',
    icon: 'chart-line-star',
    path: '/'
  }, {
    title: 'Profiles',
    icon: 'profile-circle',
    children: primaryMenuConfig?.[2].children
  }, {
    title: 'Account',
    icon: 'setting-2',
    children: primaryMenuConfig?.[3].children
  }, {
    title: 'Network',
    icon: 'users',
    children: primaryMenuConfig?.[4].children
  }, {
    title: 'Help',
    icon: 'share',
    children: megaMenuConfig?.[5].children
  }];
  const buildMenu = items => {
    return items.map((item, index) => {
      return buildMenuItemRoot(item, index);
    });
  };
  const buildMenuItemRoot = (item, index, level = 0) => {
    if (item.children) {
      return <MenuItem key={index} toggle="dropdown" trigger="hover" dropdownProps={{
        placement: 'right-end',
        modifiers: [{
          name: 'offset',
          options: {
            offset:  [10, 14]// [skid, distance]
          }
        }]
      }}>
          <MenuLink className="
              rounded-[9px] 
              border 
              border-transparent
              menu-item-here:border-gray-200 
              menu-item-here:bg-light 
              menu-link-hover:bg-light  
              menu-link-hover:border-gray-200  
              w-[62px]
              h-[60px]
              flex flex-col 
              justify-center 
              items-center 
              gap-1 p-2 
              grow
            ">
            {item.icon && <MenuIcon className="
                  menu-item-here:text-primary
                  menu-item-active:text-primary
                  menu-link-hover:text-primary
                  text-gray-600
                ">
                <KeenIcon icon={item.icon} className="text-1.5xl" />
              </MenuIcon>}
            <MenuTitle className="
                menu-item-here:text-primary
                menu-item-active:text-primary
                menu-link-hover:text-primary
                font-medium
                text-xs
                text-gray-600
              ">
              {item.title}
            </MenuTitle>
          </MenuLink>
          <MenuSub className="menu-default gap-0.5 w-[220px] scrollable-y-auto lg:overflow-visible max-h-[50vh]">
            {buildMenuChildren(item.children, level + 1)}
          </MenuSub>
        </MenuItem>;
    } else {
      return <MenuItem key={index}>
          <MenuLink path={item.path} className="
              rounded-[9px] 
              border 
              border-transparent
              menu-item-active:border-gray-200 
              menu-item-active:bg-light 
              menu-link-hover:bg-light  
              menu-link-hover:border-gray-200
              w-[62px]
              h-[60px]
              flex 
              flex-col 
              justify-center 
              items-center 
              gap-1 p-2
            ">
            {item.icon && <MenuIcon className="
                  menu-item-here:text-primary
                  menu-item-active:text-primary
                  menu-link-hover:text-primary
                  text-gray-600
                ">
                <KeenIcon icon={item.icon} className="text-1.5xl" />
              </MenuIcon>}
            <MenuTitle className="
                menu-item-here:text-primary
                menu-item-active:text-primary
                menu-link-hover:text-primary
                font-medium
                text-xs
                text-gray-600
              ">
              {item.title}
            </MenuTitle>
          </MenuLink>
        </MenuItem>;
    }
  };
  const buildMenuChildren = (items, level) => {
    return items.map((item, index) => {
      if (!item.disabled) {
        return buildMenuItemChild(item, index, level);
      }
    });
  };
  const buildMenuItemChild = (item, index, level = 0) => {
    if (item.separator) {
      return <MenuSeparator key={index} />;
    } else if (item.children) {
      return <MenuItem key={index} toggle={isDesktop ? 'dropdown' : 'accordion'} trigger={isDesktop ? 'hover' : 'click'} dropdownProps={{
        placement: 'right-start'
      }}>
          <MenuLink className="grow cursor-pointer">
            <MenuTitle>{item.title}</MenuTitle>
            <MenuArrow>
              <KeenIcon icon="right" className="text-3xs rtl:translate rtl:rotate-180" />
            </MenuArrow>
          </MenuLink>
          <MenuSub className="menu-default gap-0.5 w-[220px] scrollable-y-auto lg:overflow-visible max-h-[50vh]">
            {buildMenuChildren(item.children, level + 1)}
          </MenuSub>
        </MenuItem>;
    } else {
      return <MenuItem key={index}>
          <MenuLink path={item.path}>
            <MenuTitle>{item.title}</MenuTitle>
          </MenuLink>
        </MenuItem>;
    }
  };
  return <Menu highlight={true} multipleExpand={false} className="flex flex-col gap-2.5 grow">
      {menuConfig && buildMenu(menuConfig)}
    </Menu>;
};
export { SidebarMenu };