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
import AllSensorsDialog from "./../dialogs/AllSensorsDialog"; // Import AllSensorsDialog

function MainPage() {
  const [userDevices, setUserDevices] = useState([]);
  const [sensorsForDevice, setSensorsForDevice] = useState([]); // Senzory pro vybrané zařízení
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [openAllDevicesDialog, setOpenAllDevicesDialog] = useState(false);
  const [openAllSensorsDialog, setOpenAllSensorsDialog] = useState(false);

  // Načítání uživatelských zařízení při mountu
  useEffect(() => {
    fetchUserDevices();
  }, []);

  // Funkce pro načtení uživatelských zařízení
  const fetchUserDevices = async () => {
    try {
      const response = await DeviceService.getUserDevices();
      setUserDevices(response);
    } catch (error) {
      console.error("Chyba při načítání uživatelských zařízení:", error);
    }
  };

  // Funkce pro načtení senzorů pro vybrané zařízení
  const fetchSensorsForDevice = async (deviceId) => {
    try {
      const response = await DeviceService.getSensorsForDevice(deviceId);
      setSensorsForDevice(response);
    } catch (error) {
      console.error("Chyba při načítání senzorů zařízení:", error);
    }
  };

  // Funkce pro zobrazení senzorů vybraného zařízení
  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    fetchSensorsForDevice(device.id); // Načtení senzorů pro vybrané zařízení
  };

  // Funkce pro aktualizaci seznamu zařízení
  const handleDeviceUpdate = () => {
    fetchUserDevices();
  };

  return (
    <Container>
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Správa zařízení
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {/* Seznam uživatelských zařízení */}
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
                onClick={() => handleSelectDevice(device)} // Kliknutím zobrazíme senzory zařízení
              >
                <ListItemText primary={device.deviceName} />
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Senzory pro vybrané zařízení */}
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
              <Typography variant="h6">
                Senzory pro: {selectedDevice.deviceName}
              </Typography>

              <List>
                {sensorsForDevice.map((sensor) => (
                  <ListItem button={true} key={sensor.id}>
                    <ListItemText primary={sensor.name} />
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
      </Grid>

      {/* Dialog pro zobrazení všech zařízení */}
      <AllDevicesDialog
        open={openAllDevicesDialog}
        onClose={() => setOpenAllDevicesDialog(false)}
        onDeviceUpdated={handleDeviceUpdate} // Aktualizace seznamů při změně
      />

      {/* Dialog pro zobrazení všech senzorů */}
      <AllSensorsDialog
        open={openAllSensorsDialog}
        onClose={() => setOpenAllSensorsDialog(false)}
      />
    </Container>
  );
}

export default MainPage;
