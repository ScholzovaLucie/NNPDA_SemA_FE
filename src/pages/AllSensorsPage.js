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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import DeviceService from "../services/DeviceService";

// Stylované komponenty
const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.action.selected : "transparent",
  borderRadius: theme.shape.borderRadius,
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DetailBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  height: "100%",
  overflowY: "auto",
}));

function AllSensorsPage() {
  const [sensors, setSensors] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [filter, setFilter] = useState("");
  const [newSensorName, setNewSensorName] = useState("");
  const [newSensorDescription, setNewSensorDescription] = useState("");
  const [editedSensorName, setEditedSensorName] = useState("");
  const [editedSensorDescription, setEditedSensorDescription] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [newSensorLatitude, setNewSensorLatitude] = useState("");
  const [newSensorLongitude, setNewSensorLongitude] = useState("");
  const [editedSensorLatitude, setEditedSensorLatitude] = useState("");
  const [editedSensorLongitude, setEditedSensorLongitude] = useState("");

  useEffect(() => {
    fetchAllSensors();
    fetchAllDevices();
  }, []);

  useEffect(() => {
    if (selectedSensor) {
      setEditedSensorName(selectedSensor.sensorName);
      setEditedSensorDescription(selectedSensor.description || "");
      setEditedSensorLatitude(selectedSensor.latitude);
      setEditedSensorLongitude(selectedSensor.longitude);
      setSelectedDeviceId(selectedSensor.deviceId || "");
    }
  }, [selectedSensor]);

  const fetchAllSensors = async () => {
    try {
      const response = await DeviceService.getAllSensors();
      setSensors(response);
    } catch (error) {
      console.error("Chyba při načítání všech senzorů:", error);
    }
  };

  const fetchAllDevices = async () => {
    try {
      const response = await DeviceService.getUserDevices();
      setDevices(response);
    } catch (error) {
      console.error("Chyba při načítání zařízení:", error);
    }
  };

  const handleCreateSensor = async () => {
    try {
      await DeviceService.createSensor(
        newSensorName,
        newSensorDescription,
        newSensorLatitude,
        newSensorLongitude
      );
      setNewSensorName("");
      setNewSensorDescription("");
      setNewSensorLatitude("");
      setNewSensorLongitude("");
      fetchAllSensors();
    } catch (error) {
      console.error("Chyba při vytváření senzoru:", error);
    }
  };

  const handleUpdateSensor = async () => {
    if (!selectedSensor) return;

    try {
      await DeviceService.updateSensor(
        selectedSensor.id,
        editedSensorName,
        editedSensorDescription,
        editedSensorLatitude,
        editedSensorLongitude
      );
      handleAssignSensorToDevice();
      fetchAllSensors();
      setSelectedSensor(null);
    } catch (error) {
      console.error("Chyba při aktualizaci senzoru:", error);
    }
  };

  const handleAssignSensorToDevice = async () => {
    if (!selectedSensor || !selectedDeviceId) return;

    try {
      await DeviceService.assignSensorToDevice(
        selectedSensor.id,
        selectedDeviceId
      );
      fetchAllSensors();
    } catch (error) {
      console.error("Chyba při přiřazení senzoru k zařízení:", error);
    }
  };

  const handleBackToCreate = () => {
    setSelectedSensor(null);
  };

  const filteredSensors = sensors.filter((sensor) =>
    sensor.sensorName.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDeleteSensor = async (sensorId) => {
    try {
      await DeviceService.deleteSensor(sensorId);
      fetchAllSensors();
    } catch (error) {
      console.error("Chyba při odebírání senzoru:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        Všechny dostupné senzory
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={9}>
          <TextField
            label="Filtr senzorů"
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
          >
            Vytvořit nový
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3} sx={{ flexGrow: 1, overflow: "hidden" }}>
        <Grid item xs={12} md={6} sx={{ height: "100%" }}>
          <Paper
            elevation={3}
            sx={{ p: 2, height: "99%", overflowY: "auto", borderRadius: 2 }}
          >
            <List>
              {filteredSensors.map((sensor) => (
                <StyledListItem
                  key={sensor.id}
                  selected={selectedSensor?.id === sensor.id}
                  button
                  onClick={() => setSelectedSensor(sensor)}
                >
                  <ListItemText primary={sensor.sensorName} />
                  {selectedSensor?.id === sensor.id && (
                    <IconButton
                      edge="end"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSensor(sensor.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </StyledListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} height="99%">
          <DetailBox>
            {selectedSensor ? (
              <>
                <Typography variant="h6">Upravit senzor</Typography>
                <TextField
                  label="Název senzoru"
                  fullWidth
                  margin="normal"
                  value={editedSensorName}
                  onChange={(e) => setEditedSensorName(e.target.value)}
                />
                <TextField
                  label="Popis senzoru"
                  fullWidth
                  margin="normal"
                  value={editedSensorDescription}
                  onChange={(e) => setEditedSensorDescription(e.target.value)}
                />
                <TextField
                  label="Zeměpisná šířka"
                  fullWidth
                  margin="normal"
                  type="number"
                  inputProps={{ step: "0.0000001" }}
                  value={editedSensorLatitude}
                  onChange={(e) => setEditedSensorLatitude(e.target.value)}
                />
                <TextField
                  label="Zeměpisná výška"
                  fullWidth
                  margin="normal"
                  type="number"
                  inputProps={{ step: "0.0000001" }}
                  value={editedSensorLongitude}
                  onChange={(e) => setEditedSensorLongitude(e.target.value)}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="select-device-label">Zařízení</InputLabel>
                  <Select
                    labelId="select-device-label"
                    value={selectedDeviceId}
                    onChange={(e) => setSelectedDeviceId(e.target.value)}
                    label="Zařízení"
                  >
                    {devices.map((device) => (
                      <MenuItem key={device.id} value={device.id}>
                        {device.deviceName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleUpdateSensor}
                >
                  Uložit změny
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 2, ml: 2 }}
                  onClick={handleBackToCreate}
                >
                  Zpět
                </Button>
              </>
            ) : (
              <>
                <Typography variant="h6">Vytvořit nový senzor</Typography>
                <TextField
                  label="Název senzoru"
                  fullWidth
                  margin="normal"
                  value={newSensorName}
                  onChange={(e) => setNewSensorName(e.target.value)}
                />
                <TextField
                  label="Popis senzoru"
                  fullWidth
                  margin="normal"
                  value={newSensorDescription}
                  onChange={(e) => setNewSensorDescription(e.target.value)}
                />
                <TextField
                  label="Zeměpisná šířka"
                  fullWidth
                  margin="normal"
                  type="number"
                  inputProps={{ step: "0.0000001" }}
                  value={newSensorLatitude}
                  onChange={(e) => setNewSensorLatitude(e.target.value)}
                />
                <TextField
                  label="Zeměpisná výška"
                  fullWidth
                  margin="normal"
                  type="number"
                  inputProps={{ step: "0.0000001" }}
                  value={newSensorLongitude}
                  onChange={(e) => setNewSensorLongitude(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleCreateSensor}
                >
                  Vytvořit
                </Button>
              </>
            )}
          </DetailBox>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AllSensorsPage;
