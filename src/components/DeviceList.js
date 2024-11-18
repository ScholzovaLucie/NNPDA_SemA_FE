import React from "react";
import {
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
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
    <Grid item xs={12} sx={{ height: "100%", overflow: "hidden" }}>
      <Typography variant="h6" gutterBottom>
        Vaše zařízení
      </Typography>
      <Box
        sx={{
          height: "calc(100% - 48px)", // Odečte výšku nadpisu
          overflowY: "auto",
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 2,
          boxShadow: 2,
        }}
      >
        <List>
          {devices.map((device) => (
            <ListItem
              key={device.id}
              button
              onClick={() => onSelectDevice(device)}
              sx={{
                mb: 1,
                border: "1px solid",
                borderRadius: 1,
                borderColor:
                  selectedDevice?.id === device.id
                    ? "primary.main"
                    : "grey.300",
                boxShadow: selectedDevice?.id === device.id ? 4 : 1,
                "&:hover": {
                  backgroundColor: "grey.100",
                },
              }}
            >
              <ListItemText
                primary={device.deviceName}
                secondary={selectedDevice?.id === device.id}
              />
              {selectedDevice?.id === device.id && (
                <IconButton
                  edge="end"
                  color="secondary"
                  onClick={(e) => {
                    e.stopPropagation(); // Zabrání kliknutí na ListItem
                    handleDeleteDevice(device.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </ListItem>
          ))}
        </List>
      </Box>
    </Grid>
  );
}

export default DeviceList;
