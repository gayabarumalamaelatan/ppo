import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import ConfigApi, { USER_SERVICE_AUDITTRAIL_LIST } from '../config/ConfigApi';
import { Fragment } from 'react';
import { Pagination } from 'react-bootstrap';

// Ganti dengan URL API yang sesuai
const token = sessionStorage.getItem('accessToken');  // Ganti dengan token autentikasi yang sesuai
const pageSize = 5;

const AuditTable = () => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    // const [searchUsername, setSearchUsername] = useState('');
    // const [searchActivity, setSearchActivity] = useState('');
    const [searchFilter, setSearchFilter] = useState('username');
    const [searchFilterValue, setSearchFilterValue] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);

    const empyData = ([])

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, searchFilterValue]); // Panggil fetchData setiap kali currentPage berubah

    const fetchData = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            // const response = await axios.get(`${ConfigApi.apiUrl}audittrail/list?size=${pageSize}&page=${currentPage}`, { headers })
            
            if (searchFilter === 'username' ){
                const response = await axios.get(`${USER_SERVICE_AUDITTRAIL_LIST}?size=${pageSize}&page=${currentPage}&username=${searchFilterValue}`, { headers });
                    setData(response.data.auditTrails);
                    setTotalItem(response.data.totalItems);
                    setIsLoading(false);
            } else if (searchFilter === 'activity'){
                const response2 = await axios.get(`${USER_SERVICE_AUDITTRAIL_LIST}?size=${pageSize}&page=${currentPage}&activity=${searchFilterValue}`, { headers });
                    setData(response2.data.auditTrails);
                    setTotalItem(response2.data.totalItems);
                    setIsLoading(false);
            } else if (searchFilter === 'createdDate'){
                const response4 = await axios.get(`${USER_SERVICE_AUDITTRAIL_LIST}?size=${pageSize}&page=${currentPage}&date=${searchFilterValue}`, { headers });
                    setData(response4.data.auditTrails);
                    setTotalItem(response4.data.totalItems);
                    setIsLoading(false);
            } else {
                const response3 = await axios.get(`${USER_SERVICE_AUDITTRAIL_LIST}?size=${pageSize}&page=${currentPage}`, { headers });
                    console.log(searchFilter)
                    setData(response3.data.auditTrails);
                    setTotalItem(response3.data.totalItems);
                    setIsLoading(false);
            }
            // switch(searchFilter) {
            //     case 'username':
            //         const response = await axios.get(`${ConfigApi.apiUrl}audittrail/list?size=${pageSize}&page=${currentPage}&username=${searchFilterValue}`, { headers });
            //         setData(response.data.auditTrails);
            //         setTotalItems(response.data.totalItems);
            //         setIsLoading(false);
            //         break;
            //     case 'activity':
            //         const response2 = await axios.get(`${ConfigApi.apiUrl}audittrail/list?size=${pageSize}&page=${currentPage}&activity=${searchFilterValue}`, { headers });
            //         setData(response2.data.auditTrails);
            //         setTotalItems(response2.data.totalItems);
            //         setIsLoading(false);
            //         break;
            //     case 'createdDate':
            //         const response4 = await axios.get(`${ConfigApi.apiUrl}audittrail/list?size=${pageSize}&page=${currentPage}&createdAt=${searchFilterValue}`, { headers });
            //         setData(response4.data.auditTrails);
            //         setTotalItems(response4.data.totalItems);
            //         setIsLoading(false);
            //         break;
            //     default:
            //         const response3 = await axios.get(`${ConfigApi.apiUrl}audittrail/list?size=${pageSize}&page=${currentPage}`, { headers });
            //         setData(response3.data.auditTrails);
            //         setTotalItems(response3.data.totalItems);
            //         setIsLoading(false);
            //         break;
            // }

        } catch (error) {
            console.error('Error fetching data:', error);
            setData(empyData);
            setTotalItem(empyData);
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        // const options = { year: "numeric", month: "numeric", day: "numeric", hour: 'numeric', minute: 'numeric', second: 'numeric',  hour12: false}
        // return new Date(dateString).toLocaleDateString("en-AU", options).replaceAll("/", "-")
        // var date = new Date(dateString);
        // var dateFormatted = date.getFullYear() + "-" + date.get;Month() + "-" + date.getDate();
        var date2 = String(dateString).replaceAll("T", " ");
        return date2
      }

    const columns = React.useMemo(
        () => [
            { Header: 'Username', accessor: 'userName' },
            { Header: 'Activity', accessor: 'activity' },
            { Header: 'Created At', accessor: 'createdDate', Cell: ({ value }) => formatDate(value) || '-' },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });


    const handleResetTable = () => {
        setSearchFilter('');
        setSearchFilterValue('');
    } 

    // Pagination properties
    const pageCount = Math.ceil(totalItem / pageSize);
    const startIndex = (currentPage) * pageSize + 1;
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
        setCurrentPage(0); // Kembali ke halaman pertama saat filter pencarian digunakan
        fetchData();
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Fragment>
            <div className="container mt-4">
                <div className="row mb-3">
                    <div className="col-6">
                        <form className="form-inline">
                            <div className="input-group">
                                <select className='form-control'
                                    value={searchFilter}
                                    onChange={(e) => setSearchFilter(e.target.value)}>
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
                                />
                                <div className="input-group-append">
                                    <button type="button" className="btn btn-primary" onClick={handleResetTable}>
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-6 d-flex justify-content-end align-items-center">
                        <label htmlFor="pageSizeSelect" className="me-2">Rows per page:</label>
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
                    <table className='table table-bordered table-hover' {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {/* <th>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.every(Boolean)}
                                            onChange={toggleAllRowsCheckbox}
                                        />
                                    </th> */}
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {/* <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedRows[row.index] || false}
                                                onChange={() => handleRowCheckboxChange(row.index)}
                                            />
                                        </td> */}
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                <div>Showing {startIndex} to {endIndex} of {totalItem} entries</div>
                  <Pagination>
                      <Pagination.Prev
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 0}
                      />
                      {/* {Array.from({ length: pageCount }).map((_, index) => (
                          <Pagination.Item
                              key={index}
                              active={index === currentPage}
                              onClick={() => handlePageChange(index)}
                          >
                              {index + 1}
                          </Pagination.Item>
                      ))} */}
                      {renderPaginationItems()}
                      <Pagination.Next
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === pageCount - 1}
                      />
                  </Pagination>
              </div>
            </div>
        </Fragment>
    );
};

export default AuditTable;
