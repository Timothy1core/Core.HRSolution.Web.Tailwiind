import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { checkIsActive, KTIcon } from '@/_metronic/helpers';


// PropTypes for validation (optional but recommended)
import PropTypes from 'prop-types';

// Component definition
const MenuItem = ({ to, title, icon, fontIcon, hasArrow = false, hasBullet = false }) => {
  const { pathname } = useLocation();

  return (
    <div className='menu-item me-lg-1'>
      <Link
        className={clsx('menu-link py-3', {
          'active menu-here': checkIsActive(pathname, to),
        })}
        to={to}
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
      </Link>
    </div>
  );
};

// PropTypes definition for the component
MenuItem.propTypes = {
  to: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string,
  fontIcon: PropTypes.string,
  hasArrow: PropTypes.bool,
  hasBullet: PropTypes.bool,
};

export { MenuItem };
