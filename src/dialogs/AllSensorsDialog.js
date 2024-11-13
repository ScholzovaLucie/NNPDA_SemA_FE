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

function AllSensorsDialog({ open, onClose, selectedDevice, onSensorUpdate }) {
    const [userSensors, setUserSensors] = useState([]);
    const [allSensors, setAllSensors] = useState([]);
    const [selectedSensor, setSelectedSensor] = useState(null);
    const [newSensorData, setNewSensorData] = useState({ name: '', description: '' });
    const [filter, setFilter] = useState('');

    // Načítání senzorů při změně vybraného zařízení
    useEffect(() => {
        if (open) {
            fetchAllSensors();
        }
    }, [open]);


    // Funkce pro načtení všech senzorů
    const fetchAllSensors = async () => {
        try {
            const response = await DeviceService.getAllSensors();
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
                console.log(selectedDevice);
                await DeviceService.assignSensorToDevice(selectedSensor.id, selectedDevice.id);
                onSensorUpdate(); // Aktualizace seznamu senzorů zařízení
                fetchAllSensors(); 
                onClose();
            } catch (error) {
                console.error("Chyba při přiřazování senzoru:", error);
            }
        }
    };

    const handleDeleteService = async (sensorId) => {
        try {
            console.log(sensorId)
            await DeviceService.deleteSensor(sensorId);
            onSensorUpdate(); // Aktualizace seznamů v nadřazené komponentě
            fetchAllSensors(); // Aktualizace seznamu v dialogu
        } catch (error) {
            console.error("Chyba při mazání zařízení:", error);
        }
    };

    // Vytvoření nového senzoru
    const handleCreateSensor = async () => {
        try {
            await DeviceService.createSensor(newSensorData.name, newSensorData.description);
            setNewSensorData({ name: '', description: '' });
            fetchAllSensors(); // Aktualizace seznamu všech senzorů
            onSensorUpdate();
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
                                <Typography variant="body1"><strong>Název:</strong> {selectedSensor.sensorName}</Typography>
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
                                    .filter(sensor => sensor.sensorName.toLowerCase().includes(filter.toLowerCase()))
                                    .map(sensor => (
                                        <StyledListItem
                                            key={sensor.id}
                                            button
                                            selected={selectedSensor && selectedSensor.id === sensor.id}
                                            onClick={() => handleSelectSensor(sensor)}
                                            sx={{
                                                bgcolor: selectedSensor && selectedSensor.id === sensor.id ? "rgba(0, 0, 255, 0.1)" : "inherit"
                                              }}
                                        >
                                            <ListItemText primary={sensor.sensorName} />
                                            <IconButton
                                            edge="end"
                                            color="secondary"
                                            onClick={() => handleDeleteService(sensor.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
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
