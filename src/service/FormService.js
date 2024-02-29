import axios from "axios";
import { getToken } from "../config/Constants";
import {
  FORM_SERVICE_LOAD_DATA,
  FORM_SERVICE_LOAD_FIELD,
  FORM_SERVICE_REPORT_DATA_CSV,
  FORM_SERVICE_REPORT_DATA_EXCEL
} from "../config/ConfigApi";
import * as XLSX from 'xlsx';

const token = getToken();
const headers = { Authorization: `Bearer ${token}` };

const getCurrentDateTime = () => {
	const date = new Date();
	return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
};


const FetchHeader = async (idForm) => {
  let getTableName;
  let getFormCode;
  let getTableNameDetail;

  try {
    const response = await axios.get(
      `${FORM_SERVICE_LOAD_FIELD}?formId=${idForm}`,
      { headers }
    );
    const formCodes = response.data.coreFields.map((field) => field.formCode);
    const tableName = response.data.tableName;

    if (tableName !== null) {
      getTableName = response.data.tableName;
    } else {
      getFormCode = formCodes[0];
    }

    const primaryKeyColumnObj = response.data.coreFields.find(
      (apiColumn) => apiColumn.isPrimaryKey === true
    );
    const primaryKeyColumn = primaryKeyColumnObj
      ? primaryKeyColumnObj.fieldName
      : null;

    const transformedColumns = Array.isArray(response.data.coreFields)
      ? response.data.coreFields.map((apiColumn) => ({
          Header: apiColumn.description,
          accessor: apiColumn.fieldName.toUpperCase(),
          sortType: "basic",
          lookupTable: apiColumn.lookupTable,
          displayFormat: apiColumn.displayFormat,
          isMandatory: apiColumn.isMandatory,
          dataType: apiColumn.dataType,
          // Add other properties based on your requirements
        }))
      : [];

    const manualStatusColumn = {
      Header: "Status",
      accessor: "STATUS", // Replace 'status' with the actual accessor for the status column
      sortType: "basic",
      // Add other properties for the status column if needed
    };

    const columns = [...transformedColumns, manualStatusColumn];
    const isWorkflow = response.data.needApproval;
    const columnVisibility = Object.fromEntries(
      columns.map((column) => [column.accessor, true])
    );
    const tableNameDetail = response.data.tableDetail;
    if (tableNameDetail !== null) {
      getTableNameDetail = tableNameDetail;
    }
    return {
      columns,
      columnVisibility,
      isWorkflow,
      getTableName,
      getFormCode,
      primaryKeyColumn,
      getTableNameDetail,
    };
  } catch (error) {
    throw error;
  }
};

const HandleToUppercase = (data) => {
	data.map((item) =>
      Object.keys(item).reduce((acc, key) => {
        acc[key.toUpperCase()] = item[key];
        return acc;
      }, {})
    );
}

const FetchData = async (
  formCode,
  filterColumn,
  filterOperation,
  filterValue,
  currentPage,
  pageSize
) => {
  let urlParams;
  if (filterColumn !== "" && filterOperation !== "" && filterValue !== "") {
    urlParams = `f=${formCode}&page=${currentPage}&size=${pageSize}&filterBy=${filterColumn}&filterValue=${filterValue}&operation=${filterOperation}`;
  } else {
    urlParams = `f=${formCode}&page=${currentPage}&size=${pageSize}`;
  }
  try {
    const response = await axios.get(`${FORM_SERVICE_LOAD_DATA}?${urlParams}`, {
      headers,
    });
    const data = HandleToUppercase(response.data.data);
    /* const data = response.data.data.map((item) =>
      Object.keys(item).reduce((acc, key) => {
        acc[key.toUpperCase()] = item[key];
        return acc;
      }, {})
    ); */
    const totalItem = response.data.totalAllData;
    const totalPage = response.data.totalPage;
    return { data, totalItem, totalPage };
  } catch (error) {
    throw error;
  }
};

