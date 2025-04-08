import { Container } from '@/_metronic/components/container';
import { useLayout, useMenus } from '@/_metronic/providers';
import { NavbarMenu } from '@/_metronic/partials/menu/NavbarMenu';
import { Navbar } from '@/_metronic/partials/navbar';
const PageNavbar = () => {
  const {
    getMenuConfig
  } = useMenus();
  const {
    currentLayout
  } = useLayout();
  const menuConfig = getMenuConfig('primary');
  const accountMenuConfig = menuConfig?.['3']?.children;
  if (accountMenuConfig && currentLayout?.name === 'demo1-layout') {
    return <Navbar>
        <Container>
          <NavbarMenu items={accountMenuConfig} />
        </Container>
      </Navbar>;
  } else {
    return <></>;
  }
};
export { PageNavbar };