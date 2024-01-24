import axios from "axios";
import React, { useState } from "react";
import { Fragment } from "react";
import { useTable } from "react-table";
import { MENU_SERVICE_ALL_MENU, MENU_SERVICE_DELETE_MENU, MENU_SERVICE_DETAIL } from "../config/ConfigApi";
import { useEffect } from "react";
import { Button, Modal, ModalBody, Pagination } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import UpdateMenuModal from "../modal/UpdateMenuModal";
import { showDynamicSweetAlert } from "../toast/Swal";

const { inactive, getToken } = require('../config/Constants');

const MenuListTable = ({ editPermission, deletePermission, refreshTableStatus }) => {
    // API Call Variable
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    // Table Variable
    const [dataTable, setDataTable] = useState([]);
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [searchFilterValue, setSearchFilterValue] = useState('');
    const [resetTableStatus, setResetTableStatus] = useState(false);

    // API CRUD Variable
    const [menuToDelete, setMenuToDelete] = useState(null);
    const [menuToView, setMenuToView] = useState(null);
    const [menuToUpdate, setMenuToUpdate] = useState(null);

    // Kosmetik Variable
    const [isLoadingTable, setIsLoadingTable] = useState(true);

    // Modal variable
    const [showViewModal, setShowViewModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // To convert ISO date format to standar
    const formatDate = (dateString) => {
        var date2 = String(dateString).replaceAll("T", " ");
        return date2
    };


    // API Call Logic
    const fetchData = async () => {
        try {
            setIsLoadingTable(true);
            if (searchFilterValue !== '') {
                const response = await axios.get(`${MENU_SERVICE_ALL_MENU}?page=${currentPage}&size=${pageSize}&menuName=${searchFilterValue}`, { headers })

                setTimeout(() => {
                    setDataTable(response.data.coreMenus);
                    setTotalItem(response.data.totalItems);
                    setIsLoadingTable(false);
                }, 500)
            } else {
                const response = await axios.get(`${MENU_SERVICE_ALL_MENU}?page=${currentPage}&size=${pageSize}`, { headers })

                setTimeout(() => {
                    setDataTable(response.data.coreMenus);
                    setTotalItem(response.data.totalItems);
                    setIsLoadingTable(false);
                }, 500)
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoadingTable(false);
            showDynamicSweetAlert('Error', error, 'error');
            setDataTable([]);
        }
    }

    // Pagination properties
    const pageCount = Math.ceil(totalItem / pageSize);
    const startIndex = (currentPage) * pageSize + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, totalItem);

    // Load Column Header
    const columns = React.useMemo(
        () => [
            { Header: 'Module Id', accessor: 'moduleId' },
            { Header: 'Menu Name', accessor: 'menuName' },
            { Header: 'URL', accessor: 'url' },
            { Header: 'Created At', accessor: 'createdAt', Cell: ({ value }) => formatDate(value) || '-' },
            { Header: 'Updated At', accessor: 'updatedAt', Cell: ({ value }) => formatDate(value) || '-' },
            // { Header: 'Admin Action', 
            //     Cell: ({ row }) => (
            //     <div className="btn-group">
            //         <div className="btn-group">
            //             <button className="btn btn-default btn-flat"><i className="nav-icon fa fa-cogs"></i></button>
            //             <button type="button" className="btn btn-default btn-flat dropdown-toggle dropdown-icon" data-toggle="dropdown">
            //                 <span className="sr-only">Toggle Dropdown</span>
            //             </button>
            //             <div className="dropdown-menu" role="menu">
            //                 <a 
            //                     className="dropdown-item" 
            //                     onClick={() => handleViewMenu(row.original)}
            //                 >View Menu</a>
            //                 <a 
            //                     className="dropdown-item" 
            //                     onClick={() => handleUpdateMenu(row.original)}
            //                 >Update Menu</a>
            //                 <a 
            //                     className="dropdown-item" 
            //                     onClick={() => handleShowDeleteModal(row.original)}
            //                 >Delete Menu</a>
            //             </div>
            //         </div>
            //     </div>
            //     )
            // }
            {
                Header: 'Admin Action',
                Cell: ({ row }) => (
                    <div>
                        <Button variant="outline-success" style={{ marginRight: '5px' }} onClick={() => handleViewMenu(row.original)}><i className="fas fa-eye"></i></Button>
                        {editPermission && (
                            <Button variant="outline-primary" style={{ marginRight: '5px' }} onClick={() => handleUpdateMenu(row.original)}><i className="fas fa-edit"></i></Button>
                        )}
                        {deletePermission && (
                            <Button variant="outline-danger" onClick={() => handleShowDeleteModal(row.original)}><i className="fas fa-trash"></i></Button>
                        )}
                    </div>
                )
            },
        ],
        []
    )

    // API Call
    useEffect(() => {
        fetchData();
    }, [currentPage, pageSize, refreshTableStatus, resetTableStatus,searchFilterValue])

    // Render Table
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data: dataTable,
        }
    );

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

    const handleDeleteMenu = async () => {
        console.log('Delete!')
        try {
            const data = {
                status: inactive, // Ganti dengan status yang sesuai untuk mengunci pengguna
                id: menuToDelete.id, // Dapatkan username dari objek user yang diberikan
            };

            const response = await axios.put(`${MENU_SERVICE_DELETE_MENU}`, data, { headers });

            // console.log('User locked successfully:', response.data);

            // Tutup modal konfirmasi
            setShowDeleteModal(false);
            // Reset userToLock menjadi null
            setMenuToDelete(null);
            // Tambahkan logika 

            showDynamicSweetAlert('Success', 'Menu has been deleted successfully.', 'success');
            // Tambahkan logika lain sesuai dengan kebutuhan Anda setelah penguncian pengguna berhasil
            fetchData();
        } catch (error) {
            console.error('Error Delete menus :', error);
            showDynamicSweetAlert('Error', error, 'error');
            // Tambahkan logika lain sesuai dengan kebutuhan Anda untuk menangani kesalahan
        }
    }

    const handleViewMenu = async (menu) => {
        try {
            const response = await axios.get(`${MENU_SERVICE_DETAIL}?id=${menu.id}`, { headers });
            setMenuToView(response.data);
            console.log('Menu', response.data);
            setShowViewModal(true);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleResetTable = () => {
        setSearchFilterValue('');
        setCurrentPage(0);
        setResetTableStatus(!resetTableStatus);
    }


    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setCurrentPage(0); // Kembali ke halaman pertama saat filter pencarian digunakan
        fetchData();
    };

    const handleUpdateMenu = async (menu) => {
        setMenuToUpdate(menu.id);
        setShowUpdateModal(true);
    }

    // Handle Modal Function
    const handleShowDeleteModal = (menu) => {
        setMenuToDelete(menu);
        setShowDeleteModal(true);
    };

    const handleCloseViewModal = () => {
        setMenuToView(null);
        setShowViewModal(false);
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
            {/* <div className="container mt-4"> */}
            <div className="row mb-3">
                <div className="col-3">
                    <form className="form-inline">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                value={searchFilterValue}
                                onChange={(e) => setSearchFilterValue(e.target.value)}
                                placeholder="Search by Menu Name"
                            />
                            <div className="input-group-append">
                                <button type="button" className="btn btn-primary" onClick={handleSearchSubmit}>
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                {/* <div className="col-9 d-flex justify-content-end"> */}
                <div className="col-9 d-flex justify-content-end align-items-center">
                    <div className="row-per-page-label" style={{ whiteSpace: 'nowrap' }}>
                        Rows per page:
                    </div>
                    <select style={{ margin: '5px' }}
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
                {/* </div> */}
            </div>
            <div className="table-container">
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
                        )
                        }
                    </tbody>
                </table>
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
            {/* </div> */}
            {/* Modal view menu data*/}
            {menuToView &&
                <Modal show={showViewModal} onHide={() => handleCloseViewModal()}>
                    <Modal.Header>
                        <Modal.Title>View Menu Detail of {menuToView.menuName}</Modal.Title>
                        {/* Ganti ikon tombol close (X) */}
                        <Button variant="link default" onClick={() => handleCloseViewModal()}>
                            <FontAwesomeIcon icon={faTimes} />
                        </Button>
                    </Modal.Header>
                    <ModalBody>
                        <table className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td><strong>Module ID:</strong></td>
                                    <td>{menuToView.moduleId}</td>
                                </tr>
                                <tr>
                                    <td><strong>Menu Name:</strong></td>
                                    <td>{menuToView.menuName}</td>
                                </tr>
                                <tr>
                                    <td><strong>Icon:</strong></td>
                                    <td>{menuToView.icon}</td>
                                </tr>
                                <tr>
                                    <td><strong>URL:</strong></td>
                                    <td>{menuToView.url}</td>
                                </tr>
                                <tr>
                                    <td><strong>Element:</strong></td>
                                    <td>{menuToView.element}</td>
                                </tr>
                                <tr>
                                    <td><strong>Menu Code:</strong></td>
                                    <td>{menuToView.menuCode}</td>
                                </tr>
                                <tr>
                                    <td><strong>Parent Code:</strong></td>
                                    <td>{menuToView.parentCode}</td>
                                </tr>
                                <tr>
                                    <td><strong>Form ID:</strong></td>
                                    <td>{menuToView.formId}</td>
                                </tr>
                                <tr>
                                    <td><strong>Is Parent:</strong></td>
                                    <td>{menuToView.parent.toString()}</td>
                                </tr>
                                <tr>
                                    <td><strong>Created At:</strong></td>
                                    <td>{menuToView.createdAt}</td>
                                </tr>
                                <tr>
                                    <td><strong>Updated At:</strong></td>
                                    <td>{menuToView.updatedAt}</td>
                                </tr>
                            </tbody>
                        </table>
                    </ModalBody>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowViewModal(false)}>
                            <FontAwesomeIcon icon={faTimes} />   Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            }

            {/* Modal konfirmasi penghapusan */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                    {/* Ganti ikon tombol close (X) */}
                    <Button variant="link default" onClick={() => setShowDeleteModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the user: {menuToDelete && menuToDelete.menuName}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />   Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteMenu}>
                        <FontAwesomeIcon icon={faTrash} />   Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {menuToUpdate &&
                <UpdateMenuModal
                    isOpenModal={showUpdateModal}
                    menu={menuToUpdate}
                    handleClose={() => setShowUpdateModal(false)}
                    handleSubmit={() => fetchData()}

                />
            }

        </Fragment>
    )
}

export default MenuListTable;