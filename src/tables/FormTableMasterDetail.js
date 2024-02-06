import React, { useState, Fragment, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import "bootstrap/dist/css/bootstrap.min.css";
import "admin-lte/dist/css/adminlte.min.css";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  FORM_SERVICE_DELETE_DATA,
  FORM_SERVICE_VIEW_DATA,
} from "../config/ConfigApi";
import {
  getToken
} from "../config/Constants";
import axios from "axios";
import FormEdit from "../modal/form/FormEdit";
import { NumericFormat } from "react-number-format";
import FormDetail from "./FormDetail";
import FormPagination from "../component/FormPagination";

const FormTableMasterDetail = ({
  idForm,
  tableNameDetail,
  columns,
  data,
  columnVisibility,
  pageSize,
  totalItems,
  currentPage,
  onPageChange,
  formCode,
  menuName,
  refecthCallBack,
  primaryKey,
  isLoadingTable,
  canCreate,
  canVerify,
  canAuth,
  editPermission,
  deletePermission,
  isWorkflow,
}) => {
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };

  console.log("columnVis", columnVisibility);
  console.log("columns", columns);
  console.log("Data", data);

  const [selectedRows, setSelectedRows] = useState([]);
  const [showDetailTable, setShowDetailTable] = useState(false);
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

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const handlePageChange = (newPage) => {
    onPageChange(newPage);
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [dataToView, setDataToView] = useState(null);
  const [dataToEdit, setDataToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (data) => {
    setIsLoading(true);
    console.log("data view ", data);
    const columnKey = data.original.id;
    console.log("columnKey ", columnKey);
    try {
      await axios.delete(
        `${FORM_SERVICE_DELETE_DATA}?f=${formCode}&column=id&value=${columnKey}`,
        { headers }
      );
      //console.log('Data delete successfully:', response.data);
      setTimeout(() => {
        setShowDeleteModal(false);
        setDataToDelete(null);
        refecthCallBack();
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleView = async (data) => {
    console.log("data view ", data);

    const firstValue = Object.values(data)[2];
    console.log("First Value ", firstValue);

    try {
      const response = await axios.get(
        `${FORM_SERVICE_VIEW_DATA}?f=${formCode}&column=${primaryKey}&value=${firstValue}`,
        { headers }
      );
      console.log("Data View successfully:", response.data);
      setDataToView(response.data);
      setShowDeleteModal(false);
      setDataToDelete(null);
    } catch (error) {
      console.error("Error View data:", error);
    }
  };

  const handleShowModal = (action, dataSelected) => {
    console.log("action ", action, "data selected", dataSelected);
    if (action === "Delete") {
      setDataToDelete(dataSelected);
      setShowDeleteModal(true);
    } else if (action === "Edit") {
      setDataToEdit(dataSelected);
      setShowEditModal(true);
      console.log("edit for data", dataSelected);
    } else if (action === "View") {
      handleView(dataSelected);
      setShowViewModal(true);
    }
  };

  const handleActionClick = (action, rowData) => {
    if (action === "Delete") {
      handleDelete(dataToDelete);
    } else if (action === "Edit") {
      console.log("edit for data", rowData);
    }
  };

  function formatKey(key) {
    // Replace underscores with spaces and capitalize the first letter
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (firstChar) => firstChar.toUpperCase());
  }

  const handleRowClick = async (rowIndex) => {
    try {
      // Get the original data of the selected row
      console.log("primary key", primaryKey);
      const selectedRow = rows[rowIndex].original;
      console.log("selectedRowPrimaryKey", selectedRow[primaryKey]);
      setSelectedRows([rowIndex]);
      setSelectedRowData(selectedRow[primaryKey]);
      if (tableNameDetail) {
        setShowDetailTable(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    setShowDetailTable(false);
    setSelectedRowData(null);
    setSelectedRows([]);
  }, [tableNameDetail]);

  const [selectedRowData, setSelectedRowData] = useState(null);

  return (
    <Fragment>
      <div className="table-responsive">
        <table
          className="table table-bordered table-hover"
          {...getTableProps()}
        >
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
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(rowIndex)}
                    className={
                      selectedRows.includes(rowIndex) ? "table-success" : ""
                    }
                    style={{ cursor: "pointer" }}
                  >
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
                          <li>
                            {editPermission && (
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  handleShowModal("Edit", row.original)
                                }
                              >
                                <FaEdit /> Edit
                              </button>
                            )}
                          </li>
                          <li>
                            {deletePermission && (
                              <button
                                className="dropdown-item"
                                onClick={() => handleShowModal("Delete", row)}
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

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete data:{" "}
            {dataToDelete && dataToDelete.index}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              <FontAwesomeIcon icon={faTimes} /> Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleActionClick("Delete")}
            >
              <FontAwesomeIcon icon={faTrash} /> Delete
            </Button>
          </Modal.Footer>
        </Modal>

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
              <p>No user data to display.</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
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
          keyCol={primaryKey}
          refecthCallBack={() => refecthCallBack()}
          isWorkflow={isWorkflow}
        />
      </div>
      <hr></hr>
      {showDetailTable && (
        <div className="card card-primary">
          <div className="card-header">
            <h3 className="card-title">
              {" "}
              Detail Data {primaryKey} : {selectedRowData}
            </h3>
          </div>
          <div className="card-body">
            <FormDetail
              idForm={idForm}
              tableNameDetail={tableNameDetail}
              headers={headers}
              rowData={selectedRowData}
              canCreate={canCreate}
              canAuth={canAuth}
              canVerify={canVerify}
              editPermission={editPermission}
              deletePermission={deletePermission}
              keyCol={primaryKey}
              getFormCode={formCode}
              menuName={menuName}
            />
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default FormTableMasterDetail;
