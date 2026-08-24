import React from 'react'
import Loader from 'react-loader-spinner'

import MovieCard from '../MovieCard'
import NavBar from '../NavBar'
import Pagination from '../Pagination'

import './index.css'

class Popular extends React.Component {
  state = {
    isLoading: true,
    popularMovieResponse: {},
    hasError: false,
  }

  componentDidMount() {
    this.getPopularMoviesResponse()
  }

  getUpdatedData = responseData => ({
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

  getPopularMoviesResponse = async (page = 1) => {
    this.setState({
      isLoading: true,
      hasError: false,
    })

    const API_KEY = 'f32b79895b21468afbdd6d5342cbf3da'

    const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`

    try {
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error('Failed to fetch movies')
      }

      const data = await response.json()

      const newData = this.getUpdatedData(data)

      this.setState({
        isLoading: false,
        popularMovieResponse: newData,
      })
    } catch (error) {
      this.setState({
        isLoading: false,
        hasError: true,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container">
      <Loader
        type="TailSpin"
        color="#00c6ff"
        height={50}
        width={50}
      />

      <p className="loading-text">
        Loading movies...
      </p>
    </div>
  )

  renderErrorView = () => (
    <div className="error-container">
      <h1>Something went wrong</h1>

      <p>
        We couldn't load the movies. Please try again.
      </p>

      <button
        type="button"
        className="retry-button"
        onClick={() => this.getPopularMoviesResponse()}
      >
        Try Again
      </button>
    </div>
  )

  renderPopularMoviesList = () => {
    const {popularMovieResponse} = this.state

    const {results = []} = popularMovieResponse

    if (results.length === 0) {
      return (
        <div className="empty-container">
          <h1>No movies found</h1>
        </div>
      )
    }

    return (
      <ul className="movie-list">
        {results.map(movie => (
          <MovieCard
            key={movie.id}
            movieDetails={movie}
          />
        ))}
      </ul>
    )
  }

  render() {
    const {
      isLoading,
      popularMovieResponse,
      hasError,
    } = this.state

    return (
      <>
        <NavBar />

        <main className="route-page-body">
          {isLoading
            ? this.renderLoadingView()
            : hasError
            ? this.renderErrorView()
            : this.renderPopularMoviesList()}
        </main>

        {!isLoading &&
          !hasError &&
          popularMovieResponse.totalPages && (
            <Pagination
              totalPages={popularMovieResponse.totalPages}
              apiCallback={this.getPopularMoviesResponse}
            />
          )}
      </>
    )
  }
}

export default Popular
