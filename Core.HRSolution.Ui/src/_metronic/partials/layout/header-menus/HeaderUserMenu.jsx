import {Link} from 'react-router-dom'
import {useAuth} from '../../../../app/modules/auth'
import {toAbsoluteUrl} from '../../../helpers'

const HeaderUserMenu = () => {
  const {currentUser, logout} = useAuth()
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-danger fw-bold py-4 fs-6 w-375px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img alt='Logo' src={toAbsoluteUrl('media/profile/user-male.png')} />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bold d-flex align-items-center fs-5'>
              {currentUser?.loggedUser ? currentUser?.loggedUser.fullName : currentUser.loggedCandidate.fullName}
            </div>
            <a href='#' className='fw-bold text-muted text-hover-danger fs-7'>
              {currentUser?.loggedUser ? currentUser?.loggedUser.emailAddress : currentUser.loggedCandidate.email}
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5'>
        <Link to={'/crafted/pages/profile'} className='menu-link px-5'>
          My Profile
        </Link>
      </div>

      

     

      <div className='separator my-2'></div>

     
      <div className='menu-item px-5 my-1'>
        <Link to='/crafted/account/settings' className='menu-link px-5'>
          Change Password
        </Link>
      </div>

      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          Sign Out
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
