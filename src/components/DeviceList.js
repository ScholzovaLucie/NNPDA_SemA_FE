import React, { useState, useEffect } from 'react';
import { Container, List, ListItem, ListItemText, Button, Typography, Box } from '@mui/material';
import DeviceService from './../services/DeviceService';
import { useNavigate } from 'react-router-dom';

function DeviceList() {
    const [devices, setDevices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const response = await DeviceService.getMyDevices();
                setDevices(response);
            } catch (error) {
                console.error("Chyba při načítání zařízení:", error);
            }
        };

        fetchDevices();
    }, []);

    const handleDeviceSelect = (deviceId) => {
        navigate(`/device/${deviceId}`);
    };

    return (
        <Container>
            <Box mt={5} textAlign="center">
                <Typography variant="h4">Vaše zařízení</Typography>
                <List>
                    {devices.map((device) => (
                        <ListItem button={true} key={device.id} button onClick={() => handleDeviceSelect(device.id)}>
                            <ListItemText primary={device.name} />
                        </ListItem>
                    ))}
                </List>
                <Button variant="contained" color="primary" onClick={() => navigate('/add-device')}>
                    Přidat nové zařízení
                </Button>
            </Box>
        </Container>
    );
}

export default DeviceList;
