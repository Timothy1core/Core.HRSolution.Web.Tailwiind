import React, { forwardRef, useRef } from 'react';
import { toAbsoluteUrl } from '@/_metronic/utils';
import { useAuthContext } from '@/app/auth';
import { KeenIcon, Menu, MenuItem, MenuToggle } from '@/_metronic/components';
import { DropdownUser } from '@/_metronic/partials/dropdowns/user';
import { DropdownNotifications } from '@/_metronic/partials/dropdowns/notifications';

const SidebarFooter = forwardRef((props, ref) => {
  const {
    logout
  } = useAuthContext();
  const itemNotificationsRef = useRef(null);
  const itemUserRef = useRef(null);
  
  return <div ref={ref} className="flex flex-center justify-between shrink-0 ps-4 pe-3.5 mb-3.5">
      <Menu data-menu="true">
        <MenuItem ref={itemUserRef} toggle="dropdown" trigger="click" dropdownProps={{
        placement: 'right-start',
        modifiers: [{
          name: 'offset',
          options: {
            offset:  [10, 15]  // [skid, distance]
          }
        }]
      }}>
          <MenuToggle className="btn btn-icon rounded-full">
            <img className="size-8 rounded-full justify-center border border-gray-500 shrink-0" src={toAbsoluteUrl('/media/avatars/gray/5.png')} alt="" />
          </MenuToggle>
          {DropdownUser({
          menuItemRef: itemUserRef
        })}
        </MenuItem>
      </Menu>

      <div className="flex items-center gap-1.5">
        <Menu>
          <MenuItem ref={itemNotificationsRef} toggle="dropdown" trigger="click" dropdownProps={{
          placement: 'right-start',
          modifiers: [{
            name: 'offset',
            options: {
              offset: [10, 15]
            }
          }]
        }}>
            <MenuToggle className="btn btn-icon btn-icon-lg relative size-8 hover:bg-light hover:text-primary dropdown-open:bg-gray-200 text-gray-600">
              <KeenIcon icon="notification-status" />
            </MenuToggle>
            {DropdownNotifications({
            menuTtemRef: itemNotificationsRef
          })}
          </MenuItem>

          <MenuItem toggle="dropdown" trigger="click" dropdownProps={{
          placement: 'right-start',
          modifiers: [{
            name: 'offset',
            options: {
              offset: [10, 15]
            }
          }]
        }}></MenuItem>
        </Menu>

        <div onClick={logout} className="btn btn-icon btn-icon-lg size-8 hover:bg-light hover:text-primary text-gray-600">
          <KeenIcon icon="exit-right" />
        </div>
      </div>
    </div>;
});
export { SidebarFooter };