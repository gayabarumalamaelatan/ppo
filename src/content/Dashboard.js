import { Assignment, AssignmentTurnedIn, CheckCircle, HourglassEmpty, Verified } from "@mui/icons-material";
import { Box, Card, CardContent, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import "chart.js/auto";
import React from "react";
import { Doughnut } from "react-chartjs-2";

const Dashboard = () => {
  const summaryData = [
    { label: "REJECTED", value: 0, color: "#FF5722", icon: <Assignment color="error" /> },
    { label: "Need Verify", value: 16, color: "#FFC107", icon: <HourglassEmpty color="warning" /> },
    { label: "Need Settlement", value: 2, color: "#03A9F4", icon: <AssignmentTurnedIn color="info" /> },
    { label: "Need Approve", value: 1, color: "#FF9800", icon: <Verified color="action" /> },
    { label: "Approved", value: 31, color: "#4CAF50", icon: <CheckCircle color="success" /> },
  ];

  const transactionData = [
    { status: "APPROVED", jumlah: 31 },
    { status: "PENDING", jumlah: 16 },
    { status: "REWORK", jumlah: 1 },
    { status: "VERIFIED", jumlah: 3 },
  ];

  const chartData = {
    labels: ["APPROVED", "PENDING", "VERIFIED", "REWORK"],
    datasets: [
      {
        data: [31, 16, 3, 1],
        backgroundColor: ["#4CAF50", "#FFC107", "#03A9F4", "#FF5722"],
        hoverBackgroundColor: ["#388E3C", "#FFA000", "#0288D1", "#E64A19"],
        borderWidth: 2,
        hoverBorderColor: ["#2E7D32", "#F57C00", "#0277BD", "#D84315"],
      },
    ],
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
      animateRotate: true,
    },
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Card style={{ backgroundColor: "#fff",  color: "#000", borderRadius: "20px", boxShadow: "none" }}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Box mr={2}>{item.icon}</Box>
                  <Box>
                    <Typography variant="subtitle1" align="center">
                      {item.label}
                    </Typography>
                    <Typography variant="h4" align="left" component="div" fontWeight= "600" >
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
            <Card style={{borderRadius: "20px", boxShadow:"none"}}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Transaction Status
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>STATUS</TableCell>
                        <TableCell>JUMLAH</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody style={{border:"none"}}>
                      {transactionData.map((row) => (
                        <TableRow key={row.status}>
                          <TableCell>{row.status}</TableCell>
                          <TableCell>{row.jumlah}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell>Total</TableCell>
                        <TableCell>{transactionData.reduce((acc, row) => acc + row.jumlah, 0)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6} width={50}>
            <Card style={{borderRadius: "20px", boxShadow:"none"}}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Transaction Status
                </Typography>
                <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%">
                  <Doughnut data={chartData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
