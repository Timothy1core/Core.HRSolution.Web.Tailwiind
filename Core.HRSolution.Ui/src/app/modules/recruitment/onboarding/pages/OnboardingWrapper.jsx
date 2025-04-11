import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../_metronic/layout/components/content'
import React from 'react';
import { VerticalNavBar } from '../components/navs/vertical_navbar';
import { ProfileRow } from '../components/profile/profile_row';
import { OnboardingTable } from '../components/tables/OnboardingTable';

const OnboardingPage = () => {

  return(
  <>
    <Content>
      <OnboardingTable className='' />
      {/* <ProfileRow />
      <VerticalNavBar /> */}
    </Content>
  </>
  )
  
}

const OnboardingWrapper = () => {
  return (
    <>
      <OnboardingPage />
    </>
  )
}

export { OnboardingWrapper }
