import { useRef } from 'react';
import { KeenIcon } from '@/_metronic/components/keenicons';
import { toAbsoluteUrl } from '@/_metronic/utils';
import { Menu, MenuItem, MenuToggle } from '@/_metronic/components';
import { DropdownUser } from '@/_metronic/partials/dropdowns/user';
import { DropdownNotifications } from '@/_metronic/partials/dropdowns/notifications';
import { DropdownChat } from '@/_metronic/partials/dropdowns/chat';

const HeaderTopbar = () => {
  const itemChatRef = useRef(null);
  const itemUserRef = useRef(null);
  const itemNotificationsRef = useRef(null);
  
  const handleDropdownChatShow = () => {
    window.dispatchEvent(new Event('resize'));
  };
  return <div className="flex items-center gap-3.5">
      <div className="flex items-center gap-1">
        <Menu>
          <MenuItem ref={itemNotificationsRef} toggle="dropdown" trigger="click" dropdownProps={{
          placement: 'bottom-start',
          modifiers: [{
            name: 'offset',
            options: {
              offset: [115, 10] // [skid, distance]
            }
          }]
        }}>
            <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-gray-200 dropdown-open:bg-gray-200 text-gray-600">
              <KeenIcon icon="notification-status" className="text-gray-600" />
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
              offset: [75, 10] // [skid, distance]
            }
          }]
        }}>
            <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-gray-200 dropdown-open:bg-gray-200 text-gray-600">
              <KeenIcon icon="messages" className="text-gray-600" />
            </MenuToggle>

            {DropdownChat({
            menuTtemRef: itemChatRef
          })}
          </MenuItem>
        </Menu>
      </div>

      <Menu>
        <MenuItem ref={itemUserRef} toggle="dropdown" trigger="click" dropdownProps={{
        placement: 'bottom-start',
        modifiers: [{
          name: 'offset',
          options: {
            offset: [20, 10] // [skid, distance]
          }
        }]
      }}>
          <MenuToggle className="btn btn-icon rounded-full">
            <img className="size-9 rounded-full justify-center border border-gray-500 shrink-0" src={toAbsoluteUrl('/media/avatars/gray/5.png')} alt="" />
          </MenuToggle>
          {DropdownUser({
          menuItemRef: itemUserRef
        })}
        </MenuItem>
      </Menu>
    </div>;
};
export { HeaderTopbar };