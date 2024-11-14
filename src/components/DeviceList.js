import React from "react";
import {
  Grid,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

function DeviceList({ devices, selectedDevice, onSelectDevice, openDialog }) {
  return (
    <Grid item xs={12}>
      <Typography variant="h6" gutterBottom>
        Vaše zařízení
      </Typography>
      {devices.map((device) => (
        <Card
          key={device.id}
          variant="outlined"
          sx={{
            mb: 2,
            borderColor:
              selectedDevice?.id === device.id ? "primary.main" : "grey.300",
            boxShadow: selectedDevice?.id === device.id ? 4 : 1,
          }}
        >
          <CardActionArea onClick={() => onSelectDevice(device)}>
            <CardContent>
              <Typography variant="body1" color="textPrimary">
                {device.deviceName}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Grid>
  );
}

export default DeviceList;
