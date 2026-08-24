import {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  Route,
  Switch,
} from 'react-router-dom'

import SearchMoviesContext from './context/SearchMoviesContext'

import './App.css'


const API_KEY =
  'f32b79895b21468afbdd6d5342cbf3da'


// Lazy loaded components

const Popular = lazy(
  () => import('./components/Popular'),
)

const TopRated = lazy(
  () => import('./components/TopRated'),
)

const Upcoming = lazy(
  () => import('./components/Upcoming'),
)

const SearchQuery = lazy(
  () => import('./components/SearchQuery'),
)

const MovieDetails = lazy(
  () => import('./components/MovieDetails'),
)


// Loading UI

const LoadingView = () => (
  <div className="app-loader">
    <div className="spinner" />
    <p>Loading...</p>
  </div>
)


// Normalize TMDB response

const getUpdatedData = responseData => ({
  totalPages:
    responseData.total_pages || 0,

  totalResults:
    responseData.total_results || 0,

  results: (
    responseData.results || []
  ).map(eachMovie => ({
    id: eachMovie.id,

    posterPath: eachMovie.poster_path
      ? `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image',

    voteAverage:
      eachMovie.vote_average,

    title:
      eachMovie.title,
  })),
})


const App = () => {

  const [searchResponse, setSearchResponse] =
    useState({})

  const [apiStatus, setApiStatus] =
    useState('INITIAL')

  const [searchInput, setSearchInput] =
    useState('')

  const [searchQuery, setSearchQuery] =
    useState('')

  // SINGLE SOURCE OF TRUTH

  const [currentPage, setCurrentPage] = useState(1)


  const searchInputRef =
    useRef('')

  const searchQueryRef =
    useRef('')

  const requestIdRef =
    useRef(0)

  const controllerRef =
    useRef(null)


  // Search input

  const onChangeSearchInput =
    useCallback(text => {

      searchInputRef.current = text

      setSearchInput(text)

    }, [])


  // Search / Pagination API

  const onTriggerSearchingQuery =
    useCallback(async (page = 1) => {

      const query =
        page === 1
          ? searchInputRef.current.trim()
          : searchQueryRef.current.trim()


      // Empty query

      if (!query) {
        return false
      }


      // Cancel previous request

      if (controllerRef.current) {
        controllerRef.current.abort()
      }


      // New search

      if (page === 1) {

        searchQueryRef.current =
          query

        setSearchQuery(query)

        // New search always starts
        // from page 1

        setCurrentPage(1)
      }


      // Request ID

      const requestId =
        requestIdRef.current + 1

      requestIdRef.current =
        requestId


      const controller =
        new AbortController()

      controllerRef.current =
        controller


      setApiStatus('IN_PROGRESS')


      try {

        const apiUrl =
          `https://api.themoviedb.org/3/search/movie` +
          `?api_key=${API_KEY}` +
          `&language=en-US` +
          `&query=${encodeURIComponent(query)}` +
          `&page=${page}`


        const response =
          await fetch(
            apiUrl,
            {
              signal:
                controller.signal,
            },
          )


        if (!response.ok) {
          throw new Error(
            'Failed to fetch search results',
          )
        }


        const data =
          await response.json()


        // Ignore old request

        if (
          requestId !==
          requestIdRef.current
        ) {
          return false
        }


        const updatedData =
          getUpdatedData(data)


        setSearchResponse(
          updatedData,
        )

        setApiStatus(
          'SUCCESS',
        )


        // IMPORTANT

        // Update page ONLY after
        // successful API response.

        setCurrentPage(page)


        return true

      } catch (error) {

        if (
          error.name ===
          'AbortError'
        ) {
          return false
        }


        if (
          requestId ===
          requestIdRef.current
        ) {
          setApiStatus(
            'FAILURE',
          )
        }


        return false

      } finally {

        if (
          controllerRef.current ===
          controller
        ) {
          controllerRef.current =
            null
        }

      }

    }, [])


  // Context value

  const contextValue =
    useMemo(
      () => ({
        searchResponse,

        apiStatus,

        onTriggerSearchingQuery,

        searchInput,

        searchQuery,

        onChangeSearchInput,

        currentPage,
      }),
      [
        searchResponse,
        apiStatus,
        onTriggerSearchingQuery,
        searchInput,
        searchQuery,
        onChangeSearchInput,
        currentPage,
      ],
    )


  return (
    <SearchMoviesContext.Provider
      value={contextValue}
    >

      <div className="App d-flex flex-column">

        <Suspense
          fallback={
            <LoadingView />
          }
        >

          <Switch>

            <Route
              exact
              path="/"
              component={Popular}
            />

            <Route
              exact
              path="/top-rated"
              component={TopRated}
            />

            <Route
              exact
              path="/upcoming"
              component={Upcoming}
            />

            <Route
              exact
              path="/search"
              component={SearchQuery}
            />

            <Route
              exact
              path="/movie/:id"
              component={MovieDetails}
            />

          </Switch>

        </Suspense>

      </div>

    </SearchMoviesContext.Provider>
  )
}

export default App