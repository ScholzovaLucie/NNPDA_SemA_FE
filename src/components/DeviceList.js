import React from "react";
import {
  Grid,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DeviceService from "../services/DeviceService";

function DeviceList({ devices, selectedDevice, onSelectDevice, fetchDevices }) {
  const handleDeleteDevice = async () => {
    try {
      await DeviceService.removeDeviceFromUser(selectedDevice.id);
      fetchDevices();
    } catch (error) {}
  };

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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="textPrimary">
                  {device.deviceName}
                </Typography>
                {selectedDevice?.id === device.id && (
                  <IconButton
                    edge="end"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation(); // Zabrání kliknutí na CardActionArea
                      handleDeleteDevice();
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Grid>
  );
}

export default DeviceList;
