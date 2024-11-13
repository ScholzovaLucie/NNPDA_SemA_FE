import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import DeviceService from "./../services/DeviceService";
import AllDevicesDialog from "./../dialogs/AllDevicesDialog";
import AllSensorsDialog from "./../dialogs/AllSensorsDialog";

function MainPage() {
  const [userDevices, setUserDevices] = useState([]);
  const [sensorsForDevice, setSensorsForDevice] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [sensorData, setSensorData] = useState([]); // Nový stav pro data senzoru
  const [openAllDevicesDialog, setOpenAllDevicesDialog] = useState(false);
  const [openAllSensorsDialog, setOpenAllSensorsDialog] = useState(false);

  useEffect(() => {
    fetchUserDevices();
  }, []);

  const fetchUserDevices = async () => {
    try {
      const response = await DeviceService.getUserDevices();
      setUserDevices(response);
    } catch (error) {
      console.error("Chyba při načítání uživatelských zařízení:", error);
    }
  };

  const fetchSensorsForDevice = async (deviceId) => {
    try {
      if (!deviceId) deviceId = selectedDevice.id;
      const response = await DeviceService.getSensorsForDevice(deviceId);
      setSensorsForDevice(response);
    } catch (error) {
      console.error("Chyba při načítání senzorů zařízení:", error);
    }
  };

  const fetchSensorData = async (sensorId) => {
    try {
      const response = await DeviceService.getSensorData(sensorId); // Volání API
      setSensorData(response); // Uložení dat do stavu
    } catch (error) {

    }
  };

  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    fetchSensorsForDevice(device.id);
  };

  const handleSelectSensor = (sensor) => {
    fetchSensorData(sensor.id); // Načtení dat senzoru po kliknutí
    setSelectedSensor(sensor);
  };

  const handleDeviceUpdate = () => {
    fetchUserDevices();
  };

  const handleSensorUpdate = () => {
    fetchSensorsForDevice();
  };

  return (
    <Container>
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Správa zařízení
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setOpenAllDevicesDialog(true)}
          >
            Zobrazit všechna zařízení
          </Button>
          <Typography variant="h6">Vaše zařízení</Typography>
          <List>
            {userDevices.map((device) => (
              <ListItem
                key={device.id}
                button
                onClick={() => handleSelectDevice(device)}
                selected={selectedDevice && selectedDevice.id === device.id}
                sx={{
                  bgcolor:
                    selectedDevice && selectedDevice.id === device.id
                      ? "rgba(0, 0, 255, 0.1)"
                      : "inherit",
                }}
              >
                <ListItemText primary={device.deviceName} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12} md={4}>
          {selectedDevice ? (
            <>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setOpenAllSensorsDialog(true)}
                style={{ marginLeft: "10px" }}
              >
                Zobrazit všechny senzory
              </Button>
              <List>
                {sensorsForDevice.map((sensor) => (
                  <ListItem
                    button
                    key={sensor.id}
                    onClick={() => handleSelectSensor(sensor)}
                  >
                    <ListItemText primary={sensor.sensorName} />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Typography variant="body1">
              Vyberte zařízení pro zobrazení senzorů.
            </Typography>
          )}
        </Grid>

        {/* Seznam dat pro vybraný senzor */}
        <Grid item xs={12} md={4}>
        {selectedSensor ? (
            <>
          <Typography variant="h6">Data senzoru</Typography>
          <Box sx={{ maxHeight: 300, overflowY: "auto", border: "1px solid #ddd", borderRadius: 4 }}>
            <List>
              {sensorData.map((data, index) => (
                <ListItem key={index}>
                  <ListItemText primary={JSON.stringify(data)} />
                </ListItem>
              ))}
            </List>
          </Box>
          </>
        ):(<></>)}
        </Grid>
      </Grid>

      <AllDevicesDialog
        open={openAllDevicesDialog}
        onClose={() => setOpenAllDevicesDialog(false)}
        onDeviceUpdated={handleDeviceUpdate}
      />

      <AllSensorsDialog
        open={openAllSensorsDialog}
        onClose={() => setOpenAllSensorsDialog(false)}
        selectedDevice={selectedDevice}
        onSensorUpdate={handleSensorUpdate}
      />
    </Container>
  );
}

export default MainPage;
