import { Fragment } from 'react';
import { Container } from '@/_metronic/components/container';
import { Toolbar, ToolbarActions, ToolbarDescription, ToolbarHeading, ToolbarPageTitle } from '@/_metronic/partials/toolbar';
import { NetworkStoreClientsContent } from '.';
import { useLayout } from '@/_metronic/providers';
const NetworkStoreClientsPage = () => {
  const {
    currentLayout
  } = useLayout();
  return <Fragment>
      {currentLayout?.name === 'demo1-layout' && <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-md text-gray-600">All Members:</span>
                  <span className="text-md text-ray-800 font-semibold me-2">49,053</span>
                  <span className="text-md text-gray-600">Pro Licenses</span>
                  <span className="text-md text-gray-800 font-semibold">724</span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
            <ToolbarActions>
              <a href="#" className="btn btn-sm btn-light">
                Import CSV
              </a>
              <a href="#" className="btn btn-sm btn-primary">
                Add Member
              </a>
            </ToolbarActions>
          </Toolbar>
        </Container>}

      <Container>
        <NetworkStoreClientsContent />
      </Container>
    </Fragment>;
};
export { NetworkStoreClientsPage };