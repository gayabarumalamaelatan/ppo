import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import { FORM_SERVICE_DELETE_DATA, FORM_SERVICE_LOAD_DATA, FORM_SERVICE_LOAD_FIELD, FORM_SERVICE_REPORT_DATA_CSV, FORM_SERVICE_REPORT_DATA_EXCEL, FORM_SERVICE_VIEW_DATA } from '../config/ConfigApi';
import { NumericFormat } from 'react-number-format';
import { Modal, Pagination, Button } from 'react-bootstrap';
import { FaAddressBook, FaCogs, FaDownload, FaEdit, FaEye, FaFilter, FaSyncAlt, FaTimes, FaTrash } from 'react-icons/fa';
import FormModalAddNew from '../modal/form/FormModalAddNew';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import FormEdit from '../modal/form/FormEdit';


const FormDetail = ({ idForm, getFormCode, tableNameDetail, headers, rowData, keyCol, canCreate, canAuth, canVerify, editPermission, deletePermission, menuName }) => {
    console.log("getFormcode", getFormCode);
    console.log("keyCOl", keyCol);
    console.log("rowData", rowData);
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const [currentPageDetail, setCurrentPageDetail] = useState(1);
    const [pageSizeDetail, setPageSizeDetail] = useState(5);
    const [isLoadingTableDetail, setIsLoadingTableDetail] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = pageSizeDetail;
    // const [currentPage, setCurrentPage] = useState(1);
    const pageCount = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPageDetail - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [dataToDelete, setDataToDelete] = useState(null);
    const [dataToView, setDataToView] = useState(null);
    const [dataToEdit, setDataToEdit] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        fetchHeaderDetail();
    }, [pageSizeDetail, currentPageDetail, rowData]); // Ensure this effect runs only once on component mount

    const fetchHeaderDetail = async () => {
        try {
            const response = await axios.get(`${FORM_SERVICE_LOAD_FIELD}?formId=${idForm}&isDetail=true`, { headers });

            // Assuming coreFields is an array
            const transformedColumns = response.data.coreFields.map(apiColumn => ({
                Header: apiColumn.description,
                accessor: apiColumn.fieldName.toUpperCase(),
                sortType: 'basic',
                lookupTable: apiColumn.lookupTable,
                displayFormat: apiColumn.displayFormat,
                // Add other properties based on your requirements
            }));

            setColumns(transformedColumns);
            fetchDataDetail(tableNameDetail);
            console.log('Response data : ', transformedColumns);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const fetchDataDetail = async (tableNameDetail) => {
        setIsLoadingTableDetail(true);
        try {
            const response = await axios.get(`${FORM_SERVICE_LOAD_DATA}?t=${tableNameDetail}&filterBy=${keyCol}&filterValue=${rowData}&operation=EQUAL&page=${currentPageDetail}&size=${pageSizeDetail}&detail=true&showAll=YES`, { headers });
            const transformedData = response.data.data.map(item =>
                Object.keys(item).reduce((acc, key) => {
                  acc[key.toUpperCase()] = item[key];
                  return acc;
                }, {}));
            setTimeout(() => {
                setData(transformedData);
                setTotalItems(response.data.totalAllData);
                setIsLoadingTableDetail(false);
            }, 1000);


            console.log('Response data : ', response.data.data);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    // Use react-table hook
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    const handlePageSizeChange = (event) => {
        setPageSizeDetail(parseInt(event.target.value, 10));
        setCurrentPageDetail(1); // Kembalikan ke halaman pertama setelah mengubah ukuran halaman
    };

    function formatKey(key) {
        // Replace underscores with spaces and capitalize the first letter
        return key.replace(/_/g, ' ').replace(/\b\w/g, firstChar => firstChar.toUpperCase());
    }

    const handleShowModal = (action, dataSelected) => {
        console.log('data selected', dataSelected);
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

    const handleView = async (data) => {
        console.log('data view ', data);
        const firstValue = data.id;
        // console.log('First object ', firstObject);
        console.log('First Value ', firstValue);

        try {
            const response = await axios.get(`${FORM_SERVICE_VIEW_DATA}?t=${tableNameDetail}&column=id&value=${firstValue}`, { headers })
            console.log('Data View successfully:', response.data);
            setDataToView(response.data);
            setShowDeleteModal(false);
            setDataToDelete(null);
        } catch (error) {
            console.error('Error View data:', error);
        }
    }

    const handleDelete = async (data) => {
        setIsLoading(true);
        console.log('data view ', data);
        const columnKey = data.original.id;
        console.log('column key ', columnKey);
        try {
            const response = await axios.delete(`${FORM_SERVICE_DELETE_DATA}?t=${tableNameDetail}&column=id&value=${columnKey}`, { headers })
            //console.log('Data delete successfully:', response.data);
            setTimeout(() => {
                setShowDeleteModal(false);
                setDataToDelete(null);
                fetchDataDetail(tableNameDetail);
                setIsLoading(false);
            }, 1000);

        } catch (error) {
            console.error('Error deleting data:', error);
        }
    }

    const handleActionClick = (action, rowData) => {
        if (action === 'Delete') {
            handleDelete(dataToDelete);
        } else if (action === 'Edit') {
            console.log('edit for data', rowData);
        }
    };


    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleCustomizeToggle = () => {
        setIsCustomizeOpen(!isCustomizeOpen);
        setIsFilterOpen(false);
    };

    const handleFilterToggle = () => {
        setIsFilterOpen(!isFilterOpen);
        setIsCustomizeOpen(false);
    };

    const getCurrentDateTime = () => {
        const date = new Date();
        return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
    };


    const exportToXLS = () => {
        const headers = columns.map(column => column.Header);
        const accessors = columns.map(column => column.accessor);

        // Transform accountData sesuai dengan accessors
        const transformedData = data.map(item =>
            accessors.map(accessor => item[accessor])
        );

        // Gabungkan header dengan data
        const dataWithHeader = [headers, ...transformedData];

        const ws = XLSX.utils.aoa_to_sheet(dataWithHeader);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${menuName}_Detail-${getCurrentDateTime()}.xlsx`);
    };

    const exportToCSV = () => {
        const headers = columns.map(column => column.Header);  // Mengambil headers dari kolom
        const accessors = columns.map(column => column.accessor);  // Mengambil accessors dari kolom

        // Transform accountData sesuai dengan accessors
        const transformedData = data.map(item =>
            accessors.map(accessor => item[accessor])
        );

        // Gabungkan header dengan data
        const dataWithHeader = [headers, ...transformedData];

        const ws = XLSX.utils.aoa_to_sheet(dataWithHeader);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");  // Anda bisa mengganti "Sheet1" dengan nama yang Anda inginkan
        XLSX.writeFile(wb, `${menuName}_Detail-${getCurrentDateTime()}.csv`, { bookType: 'csv' });  // Note the added bookType parameter for CSV
    };
   
    return (
        <div >
            <div className="row align-items-center">
                <div className="col-md-4">
                    <div className="col-md-12 d-flex align-items-center">
                        <div className="row-per-page-label" style={{ whiteSpace: 'nowrap' }}>
                            Rows per page:
                        </div>
                        <select style={{ margin: '5px' }}
                            id="pageSizeSelect"
                            value={pageSizeDetail}
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

                <div className="col-md-8 d-flex justify-content-end align-items-center">

                    <div className="btn-group ml-2">
                        {canCreate && (<button
                            type="button"
                            className="btn btn-success"
                            onClick={openModal}
                        >
                            <FaAddressBook /> Add New Detail
                        </button>
                        )}
                        <button
                            type="button"
                            className="btn btn-default"
                            onClick={() => fetchDataDetail(tableNameDetail)}
                        >
                            <FaSyncAlt />
                        </button>
                        <div className="dropdown">
                            <button className="btn btn-default dropdown-toggle" type="button" id="downloadDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <FaDownload /> Download
                            </button>
                            <div className="dropdown-menu" aria-labelledby="downloadDropdown">
                                <button className="dropdown-item" onClick={exportToXLS}>Download XLS</button>
                                <button className="dropdown-item" onClick={exportToCSV}>Download CSV</button>
                                {/* <button className="dropdown-item" onClick={downloadFileXls}>All Data XLS</button>
                                <button className="dropdown-item" onClick={downloadFileCsv}>All Data CSV</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div className="table-responsive">
                <table className="table table-bordered table-striped" {...getTableProps()} style={{ width: '100%' }}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                                <th>Action</th>
                            </tr>
                        ))}

                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {isLoadingTableDetail ? (
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
                            onClick={() => handlePageChange(currentPageDetail - 1)}
                            disabled={currentPageDetail === 1}
                        />
                        {Array.from({ length: pageCount }).map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === currentPageDetail}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPageDetail + 1)}
                            disabled={currentPageDetail === pageCount}
                        />
                    </Pagination>
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

                    <FormModalAddNew
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        columns={columns}
                        menuName={menuName}
                        formCode={getFormCode}
                        tableNameDetail={tableNameDetail}
                        reFormfetchCallback={() => fetchDataDetail(tableNameDetail)}
                    />

                    <FormEdit
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        columns={columns}
                        menuName={menuName}
                        getFormCode={getFormCode}
                        tableNameDetail={tableNameDetail}
                        data={dataToEdit}
                        keyCol={keyCol}
                        refecthCallBack={() => fetchDataDetail(tableNameDetail)}
                        //isWorkflow={isWorkflow}
                    />
                </div>
            </div>
        </div>
    );
};

export default FormDetail;
