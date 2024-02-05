import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getToken } from '../../config/Constants';
import { FORM_SERVICE_INSERT_DATA, FORM_SERVICE_LOAD_DATA } from '../../config/ConfigApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSyncAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { showSuccessToast } from '../../toast/toast';
import { showDynamicSweetAlert } from '../../toast/Swal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'admin-lte/dist/css/adminlte.min.css'; // Import AdminLTE styles
import 'admin-lte/plugins/fontawesome-free/css/all.min.css';

const FormModalAddNew = ({ isOpen, onClose, columns, menuName, formCode, tableNameDetail, reFormfetchCallback }) => {
  const token = getToken();
  const headers = { Authorization: `Bearer ${token}` };
  const [lookupTableData, setLookupTableData] = useState({});
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  console.log('tableNameDetail', tableNameDetail);

  console.log('columns modal', columns);

  const initialFormValues = {};
  columns.forEach((column) => {
    initialFormValues[column.accessor] = '';
    //console.log('init', initialFormValues);
  });

  const fetchLookupTable = async () => {
    const columnsWithLookupTable = columns.filter((column) => column.lookupTable != null);

    if (columnsWithLookupTable.length > 0) {
      // Create an array of promises for fetching data
      const fetchPromises = columnsWithLookupTable.map((column) =>
        fetch(`${FORM_SERVICE_LOAD_DATA}?t=${column.lookupTable}&lookup=YES`, { headers })
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
    fetchLookupTable();
  }, [columns]);

  const sendDataToAPI = (formData, successCallback) => {
    let apiUrl;

    console.log("table", tableNameDetail);
    console.log("formCode", formCode);
    // Define the API endpoint URL for your POST request
    if (tableNameDetail) {
      apiUrl = `${FORM_SERVICE_INSERT_DATA}?f=${formCode}&t=${tableNameDetail}&isDetail=true`;
    } else {
      apiUrl = `${FORM_SERVICE_INSERT_DATA}?f=${formCode}`;
    }

    // Create the request options, including method, headers, and body
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData), // Convert the form data to JSON format
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

        if (data.message === "insert Data Successfully") {

          setTimeout(() => {
            // Call the successCallback function to close the modal
            successCallback();
            // Show a success toast with the API response message
            // showSuccessToast(data.message);
            showDynamicSweetAlert('Success', data.message, 'success');
            reFormfetchCallback();
            const resetData = { ...initialFormValues };
            // Update the form data state to trigger a re-render with the reset values
            setFormData(resetData);
            setIsLoading(false);
          }, 1000);



        }


      })
      .catch((error) => {
        // Handle any errors that occurred during the fetch
        console.error('Error sending data to API:', error);
        showDynamicSweetAlert('Error', error.message, 'error');
      });
  };


  const validateForm = () => {
    const error = {};
    columns.forEach(column => {
        if (column.isMandatory && !formData[column.accessor]) {
            error[column.accessor] = 'This field is required';
        }
    });
    setFormErrors(error);
    return Object.keys(error).length === 0;
}

  const handleSave = () => {
    if (validateForm()) {
      setIsLoading(true);
      sendDataToAPI(formData, () => {
          onClose();
      })
  };
  };

  const handleReset = () => {
    // Create a copy of the initial form values
    const resetData = { ...initialFormValues };

    // Update the form data state to trigger a re-render with the reset values
    setFormData(resetData);
  };

  //console.log('lookupTableData ', lookupTableData);
  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New : {menuName} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row">
            {columns
              .filter((column) => column.Header !== 'Status')
              .map((column) => (
                <div className="col-md-6" key={column.accessor}>
                  <Form.Group>
                    <Form.Label htmlFor={column.accessor}>{column.Header} {column.isMandatory && <span className="text-danger"> *</span>}</Form.Label>
                    {column.lookupTable !== null ? (
                      <>
                      <Form.Control
                        as="select"
                        id={column.accessor}
                        name={column.accessor}
                        value={formData[column.accessor] || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, [column.accessor]: e.target.value })
                        }
                        isInvalid={!!formErrors[column.accessor]}
                      >
                        <option value="">
                          Select an option: {column.accessor}
                        </option>
                        {Array.isArray(lookupTableData[column.accessor]) &&
                          lookupTableData[column.accessor].map((option, index) => (
                            <option
                              key={Object.values(option)[2] || index}
                              value={Object.values(option)[2]}
                            >
                              {`${Object.values(option)[2]} - ${Object.values(option)[3]}`}
                            </option>
                          ))}
                      </Form.Control>
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
                          selected={formData[column.accessor] ? new Date(formData[column.accessor]) : null}
                          onChange={(date) =>
                            setFormData({
                              ...formData,
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
                        value={formData[column.accessor] || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [column.accessor]: e.target.value,
                          })
                        }
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
          <FontAwesomeIcon icon={faTimes} /> Close
        </Button>
        <Button variant="danger" onClick={handleReset}>
          <FontAwesomeIcon icon={faSyncAlt} /> Reset
        </Button>
        <Button variant="primary" onClick={handleSave}>
          <FontAwesomeIcon icon={faSave} /> Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormModalAddNew;
