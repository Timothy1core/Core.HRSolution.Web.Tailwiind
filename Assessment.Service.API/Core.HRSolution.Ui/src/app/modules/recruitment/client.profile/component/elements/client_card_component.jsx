
import {Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import { useThemeMode } from '../../../../../../_metronic/partials'

const ClientInfoCard = ({
  id,
  logo,
  status,
  clientCompanyName,
  industry,
  services,
  comanyGroup
}) => {
  const { mode } = useThemeMode()
  const cardBg = mode === 'light' ? 'abstract-2.svg' :'abstract-2-dark.svg'
  return (
    <Link
      to={`/recruitment/clientprofile/${id}`}
      className='card border border-1 border-gray-200 border-hover-dark bgi-no-repeat'
      style={{
        backgroundPosition: 'right top',
        backgroundSize: '50% auto',
        backgroundImage: `url(${toAbsoluteUrl(`media/svg/shapes/${cardBg}`)})`,
      }}
    >
      <div className='card-header border-0 pt-9'>
        <div className='card-title m-0'>
          <div className='symbol w-100 px-5 bg-gray-200'>
            <img src={logo} alt={logo} className='p-3 w-100' />
          </div>
        </div>
        <div className='card-toolbar'>
          <span className={`badge badge-light-primary fw-bolder me-auto px-4 py-3`}>
            {status}
          </span>
        </div>
      </div>

      <div className='card-body py-5'>
        <h4 className='fs-2 fw-bolder text-gray-900 mb-0'>{clientCompanyName}</h4>
        <p className='text-gray-500 fw-bold fs-7 mt-1 mb-3'>{industry}</p>
        <span className={`badge badge-dark me-1`}>
          {services}
        </span>
        <span className={`badge badge-dark`}>
          {comanyGroup}
        </span>
      </div>
    </Link>
  )
}

export {ClientInfoCard}
