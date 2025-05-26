
// import { PageTitle } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import {useAuth} from '../../auth'
import {
  ApiTable,
} from './components/tables/ApiTable'
import React from 'react';


const ApiManagementPage = () => {
  const {currentUser} = useAuth()
  return(
  <>
    <ToolbarWrapper title="Api Management" subtitle="System Setup" />
    <Content>
    <ApiTable className='mb-5 mb-xl-8'/>
    </Content>
    
  </>
  )
  
}

const ApiManagementWrapper = () => {

  return (
    <>
      <ApiManagementPage />
    </>
  )
}

export { ApiManagementWrapper }
