import Loader from 'react-loader-spinner'

import MovieCard from '../MovieCard'
import NavBar from '../NavBar'
import Pagination from '../Pagination'

import SearchMoviesContext from '../../context/SearchMoviesContext'

import './index.css'

const SearchQuery = () => {
  const renderEmptyView = () => (
    <div className="empty-view-container">
      <div className="empty-icon">🔍</div>

      <h1 className="empty-title">
        No results found
      </h1>

      <p className="empty-description">
        We couldn't find any movies matching your search.
      </p>

      <p className="empty-hint">
        Try searching with a different movie name.
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

  const renderMoviesList = searchResponse => {
    const {results = []} = searchResponse

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
  }

  const renderSearchResultViews = value => {
    const {
      searchResponse,
      apiStatus,
    } = value

    switch (apiStatus) {
      case 'IN_PROGRESS':
        return renderLoadingView()

      case 'SUCCESS':
        return renderMoviesList(searchResponse)

      default:
        return renderEmptyView()
    }
  }

  return (
    <SearchMoviesContext.Consumer>
      {value => {
        const {
          searchResponse,
          onTriggerSearchingQuery,
        } = value

        return (
          <>
            <NavBar />

            <main className="route-page-body">
              {renderSearchResultViews(value)}
            </main>

            {searchResponse.totalPages > 0 && (
              <Pagination
                totalPages={searchResponse.totalPages}
                apiCallback={onTriggerSearchingQuery}
              />
            )}
          </>
        )
      }}
    </SearchMoviesContext.Consumer>
  )
}

export default SearchQuery
