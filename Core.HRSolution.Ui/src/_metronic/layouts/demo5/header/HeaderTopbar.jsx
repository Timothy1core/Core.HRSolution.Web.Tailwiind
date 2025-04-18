import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/_metronic/utils';
import { Menu, MenuItem, MenuToggle, KeenIcon } from '@/_metronic/components';
import { DropdownUser } from '@/_metronic/partials/dropdowns/user';
import { DropdownNotifications } from '@/_metronic/partials/dropdowns/notifications';
import { DropdownApps } from '@/_metronic/partials/dropdowns/apps';

const HeaderTopbar = () => {
  const itemChatRef = useRef(null);
  const itemUserRef = useRef(null);
  const itemNotificationsRef = useRef(null);
  
  const handleDropdownChatShow = () => {
    window.dispatchEvent(new Event('resize'));
  };
  return <div className="flex items-center gap-2 lg:gap-3.5">
      <Link to="/account/members/team-members" className="btn btn-sm btn-light">
        <KeenIcon icon="users" />
        Add <span className="hidden md:inline">Teammate</span>
      </Link>

      <div className="flex items-center gap-1">
        <Menu>
          <MenuItem ref={itemNotificationsRef} toggle="dropdown" trigger="click" dropdownProps={{
          placement: 'bottom-start',
          modifiers: [{
            name: 'offset',
            options: {
              offset: [0, 10] // [skid, distance]
            }
          }]
        }}>
            <MenuToggle className="btn btn-icon btn-icon-lg size-9 text-gray-600 hover:text-primary dropdown-open:text-primary">
              <KeenIcon icon="notification-status" />
            </MenuToggle>
            {DropdownNotifications({
            menuTtemRef: itemNotificationsRef
          })}
          </MenuItem>
        </Menu>

        <Menu>
          <MenuItem ref={itemChatRef} onShow={handleDropdownChatShow} toggle="dropdown" trigger="click" dropdownProps={{
          placement: 'bottom-start',
          modifiers: [{
            name: 'offset',
            options: {
              offset:[0, 10] // [skid, distance]
            }
          }]
        }}>
            <MenuToggle className="btn btn-icon btn-icon-lg size-9 text-gray-600 hover:text-primary dropdown-open:text-primary">
              <KeenIcon icon="setting-2" className="text-gray-600" />
            </MenuToggle>

            {DropdownApps()}
          </MenuItem>
        </Menu>
      </div>

      <Menu>
        <MenuItem ref={itemUserRef} toggle="dropdown" trigger="click" dropdownProps={{
        placement: 'bottom-start',
        modifiers: [{
          name: 'offset',
          options: {
            offset: [5, 10] // [skid, distance]
          }
        }]
      }}>
          <MenuToggle className="btn btn-icon rounded-full">
            <img className="size-7 rounded-full justify-center border border-gray-500 shrink-0" src={toAbsoluteUrl('/media/avatars/gray/5.png')} alt="" />
          </MenuToggle>
          {DropdownUser({
          menuItemRef: itemUserRef
        })}
        </MenuItem>
      </Menu>
    </div>;
};
export { HeaderTopbar };