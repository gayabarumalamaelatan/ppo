import React, { useState, useEffect } from 'react';
import FormTable from '../tables/FormTable';
import { FaAddressBook, FaCog, FaCogs, FaDownload, FaFilter, FaNewspaper, FaSearch, FaSyncAlt, FaTimes } from 'react-icons/fa';
import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FORM_SERVICE_DELETE_DATA, FORM_SERVICE_LOAD_DATA, FORM_SERVICE_LOAD_FIELD, FORM_SERVICE_REPORT_DATA, FORM_SERVICE_REPORT_DATA_CSV, FORM_SERVICE_REPORT_DATA_EXCEL } from '../config/ConfigApi';
import axios from 'axios';
import { disabled, token } from '../config/Constants';
import FormModalAddNew from '../modal/form/FormModalAddNew';
import { assertPipelinePrimaryTopicReference } from '@babel/types';
import { useRecoilValue } from 'recoil';
import { menusState } from '../store/RecoilFormTemplate';
import * as XLSX from 'xlsx';

const FormTemplate = () => {
    //const { idForm, prefixTable, menuName } = useSelector(state => state);
    const menusForm = useRecoilValue(menusState);
    const dispatch = useDispatch();
    const [columns, setColumns] = useState([]);
    const [formCode, setFormCode] = useState('');
    const [accountData, setAccountData] = useState([]);
    const headers = { Authorization: `Bearer ${token}` };
    const [getFormcode, setGetFormCode] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [filterColumn, setfilterColumn] = useState('');
    const [filterOperation, setFilterOperation] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterStatus, setFilterStatus] = useState(false);
    const [totalPage, setTotalPage] = useState('');
    const [primaryKeyColumn, setPrimaryKeyColumn] = useState(null);
    const [isLoadingTable, setIsLoadingTable] = useState(false);

    console.log('MenusForm', menusForm);
    const idForm = menusForm["idForm"];
    const prefixTable = menusForm["prefixTable"];
    const menuName = menusForm["menuName"];
    const canCreate = menusForm["create"];
    const canUpdate = menusForm["update"];
    const canDelete = menusForm["delete"];
    const canVerify = menusForm["verify"];
    const canAuth = menusForm["auth"];

    console.log('ID FORM',idForm);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const fetchHeader = async () => {
        try {
           // console.log('Exec Fetch Header');
            const response = await axios.get(`${FORM_SERVICE_LOAD_FIELD}?formId=${idForm}`, { headers });
            const formCode = response.data.map(getFormcode => getFormcode.formCode);
            console.log('Get Form code',formCode);
            setGetFormCode(formCode[0]);

            // setPrimaryKeyColumn(response.data[0].primaryKeyColumn);
            //console.log('Response data : ', response.data);

            const primaryKeyColumnObj = response.data.find(apiColumn => apiColumn.isPrimaryKey === true);

            //console.log('Key', primaryKeyColumnObj.primaryKeyColumn);

            setPrimaryKeyColumn(primaryKeyColumnObj.fieldName);

            const transformedColumns = response.data.map(apiColumn => ({
                Header: apiColumn.description,
                accessor: apiColumn.fieldName,
                sortType: 'basic',
                lookupTable: apiColumn.lookupTable,
                displayFormat: apiColumn.displayFormat,
                
                // You can customize this
            }));
            setColumns(transformedColumns);
            //console.log('getFormcode', getFormcode);
            fetchData(formCode[0]);
            setColumnVisibility(
                Object.fromEntries(transformedColumns.map(column => [column.accessor, true])));
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const fetchData = (formCodePass) => {
        setIsLoadingTable(true);

        if (filterColumn !== '' && filterOperation !== '' && filterValue !== '') {
            return axios
                .get(`${FORM_SERVICE_LOAD_DATA}?f=${formCodePass}&page=${currentPage}&size=${pageSize}&filterBy=${filterColumn}&filterValue=${filterValue}&operation=${filterOperation}`, { headers })
                .then((response) => {
                    setTimeout(() => {
                        setAccountData(response.data.data);
                        setTotalItems(response.data.totalAllData);
                        setIsLoadingTable(false); // Stop loading
                    }, 1000);

                    //console.log('Log Point: Fetch Filtered Data')
                    // console.log('Response get Data : ', accountData);
                    // console.log('Response get ')
                })
                .catch((error) => {
                    console.log('Error fetching data:', error);
                });
        } else {
            return axios
                .get(`${FORM_SERVICE_LOAD_DATA}?f=${formCodePass}&page=${currentPage}&size=${pageSize}`, { headers })
                .then((response) => {

                    setTimeout(() => {
                        setAccountData(response.data.data);
                        setTotalItems(response.data.totalAllData);
                        setTotalPage(response.data.totalPage);
                        if (totalPage != response.data.totalPage && currentPage === totalPage) {
                            setCurrentPage(response.data.totalPage);
                           // console.log('Log Point: Fetch Data to Last Page')
                            //console.log('Redirect from last page', totalPage, 'to newest last page', response.data.totalPage);
                        }
                        // console.log('Log Point: Fetch Data')
                        setIsLoadingTable(false); // Stop loading
                    }, 1000);


                    // console.log('Response get Data : ', accountData);
                    // console.log('Response get ')
                })
                .catch((error) => {
                    console.log('Error fetching data:', error);
                });
        }

    };

    const fetchfilteredData = (formCodePass, filterBy, filterOperation, value) => {
        setIsLoadingTable(true);
        console.log('formcode', formCode);
        console.log('codeFormPass', formCodePass);
        return axios
            .get(`${FORM_SERVICE_LOAD_DATA}?f=${formCodePass}&page=${currentPage}&size=${pageSize}&filterBy=${filterBy}&filterValue=${value}&operation=${filterOperation}`, { headers })
            .then((response) => {

                setTimeout(() => {
                    setAccountData(response.data.data);
                    setTotalItems(response.data.totalAllData);
                    setIsLoadingTable(false); // Stop loading
                }, 1000);

                // console.log('Response get Data : ', accountData);
                // console.log('Response get ')
            })
            .catch((error) => {
                console.log('Error fetching data:', error);
            });
    };

    // const fetchFilteredData = (formCodePass, filterBy, filterOperation, value) => {
    //     console.log('formcode', formCode);
    //     console.log('codeFormPass', formCodePass);

    //     return axios
    //       .get(`${FORM_SERVICE_LOAD_DATA}?f=${formCodePass}&page=${currentPage}&size=${pageSize}&filterBy=${filterBy}&filterValue=${value}&operation=${filterOperation}`, { headers })
    //       .then((response) => {
    //         setAccountData(response.data.data);
    //         setTotalItems(response.data.totalAllData);
    //         // console.log('Response get Data : ', accountData);
    //         // console.log('Response get ')
    //       })
    //       .catch((error) => {
    //         console.log('Error fetching data:', error);
    //       });
    //   };


    // const fetchFilteredData = (formCodePass, filterBy, filterOperation, value) => {
    //     console.log('formcode', formCode);
    //     console.log('codeFormPass', formCodePass);

    //     return axios
    //       .get(`${FORM_SERVICE_LOAD_DATA}?f=${formCodePass}&page=${currentPage}&size=${pageSize}&filterBy=${filterBy}&filterValue=${value}&operation=${filterOperation}`, { headers })
    //       .then((response) => {
    //         setAccountData(response.data.data);
    //         setTotalItems(response.data.totalAllData);
    //         // console.log('Response get Data : ', accountData);
    //         // console.log('Response get ')
    //       })
    //       .catch((error) => {
    //         console.log('Error fetching data:', error);
    //       });
    //   };

    // useEffect(() => {
    //     fetchHeader();
    // }, []);

    useEffect(() => {
        // console.log('Response get Data : ', accountData);
        fetchHeader();
        fetchData(getFormcode);
    }, [pageSize, currentPage, filterStatus,primaryKeyColumn,idForm]);

    const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [columnVisibility, setColumnVisibility] = useState();


    const handleCustomizeToggle = () => {
        setIsCustomizeOpen(!isCustomizeOpen);
        setIsFilterOpen(false);
    };

    const handleFilterToggle = () => {
        setIsFilterOpen(!isFilterOpen);
        setIsCustomizeOpen(false);
    };

    const handleToggleColumn = accessor => {
        console.log('accesor', accessor);
        setColumnVisibility(prevVisibility => ({
            ...prevVisibility,
            [accessor]: !prevVisibility[accessor]
        }));
    };

    const handleApplyCustomize = () => {
        setIsCustomizeOpen(false);
    };

    const handleApplyFilters = () => {
        console.log('selected Column', filterColumn);
        console.log('selected Operation', filterOperation);
        console.log('filter value', filterValue);
        setCurrentPage(1);
        setFilterStatus(!filterStatus);
        // console.log("test");
    }

    const handleResetFilters = () => {
        setfilterColumn('');
        setFilterOperation('');
        setFilterValue('');
        setCurrentPage(1);
        setFilterStatus(!filterStatus);
        console.log("reset");
    }

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setCurrentPage(1); // Kembalikan ke halaman pertama setelah mengubah ukuran halaman
    };

    const handlePageChange = newPage => {
        setCurrentPage(newPage);
        console.log('currentPage', currentPage);
        console.log('newPage', newPage)
    };

    const handleRefresh = () => {
        console.log('refresh');
        fetchData(getFormcode);
    }

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
        XLSX.writeFile(wb, `${menuName}-${getCurrentDateTime()}.csv`, {bookType: 'csv'});  // Note the added bookType parameter for CSV
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
        <Fragment>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>{menuName}</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/">Home</a></li>
                                <li className="breadcrumb-item active">{menuName}</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="card">
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-4">
                                <div className="col-md-12 d-flex align-items-center">
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
                                    {/* <div className="input-group input-group-sm" >
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search"
                                        />
                                        <div className="input-group-append">
                                            <button className="btn btn-primary">
                                                <FaSearch />
                                            </button>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="col-md-8 d-flex justify-content-end align-items-center">

                                <div className="btn-group ml-2">
                                   {canCreate && ( <button
                                        type="button"
                                        className="btn btn-success"
                                        onClick={openModal}
                                    >
                                        <FaAddressBook /> Add New
                                    </button>
                                   )}
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        onClick={() => fetchData(getFormcode)}
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
                    </div>
                </div>

                {isCustomizeOpen && (
                    <div className='row'>
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        {columns.map((column, index) => (
                                            <div className="col-lg-3 col-md-6 mb-2" key={column.accessor}>
                                                <label className="d-flex align-items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={columnVisibility[column.accessor]}
                                                        onChange={() => handleToggleColumn(column.accessor)}
                                                        disabled={index === 0 ? true : false}
                                                    />
                                                    <span className="ml-2">{column.Header}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="col-md-12 d-flex justify-content-end align-items-center">
                                        <button className="btn btn-secondary" onClick={handleApplyCustomize}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {isFilterOpen && (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Column Filters</h3>
                                </div>
                                <div className="card-body">
                                    <form className="row">
                                        <div className="col-md-4 mb-3">
                                            <select
                                                className="form-control"
                                                value={filterColumn}
                                                onChange={(e) => setfilterColumn(e.target.value)}
                                            >
                                                <option value="">Select a column</option>
                                                {columns.map(column => (
                                                    <option key={column.accessor} value={column.accessor} >
                                                        {column.Header}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <select
                                                className="form-control"
                                                value={filterOperation}
                                                onChange={(e) => setFilterOperation(e.target.value)}
                                            >
                                                <option value="">Select filter</option>
                                                <option value="EQUAL">Equal</option>
                                                <option value="NOTEQUAL">Not Equal</option>
                                                <option value="LIKE">Contains</option>
                                            </select>
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Enter value"
                                                value={filterValue}
                                                onChange={(e) => setFilterValue(e.target.value)}
                                            />
                                        </div>
                                    </form>
                                    <div className="d-flex justify-content-end align-items-center mt-3">
                                        <button className="btn btn-secondary mr-2" onClick={handleResetFilters}>
                                            Reset
                                        </button>
                                        <button className="btn btn-primary" onClick={handleApplyFilters}>
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}



                <div className='card'>

                    <div className='card-body'>
                        <FormTable
                            columns={columns}
                            data={accountData}
                            columnVisibility={columnVisibility}
                            pageSize={pageSize}
                            totalItems={totalItems}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            formCode={getFormcode}
                            refecthCallBack={() => fetchData(getFormcode)}
                            menuName={menuName}
                            primayKey={primaryKeyColumn}
                            isLoadingTable={isLoadingTable}
                            editPermission = {canUpdate}
                            deletePermission = {canDelete}
                        />
                    </div>
                </div>
                <FormModalAddNew
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    columns={columns}
                    menuName={menuName}
                    formCode={getFormcode}
                    reFormfetchCallback={() => fetchData(getFormcode)}
                />
            </section >
        </Fragment >

        //<FormTable columns={columns} data={accountData} />
    );
};

export default FormTemplate;