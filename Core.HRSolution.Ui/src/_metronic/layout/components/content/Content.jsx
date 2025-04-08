// import { useEffect } from 'react'
// import { useLocation } from 'react-router'
import clsx from 'clsx'
import { useLayout } from '../../core'
// import { DrawerComponent } from '../../../assets/ts/components'

const Content = ({ children }) => {
  const { config, classes } = useLayout()
  // const location = useLocation()

  // useEffect(() => {
  //   DrawerComponent.hideAll()
  // }, [location])

  const appContentContainer = config.app?.content?.container

  return (
    <div
      id='kt_app_content'
      className={clsx(
        'app-content flex-column-fluid pb-10',
        classes.content.join(' '),
        config?.app?.content?.class
      )}
    >
      {appContentContainer ? (
        <div
          id='kt_app_content_container'
          className={clsx('app-container', classes.contentContainer.join(' '), {
            'container-xxl': appContentContainer === 'fixed',
            'container-fluid': appContentContainer === 'fluid',
          })}
        >
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}

export { Content }
