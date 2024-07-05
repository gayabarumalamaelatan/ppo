import { Assignment, AssignmentTurnedIn, CheckCircle, HourglassEmpty, Verified } from "@mui/icons-material";
import { Box, Card, CardContent, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import "chart.js/auto";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { getToken } from "../config/Constants";
import { data } from "jquery";

const DashboardMm = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ["APPROVED", "PENDING", "VERIFIED", "REWORK", "REJECTED"],
    datasets: [
      {
        data: [],
        backgroundColor: ["#4CAF50", "#FFC107", "#03A9F4", "#FF9800", "#FF5722"],
        hoverBackgroundColor: ["#388E3C", "#FFA000", "#0288D1", "#E64A19"],
        borderWidth: 2,
        hoverBorderColor: ["#2E7D32", "#F57C00", "#0277BD", "#D84315"],
      },
    ],
  });

  useEffect(() => {
    fetchData();
  }, [data]);

  const token = getToken();
  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get('http://10.8.135.84:8183/form-service/count-data?branchId=1&f=MMT', { headers });
      const fetchedData = response.data;

      setTransactionData(fetchedData);

      const updatedChartData = {
        labels: fetchedData.map((item) => item.status),
        datasets: [
          {
            ...chartData.datasets[0],
            data: fetchedData.map((item) => item.count),
          },
        ],
      };
      setChartData(updatedChartData);

      const updatedSummaryData = fetchedData.map((item) => {
        let icon, color;
        switch (item.status) {
          case "REJECTED":
            icon = <Assignment color="error" />;
            color = "#FF5722";
            break;
          case "PENDING":
            icon = <HourglassEmpty color="warning" />;
            color = "#FFC107";
            break;
          case "VERIFIED":
            icon = <AssignmentTurnedIn color="info" />;
            color = "#03A9F4";
            break;
          case "REWORK":
            icon = <Verified color="action" />;
            color = "#FF9800";
            break;
          case "APPROVED":
            icon = <CheckCircle color="success" />;
            color = "#4CAF50";
            break;
          default:
            icon = <Assignment color="error" />;
            color = "#9E9E9E";
        }
        return {
          label: item.status,
          value: item.count,
          color: color,
          icon: icon,
        };
      });

      setSummaryData(updatedSummaryData);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleNavigation = (status) => {
    switch (status) {
      case "APPROVED":
        window.location.href = '/approved';
        break;
      case "PENDING":
        window.location.href = '/money-market';
        break;
      case "VERIFIED":
        window.location.href = '/money-market';
        break;
      case "REWORK":
        window.location.href = '/rework';
        break;
      case "REJECTED":
        window.location.href = '/rejected';
        break;
      default:
        break;
    }
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw} transactions`;
          },
        },
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Dashboard Money Market</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">Dashboard Money Market</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <Container maxWidth='auto'>
        <Grid container spacing={3}>
          {summaryData.map((item, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Card style={{ backgroundColor: item.color, color: "#fff", borderRadius: "20px" }}>
                <CardContent>
                  <Box display="flex" alignItems="center">
                    <Box mr={2}>{item.icon}</Box>
                    <Box>
                      <Typography variant="subtitle1" align="center">
                        {item.label}
                      </Typography>
                      <Typography variant="h4" align="left" component="div" fontWeight="600">
                        {item.value}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card style={{ borderRadius: "20px", }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Transaction Status
                  </Typography>
                  <TableContainer component={Paper} style={{ borderRadius: "10px" }}>
                    <Table>
                      <TableHead>
                        <TableRow style={{ backgroundColor: "#da201a", }}>
                          <TableCell style={{ color: "#fff", fontWeight: "bold" }}>STATUS</TableCell>
                          <TableCell style={{ color: "#fff", fontWeight: "bold" }}>COUNT</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody style={{ border: "none" }}>
                        {transactionData.map((item, index) =>
                          <TableRow key={item.status} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f2f2f2" }}>
                            <TableCell>{item.status}</TableCell>
                            <TableCell>
                              <a
                                href={item.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleNavigation(item.status);
                                }}
                              >
                                {item.count}
                              </a>
                            </TableCell>
                          </TableRow>
                        )}
                        <TableRow >
                          <TableCell style={{ backgroundColor: "#d9d9d9" }}>Total</TableCell>
                          <TableCell style={{ backgroundColor: "#d9d9d9" }}>{transactionData.reduce((acc, row) => acc + row.count, 0)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card style={{ borderRadius: "20px"}}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Transaction Status
                  </Typography>
                  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" >
                    <Doughnut data={chartData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default DashboardMm;
