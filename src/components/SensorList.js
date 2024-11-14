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
} from "@mui/material";
import DeviceService from "../services/DeviceService";

function SensorList({
  selectedDevice,
  selectedSensor,
  onSelectSensor,
  openDialog,
}) {
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
                <Typography variant="body1" color="textPrimary">
                  {sensor.sensorName}
                </Typography>
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
                        data.created_at
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
