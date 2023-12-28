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
import { FORM_SERVICE_DELETE_DATA, FORM_SERVICE_VIEW_DATA } from '../config/ConfigApi';
import { token } from '../config/Constants';
import axios from 'axios';
import FormEdit from '../modal/form/FormEdit';
import { NumericFormat } from 'react-number-format';

const FormTable = ({ columns, data, columnVisibility, pageSize, totalItems, currentPage, onPageChange, formCode, menuName, refecthCallBack, primayKey, isLoadingTable, editPermission, deletePermission }) => {

    //console.log('primary', primayKey);
    //console.log('columnVis', columnVisibility);
    console.log('columns', columns);
    // console.log('totalItems', totalItems);
    // console.log('Current Page', currentPage)
    // console.log('Log Point: Inserting Header and Data to Table');
    const itemsPerPage = pageSize;
    // const [currentPage, setCurrentPage] = useState(1);
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        setHiddenColumns
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
        //console.log('data view ', data);
        const firstObject = columns[0].accessor;
        const firstValue = Object.values(data)[0];
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
    return (
        <Fragment>
            <div className="table-responsive">
                <table className="table table-bordered" {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
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
                        ) : (
                            rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
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
            />

        </Fragment>
    );
};

export default FormTable;
