import {useContext, useMemo} from 'react'
import Loader from 'react-loader-spinner'

import MovieCard from '../MovieCard'
import NavBar from '../NavBar'
import Pagination from '../Pagination'

import SearchMoviesContext from '../../context/SearchMoviesContext'

import './index.css'

const SearchQuery = () => {
  const {
    searchResponse,
    apiStatus,
    onTriggerSearchingQuery,
    currentPage,
  } = useContext(SearchMoviesContext)

  const results = useMemo(
    () => searchResponse?.results || [],
    [searchResponse],
  )

  const totalPages =
    searchResponse?.totalPages || 0

  const renderEmptyView = () => (
    <div className="empty-view-container">

      <div className="empty-icon">
        🔍
      </div>

      <h1 className="empty-title">
        No results found
      </h1>

      <p className="empty-description">
        We couldn&apos;t find any movies
        matching your search.
      </p>

      <p className="empty-hint">
        Try searching with a different
        movie name.
      </p>

    </div>
  )

  const renderLoadingView = () => (
    <div className="loader-container">

      <Loader
        type="TailSpin"
        color="#00c6ff"
        height={50}
        width={50}
      />

      <p className="loading-text">
        Searching movies...
      </p>

    </div>
  )

  const renderSearchResultViews = () => {
    switch (apiStatus) {
      case 'IN_PROGRESS':
        return renderLoadingView()

      case 'SUCCESS':
        if (!results.length) {
          return renderEmptyView()
        }

        return (
          <ul className="search-movies-list">
            {results.map(movie => (
              <MovieCard
                key={movie.id}
                movieDetails={movie}
              />
            ))}
          </ul>
        )

      case 'FAILURE':
        return (
          <div className="empty-view-container">
            <h1>Something went wrong</h1>
            <p>
              Unable to load search results.
            </p>
          </div>
        )

      default:
        return renderEmptyView()
    }
  }

  return (
    <>
      <NavBar />

      <main className="route-page-body">
        {renderSearchResultViews()}
      </main>

      {results.length > 0 &&
        totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            apiCallback={onTriggerSearchingQuery}
          />
        )}
    </>
  )
}

export default SearchQuery