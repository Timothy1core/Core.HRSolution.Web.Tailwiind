import {Route, Routes} from 'react-router-dom'
import {ForgotPassword} from '../modules/auth/components/ForgotPassword'
import {Login} from '../modules/auth/components/Login'
import {AuthLayout} from '../modules/auth/components/AuthLayout'

const AuthPage = () => (
  <Routes>
    <Route element={<AuthLayout />}>
      <Route path='login' element={<Login />} />
      <Route path='forgot-password' element={<ForgotPassword />} />
      <Route index element={<Login />} />
    </Route>
  </Routes>
)

export {AuthPage}
