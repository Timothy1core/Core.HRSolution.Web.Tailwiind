import { Fragment } from 'react';
import { Container } from '@/_metronic/components/container';
import { toAbsoluteUrl } from '@/_metronic/utils/Assets';
import { KeenIcon } from '@/_metronic/components';
import { UserProfileHero } from '@/_metronic/partials/heros';
import { Navbar, NavbarActions, NavbarDropdown } from '@/_metronic/partials/navbar';
import { PageMenu } from '@/_metronic/pages/public-profile';
import { Works } from './blocks';
const ProfileWorksPage = () => {
  const image = <img src={toAbsoluteUrl('/media/avatars/300-1.png')} className="rounded-full border-3 border-success h-[100px] shrink-0" />;
  return <Fragment>
      <UserProfileHero name="Jenny Klabber" image={image} info={[{
      label: 'KeenThemes',
      icon: 'abstract'
    }, {
      label: 'SF, Bay Area',
      icon: 'geolocation'
    }, {
      email: 'jenny@kteam.com',
      icon: 'sms'
    }]} />

      <Container>
        <Navbar>
          <PageMenu />
          <NavbarActions>
            <button type="button" className="btn btn-sm btn-primary">
              <KeenIcon icon="users" /> Connect
            </button>
            <button className="btn btn-sm btn-icon btn-light">
              <KeenIcon icon="messages" />
            </button>
            <NavbarDropdown />
          </NavbarActions>
        </Navbar>
      </Container>

      <Container>
        <Works />
      </Container>
    </Fragment>;
};
export { ProfileWorksPage };