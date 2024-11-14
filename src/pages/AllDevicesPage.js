import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import DeviceService from "../services/DeviceService";

// Stylované komponenty
const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.action.selected : "transparent",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DetailBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));

function AllDevicesPage() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [filter, setFilter] = useState("");
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceDescription, setNewDeviceDescription] = useState("");
  const [editedDeviceName, setEditedDeviceName] = useState("");
  const [editedDeviceDescription, setEditedDeviceDescription] = useState("");

  useEffect(() => {
    fetchAllDevices();
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      setEditedDeviceName(selectedDevice.deviceName);
      setEditedDeviceDescription(selectedDevice.description || "");
    }
  }, [selectedDevice]);

  const fetchAllDevices = async () => {
    try {
      const response = await DeviceService.getAllDevices();
      setDevices(response);
    } catch (error) {
      console.error("Chyba při načítání všech zařízení:", error);
    }
  };

  const handleCreateDevice = async () => {
    try {
      await DeviceService.createDevice(newDeviceName, newDeviceDescription);
      setNewDeviceName("");
      setNewDeviceDescription("");
      fetchAllDevices();
    } catch (error) {
      console.error("Chyba při vytváření zařízení:", error);
    }
  };

  const handleUpdateDevice = async () => {
    try {
      await DeviceService.updateDevice(selectedDevice.id, {
        deviceName: editedDeviceName,
        description: editedDeviceDescription,
      });
      fetchAllDevices();
    } catch (error) {
      console.error("Chyba při aktualizaci zařízení:", error);
    }
  };

  const handleBackToCreate = () => {
    setSelectedDevice(null);
  };

  const handleAssignDevice = () => {
    if (selectedDevice) {
      DeviceService.assignDeviceToUser(selectedDevice.id);
    }
  };

  const filteredDevices = devices.filter((device) =>
    device.deviceName.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDeleteDevice = async (deviceId) => {
    try {
      await DeviceService.deleteDevice(deviceId);
      fetchAllDevices(); // Aktualizuje seznam zařízení po odstranění
    } catch (error) {
      console.error("Chyba při odebírání zařízení:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Všechna dostupná zařízení
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={9}>
          <TextField
            label="Filtr zařízení"
            fullWidth
            margin="normal"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleBackToCreate}
            sx={{ height: "100%" }}
          >
            Vytvořit nový
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <List>
            {filteredDevices.map((device) => (
              <StyledListItem
                key={device.id}
                button
                selected={selectedDevice && selectedDevice.id === device.id}
                onClick={() => setSelectedDevice(device)}
              >
                <ListItemText primary={device.deviceName} />
                <IconButton
                  edge="end"
                  color="secondary"
                  onClick={() => handleDeleteDevice(device.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </StyledListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          {selectedDevice ? (
            <DetailBox>
              <Typography variant="h6">Upravit zařízení</Typography>
              <TextField
                label="Název zařízení"
                fullWidth
                margin="normal"
                value={editedDeviceName}
                onChange={(e) => setEditedDeviceName(e.target.value)}
              />
              <TextField
                label="Popis zařízení"
                fullWidth
                margin="normal"
                value={editedDeviceDescription}
                onChange={(e) => setEditedDeviceDescription(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleUpdateDevice}
              >
                Uložit změny
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 2, ml: 2 }}
                onClick={handleAssignDevice}
              >
                Přiřadit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 2, ml: 2 }}
                onClick={handleBackToCreate}
              >
                Zpět
              </Button>
            </DetailBox>
          ) : (
            <DetailBox>
              <Typography variant="h6" gutterBottom>
                Vytvořit nové zařízení
              </Typography>
              <TextField
                label="Název zařízení"
                fullWidth
                margin="normal"
                value={newDeviceName}
                onChange={(e) => setNewDeviceName(e.target.value)}
              />
              <TextField
                label="Popis zařízení"
                fullWidth
                margin="normal"
                value={newDeviceDescription}
                onChange={(e) => setNewDeviceDescription(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleCreateDevice}
              >
                Vytvořit
              </Button>
            </DetailBox>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default AllDevicesPage;
