import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

// Create the Splash Screen context
const MetronicSplashScreenContext = createContext(undefined)

const MetronicSplashScreenProvider = ({children}) => {
  const [count, setCount] = useState(0)
  const visible = count > 0

  useEffect(() => {
    // Show SplashScreen
    if (visible) {
      document.body.classList.remove('page-loading')

      return () => {
        document.body.classList.add('page-loading')
      }
    }

    // Hide SplashScreen
    let timeout
    if (!visible) {
      timeout = window.setTimeout(() => {
        document.body.classList.add('page-loading')
      }, 3000)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [visible])

  return (
    <MetronicSplashScreenContext.Provider value={setCount}>
      {children}
    </MetronicSplashScreenContext.Provider>
  )
}

const LayoutSplashScreen = ({visible = true}) => {
  // Access the setCount function from context
  const setCount = useContext(MetronicSplashScreenContext)

  useEffect(() => {
    if (!visible) {
      return
    }

    if (setCount) {
      setCount((prev) => prev + 1)
    }

    return () => {
      if (setCount) {
        setCount((prev) => prev - 1)
      }
    }
  }, [setCount, visible])

  return null
}

export { MetronicSplashScreenProvider, LayoutSplashScreen }
