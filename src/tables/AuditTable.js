import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTable } from "react-table";
import { USER_SERVICE_AUDITTRAIL_LIST } from "../config/ConfigApi";
import { Fragment } from "react";
import { Pagination } from "react-bootstrap";

const { getToken } = require("../config/Constants");

const AuditTable = () => {
  const [data, setData] = useState([]);
  const [totalItem, setTotalItem] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [searchFilter, setSearchFilter] = useState("");
  const [searchFilterValue, setSearchFilterValue] = useState("");
  const [isLoadingTable, setIsLoadingTable] = useState(true);
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };

  const empyData = [];

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    try {
      setIsLoadingTable(true);
      let urlParams;

      if (searchFilter !== "" && searchFilterValue !== "") {
        urlParams = `size=${pageSize}&page=${currentPage}&${searchFilter}=${searchFilterValue}`;
        console.log("Set URL Params", urlParams);
      } else {
        urlParams = `size=${pageSize}&page=${currentPage}`;
        console.log("Set URL Params", urlParams);
      }

      const response = await axios.get(
        `${USER_SERVICE_AUDITTRAIL_LIST}?${urlParams}`,
        { headers }
      );
      setTimeout(() => {
        setData(response.data.auditTrails);
        setTotalItem(response.data.totalItems);
        setIsLoadingTable(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData(empyData);
      setTotalItem(empyData);
      setIsLoadingTable(false);
    }
  };

  const formatDate = (dateString) => {
    var date2 = String(dateString).replaceAll("T", " ");
    return date2;
  };

  const columns = React.useMemo(
    () => [
      { Header: "Username", accessor: "userName" },
      { Header: "Service", accessor: "serviceName" },
      { Header: "Activity", accessor: "activity" },
      {
        Header: "Created At",
        accessor: "createdDate",
        Cell: ({ value }) => formatDate(value) || "-",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const handleResetTable = () => {
    setSearchFilter("");
    setSearchFilterValue("");
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      fetchData();
    }
  };

  // Pagination properties
  const pageCount = Math.ceil(totalItem / pageSize);
  const startIndex = currentPage * pageSize + 1;
  const endIndex = Math.min((currentPage + 1) * pageSize, totalItem);

  // Handle logic
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pageCount) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setCurrentPage(0); // Kembalikan ke halaman pertama setelah mengubah ukuran halaman
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (currentPage !== 0) {
      setCurrentPage(0);
    } else {
      fetchData();
    }
  };

  // Pagination Logic

  const renderPaginationItems = () => {
    const paginationItems = [];

    if (pageCount <= 5) {
      // If there are less than or equal to 5 pages, render all page numbers.
      for (let i = 0; i < pageCount; i++) {
        paginationItems.push(
          <Pagination.Item
            key={i}
            active={i === currentPage}
            onClick={() => handlePageChange(i)}
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
          <Pagination.Item key="start" onClick={() => handlePageChange(0)}>
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
            onClick={() => handlePageChange(i)}
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
            onClick={() => handlePageChange(pageCount - 1)}
          >
            {pageCount}
          </Pagination.Item>
        );
      }
    }

    return paginationItems;
  };

  return (
    <Fragment>
      <div className="row mb-3">
        <div className="col-6">
          <form className="form-inline">
            <div className="input-group">
              <select
                className="form-control"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{ marginRight: "5px" }}
              >
                <option value="">Choose Filter</option>
                <option value="username">Username</option>
                <option value="activity">Activity</option>
                <option value="createdDate">Created Date</option>
              </select>
              <input
                type="text"
                className="form-control"
                value={searchFilterValue}
                onChange={(e) => setSearchFilterValue(e.target.value)}
                placeholder="Search"
                style={{ marginRight: "5px" }}
              />
              <div className="input-group">
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginRight: "5px" }}
                  onClick={handleResetTable}
                >
                  Reset
                </button>
              </div>
              <div className="input-group">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSearchSubmit}
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="col-6 d-flex justify-content-end align-items-center">
          <label htmlFor="pageSizeSelect" className="me-2">
            Rows per page:
          </label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="form-form-select form-select-sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table
          className="table table-bordered table-hover"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {isLoadingTable ? (
              <tr>
                <td colSpan={headerGroups[0].headers.length}>
                  {" "}
                  {/* Replace 'numberOfColumns' with the actual number of columns */}
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          Showing {startIndex} to {endIndex} of {totalItem} entries
        </div>
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
          />
          {renderPaginationItems()}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pageCount - 1}
          />
        </Pagination>
      </div>
    </Fragment>
  );
};

export default AuditTable;
