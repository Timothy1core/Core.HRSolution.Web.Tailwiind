import {useLayout} from '../../../core'
import {PageTitle} from './PageTitle'

const PageTitleWrapper = () => {
  const {config} = useLayout()
  console.log('config', config)
  if (!config.app?.pageTitle?.display) {
    return 'null'
  }

  return <PageTitle />
}

export {PageTitleWrapper}
