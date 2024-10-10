import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";

function RecruiterDashboardHeader() {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate(); // Add navigation functionality

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear any necessary data (like token or session details) here, if needed
    localStorage.removeItem("userEmail");
    localStorage.removeItem("recruiterId");
    handleMenuClose();
    navigate("/"); // Redirect to homepage on logout
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#275df5" }}>
      <Toolbar>
        {/* Logo linking to recruiter dashboard */}
        <Typography
          variant="h6"
          component={Link}
          to="/recruiter-dashboard"
          style={{ textDecoration: "none", color: "white", flexGrow: 1 }}
        >
          Job Portal
        </Typography>

        {/* Profile Menu */}
        <IconButton edge="end" color="inherit" onClick={handleProfileMenuOpen}>
          <AccountCircle />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default RecruiterDashboardHeader;
