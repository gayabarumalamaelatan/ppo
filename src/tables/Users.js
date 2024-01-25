import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTable } from 'react-table';
import { AUTH_SERVICE_FORCE_RESET_PASSWORD, AUTH_SERVICE_LIST_USER, AUTH_SERVICE_UPDATE_STATUS_USER, AUTH_SERVICE_VALIDATE_LOGIN, USER_SERVICE_USER_DETAIL } from '../config/ConfigApi';
import { Fragment } from 'react';
import { Modal, Button, Pagination, Form } from 'react-bootstrap';
// import { showSuccessToast, showErrorToast } from '../toast/toast';
import { faCheck, faSpinner, faTrash, faUnlock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import { faSyncAlt, faTimes, faLock } from '@fortawesome/free-solid-svg-icons';

import EditUserModal from '../modal/EditUserModal';
import { isTokenExpired, refreshToken } from '../config/TokenHandler';
import { showDynamicSweetAlert } from '../toast/Swal';


// Ganti dengan URL API yang sesuai

const { pendingApproval, active, pendingDelete, inactive, disabled, expired, lock, userLoggin, expiredPass, getToken } = require('../config/Constants');

const Users = ({ editPermission, delPermission, authPermission, refreshTableStatus }) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [searchUsername, setSearchUsername] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModalLock, setShowModalLock] = useState(false);
    const [userToLock, setUserToLock] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [isLoadingTable, setIsLoadingTable] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [userToUnlock, setUserToUnlock] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showTestLoginModal, setShowTestLoginModal] = useState(false);
    const [userToApprove, setUserToApprove] = useState(null);
    const [userToReset, setUserToReset] = useState(null);
    const [showModalReset, setShowModalReset] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const token = getToken();

    const handleEditUser = (user) => {

        console.log("Selected user before update:", user.id); // Log the current selectedUser
        //setSelectedUser(user.id); // Update the selected user
        setSelectedUser(user.id);
        console.log("Selected user after update:", selectedUser);
        setShowEditModal(true);
    };

    const handleFormSubmit = (data) => {
        console.log('Form data:', data);
        setShowEditModal(false);
    };


    const handleViewUser = async (user) => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${USER_SERVICE_USER_DETAIL}?userId=${user.id}`, { headers });
            setSelectedUser(response.data);
            setShowModal(true);

        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };
    const handleTestLogin = async (user) => {
        // Simpan data pengguna yang akan dikunci pada state userToLock
        setUserToLock(user);
        // Tampilkan modal konfirmasi
        setShowTestLoginModal(true);

    }

    const handleLockUser = async (user) => {
        // Simpan data pengguna yang akan dikunci pada state userToLock
        setUserToLock(user);
        // Tampilkan modal konfirmasi
        setShowModalLock(true);
    };

    const confirmTestLogin = async () => {
        try { // Ganti dengan akses token yang sesuai
            const headers = { Authorization: `Bearer ${token}` };// Ganti dengan endpoint URL yang sesuai

            // Objek data yang akan dikirim sebagai body permintaan PUT
            const data = {
                userPass: password, // Ganti dengan status yang sesuai untuk mengunci pengguna
                userName: userToLock.userName,// Dapatkan username dari objek user yang diberikan
            };
            console.log(data);

            const response = await axios.post(`${AUTH_SERVICE_VALIDATE_LOGIN}`, data, { headers });

            console.log('successfully:', response.data);

            handleCloseModal();
            setUserToLock(null);
            showDynamicSweetAlert('Success!', 'Credentials validated.', 'success');
        } catch (error) {
            console.error('Error Test Login:', error);
            showDynamicSweetAlert('Error!', error, 'error');
            // Tambahkan logika lain sesuai dengan kebutuhan Anda untuk menangani kesalahan
        }

    }

    const confirmLockUser = async () => {
        try { // Ganti dengan akses token yang sesuai
            const headers = { Authorization: `Bearer ${token}` };// Ganti dengan endpoint URL yang sesuai

            // Objek data yang akan dikirim sebagai body permintaan PUT
            const data = {
                status: lock, // Ganti dengan status yang sesuai untuk mengunci pengguna
                userName: userToLock.userName,// Dapatkan username dari objek user yang diberikan
            };
            console.log(data);

            const response = await axios.put(`${AUTH_SERVICE_UPDATE_STATUS_USER}`, data, { headers });

            console.log('User locked successfully:', response.data);

            setShowModalLock(false);
            setUserToLock(null);
            showDynamicSweetAlert('Success!', 'User locked successfull', 'success');
            //showSuccessToast('User locked successfully. ');
            fetchData();
        } catch (error) {
            console.error('Error locking user:', error);
            showDynamicSweetAlert('Error!', error, 'error');
            // Tambahkan logika lain sesuai dengan kebutuhan Anda untuk menangani kesalahan
        }
    };

    const handleCloseModal = () => {
        // Jika pengguna menutup modal tanpa mengonfirmasi, reset userToLock menjadi null
        setUserToLock(null);
        setShowModalLock(false);
        setShowModalReset(false);
        setShowTestLoginModal(false);
        setResponseMessage('');
        setPassword('');
    };

    const handlePasswordChange = (e) => {
        // Update the password state as the user types
        setPassword(e.target.value);
    };

    const handleShowUnlockModal = (user) => {
        setUserToUnlock(user);
        setShowUnlockModal(true);
    };
    const reloadData = () => {
        fetchData();
    };

    const handleUnlockUser = async (user) => {
        try { // Ganti dengan akses token yang sesuai
            const headers = { Authorization: `Bearer ${token}` };// Ganti dengan endpoint URL yang sesuai

            // Objek data yang akan dikirim sebagai body permintaan PUT
            const data = {
                status: active, // Ganti dengan status yang sesuai untuk mengunci pengguna
                userName: userToUnlock.userName, // Dapatkan username dari objek user yang diberikan
            };

            const response = await axios.put(`${AUTH_SERVICE_UPDATE_STATUS_USER}`, data, { headers });

            //console.log('User locked successfully:', response.data);

            setShowUnlockModal(false);
            setUserToUnlock(null);
            showDynamicSweetAlert('Success!', 'User Unlocked successfully.', 'success');
            //showSuccessToast('User Unlocked successfully.');
            // Tambahkan logika lain sesuai dengan kebutuhan Anda setelah penguncian pengguna berhasil
            fetchData();
        } catch (error) {
            console.error('Error locking user:', error);
            showDynamicSweetAlert('Error!', error, 'error');
            // Tambahkan logika lain sesuai dengan kebutuhan Anda untuk menangani kesalahan
        }
    };

    const handleShowDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteUser = async (user) => {
        try { // Ganti dengan akses token yang sesuai
            const headers = { Authorization: `Bearer ${token}` };// Ganti dengan endpoint URL yang sesuai

            // Objek data yang akan dikirim sebagai body permintaan PUT
            const data = {
                status: pendingDelete, // Ganti dengan status yang sesuai untuk mengunci pengguna
                userName: userToDelete.userName, // Dapatkan username dari objek user yang diberikan
            };

            // console.log(data);

            const response = await axios.put(`${AUTH_SERVICE_UPDATE_STATUS_USER}`, data, { headers });

            // console.log('User locked successfully:', response.data);

            // Tutup modal konfirmasi
            setShowDeleteModal(false);
            // Reset userToLock menjadi null
            setUserToDelete(null);
            // Tambahkan logika 
            showDynamicSweetAlert('Success!', 'User has been deleted successfully.', 'success');
            //showSuccessToast('User has been deleted successfully.');
            // Tambahkan logika lain sesuai dengan kebutuhan Anda setelah penguncian pengguna berhasil
            fetchData();
        } catch (error) {
            console.error('Error locking user:', error);
            showDynamicSweetAlert('Error!', error, 'error');
            // Tambahkan logika lain sesuai dengan kebutuhan Anda untuk menangani kesalahan
        }
    };

    const handleShowResetUser = (user) => {
        setUserToReset(user);
        setShowModalReset(true);
    };
    const handleResetUser = async (user) => {
        try { // Ganti dengan akses token yang sesuai
            const headers = { Authorization: `Bearer ${token}` };// Ganti dengan endpoint URL yang sesuai

            // Objek data yang akan dikirim sebagai body permintaan PUT
            const data = {
                status: expiredPass, // Ganti dengan status yang sesuai untuk mengunci pengguna
                id: userToReset.id, // Dapatkan username dari objek user yang diberikan
            };

            console.log(data);

            const response = await axios.put(`${AUTH_SERVICE_FORCE_RESET_PASSWORD}`, data, { headers });

            if (response.status === 200) {
                setResponseMessage(response.data);
                setShowModalReset(false);
                setUserToReset(null);
                showDynamicSweetAlert('Success!', 'User has been reset successfully.', 'success');
                console.log(response.data);
                fetchData(); // Assuming this function fetches updated data
            }
        } catch (error) {
            console.error('Error locking user:', error);
            showDynamicSweetAlert('Error!', error, 'error');
            // Tambahkan logika lain sesuai dengan kebutuhan Anda untuk menangani kesalahan
        }
    };

    const handleShowApproveModal = (user) => {
        setUserToApprove(user);
        setShowApproveModal(true);
    };

    const handlePendingApproval = async (user) => {
        try { // Ganti dengan akses token yang sesuai
            const headers = { Authorization: `Bearer ${token}` };// Ganti dengan endpoint URL yang sesuai
            console.log(userToApprove.userName);
            // Objek data yang akan dikirim sebagai body permintaan PUT
            const data = {
                status: active, // Ganti dengan status yang sesuai untuk mengunci pengguna
                userName: userToApprove.userName,
                updateBy: userLoggin, // Dapatkan username dari objek user yang diberikan
            };

            //console.log(data);

            const response = await axios.put(`${AUTH_SERVICE_UPDATE_STATUS_USER}`, data, { headers });

            // console.log('User locked successfully:', response.data);
            // Tambahkan logika lain sesuai dengan kebutuhan Anda setelah penguncian pengguna berhasil

            // Tutup modal konfirmasi
            setShowApproveModal(false);
            // Reset userToLock menjadi null
            setUserToApprove(null);
            // Tambahkan logika 
            showDynamicSweetAlert('Success!', 'User is approved successfully.', 'success');
            // showSuccessToast('User is approved successfully.');

            fetchData();
        } catch (error) {
            console.error('Error locking user:', error);
            showDynamicSweetAlert('Error!', error, 'error');
            // Tambahkan logika lain sesuai dengan kebutuhan Anda untuk menangani kesalahan
        }
    };

    const handledisabled = async (user) => {
        try { // Ganti dengan akses token yang sesuai
            const headers = { Authorization: `Bearer ${token}` };// Ganti dengan endpoint URL yang sesuai

            // Objek data yang akan dikirim sebagai body permintaan PUT
            const data = {
                status: disabled, // Ganti dengan status yang sesuai untuk mengunci pengguna
                userName: user.userName, // Dapatkan username dari objek user yang diberikan
            };

            //console.log(data);

            const response = await axios.put(`${AUTH_SERVICE_UPDATE_STATUS_USER}`, data, { headers });

            //console.log('User locked successfully:', response.data);
            // Tambahkan logika lain sesuai dengan kebutuhan Anda setelah penguncian pengguna berhasil
            fetchData();
        } catch (error) {
            console.error('Error locking user:', error);
            showDynamicSweetAlert('Error!', error, 'error');
            // Tambahkan logika lain sesuai dengan kebutuhan Anda untuk menangani kesalahan
        }
    };
    const handleActiveUser = async (user) => {
        try { // Ganti dengan akses token yang sesuai
            const headers = { Authorization: `Bearer ${token}` };// Ganti dengan endpoint URL yang sesuai

            // Objek data yang akan dikirim sebagai body permintaan PUT
            const data = {
                status: active, // Ganti dengan status yang sesuai untuk mengunci pengguna
                userName: user.userName, // Dapatkan username dari objek user yang diberikan
            };

            // console.log(data);

            const response = await axios.put(`${AUTH_SERVICE_UPDATE_STATUS_USER}`, data, { headers });

            // console.log('User locked successfully:', response.data);
            // Tambahkan logika lain sesuai dengan kebutuhan Anda setelah penguncian pengguna berhasil
            fetchData();
        } catch (error) {
            console.error('Error locking user:', error);
            showDynamicSweetAlert('Error!', error, 'error');
            // Tambahkan logika lain sesuai dengan kebutuhan Anda untuk menangani kesalahan
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, searchUsername, refreshTableStatus]); // Panggil fetchData setiap kali currentPage berubah

    const fetchData = async () => {
        try {
            setIsLoadingTable(true);

            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${AUTH_SERVICE_LIST_USER}?size=${pageSize}&page=${currentPage}&username=${searchUsername}`, { headers });


            setTimeout(() => {
                setData(response.data.users);
                setTotalItem(response.data.totalItems);
                setIsLoadingTable(false); // Stop loading
            }, 1000);
        } catch (error) {
            console.error('Error fetching data:', error);
            showDynamicSweetAlert('Error!', error, 'error');
            setIsLoadingTable(false);
        }
    };

    const columns = React.useMemo(
        () => [
            // { Header: 'ID', accessor: 'id' },
            { Header: 'Username', accessor: 'userName' },
            { Header: 'Created By', accessor: 'createdBy', },
            { Header: 'Reviewed By', accessor: 'reviewedBy', },
            { Header: 'Auth By', accessor: 'authBy', Hidden: true },
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
                Header: 'Admin Action',

                Cell: ({ row }) => {
                    if (row.original.status === pendingApproval || row.original.status === pendingDelete || row.original.status === expiredPass) {
                        return null; // Render nothing (blank) if the status is "Pending For Approval"
                    } else if (row.original.status === active) {
                        return (
                            <div className="btn-group">
                                <div className="btn-group">
                                    <button className="btn btn-default btn-flat"><i className="nav-icon fa fa-cogs"></i></button>
                                    <button type="button" className="btn btn-default btn-flat dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                        <span className="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <div className="dropdown-menu" role="menu">
                                        <a className="dropdown-item" onClick={() => handleViewUser(row.original)}>View User</a>
                                        {editPermission && (
                                            <a className="dropdown-item" onClick={() => handleLockUser(row.original)}>Lock User</a>
                                        )}
                                        {delPermission && (
                                            <a className="dropdown-item" onClick={() => handleShowDeleteModal(row.original)}>Delete User</a>
                                        )}
                                        {editPermission && (
                                            <a className="dropdown-item" onClick={() => handleShowResetUser(row.original)}>Reset Password</a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );

                    } else if (row.original.status === disabled) {
                        return (
                            <div className="btn-group">
                                <div className="btn-group">
                                    <button className="btn btn-default btn-flat"><i className="nav-icon fa fa-cogs"></i></button>
                                    <button type="button" className="btn btn-default btn-flat dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                        <span className="sr-only">Toggle Dropdown</span>
                                    </button>
                                    <div className="dropdown-menu" role="menu">
                                        <a className="dropdown-item" onClick={() => handleViewUser(row.original)}>View User</a>
                                        {editPermission && (
                                            <a className="dropdown-item" onClick={() => handleActiveUser(row.original)}>Actived User</a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );

                    }

                    return (
                        <div className="btn-group">
                            <div className="btn-group">
                                <button className="btn btn-default btn-flat"><i className="nav-icon fa fa-cogs"></i></button>
                                <button type="button" className="btn btn-default btn-flat dropdown-toggle dropdown-icon" data-toggle="dropdown">
                                    <span className="sr-only">Toggle Dropdown</span>
                                </button>
                                <div className="dropdown-menu" role="menu">
                                    <a className="dropdown-item" onClick={() => handleViewUser(row.original)}>View User</a>
                                    {editPermission && (
                                        <a className="dropdown-item" onClick={() => handleShowUnlockModal(row.original)}>Unlock User</a>
                                    )}
                                    {delPermission && (
                                        <a className="dropdown-item" onClick={() => handleShowDeleteModal(row.original)}>Delete User</a>
                                    )}
                                    {editPermission && (
                                        <a className="dropdown-item" onClick={() => handleResetUser(row.original)}>Reset Password</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                },
            },
            {
                Header: 'Actions',
                Cell: ({ row }) => {
                    if (row.original.status === 'ACTIVE' && row.original.authBy === 'LDAP') {
                        return (
                            <div>
                                <Button variant="outline-primary" onClick={() => handleEditUser(row.original)}><i className="fas fa-edit"></i></Button>&nbsp;
                                <Button variant="outline-success" onClick={() => handleTestLogin(row.original)}><i className="fas fa-sign-in"></i></Button>
                            </div>
                        );
                    } else if (row.original.status === 'ACTIVE' && row.original.authBy !== 'LDAP') {
                        return (
                            <div>
                                <Button variant="outline-primary" onClick={() => handleEditUser(row.original)}><i className="fas fa-edit"></i></Button>
                            </div>
                        );
                    }
                    else if (row.original.status === pendingApproval) {
                        return (
                            <div>
                                <Button variant="outline-success" onClick={() => handleShowApproveModal(row.original)}><i className="fas fa-check"></i></Button>&nbsp;

                            </div>
                        );
                    } else if (row.original.status === pendingDelete && row.original.createdBy !== userLoggin) {
                        return (
                            <div>
                                <Button variant="outline-danger" onClick={() => handledisabled(row.original)}><i className="fas fa-check"></i></Button>&nbsp;
                                <Button variant="outline-secondary" onClick={() => handleShowApproveModal(row.original)}><i className="fas fa-x"></i></Button>&nbsp;
                            </div>
                        );
                    }
                    else if (row.original.createdBy === userLoggin && authPermission === false && row.original.status !== active) {
                        return null;
                    }

                },
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


    const handleUpdate = (user) => {
        // Implement logic to update user data
        alert(`Username : ${user.userName}`);
    };

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
                                    value={searchUsername}
                                    onChange={(e) => setSearchUsername(e.target.value)}
                                    placeholder="Search by username"
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

            {selectedUser && (
                <div className={`modal${showModal ? ' show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">View User Details</h4>
                                <button type="button" className="close" onClick={closeModal}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {/* Display user details here */}
                                <table className="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <td>Email:</td>
                                            <td>{selectedUser.email}</td>
                                        </tr>
                                        <tr>
                                            <td>First Name:</td>
                                            <td>{selectedUser.firstName}</td>
                                        </tr>
                                        <tr>
                                            <td>Last Name:</td>
                                            <td>{selectedUser?.lastName}</td>
                                        </tr>
                                        <tr>
                                            <td>Phone Number:</td>
                                            <td>{selectedUser?.phoneNumber}</td>
                                        </tr>
                                        <tr>
                                            <td>Created At:</td>
                                            <td>{selectedUser?.createdAt}</td>
                                        </tr>
                                        <tr>
                                            <td>Updated At:</td>
                                            <td>{selectedUser?.updatedAt}</td>
                                        </tr>
                                        {selectedUser?.group?.map((group, index) => (
                                            <tr key={index}>
                                                <td>Group Name:</td>
                                                <td>{group.name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" onClick={closeModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal konfirmasi penghapusan */}
            <Modal show={showApproveModal} onHide={() => setShowApproveModal(false)}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                    {/* Ganti ikon tombol close (X) */}
                    <Button variant="link default" onClick={handleShowApproveModal}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to approve the user: {userToApprove && userToApprove.userName}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />   Cancel
                    </Button>
                    <Button variant="primary" onClick={handlePendingApproval}>
                        <FontAwesomeIcon icon={faCheck} />  Approval
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal konfirmasi penghapusan */}
            <Modal show={showUnlockModal} onHide={() => setShowUnlockModal(false)}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                    {/* Ganti ikon tombol close (X) */}
                    <Button variant="link default" onClick={handleCloseModal}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to unlock the user: {userToUnlock && userToUnlock.userName}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUnlockModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />   Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUnlockUser}>
                        <FontAwesomeIcon icon={faUnlock} />  Unlock
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal konfirmasi penghapusan */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                    {/* Ganti ikon tombol close (X) */}
                    <Button variant="link default" onClick={handleCloseModal}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the user: {userToDelete && userToDelete.userName}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />   Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteUser}>
                        <FontAwesomeIcon icon={faTrash} />   Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal konfirmasi */}
            <Modal show={showModalLock} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                    {/* Ganti ikon tombol close (X) */}
                    <Button variant="link default" onClick={handleCloseModal}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to lock the user: {userToLock && userToLock.userName}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmLockUser}>
                        <FontAwesomeIcon icon={faLock} /> Lock User
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal konfirmasi */}
            <Modal show={showTestLoginModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                    {/* Ganti ikon tombol close (X) */}
                    <Button variant="link default" onClick={handleCloseModal}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    {/* Are you sure you want to lock the user: {userToLock && userToLock.userName}? */}
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password:</Form.Label>
                        {/* <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={handlePasswordChange}
                            autoComplete="new-password"
                            required
                        /> */}
                        <div className="input-group mb-3">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                autoComplete="new-password"
                                required
                            />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span
                                        className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ cursor: 'pointer' }}
                                    ></span>
                                </div>
                            </div>
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                    </Button>
                    <Button variant="success" type="submit" onClick={confirmTestLogin}>
                        <FontAwesomeIcon icon={faCheck} /> Test
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModalReset} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                    {/* Ganti ikon tombol close (X) */}
                    <Button variant="link default" onClick={handleCloseModal}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to lock the user: {userToReset && userToReset.userName}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                    </Button>
                    <Button variant="success" type="submit" onClick={handleResetUser}>
                        <FontAwesomeIcon icon={faCheck} /> Reset Password
                    </Button>
                </Modal.Footer>
            </Modal>
            {selectedUser && (
                <EditUserModal
                    showEdit={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    username={selectedUser}
                    handleSubmit={handleFormSubmit}
                    reloadData={reloadData}
                />
            )}
        </Fragment>
    );
};

export default Users;
