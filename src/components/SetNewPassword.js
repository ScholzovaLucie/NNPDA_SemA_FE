import React, { useState } from 'react';
import {
    Avatar, Container, TextField, Button, Typography, Alert, Box,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import AuthService from './../services/AuthService';
import { useNavigate } from 'react-router-dom';

function SetNewPassword() {
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            await AuthService.setPassword(token, password);
            setSuccess('Heslo bylo úspěšně změněno.');
            setTimeout(() => navigate('/login'), 3000); // Přesměrování na přihlášení po 3 sekundách
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError('Neplatný nebo vypršený token.');
            } else {
                setError('Nastala chyba při změně hesla.');
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                     <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockResetIcon />
                </Avatar>
                <Typography variant="h5" gutterBottom>
                    Nastavení nového hesla
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Reset Token"
                        variant="outlined"
                        margin="normal"
                        required
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Nové heslo"
                        variant="outlined"
                        type="password"
                        margin="normal"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        Nastavit heslo
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default SetNewPassword;
