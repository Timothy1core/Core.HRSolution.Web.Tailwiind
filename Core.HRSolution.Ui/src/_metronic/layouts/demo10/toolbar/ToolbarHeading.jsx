import { useMenus } from '@/_metronic/providers';
import { useMenuCurrentItem } from '@/_metronic/components';
import { useLocation } from 'react-router';
import { ToolbarBreadcrumbs } from './ToolbarBreadcrumbs';
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
  return <div className="flex flex-col flex-wrap gap-1">
      <h1 className="font-medium text-lg text-gray-900">{title || currentMenuItem?.title}</h1>
      <ToolbarBreadcrumbs />
    </div>;
};
export { ToolbarHeading };