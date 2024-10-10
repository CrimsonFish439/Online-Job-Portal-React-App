import React, { useEffect, useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Box,
  Grid,
  Chip,
  Autocomplete,
  Container,
  IconButton,
  InputAdornment,
} from "@mui/material";
import axios from "axios";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const workStatusOptions = [
  { value: "EXPERIENCED", label: "I'm experienced" },
  { value: "FRESHER", label: "I'm a fresher" },
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const MAX_DESCRIPTION_LENGTH = 300;

function CandidateRegistrationForm() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
    workStatus: "",
    currentLocation: "",
    workExperienceYears: "",
    annualSalary: "",
    highestQualification: "",
    selectedCourse: "",
    selectedSpecialization: "",
    selectedUniversity: "",
    selectedSkills: [],
    picture: null,
    dateOfBirth: "",
    gender: "",
    resume: null,
    profileDescription: "",
  });

  const [locations, setLocations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const locationsResponse = await axios.get(
          "http://localhost:8080/onlinejobportal/api/locations/getalllocations"
        );
        const skillsResponse = await axios.get(
          "http://localhost:8080/onlinejobportal/api/skills/getallskills"
        );
        const qualificationsResponse = await axios.get(
          "http://localhost:8080/onlinejobportal/api/qualifications/getallqualifications"
        );

        if (formData.highestQualification) {
          const encodedQualification = encodeURIComponent(
            formData.highestQualification
          );
          const coursesResponse = await axios.get(
            `http://localhost:8080/onlinejobportal/api/courses/byqualification/${encodedQualification}`
          );
          setCourses(coursesResponse.data);
        }

        if (formData.selectedCourse) {
          const specializationsResponse = await axios.get(
            `http://localhost:8080/onlinejobportal/api/specializations/bycourse/${formData.selectedCourse}`
          );
          setSpecializations(specializationsResponse.data);
        }

        const universitiesResponse = await axios.get(
          "http://localhost:8080/onlinejobportal/api/universities/getalluniversities"
        );

        setLocations(locationsResponse.data);
        setSkills(skillsResponse.data);
        setQualifications(qualificationsResponse.data);
        setUniversities(universitiesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [formData.highestQualification, formData.selectedCourse]);

  // Validation functions for each field
  const validateFullName = (name) => /^[A-Za-z\s]{2,30}$/.test(name);
  const validateEmail = (email) =>
    /^[A-Za-z0-9._%+-]{1,30}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  const validateMobileNumber = (number) => /^[6-9][0-9]{9}$/.test(number);
  const validateSalary = (salary) => /^[1-9][0-9]{0,9}$/.test(salary);
  const validateFile = (file, allowedTypes, maxSize) => {
    if (!file) return "";
    if (!allowedTypes.includes(file.type)) {
      return `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`;
    }
    if (file.size > maxSize) {
      return `File size should not exceed ${maxSize / (1024 * 1024)} MB`;
    }
    return "";
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    let error = "";

    if (name === "picture") {
      error = validateFile(file, ["image/png", "image/jpeg"], MAX_FILE_SIZE);
    } else if (name === "resume") {
      error = validateFile(
        file,
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        MAX_FILE_SIZE
      );
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: "" }));
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    switch (name) {
      case "fullName":
        setErrors((prev) => ({
          ...prev,
          fullName: validateFullName(value)
            ? ""
            : "Full name must be 2-30 characters and contain only letters.",
        }));
        break;
      case "email":
        setErrors((prev) => ({
          ...prev,
          email: validateEmail(value) ? "" : "Please enter a valid email.",
        }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          password: validatePassword(value)
            ? ""
            : "Password must be 8+ characters, include upper, lower, number, and special symbol.",
        }));
        break;
      case "mobileNumber":
        setErrors((prev) => ({
          ...prev,
          mobileNumber: validateMobileNumber(value)
            ? ""
            : "Enter a valid 10-digit mobile number (starting with 6, 7, 8, or 9).",
        }));
        break;
      case "annualSalary":
        setErrors((prev) => ({
          ...prev,
          annualSalary: validateSalary(value)
            ? ""
            : "Enter a valid salary (maximum 10 digits).",
        }));
        break;
      case "dateOfBirth":
        const selectedDate = new Date(value);
        const today = new Date();
        setErrors((prev) => ({
          ...prev,
          dateOfBirth: selectedDate > today ? "Date of birth cannot be in the future." : "",
        }));
        break;
      default:
        break;
    }
  };

  const steps = [
    "Basic Details",
    "Employment Details",
    "Education Details",
    "Last Steps",
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
  
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
  
    try {
      const response = await axios.post(
        "http://localhost:8080/onlinejobportal/api/candidates/save",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        alert("Candidate registered successfully!");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          mobileNumber: "",
          workStatus: "",
          currentLocation: "",
          workExperienceYears: "",
          annualSalary: "",
          highestQualification: "",
          selectedCourse: "",
          selectedSpecialization: "",
          selectedUniversity: "",
          selectedSkills: [],
          picture: null,
          dateOfBirth: "",
          gender: "",
          resume: null,
          profileDescription: "",
        });
        setActiveStep(0);
        navigate("/login");
      }
    } catch (error) {
      // Check if the error response is a 409 conflict (duplicate email)
      if (error.response && error.response.status === 409) {
        alert(error.response.data); // Display the backend error message (e.g., email already exists)
      } else {
        console.error("Error while submitting form:", error);
        setError("Error submitting the form. Please try again.");
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Box>
            <TextField
              label="Full Name"
              name="fullName"
              fullWidth
              margin="normal"
              value={formData.fullName}
              onChange={handleChange}
              variant="filled"
              error={!!errors.fullName}
              helperText={errors.fullName}
              sx={{
                borderRadius: "5px",
              }}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              variant="filled"
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                borderRadius: "5px",
              }}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              variant="filled"
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                borderRadius: "5px",
              }}
            />
            <TextField
              label="Mobile Number"
              name="mobileNumber"
              fullWidth
              margin="normal"
              value={formData.mobileNumber}
              onChange={handleChange}
              variant="filled"
              error={!!errors.mobileNumber}
              helperText={errors.mobileNumber}
              sx={{
                borderRadius: "5px",
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Work Status</InputLabel>
              <Select
                name="workStatus"
                value={formData.workStatus}
                onChange={handleChange}
                label="Work Status"
                variant="filled"
                sx={{
                  borderRadius: "5px",
                }}
              >
                {workStatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Current Location</InputLabel>
              <Select
                name="currentLocation"
                value={formData.currentLocation}
                onChange={handleChange}
                label="Current Location"
                variant="filled"
                sx={{
                  borderRadius: "5px",
                }}
              >
                {locations.map((location) => (
                  <MenuItem
                    key={location.locationId}
                    value={location.locationName}
                  >
                    {location.locationName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        );
      case 1:
        return formData.workStatus === "EXPERIENCED" ? (
          <Box>
            <Typography variant="h6">Employment Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Total Work Experience (Years)</InputLabel>
                  <Select
                    name="workExperienceYears"
                    value={formData.workExperienceYears}
                    onChange={handleChange}
                    label="Total Work Experience (Years)"
                    variant="filled"
                    sx={{
                      borderRadius: "5px",
                    }}
                  >
                    {[...Array(31).keys()].map((year) => (
                      <MenuItem key={year} value={year}>
                        {year} Year{year !== 1 ? "s" : ""}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              label="Annual Salary"
              name="annualSalary"
              type="number"
              fullWidth
              margin="normal"
              value={formData.annualSalary}
              onChange={handleChange}
              variant="filled"
              error={!!errors.annualSalary}
              helperText={errors.annualSalary}
              sx={{
                borderRadius: "5px",
              }}
            />
          </Box>
        ) : (
          <Typography variant="h6">
            No employment details needed for Freshers.
          </Typography>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6">Highest Qualification</Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
              {qualifications.map((qual) => (
                <Chip
                  key={qual.qualificationId}
                  label={qual.qualificationName}
                  clickable
                  onClick={() => {
                    setFormData({
                      ...formData,
                      highestQualification: qual.qualificationName,
                      selectedCourse: "",
                      selectedSpecialization: "",
                    });
                  }}
                  color={
                    formData.highestQualification === qual.qualificationName
                      ? "primary"
                      : "default"
                  }
                  sx={{
                    borderRadius: "10px",
                  }}
                />
              ))}
            </Box>

            {formData.highestQualification && (
              <>
                <Typography variant="h6">Course</Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                  {courses.map((course) => (
                    <Chip
                      key={course.courseId}
                      label={course.courseName}
                      clickable
                      onClick={() =>
                        setFormData({
                          ...formData,
                          selectedCourse: course.courseName,
                        })
                      }
                      color={
                        formData.selectedCourse === course.courseName
                          ? "primary"
                          : "default"
                      }
                      sx={{
                        borderRadius: "10px",
                      }}
                    />
                  ))}
                </Box>
              </>
            )}

            {formData.selectedCourse && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Specialization</InputLabel>
                <Select
                  name="selectedSpecialization"
                  value={formData.selectedSpecialization}
                  onChange={handleChange}
                  variant="filled"
                  sx={{
                    borderRadius: "5px",
                  }}
                >
                  {specializations.map((spec) => (
                    <MenuItem
                      key={spec.specializationId}
                      value={spec.specializationName}
                    >
                      {spec.specializationName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Autocomplete
              options={universities}
              getOptionLabel={(option) => option.universityName || ""}
              value={
                universities.find(
                  (uni) => uni.universityName === formData.selectedUniversity
                ) || null
              }
              onChange={(e, newValue) => {
                setFormData({
                  ...formData,
                  selectedUniversity: newValue
                    ? newValue.universityName
                    : "",
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="University/Institute" />
              )}
              isOptionEqualToValue={(option, value) =>
                option.universityName === value.universityName
              }
              sx={{
                borderRadius: "5px",
                marginTop: "10px",
              }}
            />

            <Typography variant="h6" sx={{ marginTop: "10px" }}>
              Key Skills
            </Typography>
            <Autocomplete
              multiple
              options={skills}
              getOptionLabel={(option) => option.skillName}
              value={formData.selectedSkills.map((id) =>
                skills.find((skill) => skill.skillId === id)
              )}
              onChange={(e, newValue) =>
                setFormData({
                  ...formData,
                  selectedSkills: newValue.map((skill) => skill.skillId),
                })
              }
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} label="Select skills" />
              )}
              isOptionEqualToValue={(option, value) =>
                option.skillId === value.skillId
              }
              sx={{
                borderRadius: "5px",
                marginTop: "10px",
              }}
            />
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6">Last Steps</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{
                    borderRadius: "20px",
                  }}
                >
                  Upload Picture
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    name="picture"
                    onChange={handleFileChange}
                  />
                </Button>
                {formData.picture && <Typography>{formData.picture.name}</Typography>}
                {errors.picture && <Typography color="error">{errors.picture}</Typography>}
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderRadius: "20px",
                  }}
                >
                  Upload Resume
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    name="resume"
                    onChange={handleFileChange}
                  />
                </Button>
                {formData.resume && <Typography>{formData.resume.name}</Typography>}
                {errors.resume && <Typography color="error">{errors.resume}</Typography>}
              </Grid>
            </Grid>

            <TextField
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.dateOfBirth}
              onChange={handleChange}
              variant="filled"
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
              sx={{
                borderRadius: "5px",
                marginTop: "10px",
              }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                variant="filled"
                sx={{
                  borderRadius: "5px",
                }}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Profile Description"
              name="profileDescription"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={formData.profileDescription}
              onChange={handleChange}
              variant="filled"
              error={!!errors.profileDescription}
              helperText={errors.profileDescription}
              sx={{
                borderRadius: "5px",
              }}
            />
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <>
      {/* Navbar */}
      <header
        style={{ width: "100%", backgroundColor: "#275df5", padding: "15px 0" }}
      >
        <Container
          maxWidth="lg"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Satoshi",
          }}
        >
          <Typography
            variant="h5"
            color="white"
            component={RouterLink}
            to="/"
            style={{ textDecoration: "none" }}
          >
            Job Portal
          </Typography>
          <Typography color="white">
            Already have an account?{" "}
            <Button
              variant="outlined"
              color="inherit"
              component={RouterLink}
              to="/login"
              sx={{
                borderRadius: "10px",
                borderColor: "white",
                color: "white",
              }}
            >
              LOGIN
            </Button>
          </Typography>
        </Container>
      </header>

      {/* Main Form */}
      <Container
        maxWidth="lg"
        style={{ marginTop: "20px", fontFamily: "Satoshi" }}
      >
        <Grid container spacing={3}>
          {/* Left-side info box */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                position: "relative",
                left: "0",
                width: "300px",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                textAlign: "center",
                marginRight: "20px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
                backgroundColor: "#f9f9f9",
              }}
            >
              <Typography variant="h6" gutterBottom>
                On registering, you can
              </Typography>
              <Typography variant="body1">✔ Build your profile</Typography>
              <Typography variant="body1">
                ✔ Get job postings delivered
              </Typography>
              <Typography variant="body1">
                ✔ Find a job and grow your career
              </Typography>
            </Box>
          </Grid>

          {/* Form and stepper */}
          <Grid item xs={12} sm={8}>
            <Typography variant="h5" gutterBottom>
              Create your profile
            </Typography>
            <Stepper
              activeStep={activeStep}
              sx={{
                padding: "20px 0",
                "& .MuiStepIcon-root.Mui-active": {
                  color: "#275df5", // Active step color
                },
                "& .MuiStepIcon-root.Mui-completed": {
                  color: "#275df5", // Completed step color
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box sx={{ marginTop: "20px" }}>
              {renderStepContent(activeStep)}
              <Box
                sx={{
                  marginTop: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: "20px",
                    padding: "10px 20px",
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={
                    activeStep === steps.length - 1 ? handleSubmit : handleNext
                  }
                  disabled={
                    Object.values(errors).some((error) => error !== "") ||
                    !formData.fullName ||
                    !formData.email ||
                    !formData.password ||
                    !formData.mobileNumber
                  }
                  sx={{
                    backgroundColor: "#275df5",
                    borderRadius: "20px",
                    color: "white",
                    padding: "10px 20px",
                  }}
                >
                  {activeStep === steps.length - 1
                    ? loading
                      ? "Submitting..."
                      : "Submit"
                    : "Next"}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          backgroundColor: "#275df5",
          color: "white",
          padding: "20px 0",
          marginTop: "50px",
        }}
      >
        <Container
          maxWidth="lg"
          style={{ textAlign: "center", fontFamily: "Satoshi" }}
        >
          <Typography variant="body2">
            <RouterLink
              to="#"
              color="inherit"
              style={{ color: "white", textDecoration: "none" }}
            >
              About Us
            </RouterLink>{" "}
            |{" "}
            <RouterLink
              to="#"
              color="inherit"
              style={{ color: "white", textDecoration: "none" }}
            >
              Contact Us
            </RouterLink>{" "}
            |{" "}
            <RouterLink
              to="#"
              color="inherit"
              style={{ color: "white", textDecoration: "none" }}
            >
              FAQs
            </RouterLink>{" "}
            |{" "}
            <RouterLink
              to="#"
              color="inherit"
              style={{ color: "white", textDecoration: "none" }}
            >
              Terms and Conditions
            </RouterLink>{" "}
            |{" "}
            <RouterLink
              to="#"
              color="inherit"
              style={{ color: "white", textDecoration: "none" }}
            >
              Privacy Policy
            </RouterLink>
          </Typography>
          <Typography
            variant="caption"
            display="block"
            style={{ marginTop: "10px", color: "white" }}
          >
            All rights reserved © 2024 Job Portal India Ltd.
          </Typography>
        </Container>
      </footer>
    </>
  );
}

export default CandidateRegistrationForm;
