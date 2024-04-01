import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getToken, pending , getBranch } from '../../config/Constants';
import { FORM_SERVICE_INSERT_DATA, FORM_SERVICE_LOAD_DATA, FORM_SERVICE_UPDATE_DATA, FORM_SERVICE_UPDATE_STATUS, FORM_SERVICE_VIEW_DATA } from '../../config/ConfigApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { showSuccessToast } from '../../toast/toast';
import axios from 'axios';
import { showDynamicSweetAlert } from '../../toast/Swal';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'admin-lte/dist/css/adminlte.min.css'; // Import AdminLTE styles
import 'admin-lte/plugins/fontawesome-free/css/all.min.css';

const FormEdit = ({ isOpen, onClose, columns, menuName, getFormCode, data, keyCol, refecthCallBack, isWorkflow, tableNameDetail }) => {
    const token = getToken();
    const branchId = getBranch();
    const headers = { Authorization: `Bearer ${token}` };
    const [lookupTableData, setLookupTableData] = useState({});
    const [formDataEdit, setFormDataEdit] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    console.log('formcode', getFormCode);
    console.log('data Edit', data);
    console.log('col ', columns);
    const [formErrors, setFormErrors] = useState({});


    const initialFormValues = {};
    columns.forEach((column) => {
        initialFormValues[column.accessor] = '';
        //console.log('init', initialFormValues);
    });

    const fetchData = async () => {
        console.log('Log Fetch Data Detail for Edit', data);


        if (data !== null) {
            console.log('masuk');
            const firstValue = data.ID;
            const firstObject = columns[0].accessor;
            let apiUrl;
            if (tableNameDetail) {
                apiUrl = `${FORM_SERVICE_VIEW_DATA}?t=${tableNameDetail}&branchId=${branchId}&column=id&value=${firstValue}`;
            } else {
                apiUrl = `${FORM_SERVICE_VIEW_DATA}?f=${getFormCode}&branchId=${branchId}&column=id&value=${firstValue}`;
            }
            try {
                const response = await axios.get(apiUrl, { headers })
                console.log('Data Edit:', response.data);
                // Check if response.data is defined and it is an object
                if (response.data && typeof response.data === 'object') {
                    // Convert the object into an array with a single element
                    const dataArray = [response.data];

                    // Perform mapping or any other operations on the array
                    const transformedData = dataArray.map(item =>
                        Object.keys(item).reduce((acc, key) => {
                            acc[key.toUpperCase()] = item[key];
                            return acc;
                        }, {})
                    );

                    console.log('Data Edit:', transformedData);
                    setFormDataEdit(transformedData[0]);
                } else {
                    console.error('Invalid response data:', response.data);
                    // Handle the error appropriately, such as displaying a message to the user.
                }


            } catch (error) {
                console.error('Error View data:', error);
            }
        } else {
            //console.log("gak masuk datanya null");
        }

    }

    const fetchLookupTable = async () => {
        const columnsWithLookupTable = columns.filter((column) => column.lookupTable != null);

        if (columnsWithLookupTable.length > 0) {
            // Create an array of promises for fetching data
            const fetchPromises = columnsWithLookupTable.map((column) =>
                fetch(`${FORM_SERVICE_LOAD_DATA}?t=${column.lookupTable}&lookup=YES&branchId=${branchId}&page=1&size=500`, { headers })
                    .then((response) => response.json())
                    .then((data) => {
                        //console.log('API Response for', column.accessor, ':', data.data);
                        return data; // Return data to preserve it in the promise chain
                    })
            );

            // Execute all fetch promises in parallel
            Promise.all(fetchPromises)
                .then((dataArray) => {
                    //console.log('dataArray:', dataArray);
                    const lookupData = {};

                    // Ensure that dataArray matches the order of columnsWithLookupTable
                    columnsWithLookupTable.forEach((column, index) => {
                        if (dataArray[index].data && Array.isArray(dataArray[index].data)) {
                            // Ensure dataArray[index].data is an array before using it
                            lookupData[column.accessor] = dataArray[index].data;
                        }
                    });

                    console.log('lookupTableData:', lookupData);
                    setLookupTableData(lookupData);
                })
                .catch((error) => {
                    console.error('Error loading data from API:', error);
                });
        }
    }

    useEffect(() => {
        fetchLookupTable()
    }, [columns])

    useEffect(() => {
        fetchData();
    }, [data]);

    const sendDataToAPI = (formDataEdit, successCallback) => {

        console.log('Form Edit:', formDataEdit);

        const { STATUS, ID, ...formDataWithoutStatusAndId } = formDataEdit;
        console.log('Form Edit:', formDataWithoutStatusAndId);

        const firstValue = Object.values(data)[1];

        if (formDataEdit[keyCol] !== undefined) {
            delete formDataEdit[keyCol];
        }

        let apiUrl;
        if (tableNameDetail) {
            apiUrl = `${FORM_SERVICE_UPDATE_DATA}?t=${tableNameDetail}&column=id&value=${firstValue}`
        } else {
            apiUrl = `${FORM_SERVICE_UPDATE_DATA}?f=${getFormCode}&column=id&value=${firstValue}`;
        }
        // Define the API endpoint URL for your POST request


        // Create the request options, including method, headers, and body
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formDataWithoutStatusAndId), // Convert the form data to JSON format
        };

        // Send the POST request to the API endpoint
        fetch(apiUrl, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // Handle the API response data as needed
                //console.log('API Response:', data);

                if (data.message === "Update Data Successfully" && isWorkflow === true) {
                    setTimeout(async () => {
                        try {
                            const requestData = {
                                idTrx: formDataEdit.ID,
                                status: pending,
                                // Other properties in your requestData object
                            };
                            const response = await axios.post(`${FORM_SERVICE_UPDATE_STATUS}?f=${getFormCode}`, requestData, { headers });

                            // Call the successCallback function to close the modal
                            successCallback();

                            // Show a success toast with the API response message
                            // showSuccessToast(data.message);
                            showDynamicSweetAlert('Success!', data.message, 'success');

                            refecthCallBack();

                            const resetData = { ...initialFormValues };
                            // Update the form data state to trigger a re-render with the reset values
                            setFormDataEdit(resetData);
                            setIsLoading(false);
                        } catch (error) {
                            // Handle error if the axios request fails
                            console.error('Error updating data:', error);
                            // You may want to show an error message to the user
                            // showErrorToast('Failed to update data. Please try again.');
                        }
                    }, 1000);
                } else {
                    setTimeout(() => {
                        successCallback();

                        // Show a success toast with the API response message
                        // showSuccessToast(data.message);
                        showDynamicSweetAlert('Success!', data.message, 'success');

                        refecthCallBack();

                        const resetData = { ...initialFormValues };
                        // Update the form data state to trigger a re-render with the reset values
                        setFormDataEdit(resetData);
                        setIsLoading(false);
                    }, 1000);

                }

            })
            .catch((error) => {
                // Handle any errors that occurred during the fetch
                console.error('Error sending data to API:', error);
                showDynamicSweetAlert('Error!', error.message, 'error');
                setIsLoading(false);
            });
    };

    const validateForm = () => {
        const error = {};
        columns.forEach(column => {
            if (column.isMandatory && !formDataEdit[column.accessor]) {
                error[column.accessor] = 'This field is required';
            }
        });
        setFormErrors(error);
        return Object.keys(error).length === 0;
    }

    const handleEditSave = () => {
        if (validateForm()) {
            setIsLoading(true);
            sendDataToAPI(formDataEdit, () => {
                onClose();
            })
        };
    };

    const handleReset = () => {
        // Create a copy of the initial form values
        const resetData = { ...initialFormValues };

        // Update the form data state to trigger a re-render with the reset values
        setFormDataEdit(resetData);
    };

    //console.log('lookupTableData ', lookupTableData);
    return (
        <Modal show={isOpen} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit {menuName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Form untuk mengedit data */}
                    <div className="row">
                        {columns.filter((column) => column.Header !== 'Status') // Exclude the 'Status' column
                            .map((column, index) => (
                                <div className="col-md-6" key={column.accessor || index}>
                                    <Form.Group>
                                        <Form.Label htmlFor={column.accessor}>{column.Header} {column.isMandatory && <span className="text-danger"> *</span>}</Form.Label>
                                        {column.lookupTable !== null ? (
                                            <>
                                                <Select
                                                    id={column.accessor}
                                                    name={column.accessor}
                                                    value={{ label: formDataEdit[column.accessor], value: formDataEdit[column.accessor] }}
                                                    onChange={(selectedOption) =>
                                                        setFormDataEdit({
                                                            ...formDataEdit,
                                                            [column.accessor]: selectedOption.value,
                                                        })
                                                    }
                                                    options={(lookupTableData[column.accessor] || []).map((option) => ({
                                                        label: `${Object.values(option)[2]} - ${Object.values(option)[3]}`,
                                                        value: Object.values(option)[2],
                                                    }))}
                                                    isInvalid={!!formErrors[column.accessor]}
                                                />
                                                {formErrors[column.accessor] && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {formErrors[column.accessor]}
                                                    </Form.Control.Feedback>
                                                )}
                                            </>
                                        ) : column.displayFormat === 'DATE' ? (
                                            <>
                                                <div className="input-group date">
                                                    <DatePicker
                                                        className="form-control"
                                                        id={column.accessor}
                                                        name={column.accessor}
                                                        selected={formDataEdit[column.accessor] ? new Date(formDataEdit[column.accessor]) : null}
                                                        onChange={(date) =>
                                                            setFormDataEdit({
                                                                ...formDataEdit,
                                                                [column.accessor]: date.toISOString().split('T')[0],
                                                            })
                                                        }
                                                        dateFormat="yyyy-MM-dd" // Specify the desired date format
                                                        isInvalid={!!formErrors[column.accessor]}
                                                    />
                                                    <div className="input-group-append">
                                                        <div className="input-group-text">
                                                            <i className="fa fa-calendar"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                                {formErrors[column.accessor] && (
                                                    <div className="invalid-feedback d-block">
                                                        {formErrors[column.accessor]}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Form.Control
                                                    type="text"
                                                    id={column.accessor}
                                                    name={column.accessor}
                                                    value={formDataEdit[column.accessor] || ''}
                                                    onChange={(e) =>
                                                        setFormDataEdit({
                                                            ...formDataEdit,
                                                            [column.accessor]: e.target.value,
                                                        })
                                                    }
                                                    disabled={column.accessor === keyCol}
                                                    isInvalid={!!formErrors[column.accessor]}
                                                />
                                                {formErrors[column.accessor] && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {formErrors[column.accessor]}
                                                    </Form.Control.Feedback>
                                                )}
                                            </>
                                        )}

                                    </Form.Group>
                                </div>
                            ))}
                    </div>
                </Form>

                {isLoading && (
                    <div className="full-screen-overlay">
                        <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    <FontAwesomeIcon icon={faTimes} /> Batal
                </Button>
                <Button variant="primary" onClick={handleEditSave}>
                    <FontAwesomeIcon icon={faSave} /> Simpan Perubahan
                </Button>
            </Modal.Footer>
        </Modal>

    );
};

export default FormEdit;
