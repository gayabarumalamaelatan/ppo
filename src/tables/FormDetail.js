import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import { FORM_SERVICE_LOAD_DATA, FORM_SERVICE_LOAD_FIELD } from '../config/ConfigApi';
import { NumericFormat } from 'react-number-format';
import { Pagination } from 'react-bootstrap';
import { FaAddressBook, FaCogs, FaDownload, FaEdit, FaEye, FaFilter, FaSyncAlt, FaTimes, FaTrash } from 'react-icons/fa';
import FormModalAddNew from '../modal/form/FormModalAddNew';
const FormDetail = ({ idForm,getFormCode, tableNameDetail, headers, rowData, keyCol,canCreate,canAuth,canVerify,editPermission,deletePermission }) => {
    console.log("getFormcode", getFormCode);
    console.log("keyCOl", keyCol);
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

    useEffect(() => {
        fetchHeaderDetail();
    }, [pageSizeDetail, currentPageDetail, rowData]); // Ensure this effect runs only once on component mount

    const fetchHeaderDetail = async () => {
        try {
            const response = await axios.get(`${FORM_SERVICE_LOAD_FIELD}?formId=${idForm}&isDetail=true`, { headers });

            // Assuming coreFields is an array
            const transformedColumns = response.data.coreFields.map(apiColumn => ({
                Header: apiColumn.description,
                accessor: apiColumn.fieldName,
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

            setTimeout(() => {
                setData(response.data.data);
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
        const transformedData = accountData.map(item =>
            accessors.map(accessor => item[accessor])
        );

        // Gabungkan header dengan data
        const dataWithHeader = [headers, ...transformedData];

        const ws = XLSX.utils.aoa_to_sheet(dataWithHeader);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, `${menuName}-${getCurrentDateTime()}.xlsx`);
    };

    const exportToCSV = () => {
        const headers = columns.map(column => column.Header);  // Mengambil headers dari kolom
        const accessors = columns.map(column => column.accessor);  // Mengambil accessors dari kolom

        // Transform accountData sesuai dengan accessors
        const transformedData = accountData.map(item =>
            accessors.map(accessor => item[accessor])
        );

        // Gabungkan header dengan data
        const dataWithHeader = [headers, ...transformedData];

        const ws = XLSX.utils.aoa_to_sheet(dataWithHeader);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");  // Anda bisa mengganti "Sheet1" dengan nama yang Anda inginkan
        XLSX.writeFile(wb, `${menuName}-${getCurrentDateTime()}.csv`, { bookType: 'csv' });  // Note the added bookType parameter for CSV
    };
    const downloadFileCsv = async () => {


        try {
            // Fetch the data from the API
            const response = await axios.get(`${FORM_SERVICE_REPORT_DATA_CSV}?formId=${idForm}`, {
                headers: headers,
                responseType: 'blob', // Set the response type to 'blob' to handle binary data
            });

            // Create a URL for the Blob
            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));

            // Create a temporary anchor tag and set the href and download attributes
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${menuName}-${getCurrentDateTime()}.csv`; // You can set the default file name here
            document.body.appendChild(a);

            // Programmatically click the anchor tag
            a.click();

            // Remove the anchor tag after downloading
            document.body.removeChild(a);

            // Revoke the Blob URL after the download
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error while downloading file: ', error);
        }
    };

    const downloadFileXls = async () => {


        try {
            // Fetch the data from the API
            const response = await axios.get(`${FORM_SERVICE_REPORT_DATA_EXCEL}?formId=${idForm}`, {
                headers: headers,
                responseType: 'blob', // Set the response type to 'blob' to handle binary data
            });

            // Create a URL for the Blob
            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));

            // Create a temporary anchor tag and set the href and download attributes
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `${menuName}-${getCurrentDateTime()}.xls`; // You can set the default file name here
            document.body.appendChild(a);

            // Programmatically click the anchor tag
            a.click();

            // Remove the anchor tag after downloading
            document.body.removeChild(a);

            // Revoke the Blob URL after the download
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error while downloading file: ', error);
        }
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
                                        onClick={() => fetchDataDetail(getFormcode)}
                                    >
                                        <FaSyncAlt />
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${isFilterOpen ? 'btn-secondary' : 'btn-default'}`}
                                        onClick={handleFilterToggle}
                                    >

                                        {isFilterOpen ? (
                                            <>
                                                <span className="ml-1"><FaTimes />Close</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaFilter /> <span className="ml-1">Filter</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${isCustomizeOpen ? 'btn-secondary' : 'btn-default'}`}
                                        onClick={handleCustomizeToggle}
                                    >

                                        {isCustomizeOpen ? (
                                            <>
                                                <span className="ml-1"><FaTimes /> Close</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaCogs /> <span className="ml-1">Customize</span>
                                            </>
                                        )}
                                    </button>
                                    <div className="dropdown">
                                        <button className="btn btn-default dropdown-toggle" type="button" id="downloadDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <FaDownload /> Download
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="downloadDropdown">
                                            <button className="dropdown-item" onClick={exportToXLS}>Download XLS</button>
                                            <button className="dropdown-item" onClick={exportToCSV}>Download CSV</button>
                                            <button className="dropdown-item" onClick={downloadFileXls}>All Data XLS</button>
                                            <button className="dropdown-item" onClick={downloadFileCsv}>All Data CSV</button>
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

                    <FormModalAddNew
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    columns={columns}
                    menuName={keyCol}
                    formCode={getFormCode}
                    tableNameDetail={tableNameDetail}
                    reFormfetchCallback={() => fetchDataDetail(getFormcode)}
                />
                </div>
            </div>
        </div>
    );
};

export default FormDetail;
