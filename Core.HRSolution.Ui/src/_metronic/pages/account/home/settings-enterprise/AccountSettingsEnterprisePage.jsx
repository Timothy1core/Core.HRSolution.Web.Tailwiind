import { Fragment } from 'react';
import { Container } from '@/_metronic/components/container';
import { Toolbar, ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/_metronic/partials/toolbar';
import { PageNavbar } from '@/_metronic/pages/account';
import { AccountSettingsEnterpriseContent } from '.';
import { useLayout } from '@/_metronic/providers';
const AccountSettingsEnterprisePage = () => {
  const {
    currentLayout
  } = useLayout();
  return <Fragment>
      <PageNavbar />

      {currentLayout?.name === 'demo1-layout' && <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Tailored Tools for Business Scalability</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Public Profile
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                My profile
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>}
      <Container>
        <AccountSettingsEnterpriseContent />
      </Container>
    </Fragment>;
};
export { AccountSettingsEnterprisePage };