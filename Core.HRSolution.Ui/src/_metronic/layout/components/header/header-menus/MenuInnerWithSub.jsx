import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import clsx from 'clsx';
import { checkIsActive, KTIcon } from '../../../../helpers';

// Define PropTypes for validation (optional but recommended in JS)
import PropTypes from 'prop-types';

// Component definition
const MenuInnerWithSub = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  menuTrigger,
  menuPlacement,
  hasArrow = false,
  hasBullet = false,
  isMega = false,
}) => {
  const menuItemRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (menuItemRef.current && menuTrigger && menuPlacement) {
      menuItemRef.current.setAttribute('data-kt-menu-trigger', menuTrigger);
      menuItemRef.current.setAttribute('data-kt-menu-placement', menuPlacement);
    }
  }, [menuTrigger, menuPlacement]);

  return (
    <div ref={menuItemRef} className='menu-item menu-lg-down-accordion me-lg-1'>
      <span
        className={clsx('menu-link py-3', {
          active: checkIsActive(pathname, to),
        })}
      >
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}

        {icon && (
          <span className='menu-icon'>
            <KTIcon iconName={icon} className='fs-2' />
          </span>
        )}

        {fontIcon && (
          <span className='menu-icon'>
            <i className={clsx('bi fs-3', fontIcon)}></i>
          </span>
        )}

        <span className='menu-title'>{title}</span>

        {hasArrow && <span className='menu-arrow'></span>}
      </span>
      <div
        className={clsx(
          'menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown',
          isMega ? 'w-100 w-lg-850px p-5 p-lg-5' : 'menu-rounded-0 py-lg-4 w-lg-225px'
        )}
        data-kt-menu-dismiss='true'
      >
        {children}
      </div>
    </div>
  );
};

// PropTypes definition for the component
MenuInnerWithSub.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  fontIcon: PropTypes.string,
  menuTrigger: PropTypes.oneOfType([
    PropTypes.oneOf(['click']),
    PropTypes.shape({
      default: PropTypes.oneOf(['click']),
      lg: PropTypes.oneOf(['hover']),
    })
  ]),
  menuPlacement: PropTypes.oneOf(['right-start', 'bottom-start', 'left-start']),
  hasArrow: PropTypes.bool,
  hasBullet: PropTypes.bool,
  isMega: PropTypes.bool,
};

export { MenuInnerWithSub };
