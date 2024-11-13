import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, List, ListItem, ListItemText, IconButton, TextField, Box, Typography, Grid, Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import DeviceService from './../services/DeviceService';

// Vlastní stylování pro zvýraznění vybraného zařízení
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

function AllDevicesDialog({ open, onClose, onDeviceUpdated }) {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [newDeviceData, setNewDeviceData] = useState({ name: '', description: '' });
    const [filter, setFilter] = useState('');

    // Načítání všech zařízení při otevření dialogu
    useEffect(() => {
        if (open) {
            fetchAllDevices();
        }
    }, [open]);

    // Funkce pro načtení všech zařízení
    const fetchAllDevices = async () => {
        try {
            const response = await DeviceService.getAllDevices();
            setDevices(response);
        } catch (error) {
            console.error("Chyba při načítání všech zařízení:", error);
        }
    };

    // Filtrování zařízení podle názvu
    const filteredDevices = devices.filter((device) =>
        device.deviceName.toLowerCase().includes(filter.toLowerCase())
    );

    // Výběr zařízení
    const handleSelectDevice = (device) => {
        setSelectedDevice(device);
    };

    // Přiřazení zařízení k uživateli
    const handleAssignDevice = async () => {
        if (selectedDevice) {
            try {
                await DeviceService.assignDeviceToUser(selectedDevice.id);
                onDeviceUpdated(); // Aktualizace seznamů v nadřazené komponentě
                fetchAllDevices(); // Aktualizace seznamu v dialogu
                onClose();
            } catch (error) {
                console.error("Chyba při přiřazování zařízení:", error);
            }
        }
    };

    // Odstranění zařízení úplně ze systému
    const handleDeleteDevice = async (deviceId) => {
        try {
            await DeviceService.deleteDevice(deviceId);
            onDeviceUpdated(); // Aktualizace seznamů v nadřazené komponentě
            fetchAllDevices(); // Aktualizace seznamu v dialogu
        } catch (error) {
            console.error("Chyba při mazání zařízení:", error);
        }
    };

    // Vytvoření nového zařízení
    const handleCreateDevice = async () => {
        try {
            await DeviceService.createDevice(newDeviceData.name, newDeviceData.description);
            setNewDeviceData({ name: '', description: '' });
            onDeviceUpdated(); // Aktualizace seznamů v nadřazené komponentě
            fetchAllDevices(); // Aktualizace seznamu v dialogu
        } catch (error) {
            console.error("Chyba při vytváření zařízení:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>Všechna dostupná zařízení</DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    {/* Levý sloupec: Detail zařízení */}
                    <Grid item xs={12} md={4}>
                        {selectedDevice ? (
                            <DetailBox>
                                <Typography variant="h6">Detail zařízení</Typography>
                                <Typography variant="body1"><strong>Název:</strong> {selectedDevice.deviceName}</Typography>
                                <Typography variant="body1"><strong>Popis:</strong> {selectedDevice.description || 'Žádný popis'}</Typography>
                                <Box mt={2} textAlign="center">
                                    <Button variant="contained" color="primary" onClick={handleAssignDevice}>
                                        Přidat
                                    </Button>
                                </Box>
                            </DetailBox>
                        ) : (
                            <Typography variant="body1">Vyberte zařízení pro zobrazení detailů.</Typography>
                        )}
                    </Grid>

                    {/* Střední sloupec: Seznam zařízení */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            label="Filtr zařízení"
                            fullWidth
                            margin="normal"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        />
                        <Box sx={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ddd', borderRadius: 4 }}>
                            <List>
                                {filteredDevices.map((device) => (
                                    <StyledListItem
                                        key={device.id}
                                        button
                                        selected={selectedDevice && selectedDevice.id === device.id}
                                        onClick={() => handleSelectDevice(device)}
                                    >
                                        <ListItemText primary={device.deviceName} />
                                        <IconButton
                                            edge="end"
                                            color="secondary"
                                            onClick={() => handleDeleteDevice(device.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </StyledListItem>
                                ))}
                            </List>
                        </Box>
                    </Grid>

                    {/* Pravý sloupec: Vytvoření nového zařízení */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={2} sx={{ padding: 2 }}>
                            <Typography variant="h6">Vytvořit nové zařízení</Typography>
                            <TextField
                                label="Název zařízení"
                                fullWidth
                                margin="normal"
                                value={newDeviceData.name}
                                onChange={(e) => setNewDeviceData({ ...newDeviceData, name: e.target.value })}
                            />
                            <TextField
                                label="Popis zařízení"
                                fullWidth
                                margin="normal"
                                value={newDeviceData.description}
                                onChange={(e) => setNewDeviceData({ ...newDeviceData, description: e.target.value })}
                            />
                            <Button variant="contained" color="primary" fullWidth onClick={handleCreateDevice}>
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

export default AllDevicesDialog;
