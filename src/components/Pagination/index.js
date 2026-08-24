import {useEffect, useState} from 'react'

import './index.css'

const Pagination = props => {
  const {
    apiCallback,
    totalPages,
    currentPage: controlledPage,
  } = props

  const [page, setPage] = useState(1)

  const [isChangingPage, setIsChangingPage] =
    useState(false)

  const currentPage =
    controlledPage || page

  useEffect(() => {
    if (controlledPage) {
      setPage(controlledPage)
    }
  }, [controlledPage])

  const changePage = async newPage => {
    if (
      isChangingPage ||
      !totalPages ||
      newPage < 1 ||
      newPage > totalPages
    ) {
      return
    }

    setIsChangingPage(true)

    try {
      const success = await apiCallback(newPage)

      if (success === false) {
        return
      }

      setPage(newPage)
    } catch (error) {
      console.error(
        'Pagination error:',
        error,
      )
    } finally {
      setIsChangingPage(false)
    }
  }

  const onPreviousPage = () => {
    changePage(currentPage - 1)
  }

  const onNextPage = () => {
    changePage(currentPage + 1)
  }

  if (!totalPages || totalPages <= 1) {
    return null
  }

  return (
    <div className="pagination-container">

      <button
        type="button"
        className="control-btn previous-btn"
        onClick={onPreviousPage}
        disabled={
          currentPage <= 1 ||
          isChangingPage
        }
      >
        <span className="arrow">
          ‹
        </span>

        <span>
          {isChangingPage
            ? 'Loading...'
            : 'Previous'}
        </span>
      </button>


      <div className="page-indicator">

        <span className="current-page">
          {currentPage}
        </span>

        <span className="page-divider">
          /
        </span>

        <span className="total-pages">
          {totalPages}
        </span>

      </div>


      <button
        type="button"
        className="control-btn next-btn"
        onClick={onNextPage}
        disabled={
          currentPage >= totalPages ||
          isChangingPage
        }
      >
        <span>
          {isChangingPage
            ? 'Loading...'
            : 'Next'}
        </span>

        {!isChangingPage && (
          <span className="arrow">
            ›
          </span>
        )}
      </button>

    </div>
  )
}

export default Pagination