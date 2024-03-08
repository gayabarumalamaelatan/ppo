import React, { Fragment, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRecoilValue } from "recoil";
import { getToken } from "../config/Constants";
import { FORM_SERVICE_LOAD_DATA, REPORT_SERVICE_DOWNLOAD_REPORT, REPORT_SERVICE_GENERATE_REPORT, REPORT_SERVICE_GET_PARAM } from "../config/ConfigApi";
import { showDynamicSweetAlert } from "../toast/Swal";
import axios from "axios";
import { menusIdState } from "../store/MenuId";
import Select from 'react-select';

const CoreReport = () => {
    const initialFormState = {};
    const menus = useRecoilValue(menusIdState);
    const menuId = menus["menuId"];
    const menuName = menus["menuName"];
    const [formData, setFormData] = useState(initialFormState);
    const [reportHtml, setReportHtml] = useState(""); // Tambahkan state baru untuk menyimpan respons HTML
    const [exportType, setExportType] = useState("PDF"); // State untuk jenis ekspor
    const [getParam, setGetParam] = useState([]);
    const [lookupTableData, setLookupTableData] = useState({});

    const token = getToken();
    const headers = { Authorization: `Bearer ${token}` };

    console.log("menuId", menuId);
    console.log("menuName", menuName);

    const fetchParam = async () => {
        try {
            const response = await axios.get(`${REPORT_SERVICE_GET_PARAM}?menuId=${menuId}`, { headers });
            setGetParam(response.data);
        } catch (error) {
            showDynamicSweetAlert('Error!', "Error Fetching Data", 'error');
        }
    };

    const fetchLookupTable = async () => {
        const columnsWithLookupTable = getParam.filter((getParam) => getParam.tableName != null);

        if (columnsWithLookupTable.length > 0) {
            // Create an array of promises for fetching data
            const fetchPromises = columnsWithLookupTable.map((getParam) =>
                fetch(`${FORM_SERVICE_LOAD_DATA}?t=${getParam.tableName}&lookup=YES&page=1&size=500`, { headers })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('API Response for', getParam.accessor, ':', data.data);
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
    }, [getParam]);

    useEffect(() => {
        fetchParam();
    }, [menuId]);

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
        console.log(name, value);
    };

    const handleSubmit = async (e) => { // Ubah menjadi async function untuk melakukan request ke backend
        e.preventDefault();
        // Di sini Anda bisa menambahkan logika untuk mengirim data ke backend untuk menghasilkan laporan
        console.log(formData);
        const urlParams = new URLSearchParams(formData);
        const urlString = urlParams.toString();
        console.log("urlString", urlString);
        try {
            const response = await axios.get(`${REPORT_SERVICE_GENERATE_REPORT}?${urlString}&menuId=${menuId}`, { headers });
            setReportHtml(response.data);
        } catch (error) {
            showDynamicSweetAlert('Error!', "Error Fetching Data", 'error');
        }

    };

    const getCurrentDateTime = () => {
        const date = new Date();
        return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`;
    };

    const handleExport = async () => {
        const urlParams = new URLSearchParams(formData);
        const urlString = urlParams.toString();
        console.log("urlString", urlString);
        try {
            // Mengirim permintaan berdasarkan format yang dipilih (PDF atau xlsx)
            const response = await axios.get(`${REPORT_SERVICE_DOWNLOAD_REPORT}?${urlString}&menuId=${menuId}&format=${exportType}`, { headers, responseType: 'blob' });

            // Membuat objek URL dari data blob yang diterima
            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const url = window.URL.createObjectURL(blob);

            // Membuat link untuk diunduh
            const link = document.createElement('a');
            link.href = url;

            // Menentukan nama file yang akan diunduh sesuai format yang dipilih
            if (exportType === 'PDF') {
                link.setAttribute('download', `${menuName}-${getCurrentDateTime()}.pdf`);
            } else if (exportType === 'XLSX') {
                link.setAttribute('download', `${menuName}-${getCurrentDateTime()}.xlsx`);
            }

            // Menambahkan link ke dalam dokumen dan mengkliknya untuk memulai unduhan
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            // Membersihkan objek URL setelah pengunduhan selesai
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error fetching or saving PDF:', error);
            showDynamicSweetAlert('Error!', "Error Fetching Data", 'error');
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
                    <div class="row">
                        <div class="col-12">
                            <div className="card-header">
                                <h2 className="card-title">{menuName}</h2>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit} className="row">
                                    {getParam.map((field, index) => (
                                        <div className="form-group col-md-4" key={index}>
                                            <label htmlFor={field.parameter}>{field.parameter}</label>
                                            <div className={"input-group"}>
                                                {field.typeData === "date" ? (
                                                    <div className="input-group">
                                                        <DatePicker
                                                            className="form-control"
                                                            selected={formData[field.parameter] ? new Date(formData[field.parameter]) : null}
                                                            onChange={(date) => handleChange(field.parameter, date ? date.toISOString().split('T')[0] : null)}
                                                            dateFormat="yyyy-MM-dd"
                                                        />
                                                        <div className="input-group-append">
                                                            <div className="input-group-text">
                                                                <i className="fa fa-calendar"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : field.tableName ? (
                                                    <>
                                                        <Select
                                                           // className="form" // Tambahkan class form-control di sini
                                                            options={lookupTableData[field.accessor]?.map((option) => ({
                                                                label: `${Object.values(option)[2]} - ${Object.values(option)[3]}`,
                                                                value: Object.values(option)[3], // Menggunakan nilai status dari opsi
                                                            })) || []}
                                                            //value={formData[field.parameter] || ''} // Tambahkan value prop untuk menentukan nilai default
                                                            onChange={(selectedOption) => handleChange(field.parameter, selectedOption.value)}
                                                        />
                                                    </>
                                                ) : (
                                                    <input
                                                        type={field.typeData}
                                                        className="form-control"
                                                        id={field.parameter}
                                                        name={field.parameter}
                                                        value={formData[field.parameter] || ''}
                                                        onChange={(e) => handleChange(field.parameter, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="form-group col-md-12 text-right">
                                        <button type="submit" className="btn btn-primary">Load Report</button>
                                    </div>
                                </form>


                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {reportHtml && ( // Tampilkan card baru jika respons HTML tersedia
                <section className="content">
                    <div className="row mt-4">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body" >
                                    <iframe title="Report" srcDoc={reportHtml} style={{ width: '100%', height: '500px', border: 'none' }} />
                                </div>
                                <div className="card-footer">
                                    <div className="row">
                                        <div className="col-md-2">
                                            <select className="form-control" value={exportType} onChange={(e) => setExportType(e.target.value)}>
                                                <option value="PDF">PDF</option>
                                                <option value="XLSX">XLSX</option>
                                                <option value="HTML">HTML</option>
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <button className="btn btn-success" onClick={handleExport}>Export</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </Fragment>
    )
}
export default CoreReport;
