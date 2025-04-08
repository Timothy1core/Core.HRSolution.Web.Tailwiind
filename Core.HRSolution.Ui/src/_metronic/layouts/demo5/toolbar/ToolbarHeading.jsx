import { useLocation } from 'react-router';
import { useMenus } from '@/_metronic/providers';
import { useMenuCurrentItem } from '@/_metronic/components';
import { ToolbarBreadcrumbs } from '.';
const ToolbarHeading = ({
  title = ''
}) => {
  const {
    getMenuConfig
  } = useMenus();
  const {
    pathname
  } = useLocation();
  const currentMenuItem = useMenuCurrentItem(pathname, getMenuConfig('primary'));
  return <div className="flex items-center flex-wrap gap-1 lg:gap-5">
      <h1 className="font-medium text-lg text-gray-900">{title || currentMenuItem?.title}</h1>
      <div className="flex items-center gap-1 text-sm font-normal">
        <ToolbarBreadcrumbs />
      </div>
    </div>;
};
export { ToolbarHeading };