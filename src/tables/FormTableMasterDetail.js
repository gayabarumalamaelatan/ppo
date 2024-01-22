import React, { useState } from 'react';
import { useTable, useSortBy } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'admin-lte/dist/css/adminlte.min.css';
import Pagination from 'react-bootstrap/Pagination';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Fragment } from 'react';
import { FORM_SERVICE_DELETE_DATA, FORM_SERVICE_LOAD_DATA, FORM_SERVICE_LOAD_FIELD, FORM_SERVICE_UPDATE_STATUS, FORM_SERVICE_VIEW_DATA } from '../config/ConfigApi';
import { approved, reject, rework, token, verified } from '../config/Constants';
import axios from 'axios';
import FormEdit from '../modal/form/FormEdit';
import { NumericFormat } from 'react-number-format';
import Swal from 'sweetalert2';
import { showDynamicSweetAlert } from '../toast/Swal';
import FormDetail from './FormDetail';

const FormTableMasterDetail = ({ idForm, tableNameDetail, columns, data, columnVisibility, pageSize, totalItems, currentPage, onPageChange, formCode, menuName, refecthCallBack, primayKey, isLoadingTable, canCreate, canVerify, canAuth, editPermission, deletePermission, isWorkflow }) => {

    //console.log('primary', primayKey);
    console.log('columnVis', columnVisibility);
    console.log('columns', columns);
    console.log('Data', data);
    //console.log('primaryKey', primayKey);
    // console.log('Current Page', currentPage)
    // console.log('Log Point: Inserting Header and Data to Table');
    const itemsPerPage = pageSize;
    // const [currentPage, setCurrentPage] = useState(1);
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const [selectedRows, setSelectedRows] = useState([]);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [isAuthing, setIsAuthing] = useState(false);
    const [isReworking, setIsReworking] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [detailData, setDetailData] = useState([]);
    const [showDetailTable, setShowDetailTable] = useState(false);
    const [headerDataDetail, setHeaderDataDetail] = useState(null);
    const [rowDataDetail, setRowDataDetail] = useState(null);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        setHiddenColumns,
    } = useTable(
        {
            columns,
            data,
            initialState: {
                sortBy: [],
                hiddenColumns: columns.filter(column => !columnVisibility[column.accessor]).map(column => column.accessor),
            },
        },
        useSortBy
    );

    useEffect(() => {
        setHiddenColumns(columns.filter(column => !columnVisibility[column.accessor]).map(column => column.accessor));
    }, [columnVisibility]);


    const handlePageChange = newPage => {
        // setCurrentPage(newPage);
        onPageChange(newPage);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [dataToView, setDataToView] = useState(null);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const headers = { Authorization: `Bearer ${token}` };




    const handleDelete = async (data) => {
        setIsLoading(true);
        console.log('data view ', data);
        const columnKey = Object.keys(data.original)
        console.log(columnKey[0], "Data to Delete: ", data.original[columnKey[0]]);
        try {
            const response = await axios.delete(`${FORM_SERVICE_DELETE_DATA}?f=${formCode}&column=${primayKey}&value=${data.original[columnKey[0]]}`, { headers })
            //console.log('Data delete successfully:', response.data);
            setTimeout(() => {
                setShowDeleteModal(false);
                setDataToDelete(null);
                refecthCallBack();
                setIsLoading(false);
            }, 1000);

        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }

    const handleView = async (data) => {
        console.log('data view ', data);
        const firstObject = columns[0].accessor;
        const firstValue = Object.values(data)[2];
        // console.log('First object ', firstObject);
        console.log('First Value ', firstValue);

        try {
            const response = await axios.get(`${FORM_SERVICE_VIEW_DATA}?f=${formCode}&column=${primayKey}&value=${firstValue}`, { headers })
            console.log('Data View successfully:', response.data);
            setDataToView(response.data);
            setShowDeleteModal(false);
            setDataToDelete(null);
        } catch (error) {
            console.error('Error View data:', error);
        }
    }

    const handleShowModal = (action, dataSelected) => {
        console.log('action ', action, 'data selected', dataSelected);
        if (action === 'Delete') {
            setDataToDelete(dataSelected);
            setShowDeleteModal(true);

        } else if (action === 'Edit') {
            //handleEdit(dataSelected);
            setDataToEdit(dataSelected);
            setShowEditModal(true);
            console.log('edit for data', dataSelected);
        } else if (action === 'View') {
            //setDataToView(dataSelected);
            handleView(dataSelected);
            setShowViewModal(true);
        }

    }

    const handleActionClick = (action, rowData) => {
        if (action === 'Delete') {
            handleDelete(dataToDelete);
        } else if (action === 'Edit') {
            console.log('edit for data', rowData);
        }
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
    };

    function formatKey(key) {
        // Replace underscores with spaces and capitalize the first letter
        return key.replace(/_/g, ' ').replace(/\b\w/g, firstChar => firstChar.toUpperCase());
    }

    const handleVerify = async () => {
        setIsLoading(true);
        setIsVerifying(true);

        try {
            // Ambil data yang terpilih
            const selectedData = selectedRows.map((index) => rows[index].original);

            // Loop melalui setiap data terpilih dan kirim permintaan API
            for (const data of selectedData) {
                // Ubah data sesuai dengan struktur body request yang diinginkan
                const requestData = {
                    idTrx: data.id, // Menggunakan ID dari data terpilih
                    status: verified, // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
                };

                // Lakukan aksi verifikasi, misalnya, kirim data ke backend
                const response = await axios.post(`${FORM_SERVICE_UPDATE_STATUS}?f=${formCode}`, requestData, { headers });

                // Lakukan sesuatu dengan respons dari API, misalnya, tampilkan log atau lakukan pembaruan setelah verifikasi
                console.log(`Verification for ID ${data.id} successful. `);
            }

            setTimeout(() => {
                setSelectedRows([]);
                refecthCallBack();
            }, 1000);
            // Setelah semua verifikasi berhasil, kosongkan seleksi
            showDynamicSweetAlert('Verification Successful!', 'Data has been verified successfully.', 'success');
            setIsLoading(false);
            // Tambahkan logika atau panggil fungsi yang sesuai setelah verifikasi selesai
        } catch (error) {
            console.error('Error during verification:', error);
            showDynamicSweetAlert('Error!', error, 'error');
        } finally {
            setIsRejecting(false);
            setIsLoading(false);
        }
    };

    const handleAuthorize = async () => {
        setIsLoading(true);
        setIsAuthing(true);

        try {
            // Ambil data yang terpilih
            const selectedData = selectedRows.map((index) => rows[index].original);

            // Loop melalui setiap data terpilih dan kirim permintaan API
            for (const data of selectedData) {
                // Ubah data sesuai dengan struktur body request yang diinginkan
                const requestData = {
                    idTrx: data.id, // Menggunakan ID dari data terpilih
                    status: approved, // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
                };

                // Lakukan aksi verifikasi, misalnya, kirim data ke backend
                const response = await axios.post(`${FORM_SERVICE_UPDATE_STATUS}?f=${formCode}`, requestData, { headers });

                // Lakukan sesuatu dengan respons dari API, misalnya, tampilkan log atau lakukan pembaruan setelah verifikasi
                console.log(`Verification for ID ${data.id} successful. `);
            }

            setTimeout(() => {
                setSelectedRows([]);
                refecthCallBack();
            }, 1000);
            // Setelah semua verifikasi berhasil, kosongkan seleksi
            showDynamicSweetAlert('Authorization Successful!', 'Data has been authorized successfully.', 'success');
            setIsLoading(false);
            // Tambahkan logika atau panggil fungsi yang sesuai setelah verifikasi selesai
        } catch (error) {
            console.error('Error during verification:', error);
            showDynamicSweetAlert('Error!', error, 'error');
        } finally {
            setIsAuthing(false);
            setIsLoading(false);
        }
    };


    const handleReject = async () => {
        setIsRejecting(true);

        try {
            // Ambil data yang terpilih
            const selectedData = selectedRows.map((index) => rows[index].original);

            // Loop melalui setiap data terpilih dan kirim permintaan API
            for (const data of selectedData) {
                // Ubah data sesuai dengan struktur body request yang diinginkan
                const requestData = {
                    idTrx: data.id, // Menggunakan ID dari data terpilih
                    status: reject, // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
                };

                // Lakukan aksi verifikasi, misalnya, kirim data ke backend
                const response = await axios.post(`${FORM_SERVICE_UPDATE_STATUS}?f=${formCode}`, requestData, { headers });

                // Lakukan sesuatu dengan respons dari API, misalnya, tampilkan log atau lakukan pembaruan setelah verifikasi
                console.log(`Verification for ID ${data.id} successful. `);
            }

            setTimeout(() => {
                setSelectedRows([]);
                refecthCallBack();
            }, 1000);
            // Setelah semua verifikasi berhasil, kosongkan seleksi
            showDynamicSweetAlert('Rejection Successful!', 'Data has been rejected successfully.', 'success');
            setIsLoading(false);

        } catch (error) {
            console.error('Error during verification:', error);
            showDynamicSweetAlert('Error!', error, 'error');
        } finally {
            setIsRejecting(false);
            setIsLoading(false);
        }
    };

    const handleRework = async () => {
        setIsReworking(true);

        try {
            // Ambil data yang terpilih
            const selectedData = selectedRows.map((index) => rows[index].original);

            // Loop melalui setiap data terpilih dan kirim permintaan API
            for (const data of selectedData) {
                // Ubah data sesuai dengan struktur body request yang diinginkan
                const requestData = {
                    idTrx: data.id, // Menggunakan ID dari data terpilih
                    status: rework, // Ganti dengan nilai status yang sesuai, atau sesuaikan sesuai kebutuhan
                };

                // Lakukan aksi verifikasi, misalnya, kirim data ke backend
                const response = await axios.post(`${FORM_SERVICE_UPDATE_STATUS}?f=${formCode}`, requestData, { headers });


            }

            setTimeout(() => {
                setSelectedRows([]);
                refecthCallBack();
            }, 1000);
            // Setelah semua verifikasi berhasil, kosongkan seleksi
            showDynamicSweetAlert('Rework Successful!', 'Data has been sent to rework successfully.', 'success');
            setIsLoading(false);

        } catch (error) {
            console.error('Error during Rework:', error);
            showDynamicSweetAlert('Error!', error, 'error');
        } finally {
            setIsRejecting(false);
            setIsLoading(false);
        }
    };

    const handleConfirmation = (action) => {
        Swal.fire({
            text: `Are you sure you want to ${action.toLowerCase()} selected data?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                // Jika pengguna mengklik "Yes"
                // Jalankan fungsi sesuai dengan action (Verify, Authorize, atau Reject)
                if (action === 'Verify') {
                    handleVerify();
                } else if (action === 'Authorize') {
                    handleAuthorize();
                } else if (action === 'Reject') {
                    handleReject();
                } else if (action === 'Rework') {
                    handleRework();
                }
            }
        });
    };

    const handleRowClick = async (rowIndex) => {
        try {
            // Get the original data of the selected row
            const selectedRow = rows[rowIndex].original;
            console.log(selectedRow);
            setSelectedRows([rowIndex]);
            setSelectedRowData(selectedRow);
            if(tableNameDetail){
                setShowDetailTable(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        if (!tableNameDetail){
            setShowDetailTable(false);
        }
        setSelectedRowData(null);
        setSelectedRows([]);
    }, [tableNameDetail]);

    const [selectedRowData, setSelectedRowData] = useState(null);



    return (


        <Fragment>
            {isWorkflow && (
                <div className="mb-3">
                    {(canVerify || canAuth) && (
                        /* Tombol Rework */
                        <button
                            className="btn btn-warning btn-sm mr-3"
                            onClick={() => handleConfirmation('Rework')}
                            disabled={selectedRows.length === 0}
                        >
                            <i className="fas fa-redo"></i> Rework
                        </button>
                    )}
                    {canVerify && (
                        /* Tombol Verify */
                        <button
                            className="btn btn-success btn-sm mr-3"
                            onClick={() => handleConfirmation('Verify')}
                            disabled={selectedRows.length === 0}
                        >
                            <i className="fas fa-check"></i> Verify
                        </button>
                    )}
                    {canAuth && (
                        /* Tombol Authorize */
                        <button
                            className="btn btn-success btn-sm mr-3"
                            onClick={() => handleConfirmation('Authorize')}
                            disabled={selectedRows.length === 0}
                        >
                            <i className="fas fa-check"></i> Authorize
                        </button>
                    )}
                    {/* Tombol Reject */}
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleConfirmation('Reject')}
                        disabled={selectedRows.length === 0}
                    >
                        <i className="fas fa-times"></i> Reject
                    </button>
                </div>
            )}


            <div className="table-responsive">

                <table className="table table-bordered table-hover" {...getTableProps()} >
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {isWorkflow && (
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                const allRows = rows.map((row, index) => index);
                                                setSelectedRows(e.target.checked ? allRows : []);
                                            }}
                                        />
                                    </th>
                                )}
                                {headerGroup.headers.map(column => (
                                    <th key={column.accessor} className="table-header" {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        <span className="sort-icon" style={{ margin: '3px' }}>
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <i className="fas fa-sort-down"></i>
                                                ) : (
                                                    <i className="fas fa-sort-up"></i>
                                                )
                                            ) : (
                                                <i className="fas fa-sort"></i>
                                            )}
                                        </span>
                                        {column.render('Header')}
                                    </th>
                                ))}
                                <th>Action</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {isLoadingTable ? (
                            <tr>
                                <td colSpan={columns.length}>
                                    <div className="text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length}>
                                    <div className="text-center">No data available</div>
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, rowIndex) => {
                                const isSelected = selectedRows.includes(rowIndex);
                                prepareRow(row);
                                return (
                                    <tr
                                        key={row.id}
                                        onClick={() => handleRowClick(rowIndex)}
                                        className={selectedRows.includes(rowIndex) ? 'table-success' : ''}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {isWorkflow && (
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={(e) => {
                                                        setSelectedRows((prevSelected) => {
                                                            if (e.target.checked) {
                                                                return [...prevSelected, rowIndex];
                                                            } else {
                                                                return prevSelected.filter((index) => index !== rowIndex);
                                                            }
                                                        });
                                                    }}
                                                />
                                            </td>
                                        )}
                                        {row.cells.map(cell => {
                                            const column = cell.column;
                                            return (
                                                <td
                                                    key={column.id}
                                                    {...cell.getCellProps()} >
                                                    {column.displayFormat === 'CURRENCY' ? (
                                                        // Custom logic for formatting as integer or decimal
                                                        Number.isInteger(cell.value) ? (
                                                            // Format as integer
                                                            cell.value.toLocaleString()
                                                        ) : (
                                                            // Format as decimal using NumberFormatBase (replace with your actual component)
                                                            <NumericFormat
                                                                value={cell.value}
                                                                displayType={'text'}
                                                                // prefix={'Rp. '}
                                                                thousandSeparator={true}
                                                                decimalScale={2}
                                                                fixedDecimalScale
                                                            />
                                                        )
                                                    ) : column.displayFormat === 'DECIMAL' ? (
                                                        // Your logic for 'DECIMAL'
                                                        <NumericFormat
                                                            value={cell.value}
                                                            displayType={'text'}
                                                            prefix={''} // Modify prefix as needed
                                                            //thousandSeparator={true}
                                                            decimalScale={2}
                                                            fixedDecimalScale
                                                        />
                                                    ) : (
                                                        // Render cell using default rendering logic
                                                        cell.render('Cell')
                                                    )}

                                                </td>
                                            );
                                        })}
                                        <td>
                                            <div className="dropdown">
                                                <button
                                                    className="btn btn-default dropdown-toggle btn-sm float-left"
                                                    type="button"
                                                    id={`actionDropdown${row.index}`}
                                                    data-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    <i className="fa fa-cog"></i>
                                                </button>
                                                <ul
                                                    className="dropdown-menu"
                                                    aria-labelledby={`actionDropdown${row.index}`}
                                                >
                                                    <li>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={() => handleShowModal('View', row.original)}
                                                        >
                                                            <FaEye /> View
                                                        </button>
                                                    </li>
                                                    <li>
                                                        {editPermission && (
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => handleShowModal('Edit', row.original)}
                                                            >
                                                                <FaEdit /> Edit
                                                            </button>
                                                        )}
                                                    </li>
                                                    <li>
                                                        {deletePermission && (
                                                            <button
                                                                className="dropdown-item"
                                                                onClick={() => handleShowModal('Delete', row)}
                                                            >
                                                                <FaTrash /> Delete
                                                            </button>
                                                        )}
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                    {isLoading && (
                        <div className="full-screen-overlay">
                            <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                        </div>
                    )}
                </table>


                <div className="d-flex justify-content-between align-items-center">
                    <div>Showing {startIndex + 1} to {endIndex} of {totalItems} entries</div>
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {Array.from({ length: pageCount }).map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pageCount}
                        />
                    </Pagination>
                </div>



                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} >
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete data: {dataToDelete && dataToDelete.index}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setShowDeleteModal(false)}>
                            <FontAwesomeIcon icon={faTimes} />   Cancel
                        </Button>
                        <Button variant='danger' onClick={() => handleActionClick("Delete")}>
                            <FontAwesomeIcon icon={faTrash} /> Delete
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>View {menuName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Check if dataToView is not null before rendering */}
                        {dataToView ? (
                            <div className="container">
                                <div className="row">
                                    {columns.map(column => (
                                        <div key={column.accessor} className="col-md-4 mb-3">
                                            <div className="d-flex align-items-center">
                                                <strong>{formatKey(column.accessor)}:</strong>
                                                <span className="ml-2 flex-fill">
                                                    {column.displayFormat === 'CURRENCY' || column.displayFormat === 'DECIMAL' ? (
                                                        <NumericFormat
                                                            value={dataToView[column.accessor]}
                                                            displayType={'text'}
                                                            prefix={column.displayFormat === 'CURRENCY' ? '' : ''}
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            fixedDecimalScale
                                                        />
                                                    ) : (
                                                        dataToView[column.accessor]
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>No user data to display.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='secondary' onClick={() => setShowViewModal(false)}>
                            <FontAwesomeIcon icon={faTimes} /> Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <FormEdit
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    columns={columns}
                    menuName={menuName}
                    getFormCode={formCode}
                    data={dataToEdit}
                    keyCol={primayKey}
                    refecthCallBack={() => refecthCallBack()}
                    isWorkflow={isWorkflow}
                />
                
            </div>
                        <hr></hr>
            {showDetailTable && (
                    <div className="card card-primary">
                        <div className="card-header">
                            <h3 className="card-title"> Detail Data {primayKey} : {selectedRowData && selectedRowData.id}</h3>
                        </div>
                        <div className="card-body">
                            <FormDetail
                                idForm={idForm}
                                tableNameDetail={tableNameDetail}
                                headers={headers}
                                rowData={selectedRowData.id}
                                canCreate={canCreate}
                                canAuth={canAuth}
                                canVerify={canVerify}
                                editPermission={editPermission}
                                deletePermission={deletePermission}
                                keyCol={primayKey}
                                getFormCode={formCode}

                            />


                        </div>
                    </div>
                )}
        </Fragment>
    );
};

export default FormTableMasterDetail;
