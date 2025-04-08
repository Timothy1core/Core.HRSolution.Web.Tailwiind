import { Fragment } from 'react';
import { Container } from '@/_metronic/components/container';
import { Toolbar, ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/_metronic/partials/toolbar';
import { PageNavbar } from '@/_metronic/pages/account';
import { AccountIntegrationsContent } from '.';
import { useLayout } from '@/_metronic/providers';
const AccountIntegrationsPage = () => {
  const {
    currentLayout
  } = useLayout();
  return <Fragment>
      <PageNavbar />

      {currentLayout?.name === 'demo1-layout' && <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>Enhance Workflows with Advanced Integrations.</ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Add New Integration
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>}

      <Container>
        <AccountIntegrationsContent />
      </Container>
    </Fragment>;
};
export { AccountIntegrationsPage };