import React, { useState, useEffect } from 'react';
import { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const FormDesain = () => {
    const [formData, setFormData] = useState({
        branch: '',
        module: '',
        formCode: '',
        formName: '',
        description: '',
        needApproval: 0,
        workflowOption: 'default',
        selectedUser: ''
    });

    const [detailData, setDetailData] = useState([{

        FIELD_NAME: '',
        DESCRIPTION: '',
        DATA_TYPE: '',
        IS_MANDATORY: ''
    }]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        console.log(detailData);
        // Handle form submission
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
        setFormData(prevState => ({
            ...prevState,
            [name]: newValue
        }));
    };

    const handleDetailChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? (checked ? '1' : '0') : value; // Update value for checkbox
        const newDetailData = [...detailData];
        newDetailData[index][name] = newValue;
        setDetailData(newDetailData);
    };

    const addDetailRow = () => {
        setDetailData([...detailData, {
            ID_FORM: '',
            FORM_CODE: '',
            FIELD_NAME: '',
            DESCRIPTION: '',
            LOOKUP_TABLE: '',
            DATA_TYPE: '',
            MIN_LENGTH: '',
            MAX_LENGTH: '',
            STATUS: '',
            CREATED_AT: '',
            UPDATED_AT: '',
            PRIMARY_KEY_COLUMN: '',
            IS_PRIMARY_KEY: '',
            DISPLAY_FORMAT: '',
            IS_DETAIL: '',
            IS_MANDATORY: ''
        }]);
    };

    const removeDetailRow = (index) => {
        const newDetailData = [...detailData];
        newDetailData.splice(index, 1);
        setDetailData(newDetailData);
    };

    useEffect(() => {
        if (detailData.length === 0) {
            addDetailRow();
        }
    }, []); // Empty dependency array to run this effect only once when component mounts

    return (
        <Fragment>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Apps Screen</h1>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="card card-default">
                    <div className="card-header">
                        <h3 className="card-title">Screen Information</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="container">
                                <div className="form-group row">
                                    <label htmlFor="branch" className="col-sm-2 col-form-label">Department</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="branch"
                                            name="branch"
                                            value={formData.module}
                                            onChange={handleChange}
                                            placeholder="Enter Department"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="module" className="col-sm-2 col-form-label">Module</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="module"
                                            name="module"
                                            value={formData.module}
                                            onChange={handleChange}
                                            placeholder="Enter Module"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="formCode" className="col-sm-2 col-form-label">Screen Code</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="formCode"
                                            name="formCode"
                                            value={formData.formCode}
                                            onChange={handleChange}
                                            placeholder="Enter Screen Code"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="formName" className="col-sm-2 col-form-label">Screen Name</label>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="formName"
                                            name="formName"
                                            value={formData.formName}
                                            onChange={handleChange}
                                            placeholder="Enter Screen Name"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="description" className="col-sm-2 col-form-label">Description</label>
                                    <div className="col-sm-10">
                                        <textarea
                                            rows={3}
                                            className="form-control"
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Enter Description"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="description" className="col-sm-2 col-form-label">Workflow</label>
                                    <div className="col-sm-10">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="defaultWorkflow"
                                                name="workflowOption"
                                                value="default"
                                                checked={formData.workflowOption === 'default'}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="defaultWorkflow">
                                                Default
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="customWorkflow"
                                                name="workflowOption"
                                                value="custom"
                                                checked={formData.workflowOption === 'custom'}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="customWorkflow">
                                                Custom
                                            </label>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </form>
                    </div>
                </div>
                {formData.workflowOption === 'custom' && (
                    <div className="card card-default">
                        <div className="card-header">
                            <h3 className="card-title">Screen Workflow</h3>
                        </div>
                        <div className="card-body">
                            <div className="col">
                                <label htmlFor="userSelect">Select User</label>
                                <select
                                    className="form-control"
                                    id="userSelect"
                                    name="selectedUser"
                                    value={formData.selectedUser}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Select a User --</option>
                                    <option value="user1">User 1</option>
                                    <option value="user2">User 2</option>
                                    <option value="user3">User 3</option>
                                    {/* Add more options as needed */}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
                <div className="card card-default">
                    <div className="card-header">
                        <h3 className="card-title">Screen Detail</h3>
                    </div>
                    <div className="card-body">
                        {detailData.map((detail, index) => (
                            <div key={index}>
                                <div className="form-group row">
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Field Name"
                                            name="FIELD_NAME"
                                            value={detail.FIELD_NAME}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Description"
                                            name="DESCRIPTION"
                                            value={detail.DESCRIPTION}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        />
                                    </div>
                                    <div className="col">
                                        <select
                                            className="form-control"
                                            placeholder="Data Type"
                                            name="DATA_TYPE"
                                            value={detail.DATA_TYPE}
                                            onChange={(e) => handleDetailChange(index, e)}
                                        >
                                            <option value="">Select Data Type</option>
                                            <option value="NUMERIC">NUMERIC</option>
                                            <option value="DECIMAL">DECIMAL</option>
                                            <option value="CHAR">CHAR</option>
                                            <option value="DATE">DATE</option>
                                            <option value="BOOLEAN">BOOLEAN</option>
                                            {/* Add more options here if needed */}
                                        </select>
                                    </div>
                                    <div className="col">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`is_mandatory_${index}`}
                                                name="IS_MANDATORY"
                                                checked={detail.IS_MANDATORY === '1'}
                                                onChange={(e) => handleDetailChange(index, e)}
                                            />
                                            <label className="form-check-label" htmlFor={`is_mandatory_${index}`}>
                                                Required
                                            </label>
                                        </div>
                                    </div>

                                    {/* Add other input fields */}

                                    <div className="col">
                                        <button type="button" className="btn btn-danger" onClick={() => removeDetailRow(index)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card-footer">
                        <button className="btn btn-primary" onClick={addDetailRow}>Add Row</button>
                    </div>


                </div>
                <div className="card-footer">
                    <button type="submit" className="btn btn-primary float-right">Submit</button>
                </div>
            </section>
        </Fragment>
    );
};

export default FormDesain;
