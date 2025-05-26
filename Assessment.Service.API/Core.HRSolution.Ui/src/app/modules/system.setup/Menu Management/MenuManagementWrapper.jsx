
// import { PageTitle } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import {useAuth} from '../../auth'
import {
  MenuTable,
} from './components/tables/MenuTable'
import React from 'react';

const MenuManagementPage = () => {
  const {currentUser} = useAuth()

  return(
  <>
    <ToolbarWrapper title="Menu Management" subtitle="System Setup" />
    <Content>
      <MenuTable className='mb-5 mb-xl-8' />
    </Content>
  </>
  )
  
}

const MenuManagementWrapper = () => {
  return (
    <>
      {/* <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.RoleManagement' })}</PageTitle> */}
      <MenuManagementPage />
    </>
  )
}

export { MenuManagementWrapper }
