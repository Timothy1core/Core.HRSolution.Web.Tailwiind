import { Fragment } from 'react';
import { Container } from '@/_metronic/components/container';
import { toAbsoluteUrl } from '@/_metronic/utils/Assets';
import { KeenIcon } from '@/_metronic/components';
import { UserProfileHero } from '@/_metronic/partials/heros';
import { Navbar, NavbarActions, NavbarDropdown } from '@/_metronic/partials/navbar';
import { PageMenu } from '@/_metronic/pages/public-profile';
import { ProfileGamerContent } from '.';
const ProfileGamerPage = () => {
  const image = <img src={toAbsoluteUrl('/media/avatars/300-27.png')} className="rounded-full border-3 border-success size-[100px] shrink-0" />;
  return <Fragment>
      <UserProfileHero name="Floyd Miles" image={image} info={[{
      label: 'SF, Bay Area',
      icon: 'geolocation'
    }, {
      label: 'floydgg',
      icon: 'twitch'
    }, {
      email: 'Level 22',
      icon: 'ocus'
    }]} />

      <Container>
        <Navbar>
          <PageMenu />

          <NavbarActions>
            <button className="dropdown-toggle btn btn-sm btn-primary">
              <KeenIcon icon="users" /> Connect
            </button>
            <button className="dropdown-toggle btn btn-sm btn-light">
              <KeenIcon icon="plus-squared" /> Invite to Team
            </button>
            <button className="btn btn-sm btn-icon btn-light">
              <KeenIcon icon="messages" />
            </button>
            <NavbarDropdown />
          </NavbarActions>
        </Navbar>
      </Container>

      <Container>
        <ProfileGamerContent />
      </Container>
    </Fragment>;
};
export { ProfileGamerPage };