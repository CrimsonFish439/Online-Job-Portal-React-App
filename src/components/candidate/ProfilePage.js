import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Modal,
  IconButton,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CandidateDashboardHeader from "./CandidateDashboardHeader";

function ProfilePage() {
  const [candidate, setCandidate] = useState({
    name: "",
    profilePicUrl: "",
    workStatus: "EXPERIENCED",
    experienceYears: 0,
    experienceMonths: 0,
    currentSalary: 0,
    location: "",
    mobileNumber: "",
    email: "",
  });
  const [openPicModal, setOpenPicModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [locationOptions, setLocationOptions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const response = await axios.get(
          "http://localhost:8080/onlinejobportal/api/candidates/details",
          {
            params: { email: email },
          }
        );

        const {
          fullName,
          profilePictureUrl,
          workStatus,
          workExperienceYears,
          workExperienceMonths,
          annualSalary,
          currentLocation,
          mobileNumber,
        } = response.data;

        setCandidate({
          name: fullName,
          profilePicUrl: profilePictureUrl,
          workStatus,
          experienceYears: workExperienceYears,
          experienceMonths: workExperienceMonths || 0,
          currentSalary: annualSalary,
          location: currentLocation,
          mobileNumber,
          email,
        });
      } catch (error) {
        console.error("Error fetching candidate details:", error);
      }
    };

    fetchCandidateDetails();

    const fetchLocationOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/onlinejobportal/api/locations/getalllocations"
        );
        setLocationOptions(response.data);
      } catch (error) {
        console.error("Error fetching location options:", error);
      }
    };

    fetchLocationOptions();
  }, []);

  const handlePicOpen = () => setOpenPicModal(true);
  const handlePicClose = () => setOpenPicModal(false);
  const handleDetailsOpen = () => setOpenDetailsModal(true);
  const handleDetailsClose = () => setOpenDetailsModal(false);

  const handleSaveDetails = async () => {
    try {
      const previousEmail = localStorage.getItem("userEmail");
      await axios.post(
        "http://localhost:8080/onlinejobportal/api/candidates/updateProfile",
        {
          ...candidate,
          email: candidate.email,
        }
      );

      if (previousEmail !== candidate.email) {
        localStorage.removeItem("userEmail");
        alert("Email updated. Please log in again.");
        navigate("/login");
      } else {
        handleDetailsClose();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeletePhoto = async () => {
    const email = localStorage.getItem("userEmail");
    try {
      await axios.post(
        "http://localhost:8080/onlinejobportal/api/candidates/deleteProfilePicture",
        { email }
      );
      setCandidate({ ...candidate, profilePicUrl: "" });
      handlePicClose();
    } catch (error) {
      console.error("Error deleting profile picture:", error);
    }
  };

  const handleChangePhoto = async (e) => {
    const file = e.target.files[0];
    const email = localStorage.getItem("userEmail");
    if (file) {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("picture", file);

      try {
        const response = await axios.post(
          "http://localhost:8080/onlinejobportal/api/candidates/updateProfilePicture",
          formData
        );
        const profilePicUrl = response.data;
        setCandidate({ ...candidate, profilePicUrl });
        handlePicClose();
      } catch (error) {
        console.error("Error updating profile picture:", error);
      }
    }
  };

  return (
    <>
      <CandidateDashboardHeader />
      <Container maxWidth="lg" sx={{ marginTop: "40px" }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "40px",
                borderRadius: "16px",
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                position: "relative",
              }}
            >
              {/* Enlarged Profile Picture */}
              <Avatar
                onClick={handlePicOpen}
                alt={candidate.name}
                src={`http://localhost:8080/onlinejobportal/${candidate.profilePicUrl}`}
                sx={{
                  width: "160px",
                  height: "160px",
                  cursor: "pointer",
                  marginRight: "40px",
                  border: "6px solid #275df5",
                }}
              />

              {/* Candidate Details */}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#275df5" }}>
                  {candidate.name}
                </Typography>

                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LocationOnIcon sx={{ mr: 2, color: "#275df5" }} />
                      <Typography variant="body1">{candidate.location}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <EmailIcon sx={{ mr: 2, color: "#275df5" }} />
                      <Typography variant="body1">{candidate.email}</Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <PhoneIcon sx={{ mr: 2, color: "#275df5" }} />
                      <Typography variant="body1">{candidate.mobileNumber}</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <WorkOutlineIcon sx={{ mr: 2, color: "#275df5" }} />
                      <Typography variant="body1">
                        {candidate.experienceYears} Year
                        {candidate.experienceYears !== 1 && "s"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AttachMoneyIcon sx={{ mr: 2, color: "#275df5" }} />
                      <Typography variant="body1">₹ {candidate.currentSalary}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Edit Button */}
              <IconButton
                onClick={handleDetailsOpen}
                sx={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  backgroundColor: "#275df5",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#0039cb",
                  },
                }}
              >
                <EditIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Modal for Profile Picture */}
      <Modal open={openPicModal} onClose={handlePicClose}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6">Profile photo upload</Typography>
          <Avatar
            alt={candidate.name}
            src={`http://localhost:8080/onlinejobportal/${candidate.profilePicUrl}`}
            sx={{ width: "140px", height: "140px", margin: "20px auto" }}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-pic-upload"
            type="file"
            onChange={handleChangePhoto}
          />
          <label htmlFor="profile-pic-upload">
            <Button
              variant="contained"
              component="span"
              color="primary"
              sx={{ mt: 2 }}
            >
              Change Photo
            </Button>
          </label>
        </Box>
      </Modal>

      {/* Modal for Profile Details */}
      <Modal open={openDetailsModal} onClose={handleDetailsClose}>
        <Box sx={{ ...modalStyle, width: 600, maxHeight: "80vh", overflowY: "auto" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Profile Details
          </Typography>
          <TextField
            fullWidth
            label="Name"
            value={candidate.name}
            onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
            margin="normal"
          />

          <FormLabel>Work Status</FormLabel>
          <RadioGroup
            value={candidate.workStatus}
            onChange={(e) => setCandidate({ ...candidate, workStatus: e.target.value })}
            row
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="FRESHER" control={<Radio />} label="Fresher" />
            <FormControlLabel value="EXPERIENCED" control={<Radio />} label="Experienced" />
          </RadioGroup>

          <TextField
            fullWidth
            label="Years of Experience"
            type="number"
            value={candidate.experienceYears}
            onChange={(e) => setCandidate({ ...candidate, experienceYears: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Current Salary"
            value={candidate.currentSalary}
            onChange={(e) => setCandidate({ ...candidate, currentSalary: e.target.value })}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              value={candidate.location}
              onChange={(e) => setCandidate({ ...candidate, location: e.target.value })}
              label="Location"
            >
              {locationOptions.map((location) => (
                <MenuItem key={location.locationId} value={location.locationName}>
                  {location.locationName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Mobile Number"
            value={candidate.mobileNumber}
            onChange={(e) => setCandidate({ ...candidate, mobileNumber: e.target.value })}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Email"
            value={candidate.email}
            InputProps={{ readOnly: true }}
            margin="normal"
          />

          <Button
            onClick={handleSaveDetails}
            variant="contained"
            sx={{ mt: 2 }}
          >
            Save
          </Button>
        </Box>
      </Modal>
    </>
  );
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "12px",
  boxShadow: 24,
  p: 4,
  maxHeight: "80vh", // Ensure that modal doesn't go beyond viewport
  overflowY: "auto", // Enable scrolling
};

export default ProfilePage;
