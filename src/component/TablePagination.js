import React from 'react'
import { Pagination } from 'react-bootstrap';

// For 0 based pagination

const TablePagination = ({
    totalItems,
    pageSize,
    currentPage,
    onPageChange,
  }) => {

    const pageCount = Math.ceil(totalItems / pageSize);

    const renderPaginationItems = () => {
        const paginationItems = [];
      
        if (pageCount <= 5) {
          // If there are less than or equal to 5 pages, render all page numbers.
          for (let i = 0; i < pageCount; i++) {
            paginationItems.push(
              <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => onPageChange(i)}
              >
                {i + 1}
              </Pagination.Item>
            );
          }
        } else {
          // If there are more than 5 pages, include ellipsis.
          const startPage = Math.max(0, currentPage - 2);
          const endPage = Math.min(pageCount - 1, currentPage + 2);
      
          if (startPage > 0) {
            paginationItems.push(
              <Pagination.Item key="start" onClick={() => onPageChange(0)}>
                1
              </Pagination.Item>
            );
      
            if (startPage > 1) {
              paginationItems.push(<Pagination.Ellipsis key="start-ellipsis" />);
            }
          }
      
          for (let i = startPage; i <= endPage; i++) {
            paginationItems.push(
              <Pagination.Item
                key={i}
                active={i === currentPage}
                onClick={() => onPageChange(i)}
              >
                {i + 1}
              </Pagination.Item>
            );
          }
      
          if (endPage < pageCount - 1) {
            if (endPage < pageCount - 2) {
              paginationItems.push(<Pagination.Ellipsis key="end-ellipsis" />);
            }
      
            paginationItems.push(
              <Pagination.Item
                key="end"
                onClick={() => onPageChange(pageCount - 1)}
              >
                {pageCount}
              </Pagination.Item>
            );
          }
        }
      
        return paginationItems;
      };

  return (
    <Pagination>
        <Pagination.Prev
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
        />
        {renderPaginationItems()}
        <Pagination.Next
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === pageCount - 1}
        />
    </Pagination>
  )
}

export default TablePagination