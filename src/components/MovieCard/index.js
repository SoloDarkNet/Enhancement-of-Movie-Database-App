import {Link} from 'react-router-dom'
import './index.css'

const MovieCard = props => {
  const {movieDetails} = props
  const {id, title, posterPath, voteAverage} = movieDetails

  return (
    <li className="movie-card">
      <Link to={`/movie/${id}`} className="movie-card-link">
        <div className="movie-poster-container">
          <img
            className="movie-card-image"
            src={posterPath}
            alt={title}
          />

          <div className="movie-overlay">
            <span className="rating-badge">
              ⭐ {voteAverage}
            </span>

            <button
              className="view-details-btn"
              type="button"
            >
              View Details
            </button>
          </div>
        </div>

        <div className="movie-info">
          <h1 className="movie-title">{title}</h1>
          <p className="movie-rating">
            ⭐ {voteAverage}
          </p>
        </div>
      </Link>
    </li>
  )
}

export default MovieCard
