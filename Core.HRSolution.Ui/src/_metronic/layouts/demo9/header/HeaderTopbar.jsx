import { useRef } from 'react';
import { Menu, MenuItem, MenuToggle, KeenIcon } from '@/_metronic/components';
import { DropdownUser } from '@/_metronic/partials/dropdowns/user';
import { DropdownNotifications } from '@/_metronic/partials/dropdowns/notifications';
import { DropdownCard2 } from '@/_metronic/partials/dropdowns/general';

const HeaderTopbar = () => {
  const itemChatRef = useRef(null);
  const itemNotificationsRef = useRef(null);
  const itemUserRef = useRef(null);
  
  const handleDropdownChatShow = () => {
    window.dispatchEvent(new Event('resize'));
  };
  return <div className="flex items-center gap-2 lg:gap-3.5 lg:w-[400px] justify-end">
      <div className="flex items-center gap-2 me-0.5">
        <Menu className="items-stretch">
          <MenuItem ref={itemNotificationsRef} toggle="dropdown" trigger="click" dropdownProps={{
          placement: 'bottom-start',
          modifiers: [{
            name: 'offset',
            options: {
              offset: [7, 10] // [skid, distance]
            }
          }]
        }}>
            <MenuToggle className="btn btn-icon btn-icon-base btn-sm text-gray-600 hover:text-primary dropdown-open:text-primary">
              <KeenIcon icon="notification-status" />
            </MenuToggle>
            {DropdownNotifications({
            menuTtemRef: itemNotificationsRef
          })}
          </MenuItem>
        </Menu>

        <Menu className="items-stretch">
          <MenuItem ref={itemUserRef} toggle="dropdown" trigger="click" dropdownProps={{
          placement: 'bottom-start',
          modifiers: [{
            name: 'offset',
            options: {
              offset: [7, 10] // [skid, distance]
            }
          }]
        }}>
            <MenuToggle className="btn btn-icon btn-icon-base btn-sm text-gray-600 hover:text-primary dropdown-open:text-primary">
              <KeenIcon icon="profile-circle" />
            </MenuToggle>
            {DropdownUser({
            menuItemRef: itemUserRef
          })}
          </MenuItem>
        </Menu>
      </div>

      <div className="border-e border-gray-200 h-5"></div>

      <div className="flex items-center gap-2">
        <label className="switch switch-sm">
          <input className="order-1" name="check" type="checkbox" defaultChecked value="1" />
          <div className="switch-label order-2">
            <span className="text-gray-800 text-2sm font-medium">Pro</span>
          </div>
        </label>
      </div>

      <div className="border-e border-gray-200 h-5"></div>

      <Menu className="items-stretch">
        <MenuItem ref={itemChatRef} onShow={handleDropdownChatShow} toggle="dropdown" trigger="click" dropdownProps={{
        placement: 'bottom-start',
        modifiers: [{
          name: 'offset',
          options: {
            offset: [0, 10] // [skid, distance]
          }
        }]
      }}>
          <MenuToggle className="btn btn-sm btn-dark">
            Create
            <KeenIcon icon="down" />
          </MenuToggle>

          {DropdownCard2()}
        </MenuItem>
      </Menu>
    </div>;
};
export { HeaderTopbar };