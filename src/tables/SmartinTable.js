import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import { AUTH_SERVICE_FORCE_RESET_PASSWORD, AUTH_SERVICE_LIST_USER, AUTH_SERVICE_UPDATE_STATUS_USER, MENU_SERVICE_ALL_MODULES, MENU_SERVICE_CORE_MODULE, MENU_SERVICE_CORE_MODULE_DELETE, MENU_SERVICE_CORE_MODULE_GET_ID, MENU_SERVICE_DELETE_MENU, SMARTIN_SERVICE_UPLOAD_FILE_LIST, USER_SERVICE_USER_DETAIL } from '../config/ConfigApi';
import { Fragment } from 'react';
import { Modal, Button, ButtonGroup, Form, Pagination } from 'react-bootstrap';
import { showSuccessToast, showErrorToast } from '../toast/toast';
import { faCheck, faSpinner, faTrash, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faSyncAlt, faTimes, faLock } from '@fortawesome/free-solid-svg-icons';


import { flushSync } from 'react-dom';
import EditUserModal from '../modal/EditUserModal';
import { isTokenExpired, refreshToken } from '../config/TokenHandler';
import EditModuleModal from '../modal/administration/EditModuleModal';


// Ganti dengan URL API yang sesuai

const { pendingApproval, active, pendingDelete, inactive, disabled, expired, lock, userLoggin, token, expiredPass } = require('../config/Constants');

const SmartinTable = ({ refreshTableStatus }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [searchFileName, setSearchFileName] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [showModal, setShowModal] = useState(false);



    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, refreshTableStatus]); // Panggil fetchData setiap kali currentPage berubah

    const fetchData = async () => {
        try {
            setIsLoadingTable(true);

            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${SMARTIN_SERVICE_UPLOAD_FILE_LIST}?size=${pageSize}&page=${currentPage}&fileName=${searchFileName}`, { headers });


            setTimeout(() => {
                setData(response.data.fileLogs);
                setTotalItem(response.data.totalItems);
                setIsLoadingTable(false); // Stop loading
            }, 1000);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoadingTable(false);
        }
    };

    const reloadData = () => {
        fetchData();
    };

    const columns = React.useMemo(
        () => [
            // { Header: 'ID', accessor: 'id' },
            { Header: 'Id', accessor: 'id' },
            { Header: 'File Name', accessor: 'fileName', },
            { Header: 'Description', accessor: 'description', },
            { Header: 'Uploaded Date', accessor: 'uploadedDate', },
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

    // Pagination properties
    const pageCount = Math.ceil(totalItem / pageSize);
    const startIndex = (currentPage) * pageSize + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, totalItem);

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
            <div className="container mt-4">
                <div className="row mb-3">
                    <div className="col-3">
                        <form className="form-inline">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={searchFileName}
                                    onChange={(e) => setSearchFileName(e.target.value)}
                                    placeholder="Search by Module Name"
                                />
                                <div className="input-group-append">
                                    <button type="button" className="btn btn-primary" onClick={handleSearchSubmit}>
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="col-9 d-flex justify-content-end align-items-center">
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


                <div className="table-responsive">

                    <table className='table table-bordered table-hover' {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {isLoadingTable ? (
                                <tr>
                                    <td colSpan={headerGroups[0].headers.length}> {/* Replace 'numberOfColumns' with the actual number of columns */}
                                        <div className="text-center">
                                            <div className="spinner-border text-primary" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                rows.map(row => {
                                    prepareRow(row);
                                    return (
                                        <tr {...row.getRowProps()} className="table-row-hover">

                                            {row.cells.map(cell => (
                                                <td {...cell.getCellProps()} >{cell.render('Cell')}</td>
                                            ))}
                                        </tr>
                                    );
                                })
                            )}
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

export default SmartinTable;
