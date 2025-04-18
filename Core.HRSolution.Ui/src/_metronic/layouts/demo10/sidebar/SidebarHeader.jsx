import React, { forwardRef, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toAbsoluteUrl } from '@/_metronic/utils';
import { Menu, MenuArrow, MenuIcon, MenuItem, MenuLabel, MenuLink, MenuSub, MenuTitle } from '@/_metronic/components/menu';
import { MENU_ROOT } from '@/app/config';
import { KeenIcon } from '@/_metronic/components';
import { ModalSearch } from '@/_metronic/partials/modals/search/ModalSearch';

const SidebarHeader = forwardRef((props, ref) => {
  const {
    pathname
  } = useLocation();
  const [selectedMenuItem, setSelectedMenuItem] = useState(MENU_ROOT[1]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const handleSearchModalOpen = () => setSearchModalOpen(true);
  const handleSearchModalClose = () => {
    setSearchModalOpen(false);
  };
  
  useEffect(() => {
    MENU_ROOT.forEach(item => {
      if (item.rootPath && pathname.includes(item.rootPath)) {
        setSelectedMenuItem(item);
      }
    });
  }, [pathname]);
  return <div ref={ref} className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5 px-3.5 h-[70px]">
        <Link to="/">
          <img src={toAbsoluteUrl('/media/app/mini-logo-circle-success.svg')} className="h-[34px]" />
        </Link>

        <Menu className="menu-default grow">
          <MenuItem className="grow" toggle="dropdown" trigger="hover" dropdownProps={{
          placement:  'bottom-end',
          modifiers: [{
            name: 'offset',
            options: {
              offset: [0, 15] // [skid, distance]
            }
          }]
        }}>
            <MenuLabel className="cursor-pointer text-gray-900 font-medium grow justify-between">
            <h1 className="text-gray-900 text-lg font-bold hidden md:block ms-2.5 me-1">COREAGILE</h1>
            <h1 className="text-gray-900 text-lg font-normal hidden md:block">SYSTEM</h1>
              <div className="flex flex-col text-gray-900 font-medium">
                <MenuArrow>
                  <KeenIcon icon="up" />
                </MenuArrow>
                <MenuArrow>
                  <KeenIcon icon="down" />
                </MenuArrow>
              </div>
            </MenuLabel>

            <MenuSub className="menu-default w-48 py-2" baseClassName="dark">
              {MENU_ROOT.map((item, index) => <MenuItem key={index} className={item === selectedMenuItem ? 'active' : ''}>
                  <MenuLink path={item.path}>
                    {item.icon && <MenuIcon>
                        <KeenIcon icon={item.icon} />
                      </MenuIcon>}
                    <MenuTitle>{item.title}</MenuTitle>
                  </MenuLink>
                </MenuItem>)}
            </MenuSub>
          </MenuItem>
        </Menu>
      </div>

      <div className="flex items-center gap-2.5 px-3.5">
        <Link to="/public-profile/projects/3-columns" className="btn btn-dark btn-sm justify-center min-w-[198px]">
          <KeenIcon icon="plus" />
          Add New
        </Link>

        <div className="flex items-center">
          <button onClick={handleSearchModalOpen} className="btn btn-icon btn-dark btn-icon-lg size-8 hover:text-primary">
            <KeenIcon icon="magnifier" />
          </button>
          <ModalSearch open={searchModalOpen} onOpenChange={handleSearchModalClose} />
        </div>
      </div>
    </div>;
});
export { SidebarHeader };