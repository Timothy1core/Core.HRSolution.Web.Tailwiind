import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react'
import qs from 'qs'

// Function to create response context
function createResponseContext(initialState) {
  return createContext(initialState)
}

// Function to check if an object is not empty
function isNotEmpty(obj) {
  return obj !== undefined && obj !== null && obj !== ''
}

// Function to stringify request query
function stringifyRequestQuery(state) {
  const pagination = qs.stringify(state, { filter: ['page', 'items_per_page'], skipNulls: true })
  const sort = qs.stringify(state, { filter: ['sort', 'order'], skipNulls: true })
  const search = isNotEmpty(state.search)
    ? qs.stringify(state, { filter: ['search'], skipNulls: true })
    : ''

  const filter = state.filter
    ? Object.entries(state.filter)
        .filter((obj) => isNotEmpty(obj[1]))
        .map((obj) => `filter_${obj[0]}=${obj[1]}`)
        .join('&')
    : ''

  return [pagination, sort, search, filter]
    .filter((f) => f)
    .join('&')
    .toLowerCase()
}

// Function to parse request query
function parseRequestQuery(query) {
  const cache = qs.parse(query)
  return cache
}

// Function to check if grouping is disabled
function calculatedGroupingIsDisabled(isLoading, data = []) {
  if (isLoading) {
    return true
  }

  return !data || !data.length
}

// Function to calculate if all data is selected
function calculateIsAllDataSelected(data = [], selected = []) {
  if (!data) {
    return false
  }

  return data.length > 0 && data.length === selected.length
}

// Function to handle selecting an item
function groupingOnSelect(id, selected, setSelected) {
  if (!id) {
    return
  }

  if (selected.includes(id)) {
    setSelected(selected.filter((itemId) => itemId !== id))
  } else {
    const updatedSelected = [...selected, id]
    setSelected(updatedSelected)
  }
}

// Function to handle selecting all items
function groupingOnSelectAll(isAllSelected, setSelected, data = []) {
  if (isAllSelected) {
    setSelected([])
    return
  }

  if (!data || !data.length) {
    return
  }

  setSelected(data.filter((item) => item.id).map((item) => item.id))
}

// Custom hook to debounce a value
function useDebounce(value, delay) {
  // State and setter for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export {
  createResponseContext,
  stringifyRequestQuery,
  parseRequestQuery,
  calculatedGroupingIsDisabled,
  calculateIsAllDataSelected,
  groupingOnSelect,
  groupingOnSelectAll,
  useDebounce,
  isNotEmpty,
}
