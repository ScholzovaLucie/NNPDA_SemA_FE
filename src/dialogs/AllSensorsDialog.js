import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, List, ListItem, ListItemText, IconButton, Box, Typography, Grid, Paper, TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import DeviceService from './../services/DeviceService'; // Změněno na SensorService

// Vlastní stylování pro zvýraznění vybraného senzoru
const StyledListItem = styled(ListItem)(({ theme, selected }) => ({
    backgroundColor: selected ? theme.palette.action.selected : 'transparent',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    },
}));

const DetailBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
}));

function AllSensorsDialog({ open, onClose, selectedDevice, onSensorAssigned }) {
    const [userSensors, setUserSensors] = useState([]);
    const [allSensors, setAllSensors] = useState([]);
    const [selectedSensor, setSelectedSensor] = useState(null);
    const [newSensorData, setNewSensorData] = useState({ name: '', description: '' });
    const [filter, setFilter] = useState('');

    // Načítání senzorů při změně vybraného zařízení
    useEffect(() => {
        if (selectedDevice) {
            fetchUserSensors();
            fetchAllSensors();
        }
    }, [selectedDevice]);

    // Funkce pro načtení senzorů uživatele pro dané zařízení
    const fetchUserSensors = async () => {
        try {
            const response = await DeviceService.getSensorsForDevice(selectedDevice.id);
            console.log(response)
            setUserSensors(response);
        } catch (error) {
            console.error("Chyba při načítání senzorů uživatele:", error);
        }
    };

    // Funkce pro načtení všech senzorů
    const fetchAllSensors = async () => {
        try {
            const response = await DeviceService.getAllSensors();
            console.log(response)
            setAllSensors(response);
        } catch (error) {
            console.error("Chyba při načítání všech senzorů:", error);
        }
    };

    // Výběr senzoru
    const handleSelectSensor = (sensor) => {
        setSelectedSensor(sensor);
    };

    // Přiřazení vybraného senzoru k zařízení
    const handleAssignSensor = async () => {
        if (selectedSensor) {
            try {
                await DeviceService.assignSensorToDevice(selectedSensor.id, selectedDevice.id);
                onSensorAssigned(); // Aktualizace seznamu senzorů zařízení
                fetchUserSensors();
            } catch (error) {
                console.error("Chyba při přiřazování senzoru:", error);
            }
        }
    };

    // Odstranění senzoru ze zařízení
    const handleDeleteSensor = async (sensorId) => {
        try {
            await DeviceService.removeSensorFromDevice(sensorId, selectedDevice.id);
            fetchUserSensors(); // Aktualizace seznamu senzorů uživatele
        } catch (error) {
            console.error("Chyba při odstraňování senzoru:", error);
        }
    };

    // Vytvoření nového senzoru
    const handleCreateSensor = async () => {
        try {
            await DeviceService.createSensor(newSensorData.name, newSensorData.description);
            setNewSensorData({ name: '', description: '' });
            fetchAllSensors(); // Aktualizace seznamu všech senzorů
        } catch (error) {
            console.error("Chyba při vytváření senzoru:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>Senzory pro zařízení: {selectedDevice?.deviceName}</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    {/* Levý sloupec: Detail senzoru */}
                    <Grid item xs={12} md={4}>
                        {selectedSensor ? (
                            <DetailBox>
                                <Typography variant="h6">Detail senzoru</Typography>
                                <Typography variant="body1"><strong>Název:</strong> {selectedSensor.name}</Typography>
                                <Typography variant="body1"><strong>Popis:</strong> {selectedSensor.description || 'Žádný popis'}</Typography>
                                <Box mt={2} textAlign="center">
                                    <Button variant="contained" color="primary" onClick={handleAssignSensor}>
                                        Přidat k zařízení
                                    </Button>
                                </Box>
                            </DetailBox>
                        ) : (
                            <Typography variant="body1">Vyberte senzor pro zobrazení detailů.</Typography>
                        )}
                    </Grid>

                    {/* Střední sloupec: Seznam všech senzorů */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h6">Všechny dostupné senzory</Typography>
                        <TextField
                            label="Filtr senzorů"
                            fullWidth
                            margin="normal"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <Box sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 4 }}>
                            <List>
                                {allSensors
                                    .filter(sensor => sensor.name.toLowerCase().includes(filter.toLowerCase()))
                                    .map(sensor => (
                                        <StyledListItem
                                            key={sensor.id}
                                            button
                                            selected={selectedSensor && selectedSensor.id === sensor.id}
                                            onClick={() => handleSelectSensor(sensor)}
                                        >
                                            <ListItemText primary={sensor.name} />
                                        </StyledListItem>
                                    ))}
                            </List>
                        </Box>
                    </Grid>

                    {/* Pravý sloupec: Vytvoření nového senzoru */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ padding: 2 }}>
                            <Typography variant="h6">Vytvořit nový senzor</Typography>
                            <TextField
                                label="Název senzoru"
                                fullWidth
                                margin="normal"
                                value={newSensorData.name}
                                onChange={(e) => setNewSensorData({ ...newSensorData, name: e.target.value })}
                            />
                            <TextField
                                label="Popis senzoru"
                                fullWidth
                                margin="normal"
                                value={newSensorData.description}
                                onChange={(e) => setNewSensorData({ ...newSensorData, description: e.target.value })}
                            />
                            <Button variant="contained" color="primary" fullWidth onClick={handleCreateSensor}>
                                Vytvořit
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Zavřít</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AllSensorsDialog;
