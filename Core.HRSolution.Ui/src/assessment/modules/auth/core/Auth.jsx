/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext } from 'react'
// import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import * as authHelper from './helpers/AuthHelpers'
import { getCandidateByToken } from './requests/_requests'

// Define the context properties without TypeScript annotations
const AuthContextProps = {
  auth: undefined,
  saveAuth: (auth) => {},
  currentUser: undefined,
  setCurrentUser: (user) => {},
  logout: () => {}
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
}

// Create the AuthContext
const AuthContext = createContext(initAuthContextPropsState)

const useAuth = () => {
  return useContext(AuthContext)
}

// AuthProvider component with token handling
const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState(undefined)

  const saveAuth = (auth) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const logout = () => {
    saveAuth(undefined)
    setCurrentUser(undefined)
  }

  return (
    <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// AuthInit component to handle user initialization
const AuthInit = ({ children }) => {
  const { auth, setCurrentUser, logout } = useAuth()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  // Fetch the user based on auth token
  useEffect(() => {
    const requestUser = async () => {
      try {
        if (auth && auth.token) {
          const { data } = await getCandidateByTokenRevalidate(auth.token)
          if (data) { 
            setCurrentUser(data)
          }
        }
      } catch (error) {
        console.error(error)
        logout()
      } finally {
        setShowSplashScreen(false)
      }
    }

    if (auth && auth.token) {
      requestUser()
    } else {
      logout()
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return <>{children}</>

  // return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export { AuthProvider, AuthInit, useAuth }
