import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  FormHelperText,
} from "@mui/material";
import { Box } from "@mui/material";

import axios from "axios";
import { useNavigate } from "react-router";
import RecruiterDashboardHeader from "./RecruiterDashboardHeader";
import Footer from "../home/Footer";

function RecruiterRegistration() {
  const [activeStep, setActiveStep] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    officialEmail: "",
    password: "",
    companyName: "",
    employeeRange: "",
    designation: "",
    companyLocation: "",
    companyAddress: "",
    aboutCompany: "",
    companyLogo: null,
    industry: "",
    companyLogoName: "",
  });

  const [errors, setErrors] = useState({});
  const [locationOptions, setLocationOptions] = useState([]);
  const [industryOptions, setIndustryOptions] = useState([]);

  const navigate = useNavigate();
  const maxFileSize = 2 * 1024 * 1024; // 2MB
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];

  // Fetch location and industry options
  useEffect(() => {
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

    const fetchIndustryOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/onlinejobportal/api/industries/getallindustries"
        );
        setIndustryOptions(response.data);
      } catch (error) {
        console.error("Error fetching industry options:", error);
      }
    };

    fetchLocationOptions();
    fetchIndustryOptions();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateField(name, value);
  };

  // Handle file input changes for company logo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > maxFileSize) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          companyLogo: "File size should not exceed 2MB.",
        }));
        return;
      }

      if (!allowedFileTypes.includes(file.type)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          companyLogo: "File type must be .jpg, .jpeg, or .png.",
        }));
        return;
      }

      setFormData({
        ...formData,
        companyLogo: file,
        companyLogoName: file.name,
      });
      setErrors((prevErrors) => ({
        ...prevErrors,
        companyLogo: "", // Clear error if valid file
      }));
    }
  };

  // Validate form fields
  const validateField = (name, value) => {
    let errorMessage = "";

    switch (name) {
      case "fullName":
        if (!value || value.length < 3) {
          errorMessage = "Full Name must be at least 3 characters long.";
        }
        break;
      case "officialEmail":
        if (!value || !/\S+@\S+\.\S+/.test(value)) {
          errorMessage = "Please enter a valid email.";
        }
        break;
      case "password":
        if (!value || value.length < 8) {
          errorMessage = "Password must be at least 8 characters long.";
        }
        break;
      case "companyName":
        if (!value || value.length > 50) {
          errorMessage = "Company Name cannot exceed 50 characters.";
        }
        break;
      case "designation":
        if (!value || value.length > 50) {
          errorMessage = "Designation cannot exceed 50 characters.";
        }
        break;
      case "companyAddress":
        if (!value || value.length > 80) {
          errorMessage = "Company Address cannot exceed 80 characters.";
        }
        break;
      case "employeeRange":
        if (!value) {
          errorMessage = "Please select an employee range.";
        }
        break;
      case "companyLocation":
        if (!value) {
          errorMessage = "Please select a company location.";
        }
        break;
      case "industry":
        if (!value) {
          errorMessage = "Please select an industry.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  // Validate the whole form before proceeding to the next step
  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
    });

    return Object.keys(errors).length === 0;
  };

  // Handle form submission only after the last step
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/onlinejobportal/api/recruiter/register",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201 || response.status === 200) {
        alert("Recruiter registered successfully!");
        navigate("/recruiter-login");
      } else {
        alert("Failed to register recruiter.");
      }
    } catch (error) {
      console.error("Error while registering recruiter:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleNext = () => {
    if (!validateForm()) return;

    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = ["Personal Details", "Company Details"];

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <TextField
              label="Full Name *"
              name="fullName"
              fullWidth
              value={formData.fullName}
              onChange={handleInputChange}
              margin="normal"
              error={!!errors.fullName}
              helperText={errors.fullName}
            />

            <TextField
              label="Official Email *"
              name="officialEmail"
              type="email"
              fullWidth
              value={formData.officialEmail}
              onChange={handleInputChange}
              margin="normal"
              error={!!errors.officialEmail}
              helperText={errors.officialEmail}
            />

            <TextField
              label="Password *"
              name="password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              label="Company Name *"
              name="companyName"
              fullWidth
              value={formData.companyName}
              onChange={handleInputChange}
              margin="normal"
              error={!!errors.companyName}
              helperText={errors.companyName}
            />

            <FormControl fullWidth margin="normal" error={!!errors.employeeRange}>
              <InputLabel>Employee Range *</InputLabel>
              <Select
                name="employeeRange"
                value={formData.employeeRange}
                onChange={handleInputChange}
              >
                <MenuItem value="RANGE_15_50">15-50 Employees</MenuItem>
                <MenuItem value="RANGE_50_100">50-100 Employees</MenuItem>
                <MenuItem value="RANGE_100_250">100-250 Employees</MenuItem>
                <MenuItem value="RANGE_250_500">250-500 Employees</MenuItem>
              </Select>
              <FormHelperText>{errors.employeeRange}</FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal" error={!!errors.industry}>
              <InputLabel>Industry *</InputLabel>
              <Select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
              >
                {industryOptions.map((industry) => (
                  <MenuItem key={industry.industryId} value={industry.industryName}>
                    {industry.industryName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.industry}</FormHelperText>
            </FormControl>

            <TextField
              label="Designation *"
              name="designation"
              fullWidth
              value={formData.designation}
              onChange={handleInputChange}
              margin="normal"
              error={!!errors.designation}
              helperText={errors.designation}
            />

            <FormControl fullWidth margin="normal" error={!!errors.companyLocation}>
              <InputLabel>Company Location *</InputLabel>
              <Select
                name="companyLocation"
                value={formData.companyLocation}
                onChange={handleInputChange}
              >
                {locationOptions.map((location) => (
                  <MenuItem key={location.locationId} value={location.locationName}>
                    {location.locationName}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.companyLocation}</FormHelperText>
            </FormControl>

            <TextField
              label="Company Address *"
              name="companyAddress"
              fullWidth
              value={formData.companyAddress}
              onChange={handleInputChange}
              margin="normal"
              error={!!errors.companyAddress}
              helperText={errors.companyAddress}
            />

            <TextField
              label="About Company"
              name="aboutCompany"
              fullWidth
              multiline
              rows={4}
              value={formData.aboutCompany}
              onChange={handleInputChange}
              margin="normal"
            />

            <Box sx={{ marginTop: 2 }}>
              <Button variant="contained" component="label" fullWidth>
                Upload Company Logo
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {formData.companyLogoName && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  File uploaded: {formData.companyLogoName}
                </Typography>
              )}
              {errors.companyLogo && (
                <Typography variant="body2" color="error" sx={{ marginTop: 1 }}>
                  {errors.companyLogo}
                </Typography>
              )}
            </Box>
          </>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <>
      <RecruiterDashboardHeader />
      <Container maxWidth="md">
        <Card sx={{ p: 3, mt: 5, boxShadow: 5, borderRadius: 3 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
            Recruiter Registration
          </Typography>

          <Stepper activeStep={activeStep} style={{ marginBottom: "20px" }}>
            {steps.map((label, index) => (
              <Step key={index}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form>
            {renderStepContent(activeStep)}

            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={6}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="contained"
                  fullWidth
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  onClick={handleNext}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {activeStep === steps.length - 1 ? "Submit" : "Next"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Container>
      <Footer />
    </>
  );
}

export default RecruiterRegistration;
