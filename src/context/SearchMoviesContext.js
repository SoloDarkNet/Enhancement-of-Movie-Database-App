import {createContext} from 'react'

const SearchMoviesContext = createContext({
  searchResponse: {},
  apiStatus: 'INITIAL',
  searchInput: '',
  searchQuery: '',
  onTriggerSearchingQuery: () => {},
  onChangeSearchInput: () => {},
})

export default SearchMoviesContext
