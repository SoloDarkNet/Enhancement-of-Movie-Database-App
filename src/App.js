import {lazy, Suspense, useState} from 'react'
import {Route, Switch} from 'react-router-dom'

import SearchMoviesContext from './context/SearchMoviesContext'

import './App.css'


// API Key
const API_KEY = 'f32b79895b21468afbdd6d5342cbf3da'


// Lazy loaded components
const Popular = lazy(() => import('./components/Popular'))
const TopRated = lazy(() => import('./components/TopRated'))
const Upcoming = lazy(() => import('./components/Upcoming'))
const SearchQuery = lazy(() => import('./components/SearchQuery'))


// Loading UI
const LoadingView = () => (
  <div className="app-loader">
    <div className="spinner" />
    <p>Loading...</p>
  </div>
)


const App = () => {
  const [searchResponse, setSearchResponse] = useState({})
  const [apiStatus, setApiStatus] = useState('INITIAL')
  const [searchInput, setSearchInput] = useState('')


  // Search input
  const onChangeSearchInput = text => {
    setSearchInput(text)
  }


  // Convert API response
  const getUpdatedData = responseData => ({
    totalPages: responseData.total_pages,
    totalResults: responseData.total_results,

    results: responseData.results.map(eachMovie => ({
      id: eachMovie.id,

      posterPath: eachMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${eachMovie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image',

      voteAverage: eachMovie.vote_average,

      title: eachMovie.title,
    })),
  })


  // Search movies
  const onTriggerSearchingQuery = async (page = 1) => {
    if (!searchInput.trim()) {
      return
    }

    setApiStatus('IN_PROGRESS')

    try {
      const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
        searchInput,
      )}&page=${page}`

      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }

      const data = await response.json()

      setSearchResponse(getUpdatedData(data))

      setApiStatus('SUCCESS')
    } catch (error) {
      console.error(error)

      setApiStatus('FAILURE')
    }
  }


  return (
    <SearchMoviesContext.Provider
      value={{
        searchResponse,
        apiStatus,
        onTriggerSearchingQuery,
        searchInput,
        onChangeSearchInput,
      }}
    >
      <div className="App d-flex flex-column">

        <Suspense fallback={<LoadingView />}>
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

          </Switch>
        </Suspense>

      </div>
    </SearchMoviesContext.Provider>
  )
}


export default App
