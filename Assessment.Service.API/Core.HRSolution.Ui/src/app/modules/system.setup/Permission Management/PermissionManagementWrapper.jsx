
// import { PageTitle } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import {useAuth} from '../../auth'
import {
  PermissionTable,
} from './components/tables/PermissionTable'
import React from 'react';


const PermissionManagementPage = () => {
  const {currentUser} = useAuth()
  return(
  <>
    <ToolbarWrapper title="Permission Management" subtitle="System Setup" />
    <Content>
    <PermissionTable className='mb-5 mb-xl-8'/>
    </Content>
    
  </>
  )
  
}

const PermissionManagementWrapper = () => {

  return (
    <>
      <PermissionManagementPage />
    </>
  )
}

export { PermissionManagementWrapper }
