import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeviceService from "../services/DeviceService";
import DeleteIcon from "@mui/icons-material/Delete";

function SensorList({ selectedDevice, selectedSensor, onSelectSensor }) {
  const [sensorsForDevice, setSensorsForDevice] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [hasMoreData, setHasMoreData] = useState(true);

  useEffect(() => {
    if (selectedDevice) {
      fetchSensorsForDevice(selectedDevice.id);
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (selectedSensor) {
      fetchSensorData(selectedSensor.id, page, size);
    }
  }, [selectedSensor, page]);

  const fetchSensorsForDevice = async (deviceId) => {
    try {
      const response = await DeviceService.getSensorsForDevice(deviceId);
      setSensorsForDevice(response);
    } catch (error) {
      console.error("Chyba při načítání senzorů zařízení:", error);
    }
  };

  const fetchSensorData = async (sensorId, currentPage, pageSize) => {
    try {
      const response = await DeviceService.getSensorData(
        sensorId,
        currentPage,
        pageSize
      );
      if (response.length < pageSize) {
        setHasMoreData(false);
      }
      setSensorData((prevData) =>
        currentPage === 0 ? response : [...prevData, ...response]
      );
    } catch (error) {
      console.error("Chyba při načítání dat senzoru:", error);
    }
  };

  const loadMoreData = () => {
    if (hasMoreData) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleDeleteSensor = async (sensorId) => {
    try {
      await DeviceService.removeSensorFromDevice(sensorId, selectedDevice.id);
      fetchSensorsForDevice(selectedDevice.id);
    } catch (error) {}
  };

  return (
    <Grid container spacing={2} sx={{ height: "90vh", overflow: "hidden" }}>
      {/* Seznam senzorů */}
      <Grid item xs={12} md={6} sx={{ height: "100%", overflow: "hidden" }}>
        <Typography variant="h6" gutterBottom>
          Senzory
        </Typography>
        <Box
          sx={{
            height: "calc(100% - 48px)",
            overflowY: "auto",
            border: "1px solid #ddd",
            borderRadius: 2,
            p: 2,
            boxShadow: 2,
          }}
        >
          <List>
            {sensorsForDevice.map((sensor) => (
              <ListItem
                key={sensor.id}
                button
                onClick={() => onSelectSensor(sensor)}
                sx={{
                  mb: 1,
                  border: "1px solid",
                  borderRadius: 1,
                  borderColor:
                    selectedSensor?.id === sensor.id
                      ? "secondary.main"
                      : "grey.300",
                  boxShadow: selectedSensor?.id === sensor.id ? 4 : 1,
                  "&:hover": {
                    backgroundColor: "grey.100",
                  },
                }}
              >
                <ListItemText
                  primary={sensor.sensorName}
                  secondary={selectedSensor?.id === sensor.id}
                />
                {selectedSensor?.id === sensor.id && (
                  <IconButton
                    edge="end"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation(); // Zabrání kliknutí na ListItem
                      handleDeleteSensor(sensor.id);
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

      {/* Seznam dat senzoru */}
      <Grid item xs={12} md={6} sx={{ height: "100%", overflow: "hidden" }}>
        {selectedSensor ? (
          <>
            <Typography variant="h6" gutterBottom>
              Data senzoru
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
                {sensorData.map((data, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={`Hodnota: ${data.value}`}
                      secondary={`Vytvořeno: ${new Date(
                        data.timestamp
                      ).toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
              {hasMoreData && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={loadMoreData}
                  sx={{ mt: 2 }}
                >
                  Načíst více
                </Button>
              )}
            </Box>
          </>
        ) : (
          <Typography variant="body1" color="textSecondary">
            Vyberte senzor pro zobrazení dat.
          </Typography>
        )}
      </Grid>
    </Grid>
  );
}

export default SensorList;
