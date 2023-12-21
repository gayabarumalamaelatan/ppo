import React, { useState } from "react";
import { showDynamicSweetAlert } from "../toast/Swal";
import axios from "axios";
import { INTEGRATION_SERVICE_WSO_SOCKET } from "../config/ConfigApi";

const { token } = require('../config/Constants');

const SocketTable = ({ isLoadingTable }) => {
  const [inputValues, setInputValues] = useState({});
  const [executedItems, setExecutedItems] = useState([]);

  const headers = { Authorization: `Bearer ${token}` };

  const roles = [
    { id: "1", shellName: "Full Duplex Client" },
    // { id: "2", shellName: "Full Duplex Server" },
  ];


  const handleInputChange = (id, field, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [`${field}-${id}`]: value,
    }));
  };

  const handleExecuteClick = async (row) => {
    try {
        const restPort = inputValues[`restPort-${row.shellName}`];
        const socketAddress = inputValues[`socketAddress-${row.shellName}`];
        const socketPort = inputValues[`socketPort-${row.shellName}`];
        
        const data = {
            fileName: "runClinent",
            parameter: [
                "/opt/source/lib/FullDuplexClient/FullDuplexClient-1.0-SNAPSHOT-jar-with-dependencies.jar",restPort,socketAddress,socketPort
            ]
        }

        if (restPort && socketAddress && socketPort) {
            console.log(
            `Executing with Rest Port ${restPort}, Socket Address ${socketAddress}, and Socket Port ${socketPort} for ID ${row.shellName}`
            );
            const response = await axios.post(`${INTEGRATION_SERVICE_WSO_SOCKET}`, data, {headers})
            // Add the executed item to the list

            console.log("Success executing client:", response);
            setExecutedItems((prevItems) => [
                ...prevItems,
                {
                    shellName: row.shellName,
                    restPort,
                    socketAddress,
                    socketPort,
                },
                ]);
            // Reset states after execution if needed
            setInputValues((prevValues) => ({
            ...prevValues,
            [`restPort-${row.shellName}`]: "",
            [`socketAddress-${row.shellName}`]: "",
            [`socketPort-${row.shellName}`]: "",
            }));
        } else {
            showDynamicSweetAlert('Error!','Please fill all value', 'error'); 
        }
    } catch (error) {
        console.log("Error executing socket", error);
    }




  };

  const handleTerminateClick = (row) => {
    // const restPort = inputValues[`restPort-${row.shellName}`];
    // const socketAddress = inputValues[`socketAddress-${row.shellName}`];
    // const socketPort = inputValues[`socketPort-${row.shellName}`];

    const restPort = row.restPort;
    const socketAddress = row.socketAddress;
    const socketPort = row.socketPort;

    console.log(
      `Terminating with Rest Port ${restPort}, Socket Address ${socketAddress}, and Socket Port ${socketPort} for ID ${row.shellName}`
    );
    
    setExecutedItems((prevItems) => prevItems.filter((executedItem) => executedItem !== row));
    // Reset states after termination if needed
    // setInputValues((prevValues) => ({
    //   ...prevValues,
    //   [`restPort-${row.shellName}`]: "",
    //   [`socketAddress-${row.shellName}`]: "",
    //   [`socketPort-${row.shellName }`]: "",
    // }));
  };

  return (
    <div className="table-container">
      <h4>Run Client</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Listening Rest Port</th>
            <th>Remote Socket Address</th>
            <th>Remote Socket Port</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((row) => (
            <tr key={row.shellName}>
              <td>{row.shellName}</td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={inputValues[`restPort-${row.shellName}`] || ""}
                  onChange={(e) =>
                    handleInputChange(row.shellName, "restPort", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={inputValues[`socketAddress-${row.shellName}`] || ""}
                  onChange={(e) =>
                    handleInputChange(row.shellName, "socketAddress", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={inputValues[`socketPort-${row.shellName}`] || ""}
                  onChange={(e) =>
                    handleInputChange(row.shellName, "socketPort", e.target.value)
                  }
                />
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleExecuteClick(row)}
                >
                  Execute
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      	
      <h4>Running Client</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Listening Rest Port</th>
            <th>Remote Socket Address</th>
            <th>Remote Socket Port</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {executedItems.map((item, index) => (
            <tr key={index}>
              <td>{item.shellName}</td>
              <td>{item.restPort}</td>
              <td>{item.socketAddress}</td>
              <td>{item.socketPort}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleTerminateClick(item)}
                >
                  Terminate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default SocketTable;
