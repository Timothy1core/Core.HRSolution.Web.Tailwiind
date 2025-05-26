
import {useEffect, useRef, useState} from 'react'
import {SearchComponent} from '../../../assets/ts/components'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'

const Search = () => {
  const [menuState, setMenuState] = useState('main')
  const element = useRef(null)
  const wrapperElement = useRef(null)
  const resultsElement = useRef(null)
  const suggestionsElement = useRef(null)
  const emptyElement = useRef(null)

  const processs = (search) => {
    setTimeout(function () {
      const number = Math.floor(Math.random() * 6) + 1

      // Hide recently viewed
      suggestionsElement.current.classList.add('d-none')

      if (number === 3) {
        // Hide results
        resultsElement.current.classList.add('d-none')
        // Show empty message
        emptyElement.current.classList.remove('d-none')
      } else {
        // Show results
        resultsElement.current.classList.remove('d-none')
        // Hide empty message
        emptyElement.current.classList.add('d-none')
      }

      // Complete search
      search.complete()
    }, 1500)
  }

  const clear = () => {
    // Show recently viewed
    suggestionsElement.current.classList.remove('d-none')
    // Hide results
    resultsElement.current.classList.add('d-none')
    // Hide empty message
    emptyElement.current.classList.add('d-none')
  }

  useEffect(() => {
    // Initialize search handler
    const searchObject = SearchComponent.createInstance('#kt_header_search')

    // Search handler
    searchObject.on('kt.search.process', processs)

    // Clear handler
    searchObject.on('kt.search.clear', clear)
  }, [])

  return (
    <>
      <div
        id='kt_header_search'
        className='d-flex align-items-stretch'
        data-kt-search-keypress='true'
        data-kt-search-min-length='2'
        data-kt-search-enter='enter'
        data-kt-search-layout='menu'
        data-kt-menu-trigger='auto'
        data-kt-menu-overflow='false'
        data-kt-menu-permanent='true'
        data-kt-menu-placement='bottom-end'
        ref={element}
      >
        <div
          className='d-flex align-items-center'
          data-kt-search-element='toggle'
          id='kt_header_search_toggle'
        >
          <div className='btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px'>
            <KTIcon iconName='magnifier' className='fs-2' />
          </div>
        </div>

        <div
          data-kt-search-element='content'
          className='menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px'
        >
          <div
            className={`${menuState === 'main' ? '' : 'd-none'}`}
            ref={wrapperElement}
            data-kt-search-element='wrapper'
          >
            <form
              data-kt-search-element='form'
              className='w-100 position-relative mb-3'
              autoComplete='off'
            >
              <KTIcon
                iconName='magnifier'
                className='fs-2 text-lg-1 text-gray-500 position-absolute top-50 translate-middle-y ms-0'
              />

              <input
                type='text'
                className='form-control form-control-flush ps-10'
                name='search'
                placeholder='Search...'
                data-kt-search-element='input'
              />

              <span
                className='position-absolute top-50 end-0 translate-middle-y lh-0 d-none me-1'
                data-kt-search-element='spinner'
              >
                <span className='spinner-border h-15px w-15px align-middle text-gray-500' />
              </span>

              <span
                className='btn btn-flush btn-active-color-primary position-absolute top-50 end-0 translate-middle-y lh-0 d-none'
                data-kt-search-element='clear'
              >
                <KTIcon iconName='cross' className='fs-2 text-lg-1 me-0' />
              </span>

              <div
                className='position-absolute top-50 end-0 translate-middle-y'
                data-kt-search-element='toolbar'
              >
                <div
                  data-kt-search-element='preferences-show'
                  className='btn btn-icon w-20px btn-sm btn-active-color-primary me-1'
                  data-bs-toggle='tooltip'
                  onClick={() => {
                    setMenuState('preferences')
                  }}
                  title='Show search preferences'
                >
                  <KTIcon iconName='setting-2' className='fs-1' />
                </div>

                <div
                  data-kt-search-element='advanced-options-form-show'
                  className='btn btn-icon w-20px btn-sm btn-active-color-primary'
                  data-bs-toggle='tooltip'
                  onClick={() => {
                    setMenuState('advanced')
                  }}
                  title='Show more search options'
                >
                  <KTIcon iconName='down' className='fs-2' />
                </div>
              </div>
            </form>

            <div ref={resultsElement} data-kt-search-element='results' className='d-none'>
              <div className='scroll-y mh-200px mh-lg-350px'>
                <h3 className='fs-5 text-muted m-0 pb-5' data-kt-search-element='category-title'>
                  Users
                </h3>

                <a
                  href='/#'
                  className='d-flex text-gray-900 text-hover-primary align-items-center mb-5'
                >
                  <div className='symbol symbol-40px me-4'>
                    <img src={toAbsoluteUrl('media/avatars/300-6.jpg')} alt='' />
                  </div>

                  <div className='d-flex flex-column justify-content-start fw-bold'>
                    <span className='fs-6 fw-bold'>Karina Clark</span>
                    <span className='fs-7 fw-bold text-muted'>Marketing Manager</span>
                  </div>
                </a>
                {/* <!-- Other repeated elements --> */}
              </div>
            </div>
            {/* <!-- Additional JSX code --> */}
          </div>
        </div>
      </div>
    </>
  )
}

export {Search}
