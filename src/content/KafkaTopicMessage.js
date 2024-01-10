import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { INTEGRATION_SERVICE_KAFKA_TOPIC_MESSAGE } from "../config/ConfigApi";
import { Pagination } from "react-bootstrap";
import { useTable } from "react-table";

const { token } = require('../config/Constants');

const KafkaTopicMessage = ({topicName, onBackClick}) => {
    // API Call Variable
    const headers = { Authorization: `Bearer ${token}` };

    // Kosmetik Variable
    const [isLoadingTable, setIsLoadingTable] = useState(true);

    // Table Variable
    const [dataTable, setDataTable] = useState([]);
    //const [totalItem, setTotalItem] = useState(0);
    //const [currentPage, setCurrentPage] = useState(0);
    //const [pageSize, setPageSize] = useState(5);

    // API Call
    const fetchData = async () => {
        try {
            setIsLoadingTable(true);
            const response = await axios.get(`${INTEGRATION_SERVICE_KAFKA_TOPIC_MESSAGE}?topicName=${topicName}` ,{headers})
            
            setTimeout(() => {
                setDataTable(response.data.messageList);
                setIsLoadingTable(false);
            }, 500)
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoadingTable(false);
            setDataTable([]);
        }
    }

    // Load Column Header

    const columns = React.useMemo(() => [
        { Header: 'Key', accessor: 'key'},
        { Header: 'Partition', accessor: 'partition'},
        { Header: 'Offset', accessor: 'offset'},
        { Header: 'Timestamp', accessor: 'timestamp'},
        { Header: 'Value', accessor: 'value'},
    ],[])

    useEffect(() => {
        fetchData();
    }, [ ])


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
            data: dataTable
        }
    );

    
    return (
        <Fragment>
            <div className="row mb-3">
                {/* <div className="col-1 d-flex justify-content-end align-items-center"> */}
                    <div onClick={onBackClick} style={{ cursor: 'pointer', color: '#007bff' }}>
                        <i className="fas fa-arrow-left"></i> Back to Topics
                    </div>
                {/* </div> */}
                {/* <div className="col-12 d-flex justify-content-end align-items-center">
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
                </div> */}
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
                {/* <div className="d-flex justify-content-between align-items-center">
                    <div>Showing {startIndex} to {endIndex} of {totalItem} entries</div>
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        />
                        {renderPaginationItems()}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pageCount - 1}
                        />
                    </Pagination>
                </div> */}
            </div>  
        </Fragment>
    )

}

export default KafkaTopicMessage