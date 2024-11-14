import React from "react";
import { Box, Typography } from "@mui/material";

function Dashboard() {
  return (
    <Box sx={{ padding: 3, height: "90vh" }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <iframe
          src="http://localhost:5601/app/dashboards#/view/fdb01290-a2c0-11ef-b76a-4b345559b139?embed=true&_g=(refreshInterval:(pause:!f,value:60000),time:(from:'2024-11-14T20:38:12.654Z',to:'2024-11-14T21:12:22.830Z'))&_a=()"
          height="100%"
          width="100%"
        ></iframe>
      </Box>
    </Box>
  );
}

export default Dashboard;
