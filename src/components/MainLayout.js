import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AuthService from "../services/AuthService";

const drawerWidth = 240; // Nastavení šířky bočního menu

function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logoutUser();
    navigate("/login"); // Přesměrování na přihlašovací stránku po odhlášení
  };

  return (
    <Box display="flex">
      {/* Boční menu */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            height: "100vh",
            backgroundColor: "#2F3A48",
            color: "white",
            padding: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Správa systému
          </Typography>
          <List>
            <ListItem button onClick={() => navigate("/")}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => navigate("/my")}>
              <ListItemText primary="Moje data" />
            </ListItem>
            <ListItem button onClick={() => navigate("/devices")}>
              <ListItemText primary="Zařízení" />
            </ListItem>
            <ListItem button onClick={() => navigate("/sensors")}>
              <ListItemText primary="Senzory" />
            </ListItem>
            <ListItem button onClick={() => navigate("/profile")}>
              <ListItemText primary="Profil" />
            </ListItem>
          </List>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            margin: 2,
            backgroundColor: "#d32f2f", // Červená barva pro tlačítko odhlášení
          }}
        >
          Logout
        </Button>
      </Drawer>

      {/* Hlavní obsah */}
      <Box
        sx={{
          flexGrow: 1,
          padding: 3,
          marginLeft: `${drawerWidth}px`, // Posunutí obsahu vedle menu
        }}
      >
        <Outlet /> {/* Všechny vnořené trasy se zde vykreslí */}
      </Box>
    </Box>
  );
}

export default MainLayout;
