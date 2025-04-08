/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, createContext, useContext,useCallback  } from 'react'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import * as authHelper from './helpers/AuthHelpers'
import { getUserByToken } from './requests/_requests'
import { getCandidateByToken } from '../../../../assessment/modules/auth/core/requests/_requests'

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

  const stableSetCurrentUser = useCallback(setCurrentUser, [])
  const stableLogout = useCallback(logout, [])

  useEffect(() => {
    let isMounted = true // Avoid state updates if component unmounts during fetch

    const fetchUserData = async () => {
      try {
        if (auth?.token) {
          const [userResponse, candidateResponse] = await Promise.allSettled([
            auth?.isCore ? getUserByToken(auth.token) : getCandidateByToken(auth.token)
          ])

          if (isMounted) {
            if (userResponse.status === 'fulfilled' && userResponse.value?.data) {
              stableSetCurrentUser(userResponse.value.data)
            } else if (candidateResponse.status === 'fulfilled' && candidateResponse.value?.data) {
              stableSetCurrentUser(candidateResponse.value.data)
            } else {
              throw new Error('No valid user or candidate data')
            }
          }
        }
      } catch (error) {
        console.error('AuthInit Error:', error)
        if (isMounted) {
          stableLogout()
        }
      } finally {
        if (isMounted) {
          setShowSplashScreen(false)
        }
      }
    }

    if (auth?.token) {
      fetchUserData()
    } else {
      stableLogout()
      setShowSplashScreen(false)
    }

    return () => {
      isMounted = false // Cleanup on unmount
    }
  }, [auth?.token, stableSetCurrentUser, stableLogout])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export { AuthProvider, AuthInit, useAuth }
