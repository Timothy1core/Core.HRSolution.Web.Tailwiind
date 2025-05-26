
// import { PageTitle } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import {useAuth} from '../../auth'
import {
  RoleTable,
} from './components/tables/RoleTable'
import React from 'react';


const RoleManagementPage = () => {
  const {currentUser} = useAuth()
  return(
  <>
    <ToolbarWrapper title="Role Management" subtitle="System Setup" />
    <Content>
    <RoleTable className='mb-5 mb-xl-8'/>
    </Content>
    
  </>
  )
  
}

const RoleManagementWrapper = () => {

  return (
    <>
      {/* <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.RoleManagement' })}</PageTitle> */}
      <RoleManagementPage />
    </>
  )
}

export { RoleManagementWrapper }