const FetchDataMaster = async (
  formCode,
  filterColumn,
  filterOperation,
  filterValue,
  currentPage,
  pageSize
) => {
  let urlParams;
  if (filterColumn !== "" && filterOperation !== "" && filterValue !== "") {
    urlParams = `f=${formCode}&page=${currentPage}&size=${pageSize}&filterBy=${filterColumn}&filterValue=${filterValue}&operation=${filterOperation}&&detail=true`;
  } else {
    urlParams = `f=${formCode}&page=${currentPage}&size=${pageSize}&detail=true`;
  }
  try {
    const response = await axios.get(`${FORM_SERVICE_LOAD_DATA}?${urlParams}`, {
      headers,
    });
    const data = HandleToUppercase(response.data.data);
    /* const data = response.data.data.map((item) =>
      Object.keys(item).reduce((acc, key) => {
        acc[key.toUpperCase()] = item[key];
        return acc;
      }, {})
    ); */
    const totalItem = response.data.totalAllData;
    const totalPage = response.data.totalPage;
    return { data, totalItem, totalPage };
  } catch (error) {
    throw error;
  }
};

const FetchDataView = async (
  formCode,
  tableName,
  filterColumn,
  filterOperation,
  filterValue,
  currentPage,
  pageSize
) => {
  let urlParams;
  if (filterColumn !== "" && filterOperation !== "" && filterValue !== "") {
    urlParams = `t=${tableName}&page=${currentPage}&size=${pageSize}&filterBy=${filterColumn}&filterValue=${filterValue}&operation=${filterOperation}&viewOnly=true`;
  } else {
    urlParams = `t=${tableName}&page=${currentPage}&size=${pageSize}&viewOnly=true`;
  }
  try {
    const response = await axios.get(`${FORM_SERVICE_LOAD_DATA}?${urlParams}`, {
      headers,
    });
	const data = HandleToUppercase(response.data.data);
    /* const data = response.data.data.map((item) =>
      Object.keys(item).reduce((acc, key) => {
        acc[key.toUpperCase()] = item[key];
        return acc;
      }, {})
    ); */
    const totalItem = response.data.totalAllData;
    const totalPage = response.data.totalPage;
    return { data, totalItem, totalPage };
  } catch (error) {
    throw error;
  }
};

const FetchDataInquiry = async (
  formCode,
  filterColumn,
  filterOperation,
  filterValue,
  currentPage,
  pageSize
) => {
  let urlParams;
  if (filterColumn !== "" && filterOperation !== "" && filterValue !== "") {
    urlParams = `f=${formCode}&page=${currentPage}&size=${pageSize}&filterBy=${filterColumn}&filterValue=${filterValue}&operation=${filterOperation}&showAll=YES`;
  } else {
    urlParams = `f=${formCode}&page=${currentPage}&size=${pageSize}&showAll=YES`;
  }
  try {
    const response = await axios.get(`${FORM_SERVICE_LOAD_DATA}?${urlParams}`, {
      headers,
    });
    const data = HandleToUppercase(response.data.data);
    /* const data = response.data.data.map((item) =>
      Object.keys(item).reduce((acc, key) => {
        acc[key.toUpperCase()] = item[key];
        return acc;
      }, {})
    ); */
    const totalItem = response.data.totalAllData;
    const totalPage = response.data.totalPage;
    return { data, totalItem, totalPage };
  } catch (error) {
    throw error;
  }
};


const FormExportToXls = (columns, menuName, accountData) => {
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

const FormExportToCsv = (columns, menuName, accountData) => {
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

const FormDownloadFileCsv = async (idForm, menuName) => {

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
		throw error;
	}
};

const FormDownloadFileXls = async (idForm, menuName) => {

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
            throw error;
        }
};

	
export {
  FetchHeader,
  FetchData,
  FetchDataMaster,
  FetchDataInquiry,
  FetchDataView,
  FormExportToXls,
  FormExportToCsv,
  FormDownloadFileCsv,
  FormDownloadFileXls
};
