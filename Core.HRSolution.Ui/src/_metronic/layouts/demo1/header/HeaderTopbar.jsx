import { useRef, useState } from 'react';
import { KeenIcon } from '@/_metronic/components/keenicons';
import { toAbsoluteUrl } from '@/_metronic/utils';
import { Menu, MenuItem, MenuToggle } from '@/_metronic/components';
import { DropdownUser } from '@/_metronic/partials/dropdowns/user';
import { DropdownNotifications } from '@/_metronic/partials/dropdowns/notifications';
import { DropdownApps } from '@/_metronic/partials/dropdowns/apps';
import { DropdownChat } from '@/_metronic/partials/dropdowns/chat';
import { ModalSearch } from '@/_metronic/partials/modals/search/ModalSearch';

const HeaderTopbar = () => {
  
  const itemChatRef = useRef(null);
  const itemAppsRef = useRef(null);
  const itemUserRef = useRef(null);
  const itemNotificationsRef = useRef(null);
  const handleShow = () => {
    window.dispatchEvent(new Event('resize'));
  };
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const handleOpen = () => setSearchModalOpen(true);
  const handleClose = () => {
    setSearchModalOpen(false);
  };
  return <div className="flex items-center gap-2 lg:gap-3.5">
      {/* <button onClick={handleOpen} className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500">
        <KeenIcon icon="magnifier" />
      </button>
      <ModalSearch open={searchModalOpen} onOpenChange={handleClose} />

      <Menu>
        <MenuItem ref={itemChatRef} onShow={handleShow} toggle="dropdown" trigger="click" dropdownProps={{
        placement: 'bottom-start',
        modifiers: [{
          name: 'offset',
          options: {
            offset: [-170, 10]
          }
        }]
      }}>
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="messages" />
          </MenuToggle>

          {DropdownChat({
          menuTtemRef: itemChatRef
        })}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem ref={itemAppsRef} toggle="dropdown" trigger="click" dropdownProps={{
        placement: 'bottom-start',
        modifiers: [{
          name: 'offset',
          options: {
            offset: [-10, 10]
          }
        }]
      }}>
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="element-11" />
          </MenuToggle>

          {DropdownApps()}
        </MenuItem>
      </Menu> */}

      <Menu>
        <MenuItem ref={itemNotificationsRef} toggle="dropdown" trigger="click" dropdownProps={{
        placement: 'bottom-start',
        modifiers: [{
          name: 'offset',
          options: {
            offset:  [-70, 10] // [skid, distance]
          }
        }]
      }}>
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="notification-status" />
          </MenuToggle>
          {DropdownNotifications({
          menuTtemRef: itemNotificationsRef
        })}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem ref={itemUserRef} toggle="dropdown" trigger="click" dropdownProps={{
        placement: 'bottom-start',
        modifiers: [{
          name: 'offset',
          options: {
            offset: [-20, 10] // [skid, distance]
          }
        }]
      }}>
          <MenuToggle className="btn btn-icon rounded-full">
            <img className="size-9 rounded-full border-2 border-success shrink-0" src={toAbsoluteUrl('/media/avatars/300-2.png')} alt="" />
          </MenuToggle>
          {DropdownUser({
          menuItemRef: itemUserRef
        })}
        </MenuItem>
      </Menu>
    </div>;
};
export { HeaderTopbar };