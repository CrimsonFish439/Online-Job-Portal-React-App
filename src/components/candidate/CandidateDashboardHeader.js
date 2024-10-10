import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; // for routing between pages
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu"; // for Jobs dropdown

function CandidateDashboardHeader() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const navigate = useNavigate(); // Use this for navigation when logging out

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear any necessary data (like token or session details) here, if needed
    localStorage.removeItem("userEmail");
    localStorage.removeItem("candidateId");
    handleMenuClose();
    navigate("/"); // Redirect to homepage on logout
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "#275df5" }}>
      <Toolbar>
        {/* Logo on the left */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          style={{ textDecoration: "none", color: "white", flexGrow: 1 }}
        >
          Job Portal
        </Typography>

        {/* Jobs dropdown menu */}
        <Button
          onClick={handleMenuOpen}
          style={{ color: "white", marginRight: "20px" }}
        >
          Jobs
          <MenuIcon />
        </Button>

        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem component={Link} to="/application-status" onClick={handleMenuClose}>
            Application Status
          </MenuItem>
        </Menu>

        {/* User profile dropdown */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={handleProfileMenuOpen}
        >
          <AccountCircle />
        </IconButton>

        <Menu
          anchorEl={profileAnchorEl}
          keepMounted
          open={Boolean(profileAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
            View & Update your Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default CandidateDashboardHeader;
