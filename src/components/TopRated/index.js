import React from 'react'
import Loader from 'react-loader-spinner'

import MovieCard from '../MovieCard'
import NavBar from '../NavBar'
import Pagination from '../Pagination'

import './index.css'

class TopRated extends React.Component {
  state = {
    isLoading: true,
    topRatedMovieResponse: {},
  }

  componentDidMount() {
    this.getTopRatedMoviesResponse()
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

  getTopRatedMoviesResponse = async (page = 1) => {
    this.setState({
      isLoading: true,
    })

    const API_KEY = 'f32b79895b21468afbdd6d5342cbf3da'

    const apiUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`

    try {
      const response = await fetch(apiUrl)

      const data = await response.json()

      const newData = this.getUpdatedData(data)

      this.setState({
        isLoading: false,
        topRatedMovieResponse: newData,
      })
    } catch (error) {
      this.setState({
        isLoading: false,
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
        Loading top rated movies...
      </p>
    </div>
  )

  renderTopRatedMoviesList = () => {
    const {topRatedMovieResponse} = this.state

    const {results = []} = topRatedMovieResponse

    return (
      <div className="top-rated-content">
        <div className="section-header">
          <h1 className="route-heading">
            Top Rated Movies
          </h1>

          <p className="section-description">
            The highest rated movies on movieDB
          </p>
        </div>

        {results.length > 0 ? (
          <ul className="movie-list-container">
            {results.map(movie => (
              <MovieCard
                key={movie.id}
                movieDetails={movie}
              />
            ))}
          </ul>
        ) : (
          <div className="empty-container">
            <h1>No movies found</h1>
          </div>
        )}
      </div>
    )
  }

  render() {
    const {
      isLoading,
      topRatedMovieResponse,
    } = this.state

    return (
      <>
        <NavBar />

        <main className="route-page-body">
          {isLoading
            ? this.renderLoadingView()
            : this.renderTopRatedMoviesList()}
        </main>

        {!isLoading &&
          topRatedMovieResponse.totalPages && (
            <Pagination
              totalPages={topRatedMovieResponse.totalPages}
              apiCallback={this.getTopRatedMoviesResponse}
            />
          )}
      </>
    )
  }
}

export default TopRated
