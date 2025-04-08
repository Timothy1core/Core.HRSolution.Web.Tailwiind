/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { createContext, useContext, useEffect, useState } from 'react'

// PageLink interface replaced with standard JavaScript structure
const PageDataContext = createContext({
  setPageTitle: (_title) => {},
  setPageBreadcrumbs: (_breadcrumbs) => {},
  setPageDescription: (_description) => {},
})

const PageDataProvider = ({ children }) => {
  const [pageTitle, setPageTitle] = useState('')
  const [pageDescription, setPageDescription] = useState('')
  const [pageBreadcrumbs, setPageBreadcrumbs] = useState([])

  const value = {
    pageTitle,
    setPageTitle,
    pageDescription,
    setPageDescription,
    pageBreadcrumbs,
    setPageBreadcrumbs,
  }

  return (
    <PageDataContext.Provider value={value}>
      {children}
    </PageDataContext.Provider>
  )
}

function usePageData() {
  return useContext(PageDataContext)
}

const PageTitle = ({ children, description, breadcrumbs }) => {
  const { setPageTitle, setPageDescription, setPageBreadcrumbs } = usePageData()

  useEffect(() => {
    if (children) {

      setPageTitle(children.toString())
    }
    return () => {
      setPageTitle('Test')
    }
  }, [children])

  useEffect(() => {
    if (description) {
      setPageDescription(description)
    }
    return () => {
      setPageDescription('')
    }
  }, [description])

  useEffect(() => {
    if (breadcrumbs) {
      setPageBreadcrumbs(breadcrumbs)
    }
    return () => {
      setPageBreadcrumbs([])
    }
  }, [breadcrumbs])

  return null
}

const PageDescription = ({ children }) => {
  const { setPageDescription } = usePageData()

  useEffect(() => {
    if (children) {
      setPageDescription(children.toString())
    }
    return () => {
      setPageDescription('')
    }
  }, [children])

  return null
}

export { PageDescription, PageTitle, PageDataProvider, usePageData }
