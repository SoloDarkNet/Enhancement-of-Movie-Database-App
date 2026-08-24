import {useEffect, useState} from 'react'
import {Link, useParams} from 'react-router-dom'

import NavBar from '../NavBar'

import './index.css'

const API_KEY = 'f32b79895b21468afbdd6d5342cbf3da'

const MovieDetails = () => {
  const {id} = useParams()

  const [movie, setMovie] = useState(null)
  const [trailerKey, setTrailerKey] = useState('')

  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const getMovieDetails = async () => {
      setIsLoading(true)
      setHasError(false)

      try {
        // Movie details API
        const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`

        // Movie videos / trailers API
        const videosUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}&language=en-US`

        // Both APIs at the same time
        const [movieResponse, videosResponse] = await Promise.all([
          fetch(movieUrl),
          fetch(videosUrl),
        ])

        if (!movieResponse.ok || !videosResponse.ok) {
          throw new Error('Failed to fetch movie data')
        }

        const movieData = await movieResponse.json()
        const videosData = await videosResponse.json()

        // Find YouTube trailer
        const trailer = videosData.results.find(
          video =>
            video.site === 'YouTube' &&
            video.type === 'Trailer' &&
            video.official === true,
        )

        // If official trailer is not available,
        // find any YouTube trailer
        const youtubeTrailer =
          trailer ||
          videosData.results.find(
            video => video.site === 'YouTube' && video.type === 'Trailer',
          )

        setMovie(movieData)

        setTrailerKey(youtubeTrailer ? youtubeTrailer.key : '')
      } catch (error) {
        console.error(error)

        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    getMovieDetails()
  }, [id])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="movie-details-status">
          <p>Loading movie details...</p>
        </div>
      )
    }

    if (hasError || !movie) {
      return (
        <div className="movie-details-status">
          <h1>Something went wrong</h1>

          <p>We couldn&apos;t load this movie.</p>

          <Link className="back-to-movies" to="/">
            Back to movies
          </Link>
        </div>
      )
    }

    const backdropPath = movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
      : ''

    const posterPath = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image'

    return (
      <>
        <article className="movie-details-card">
          {/* Backdrop */}

          {backdropPath && (
            <img className="movie-details-backdrop" src={backdropPath} alt="" />
          )}

          {/* Movie information */}

          <div className="movie-details-content">
            <img
              className="movie-details-poster"
              src={posterPath}
              alt={movie.title}
            />

            <div className="movie-details-copy">
              <h1>{movie.title}</h1>

              <p className="movie-details-rating">⭐ {movie.vote_average}</p>

              <p>{movie.overview || 'No overview available.'}</p>

              <p className="movie-details-meta">
                {movie.release_date || 'Release date unavailable'}

                {movie.runtime ? ` | ${movie.runtime} min` : ''}
              </p>

              <Link className="back-to-movies" to="/">
                Back to movies
              </Link>
            </div>
          </div>
        </article>

        {/* Trailer */}

        <section className="movie-trailer-section">
          <h2>Official Trailer</h2>

          {trailerKey ? (
            <div className="trailer-container">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}`}
                title={`${movie.title} Official Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="no-trailer">
              <p>Trailer not available for this movie.</p>
            </div>
          )}
        </section>
      </>
    )
  }

  return (
    <>
      <NavBar />

      <main className="movie-details-page">{renderContent()}</main>
    </>
  )
}

export default MovieDetails
