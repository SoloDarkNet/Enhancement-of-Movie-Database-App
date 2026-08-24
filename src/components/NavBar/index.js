import {useState} from 'react'
import {Link, withRouter} from 'react-router-dom'

import SearchMoviesContext from '../../context/SearchMoviesContext'

import './index.css'

const NavBar = props => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const renderSearchBar = () => (
    <SearchMoviesContext.Consumer>
      {value => {
        const {
          onTriggerSearchingQuery,
          onChangeSearchInput,
          searchInput,
        } = value

        const onChangeHandler = event => {
          onChangeSearchInput(event.target.value)
        }

        const onSearchHandler = event => {
          event.preventDefault()

          const {history} = props

          if (!searchInput.trim()) {
            return
          }

          onTriggerSearchingQuery()

          setIsMenuOpen(false)

          history.push('/search')
        }

        return (
          <form className="search-container" onSubmit={onSearchHandler}>
            <span className="search-icon">⌕</span>

            <input
              type="text"
              className="search-input"
              onChange={onChangeHandler}
              value={searchInput}
              placeholder="Search movies, shows..."
              aria-label="Search movies"
            />

            <button className="search-button" type="submit" aria-label="Search">
              Search
            </button>
          </form>
        )
      }}
    </SearchMoviesContext.Consumer>
  )

  const handleNavClick = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar-container">
      <div className="navbar-inner">
        {/* Logo */}

        <Link to="/" className="logo-container" onClick={handleNavClick}>
          <span className="logo-mark">M</span>

          <span className="page-logo">
            Movie<span>DB</span>
          </span>
        </Link>

        {/* Desktop Navigation */}

        <div className={`navbar-content ${isMenuOpen ? 'menu-open' : ''}`}>
          <ul className="nav-items-list">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleNavClick}>
                <span>Home</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/top-rated"
                onClick={handleNavClick}
              >
                <span>Top Rated</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className="nav-link"
                to="/upcoming"
                onClick={handleNavClick}
              >
                <span>Upcoming</span>
              </Link>
            </li>
          </ul>

          {/* Search */}

          <div className="navbar-search">{renderSearchBar()}</div>
        </div>

        {/* Mobile Menu */}

        <button
          type="button"
          className={`menu-button ${isMenuOpen ? 'menu-active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}

export default withRouter(NavBar)
