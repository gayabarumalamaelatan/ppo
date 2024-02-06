import React, { useState, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import "admin-lte/dist/css/adminlte.min.css";
import { FaEye } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "react";
import { FORM_SERVICE_VIEW_DATA } from "../config/ConfigApi";
import { getToken } from "../config/Constants";
import axios from "axios";
import { NumericFormat } from "react-number-format";
import FormPagination from "../component/FormPagination";

const FormTableView = ({
  columns,
  data,
  columnVisibility,
  pageSize,
  totalItems,
  currentPage,
  onPageChange,
  formCode,
  menuName,
  primayKey,
  isLoadingTable,
  tableName,
}) => {
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };

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
        hiddenColumns: columns
          .filter((column) => !columnVisibility[column.accessor])
          .map((column) => column.accessor),
      },
    },
    useSortBy
  );

  useEffect(() => {
    setHiddenColumns(
      columns
        .filter((column) => !columnVisibility[column.accessor])
        .map((column) => column.accessor)
    );
  }, [columnVisibility]);

  const [showViewModal, setShowViewModal] = useState(false);
  const [dataToView, setDataToView] = useState(null);

  const handleView = async (data) => {
    console.log("data view ", data);

    const firstValue = Object.values(data)[2];
    console.log("First Value ", firstValue);

    try {
      let response;
      if (tableName) {
        response = await axios.get(
          `${FORM_SERVICE_VIEW_DATA}?t=${tableName}&column=${primayKey}&value=${firstValue}&viewOnly=true`,
          { headers }
        );
      } else {
        response = await axios.get(
          `${FORM_SERVICE_VIEW_DATA}?f=${formCode}&column=${primayKey}&value=${firstValue}&viewOnly=true`,
          { headers }
        );
      }
      console.log("Data View successfully:", response.data);
      setDataToView(response.data);
    } catch (error) {
      console.error("Error View data:", error);
    }
  };

  const handleShowModal = (action, dataSelected) => {
    console.log("action ", action, "data selected", dataSelected);
    if (action === "Delete") {
      console.log("delete data", dataSelected);
    } else if (action === "Edit") {
      console.log("edit for data", dataSelected);
    } else if (action === "View") {
      handleView(dataSelected);
      setShowViewModal(true);
    }
  };

  function formatKey(key) {
    // Replace underscores with spaces and capitalize the first letter
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (firstChar) => firstChar.toUpperCase());
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const handlePageChange = (newPage) => {
    onPageChange(newPage);
  };

  return (
    <Fragment>
      <div className="table-responsive">
        <table className="table table-bordered" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.accessor}
                    className="table-header"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    <span className="sort-icon" style={{ margin: "3px" }}>
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
                    {column.render("Header")}
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
                prepareRow(row);
                return (
                  <tr key={row.id} {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      const column = cell.column;
                      return (
                        <td key={column.id} {...cell.getCellProps()}>
                          {column.displayFormat === "CURRENCY" ? (
                            // Custom logic for formatting as integer or decimal
                            Number.isInteger(cell.value) ? (
                              // Format as integer
                              cell.value.toLocaleString()
                            ) : (
                              // Format as decimal using NumberFormatBase (replace with your actual component)
                              <NumericFormat
                                value={cell.value}
                                displayType={"text"}
                                // prefix={'Rp. '}
                                thousandSeparator={true}
                                decimalScale={2}
                                fixedDecimalScale
                              />
                            )
                          ) : column.displayFormat === "DECIMAL" ? (
                            // Your logic for 'DECIMAL'
                            <NumericFormat
                              value={cell.value}
                              displayType={"text"}
                              prefix={""} // Modify prefix as needed
                              //thousandSeparator={true}
                              decimalScale={2}
                              fixedDecimalScale
                            />
                          ) : (
                            // Render cell using default rendering logic
                            cell.render("Cell")
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
                              onClick={() =>
                                handleShowModal("View", row.original)
                              }
                            >
                              <FaEye /> View
                            </button>
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
          <div>
            Showing {startIndex + 1} to {endIndex} of {totalItems} entries
          </div>
          <FormPagination
            totalItems={totalItems}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <Modal
        show={showViewModal}
        onHide={() => setShowViewModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>View {menuName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Check if dataToView is not null before rendering */}
          {dataToView ? (
            <div className="container">
              <div className="row">
                {columns.map((column) => (
                  <div key={column.accessor} className="col-md-4 mb-3">
                    <div className="d-flex align-items-center">
                      <strong>{formatKey(column.accessor)}:</strong>
                      <span className="ml-2 flex-fill">
                        {column.displayFormat === "CURRENCY" ||
                        column.displayFormat === "DECIMAL" ? (
                          <NumericFormat
                            value={dataToView[column.accessor]}
                            displayType={"text"}
                            prefix={
                              column.displayFormat === "CURRENCY" ? "" : ""
                            }
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
            <p>No data {menuName} to display.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            <FontAwesomeIcon icon={faTimes} /> Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default FormTableView;
