import React from "react";
import { Box, Typography } from "@mui/material";

function Dashboard() {
  return (
    <Box sx={{ padding: 3, height: "90vh" }}>
      {" "}
      {/* Změněno na 100vh */}
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
        <iframe src="http://localhost:5601/app/dashboards#/view/0db9bcb0-a760-11ef-8af2-8bcecd72b0a4?embed=true&_g=(refreshInterval:(pause:!f,value:60000),time:(from:now%2Fd,to:now%2Fd))&_a=()&hide-filter-bar=true" height="100%" width="100%"></iframe>
      </Box>
    </Box>
  );
}

export default Dashboard;
