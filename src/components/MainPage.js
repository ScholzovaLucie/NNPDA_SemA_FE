import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Box, Grid, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import DeviceService from './../services/DeviceService';

function MainPage() {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [sensors, setSensors] = useState([]);
    const [openDeviceDialog, setOpenDeviceDialog] = useState(false);
    const [openSensorDialog, setOpenSensorDialog] = useState(false);
    const [deviceData, setDeviceData] = useState({ name: '', description: '' });
    const [sensorData, setSensorData] = useState({ name: '', type: '', unit: '' });

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await DeviceService.getUserDevices();
            setDevices(response);
        } catch (error) {
        }
    };

    const handleDeviceSelect = async (device) => {
        setSelectedDevice(device);
        fetchSensors(device.id);
    };

    const fetchSensors = async (deviceId) => {
        try {
            const response = await DeviceService.getSensorsForDevice(deviceId);
            setSensors(response);
        } catch (error) {
            console.error("Chyba při načítání senzorů:", error);
        }
    };

    const handleAddDevice = () => {
        setOpenDeviceDialog(true);
    };

    const handleSaveDevice = async () => {
        await DeviceService.createDevice(deviceData.name, deviceData.description);
        setOpenDeviceDialog(false);
        setDeviceData({ name: '', description: '' });
        fetchDevices();
    };

    const handleDeleteDevice = async (deviceId) => {
        await DeviceService.deleteDevice(deviceId);
        setSelectedDevice(null);
        setSensors([]);
        fetchDevices();
    };

    const handleAddSensor = () => {
        setOpenSensorDialog(true);
    };

    const handleSaveSensor = async () => {
        await DeviceService.createSensor(sensorData.name, sensorData.type, sensorData.unit);
        setOpenSensorDialog(false);
        setSensorData({ name: '', type: '', unit: '' });
        fetchSensors(selectedDevice.id);
    };

    const handleDeleteSensor = async (sensorId) => {
        await DeviceService.removeSensorFromDevice(sensorId, selectedDevice.id);
        fetchSensors(selectedDevice.id);
    };

    return (
        <Container>
            <Box mt={5} textAlign="center">
                <Typography variant="h4" gutterBottom>
                    Správa zařízení a senzorů
                </Typography>
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6">Vaše zařízení</Typography>
                    <List>
                        {devices.map((device) => (
                            <ListItem
                                key={device.id}
                                button
                                selected={selectedDevice && selectedDevice.id === device.id}
                                onClick={() => handleDeviceSelect(device)}
                            >
                                <ListItemText primary={device.name} />
                                <Button color="secondary" onClick={() => handleDeleteDevice(device.id)}>
                                    Odstranit
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                    <Button variant="contained" color="primary" onClick={handleAddDevice}>
                        Přidat nové zařízení
                    </Button>
                </Grid>

                <Grid item xs={12} md={8}>
                    {selectedDevice ? (
                        <Box>
                            <Typography variant="h6">Senzory zařízení: {selectedDevice.name}</Typography>
                            <List>
                                {sensors.map((sensor) => (
                                    <ListItem key={sensor.id}>
                                        <ListItemText primary={sensor.name} />
                                        <Button color="secondary" onClick={() => handleDeleteSensor(sensor.id)}>
                                            Odstranit senzor
                                        </Button>
                                    </ListItem>
                                ))}
                            </List>
                            <Button variant="contained" color="primary" onClick={handleAddSensor}>
                                Přidat senzor k zařízení
                            </Button>
                        </Box>
                    ) : (
                        <Typography variant="body1">Vyberte zařízení pro zobrazení senzorů.</Typography>
                    )}
                </Grid>
            </Grid>

            <Dialog open={openDeviceDialog} onClose={() => setOpenDeviceDialog(false)}>
                <DialogTitle>Přidat nové zařízení</DialogTitle>
                <DialogContent>
                    <TextField label="Název zařízení" fullWidth margin="normal" value={deviceData.name} onChange={(e) => setDeviceData({ ...deviceData, name: e.target.value })} />
                    <TextField label="Popis zařízení" fullWidth margin="normal" value={deviceData.description} onChange={(e) => setDeviceData({ ...deviceData, description: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeviceDialog(false)}>Zrušit</Button>
                    <Button onClick={handleSaveDevice} color="primary">Uložit</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openSensorDialog} onClose={() => setOpenSensorDialog(false)}>
                <DialogTitle>Přidat nový senzor</DialogTitle>
                <DialogContent>
                    <TextField label="Název senzoru" fullWidth margin="normal" value={sensorData.name} onChange={(e) => setSensorData({ ...sensorData, name: e.target.value })} />
                    <TextField label="Typ senzoru" fullWidth margin="normal" value={sensorData.type} onChange={(e) => setSensorData({ ...sensorData, type: e.target.value })} />
                    <TextField label="Jednotka senzoru" fullWidth margin="normal" value={sensorData.unit} onChange={(e) => setSensorData({ ...sensorData, unit: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSensorDialog(false)}>Zrušit</Button>
                    <Button onClick={handleSaveSensor} color="primary">Uložit</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default MainPage;
