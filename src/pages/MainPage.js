import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import DeviceList from "../components/DeviceList";
import SensorList from "../components/SensorList";
import DeviceService from "../services/DeviceService";

function MainPage() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedSensor, setSelectedSensor] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const response = await DeviceService.getUserDevices();
      setDevices(response);
    } catch (error) {
      console.error("Chyba při načítání zařízení:", error);
    }
  };

  const handleSelectDevice = (device) => {
    setSelectedDevice(device);
    setSelectedSensor(null);
  };

  const handleSelectSensor = (sensor) => {
    setSelectedSensor(sensor);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Přehled zařízení a senzorů
      </Typography>
      <Grid container spacing={3}>
        {/* Seznam zařízení - 1/3 šířky */}
        <Grid item xs={12} md={4}>
          <DeviceList
            devices={devices}
            selectedDevice={selectedDevice}
            onSelectDevice={handleSelectDevice}
            fetchDevices={fetchDevices}
          />
        </Grid>

        {/* Seznam senzorů - 2/3 šířky */}
        <Grid item xs={12} md={8}>
          <SensorList
            selectedDevice={selectedDevice}
            selectedSensor={selectedSensor}
            onSelectSensor={handleSelectSensor}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default MainPage;
