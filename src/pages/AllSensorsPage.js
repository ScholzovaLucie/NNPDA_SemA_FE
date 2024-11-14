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
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DetailBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
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
      setSelectedDeviceId(selectedSensor.deviceId || ""); // Nastavení deviceId senzoru při výběru
    }
  }, [selectedSensor]);

  // Načte všechny senzory
  const fetchAllSensors = async () => {
    try {
      const response = await DeviceService.getAllSensors();
      setSensors(response);
    } catch (error) {
      console.error("Chyba při načítání všech senzorů:", error);
    }
  };

  // Načte všechna zařízení
  const fetchAllDevices = async () => {
    try {
      const response = await DeviceService.getUserDevices();
      setDevices(response);
    } catch (error) {
      console.error("Chyba při načítání zařízení:", error);
    }
  };

  // Vytvoří nový senzor
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
      setEditedSensorLongitude("");
      fetchAllSensors(); // Aktualizuje seznam senzorů
    } catch (error) {
      console.error("Chyba při vytváření senzoru:", error);
    }
  };

  // Aktualizuje vybraný senzor
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
      fetchAllSensors(); // Aktualizuje seznam senzorů
      setSelectedSensor(null); // Vrátí se zpět k vytvoření nového senzoru
    } catch (error) {
      console.error("Chyba při aktualizaci senzoru:", error);
    }
  };

  // Přiřadí senzor k zařízení
  const handleAssignSensorToDevice = async () => {
    if (!selectedSensor || !selectedDeviceId) return;

    try {
      await DeviceService.assignSensorToDevice(
        selectedSensor.id,
        selectedDeviceId
      );
      fetchAllSensors(); // Aktualizuje seznam senzorů po přiřazení
    } catch (error) {
      console.error("Chyba při přiřazení senzoru k zařízení:", error);
    }
  };

  // Resetuje formulář pro vytvoření nového senzoru
  const handleBackToCreate = () => {
    setSelectedSensor(null);
  };

  // Filtrování senzorů podle názvu
  const filteredSensors = sensors.filter((sensor) =>
    sensor.sensorName.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDeleteSensor = async (sensorId) => {
    try {
      await DeviceService.deleteSensor(sensorId);
      fetchAllSensors(); // Aktualizuje seznam senzorů po odstranění
    } catch (error) {
      console.error("Chyba při odebírání senzoru:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Všechny dostupné senzory
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
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
            sx={{ height: "100%" }}
          >
            Vytvořit nový
          </Button>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <List>
            {filteredSensors.map((sensor) => (
              <StyledListItem
                key={sensor.id}
                button
                selected={selectedSensor && selectedSensor.id === sensor.id}
                onClick={() => setSelectedSensor(sensor)}
              >
                <ListItemText primary={sensor.sensorName} />
                <IconButton
                  edge="end"
                  color="secondary"
                  onClick={() => handleDeleteSensor(sensor.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </StyledListItem>
            ))}
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          {selectedSensor ? (
            <DetailBox>
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
                variant="contained"
                color="secondary"
                sx={{ mt: 2, ml: 2 }}
                onClick={handleAssignSensorToDevice}
              >
                Přiřadit k zařízení
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
                Vytvořit nový senzor
              </Typography>
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
            </DetailBox>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default AllSensorsPage;
