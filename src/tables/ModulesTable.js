import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import { AUTH_SERVICE_FORCE_RESET_PASSWORD, AUTH_SERVICE_LIST_USER, AUTH_SERVICE_UPDATE_STATUS_USER, MENU_SERVICE_ALL_MODULES, MENU_SERVICE_CORE_MODULE, MENU_SERVICE_CORE_MODULE_DELETE, MENU_SERVICE_CORE_MODULE_GET_ID, MENU_SERVICE_DELETE_MENU, USER_SERVICE_USER_DETAIL } from '../config/ConfigApi';
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

const ModulesTable = ({ editPermission, deletePermission, refreshTableStatus }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [searchModule, setSearchModule] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedModule, setSelectedModule] = useState('');
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState(null);

    const handleEdit = (data) => {
        setSelectedModule(data);
        setShowEditModal(true);
    };

    const handleFormSubmit = (data) => {
        console.log('Form data:', data);
        setShowEditModal(false);
    };



    const handleView = async (data) => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${MENU_SERVICE_CORE_MODULE_GET_ID}?moduleId=${data.id}`, { headers });
            setSelectedModule(response.data);
            setShowModal(true);

        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };



    const handleShowDeleteModal = (data) => {
        setModuleToDelete(data);
        setShowDeleteModal(true);
    };

    const handleDelete = async (data) => {
        setIsLoading(true);
        try { // Ganti dengan akses token yang sesuai
            const headers = { Authorization: `Bearer ${token}` };// Ganti dengan endpoint URL yang sesuai

            // Objek data yang akan dikirim sebagai body permintaan PUT
            const data = {
                status: inactive, // Ganti dengan status yang sesuai untuk mengunci pengguna
                id: moduleToDelete.id, // Dapatkan username dari objek user yang diberikan
            };

            // console.log(data);

            const response = await axios.put(`${MENU_SERVICE_CORE_MODULE_DELETE}`, data, { headers });

            setTimeout(() => {
                setShowDeleteModal(false);
                setModuleToDelete(null);
                showSuccessToast('User has been deleted successfully.');
                setIsLoading(false);
                reloadData();
            }, 1000);

        } catch (error) {
            console.error('Error Deleted modules :', error);
            // Tambahkan logika lain sesuai dengan kebutuhan Anda untuk menangani kesalahan
        }
    };



    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, refreshTableStatus, searchModule]); // Panggil fetchData setiap kali currentPage berubah

    const fetchData = async () => {
        try {
            setIsLoadingTable(true);

            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${MENU_SERVICE_CORE_MODULE}?size=${pageSize}&page=${currentPage}&moduleName=${searchModule}`, { headers });


            setTimeout(() => {
                setData(response.data.coreModules);
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
            { Header: 'Module Name', accessor: 'moduleName' },
            { Header: 'Prefix Table', accessor: 'prefixTable', },
            { Header: 'Module Code', accessor: 'moduleCode', },
            {
                Header: 'Status', accessor: 'status',
                Cell: ({ value }) => {
                    if (value === 'PENDING_APPROVAL') {
                        return 'PENDING APPROVAL';
                    } else if (value === 'PENDING_DELETE') {
                        return 'PENDING DELETE';
                    } else if (value === expiredPass) {
                        return 'FORCE RESET PASSOWRD';
                    }

                    return value;

                },
            },
            {
                Header: 'Actions',
                Cell: ({ row }) => {

                    return (

                        <div>
                            <Button variant="outline-success" style={{ marginRight: '5px' }} onClick={() => handleView(row.original)}><i className="fas fa-eye"></i></Button>
                            {editPermission && (
                                <Button variant="outline-primary" style={{ marginRight: '5px' }} onClick={() => handleEdit(row.original)}><i className="fas fa-edit"></i></Button>
                            )}
                            {deletePermission && (
                                <Button variant="outline-danger" onClick={() => handleShowDeleteModal(row.original)}><i className="fas fa-trash"></i></Button>
                            )}
                        </div>
                    );
                }
            },
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


    const handleCloseModal = () => {
        setShowEditModal(false);
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
                                    value={searchModule}
                                    onChange={(e) => setSearchModule(e.target.value)}
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

            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>View Module Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedModule && (
                        <div>
                            <div className="row">
                                <div className="col-3">
                                    <strong>Module ID</strong>
                                </div>
                                <div className="col-auto" >
                                    <strong>:</strong>
                                </div>
                                <div className="col-8">{selectedModule.id}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <strong>Module Name</strong>
                                </div>
                                <div className="col-auto">
                                    <strong>:</strong>
                                </div>
                                <div className="col-8">{selectedModule.moduleName}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <strong>Icon</strong>
                                </div>
                                <div className="col-auto">
                                    <strong>:</strong>
                                </div>
                                <div className="col-8">{selectedModule.icon}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <strong>URL</strong>
                                </div>
                                <div className="col-auto">
                                    <strong>:</strong>
                                </div>
                                <div className="col-8">{selectedModule.url}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <strong>Element</strong>
                                </div>
                                <div className="col-auto">
                                    <strong>:</strong>
                                </div>
                                <div className="col-8">{selectedModule.element}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <strong>Status</strong>
                                </div>
                                <div className="col-auto">
                                    <strong>:</strong>
                                </div>
                                <div className="col-8">{selectedModule.status}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <strong>Module Code</strong>
                                </div>
                                <div className="col-auto">
                                    <strong>:</strong>
                                </div>
                                <div className="col-8">{selectedModule.moduleCode}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <strong>Prefix Table</strong>
                                </div>
                                <div className="col-auto">
                                    <strong>:</strong>
                                </div>
                                <div className="col-8">{selectedModule.prefixTable}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <strong>Created At</strong>
                                </div>
                                <div className="col-auto">
                                    <strong>:</strong>
                                </div>
                                <div className="col-8">{selectedModule.createdAt}</div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <strong>Updated At</strong>
                                </div>
                                <div className="col-auto">
                                    <strong>:</strong>
                                </div>
                                <div className="col-8">{selectedModule.updatedAt}</div>
                            </div>
                            {/* Add more module data fields as needed */}
                        </div>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />   Close
                    </Button>
                </Modal.Footer>


            </Modal>



            {/* Modal konfirmasi penghapusan */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>

                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the module : {moduleToDelete && moduleToDelete.moduleName} ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />   Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        <FontAwesomeIcon icon={faTrash} />   Delete
                    </Button>
                </Modal.Footer>
                {isLoading && (
                    <div className="full-screen-overlay">
                        <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                    </div>
                )}
            </Modal>

            {selectedModule && (
                <EditModuleModal
                    showEdit={showEditModal}
                    handleClose={handleCloseModal}
                    dataModule={selectedModule}
                    //refecthCallBack={() => fetchData()}
                    reloadData={reloadData}
                />
            )}
        </Fragment>
    );
};

export default ModulesTable;
