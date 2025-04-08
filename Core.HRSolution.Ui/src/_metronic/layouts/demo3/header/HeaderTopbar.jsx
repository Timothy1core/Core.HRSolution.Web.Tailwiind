import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { KeenIcon } from '@/_metronic/components/keenicons';
import { toAbsoluteUrl } from '@/_metronic/utils';
import { Menu, MenuItem, MenuToggle } from '@/_metronic/components';
import { DropdownUser } from '@/_metronic/partials/dropdowns/user';
import { ModalSearch } from '@/_metronic/partials/modals/search/ModalSearch';
import { DropdownNotifications } from '@/_metronic/partials/dropdowns/notifications';
import { DropdownApps } from '@/_metronic/partials/dropdowns/apps';
import { DropdownChat } from '@/_metronic/partials/dropdowns/chat';

const HeaderTopbar = () => {
  const itemAppsRef = useRef(null);
  const itemChatRef = useRef(null);
  const itemUserRef = useRef(null);
  const itemNotificationsRef = useRef(null);
  
  const handleDropdownChatShow = () => {
    window.dispatchEvent(new Event('resize'));
  };
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const handleSearchModalOpen = () => setSearchModalOpen(true);
  const handleSearchModalClose = () => {
    setSearchModalOpen(false);
  };
  return <div className="flex items-center lg:gap-3.5">
      <Link to={'/account/home/get-started'} className="btn btn-xs btn-primary me-1 sm:me-0">
        Get Started
      </Link>

      <div className="flex items-center gap-1.5">
        <button onClick={handleSearchModalOpen} className="btn btn-icon btn-icon-lg size-8 text-gray-600 hover:text-primary">
          <KeenIcon icon="magnifier" />
        </button>
        <ModalSearch open={searchModalOpen} onOpenChange={handleSearchModalClose} />

        <Menu>
          <MenuItem ref={itemNotificationsRef} toggle="dropdown" trigger="click" dropdownProps={{
          placement: 'bottom-start',
          modifiers: [{
            name: 'offset',
            options: {
              offset: [10, 10] // [skid, distance]
            }
          }]
        }}>
            <MenuToggle className="btn btn-icon btn-icon-lg size-8 text-gray-600 hover:text-primary [dropdown-open:text-primary">
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
              offset: [10, 10] // [skid, distance]
            }
          }]
        }}>
            <MenuToggle className="btn btn-icon btn-icon-lg size-8 text-gray-600 hover:text-primary [dropdown-open:text-primary">
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
              offset: [10, 10] // [skid, distance]
            }
          }]
        }}>
            <MenuToggle className="btn btn-icon btn-icon-lg size-8 text-gray-600 hover:text-primary [dropdown-open:text-primary">
              <KeenIcon icon="element-11" />
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
            offset: [0, 9] // [skid, distance]
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
    </div>;
};
export { HeaderTopbar };