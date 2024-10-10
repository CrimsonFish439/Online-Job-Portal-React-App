import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Autocomplete,
  Container,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router";
import RecruiterDashboardHeader from "./RecruiterDashboardHeader";
import Footer from "../home/Footer";

const JobPostingForm = () => {
  const [jobData, setJobData] = useState({
    jobTitle: "",
    employmentType: "",
    keySkillsIds: [],
    jobLocationIds: [],
    department: "",
    workMode: "",
    minExperience: 0,
    maxExperience: 0,
    minSalary: 0,
    maxSalary: 0,
    qualificationName: "",
    courseName: "",
    specializationName: "",
    jobDescription: "",
    vacancies: 0,
  });

  const [skills, setSkills] = useState([]);
  const [locations, setLocations] = useState([]);
  const [qualifications, setQualifications] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsResponse = await axios.get(
          "http://localhost:8080/onlinejobportal/api/skills/getallskills"
        );
        const locationsResponse = await axios.get(
          "http://localhost:8080/onlinejobportal/api/locations/getalllocations"
        );
        const qualificationsResponse = await axios.get(
          "http://localhost:8080/onlinejobportal/api/qualifications/getallqualifications"
        );

        setSkills(skillsResponse.data);
        setLocations(locationsResponse.data);
        setQualifications(qualificationsResponse.data);
      } catch (error) {
        console.error("Error fetching form data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (jobData.qualificationName) {
      const fetchCourses = async () => {
        try {
          const encodedQualificationName = encodeURIComponent(
            jobData.qualificationName
          );
          const coursesResponse = await axios.get(
            `http://localhost:8080/onlinejobportal/api/courses/byqualification/${encodedQualificationName}`
          );
          setCourses(coursesResponse.data);
        } catch (error) {
          console.error("Error fetching courses", error);
        }
      };
      fetchCourses();
    }
  }, [jobData.qualificationName]);

  useEffect(() => {
    if (jobData.courseName) {
      const fetchSpecializations = async () => {
        try {
          const encodedCourseName = encodeURIComponent(jobData.courseName);
          const specializationsResponse = await axios.get(
            `http://localhost:8080/onlinejobportal/api/specializations/bycourse/${encodedCourseName}`
          );
          setSpecializations(specializationsResponse.data);
        } catch (error) {
          console.error("Error fetching specializations", error);
        }
      };
      fetchSpecializations();
    }
  }, [jobData.courseName]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "jobTitle":
        if (value.length > 50) error = "Job title cannot exceed 50 characters.";
        break;
      case "department":
        if (value.length > 50)
          error = "Department cannot exceed 50 characters.";
        break;
      case "minExperience":
        if (value < 0) error = "Minimum experience cannot be less than 0.";
        break;
      case "maxExperience":
        if (value < jobData.minExperience)
          error = "Maximum experience cannot be less than minimum experience.";
        break;
      case "minSalary":
        if (value < 0) error = "Minimum salary cannot be less than 0.";
        break;
      case "maxSalary":
        if (value < jobData.minSalary)
          error = "Maximum salary cannot be less than minimum salary.";
        break;
      case "jobDescription":
        if (value.length > 1500)
          error = "Job description cannot exceed 1500 characters.";
        break;
      case "vacancies":
        if (value < 1) error = "Vacancies must be at least 1.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setJobData({ ...jobData, [name]: value });
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const validationErrors = {};
    Object.keys(jobData).forEach((key) => {
      const error = validateField(key, jobData[key]);
      if (error) validationErrors[key] = error;
    });
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Only submit if there are no errors
      const recruiterEmail = localStorage.getItem("userEmail");

      const updatedJobData = {
        ...jobData,
        recruiterEmail: recruiterEmail,
      };

      try {
        const response = await axios.post(
          "http://localhost:8080/onlinejobportal/api/job/postjob",
          updatedJobData
        );
        alert(response.data);
        navigate("/recruiter/jobs-list");
      } catch (error) {
        console.error("Error posting job", error);
        alert("Error posting job.");
      }
    }
  };

  return (
    <>
      <RecruiterDashboardHeader />
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "#f7f9fc",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "center", color: "#275df5" }}
          >
            Post a New Job
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ textAlign: "center", mb: 3, color: "#6b6b6b" }}
          >
            Fill out the details below to post a new job opening.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Job Title"
                  name="jobTitle"
                  value={jobData.jobTitle}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.jobTitle}
                  helperText={errors.jobTitle}
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Employment Type"
                  name="employmentType"
                  value={jobData.employmentType}
                  onChange={handleInputChange}
                  select
                  fullWidth
                  required
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                >
                  <MenuItem value="FULL_TIME">Full Time</MenuItem>
                  <MenuItem value="PART_TIME">Part Time</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={skills}
                  getOptionLabel={(option) => option.skillName}
                  value={jobData.keySkillsIds.map((id) =>
                    skills.find((skill) => skill.skillId === id)
                  )}
                  onChange={(e, newValue) =>
                    setJobData({
                      ...jobData,
                      keySkillsIds: newValue.map((skill) => skill.skillId),
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Key Skills"
                      placeholder="Skills"
                      sx={{ backgroundColor: "white", borderRadius: 2 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={locations}
                  getOptionLabel={(option) => option.locationName}
                  value={jobData.jobLocationIds.map((id) =>
                    locations.find((location) => location.locationId === id)
                  )}
                  onChange={(e, newValue) =>
                    setJobData({
                      ...jobData,
                      jobLocationIds: newValue.map(
                        (location) => location.locationId
                      ),
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Locations"
                      placeholder="Locations"
                      sx={{ backgroundColor: "white", borderRadius: 2 }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Department"
                  name="department"
                  value={jobData.department}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.department}
                  helperText={errors.department}
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Work Mode"
                  name="workMode"
                  value={jobData.workMode}
                  onChange={handleInputChange}
                  select
                  fullWidth
                  required
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                >
                  <MenuItem value="WORK_FROM_HOME">Work from Home</MenuItem>
                  <MenuItem value="IN_OFFICE">In Office</MenuItem>
                  <MenuItem value="HYBRID">Hybrid</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Minimum Experience"
                  name="minExperience"
                  type="number"
                  value={jobData.minExperience}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.minExperience}
                  helperText={errors.minExperience}
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Maximum Experience"
                  name="maxExperience"
                  type="number"
                  value={jobData.maxExperience}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.maxExperience}
                  helperText={errors.maxExperience}
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Minimum Salary"
                  name="minSalary"
                  type="number"
                  value={jobData.minSalary}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.minSalary}
                  helperText={errors.minSalary}
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Maximum Salary"
                  name="maxSalary"
                  type="number"
                  value={jobData.maxSalary}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.maxSalary}
                  helperText={errors.maxSalary}
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Qualification"
                  name="qualificationName"
                  value={jobData.qualificationName}
                  onChange={handleInputChange}
                  select
                  fullWidth
                  required
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                >
                  {qualifications.map((qualification) => (
                    <MenuItem
                      key={qualification.qualificationName}
                      value={qualification.qualificationName}
                    >
                      {qualification.qualificationName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {jobData.qualificationName && (
                <Grid item xs={12}>
                  <TextField
                    label="Course"
                    name="courseName"
                    value={jobData.courseName}
                    onChange={handleInputChange}
                    select
                    fullWidth
                    required
                    sx={{ backgroundColor: "white", borderRadius: 2 }}
                  >
                    {courses.map((course) => (
                      <MenuItem key={course.courseName} value={course.courseName}>
                        {course.courseName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              {jobData.courseName && (
                <Grid item xs={12}>
                  <TextField
                    label="Specialization"
                    name="specializationName"
                    value={jobData.specializationName}
                    onChange={handleInputChange}
                    select
                    fullWidth
                    required
                    sx={{ backgroundColor: "white", borderRadius: 2 }}
                  >
                    {specializations.map((specialization) => (
                      <MenuItem
                        key={specialization.specializationName}
                        value={specialization.specializationName}
                      >
                        {specialization.specializationName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  label="Job Description"
                  name="jobDescription"
                  value={jobData.jobDescription}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  fullWidth
                  required
                  error={!!errors.jobDescription}
                  helperText={errors.jobDescription}
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Vacancies"
                  name="vacancies"
                  type="number"
                  value={jobData.vacancies}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  error={!!errors.vacancies}
                  helperText={errors.vacancies}
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                />
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ px: 5, py: 1.5, borderRadius: 3 }}
                >
                  Post Job
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default JobPostingForm;
