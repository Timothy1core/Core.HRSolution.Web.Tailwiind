

// ID type can be undefined, null, or a number
export const ID = undefined | null ;

// PaginationState type
export const PaginationState = {
  page: 1,
  items_per_page: 10, // Options: 10 | 30 | 50 | 100
  links: [], // Array of objects with label, active, url, and page
};

// SortState type
export const SortState = {
  sort: '', // Optional string
  order: 'asc', // Optional 'asc' | 'desc'
};

// FilterState type
export const FilterState = {
  filter: null, // Optional unknown value
};

// SearchState type
export const SearchState = {
  search: '', // Optional string
};

// Response type with generic T
export const Response = (data) => ({
  data: data || null,
  payload: {
    message: '',
    errors: {}, // Dictionary of errors
    pagination: PaginationState,
  },
});

// QueryState combining PaginationState, SortState, FilterState, and SearchState
export const QueryState = {
  ...PaginationState,
  ...SortState,
  ...FilterState,
  ...SearchState,
};

// QueryRequestContextProps
export const QueryRequestContextProps = {
  state: QueryState,
  updateState: () => {},
};

// Initial state for queries
export const initialQueryState = {
  page: 1,
  items_per_page: 10,
};

// Initial context for QueryRequest
export const initialQueryRequest = {
  state: initialQueryState,
  updateState: () => {},
};

// QueryResponseContextProps with generic T
export const QueryResponseContextProps = {
  response: undefined, // Response<Array<T>>
  refetch: () => {},
  isLoading: false,
  query: '',
};

// Initial context for QueryResponse
export const initialQueryResponse = {
  refetch: () => {},
  isLoading: false,
  query: '',
};

// ListViewContextProps
export const ListViewContextProps = {
  selected: [], // Array of IDs
  onSelect: () => {},
  onSelectAll: () => {},
  clearSelected: () => {},
  itemIdForUpdate: undefined, // NULL => (CREATION MODE) | MODAL IS OPENED
                             // NUMBER => (EDIT MODE) | MODAL IS OPENED
                             // UNDEFINED => MODAL IS CLOSED
  setItemIdForUpdate: () => {}, // Dispatch<SetStateAction<ID>>
  isAllSelected: false,
  disabled: false,
};

// Initial context for ListView
export const initialListView = {
  selected: [],
  onSelect: () => {},
  onSelectAll: () => {},
  clearSelected: () => {},
  setItemIdForUpdate: () => {},
  isAllSelected: false,
  disabled: false,
};
