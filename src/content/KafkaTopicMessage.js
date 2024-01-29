import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { INTEGRATION_SERVICE_KAFKA_TOPIC_MESSAGE } from "../config/ConfigApi";
import { Pagination } from "react-bootstrap";
import { useTable } from "react-table";

const { getToken } = require('../config/Constants');

const KafkaTopicMessage = ({topicName, onBackClick}) => {
    // API Call Variable
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    // Kosmetik Variable
    const [isLoadingTable, setIsLoadingTable] = useState(true);

    // Table Variable
    const [dataTable, setDataTable] = useState([]);
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    // API Call
    const fetchData = async () => {
        try {
            setIsLoadingTable(true);
            const response = await axios.get(`${INTEGRATION_SERVICE_KAFKA_TOPIC_MESSAGE}?topicName=${topicName}&page=${currentPage}&size=${pageSize}` ,{headers})
            
            setTimeout(() => {
                setDataTable(response.data.messageList);
                setTotalItem(response.data.totalItems);
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
    }, [currentPage, pageSize])


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

    const pageCount = Math.ceil(totalItem / pageSize);
    const startIndex = (currentPage) * pageSize + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, totalItem);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageCount) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setCurrentPage(0); // Kembalikan ke halaman pertama setelah mengubah ukuran halaman
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
            <div className="row mb-3">
                <div className="col-md-3 col-sm-12 d-flex align-items-center">
                    <div onClick={onBackClick} style={{ cursor: 'pointer', color: '#007bff' }}>
                        <i className="fas fa-arrow-left"></i> Back to Topics
                    </div>
                </div>
                <div className="col-md-9 col-sm-12 d-flex justify-content-end align-items-center">
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
                        {renderPaginationItems()}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pageCount - 1}
                        />
                    </Pagination>
                </div>
            </div>  
        </Fragment>
    )

}

export default KafkaTopicMessage