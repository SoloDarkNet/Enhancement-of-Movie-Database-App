import {Link, withRouter} from 'react-router-dom'

import SearchMoviesContext from '../../context/SearchMoviesContext'

import './index.css'

const NavBar = props => {
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

          if (searchInput.trim() === '') {
            return
          }

          onTriggerSearchingQuery()

          history.push('/search')
        }

        return (
          <form
            className="search-container"
            onSubmit={onSearchHandler}
          >
            <input
              type="text"
              className="search-input"
              onChange={onChangeHandler}
              value={searchInput}
              placeholder="Search movies..."
            />

            <button
              className="search-button"
              type="submit"
            >
              🔍
            </button>
          </form>
        )
      }}
    </SearchMoviesContext.Consumer>
  )

  return (
    <nav className="navbar-container">
      {/* Logo */}

      <Link to="/" className="logo-container">
        <h1 className="page-logo">movieDB</h1>
      </Link>

      {/* Navigation */}

      <div className="navbar-right">
        <ul className="nav-items-list">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Popular
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/top-rated">
              Top Rated
            </Link>
          </li>

          <li className="nav-item">
            <Link className="nav-link" to="/upcoming">
              Upcoming
            </Link>
          </li>
        </ul>

        {/* Search */}

        {renderSearchBar()}
      </div>
    </nav>
  )
}

export default withRouter(NavBar)
