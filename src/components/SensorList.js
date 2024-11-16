import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Card,
  CardActionArea,
  CardContent,
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
      console.log(deviceId);
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
    <Grid container spacing={2}>
      {/* Seznam senzorů */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" gutterBottom>
          Senzory
        </Typography>
        {sensorsForDevice.map((sensor) => (
          <Card
            key={sensor.id}
            variant="outlined"
            sx={{
              mb: 2,
              borderColor:
                selectedSensor?.id === sensor.id
                  ? "secondary.main"
                  : "grey.300",
              boxShadow: selectedSensor?.id === sensor.id ? 4 : 1,
            }}
          >
            <CardActionArea onClick={() => onSelectSensor(sensor)}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" color="textPrimary">
                    {sensor.sensorName}
                  </Typography>
                  {selectedSensor?.id === sensor.id && (
                    <IconButton
                      edge="end"
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation(); // Zabrání kliknutí na CardActionArea
                        handleDeleteSensor(sensor.id);
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

      {/* Seznam dat senzoru */}
      <Grid item xs={12} md={6}>
        {selectedSensor ? (
          <>
            <Typography variant="h6" gutterBottom>
              Data senzoru
            </Typography>
            <Box
              sx={{
                maxHeight: 300,
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
                        data.createdAt
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
