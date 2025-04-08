import { Fragment } from 'react';
import { Container } from '@/_metronic/components/container';
import { Toolbar, ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/_metronic/partials/toolbar';
import { PageNavbar } from '@/_metronic/pages/account';
import { AccountPrivacySettingsContent } from '.';
import { useLayout } from '@/_metronic/providers';
const AccountPrivacySettingsPage = () => {
  const {
    currentLayout
  } = useLayout();
  return <Fragment>
      <PageNavbar />

      {currentLayout?.name === 'demo1-layout' && <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Central Hub for Personal Customization</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Order History
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>}

      <Container>
        <AccountPrivacySettingsContent />
      </Container>
    </Fragment>;
};
export { AccountPrivacySettingsPage };