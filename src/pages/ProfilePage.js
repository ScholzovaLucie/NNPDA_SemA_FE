import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import AuthService from "../services/AuthService";

function ProfilePage() {
  const [profile, setProfile] = useState({
    id: "",
    username: "",
    email: "",
    timestamp: "",
    updatedAt: "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await AuthService.getUserData();
        setProfile({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          timestamp: userData.timestamp,
          updatedAt: userData.updatedAt,
        });
      } catch (error) {
        console.error("Chyba při načítání profilu uživatele:", error);
      }
    };
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (
      newPassword &&
      confirmNewPassword &&
      newPassword !== confirmNewPassword
    ) {
      setPasswordError("Nová hesla se neshodují");
      setIsPasswordValid(false);
    } else {
      setPasswordError("");
      setIsPasswordValid(true);
    }
  }, [newPassword, confirmNewPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleChangePassword = async () => {
    if (!isPasswordValid) return;

    try {
      await AuthService.changePassword({
        username: profile.username,
        oldPassword,
        newPassword,
      });
      setSnackbarMessage("Heslo úspěšně změněno");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      setSnackbarMessage("Chyba při změně hesla");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSave = async () => {
    try {
      await AuthService.updateUserProfile(profile);
      setSnackbarMessage("Profil úspěšně aktualizován");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Chyba při aktualizaci profilu");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Profil uživatele
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
          {profile.username[0]?.toUpperCase()}
        </Avatar>
      </Box>
      <TextField
        label="Uživatelské jméno"
        name="username"
        value={profile.username}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="E-mail"
        name="email"
        value={profile.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Typography variant="h6" mt={3}>
        Změna hesla
      </Typography>
      <TextField
        label="Staré heslo"
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Nové heslo"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Potvrzení nového hesla"
        type="password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      {passwordError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {passwordError}
        </Typography>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleChangePassword}
        sx={{ mt: 2 }}
        fullWidth
        disabled={!isPasswordValid}
      >
        Změnit heslo
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 2 }}
        fullWidth
      >
        Uložit
      </Button>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProfilePage;
