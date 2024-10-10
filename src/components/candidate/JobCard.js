import React from "react";
import { Card, CardContent, Typography, Grid, Box, Chip } from "@mui/material";
import { useNavigate } from "react-router";

const JobCard = ({ job }) => {
  const recruiter = job.recruiter || {}; // Provide fallback in case recruiter is undefined
  const jobLocations = job.jobLocationIds || []; // Use jobLocationIds since it's a list of location names
  const keySkills = job.keySkillsIds || []; // Use keySkillsIds since it's a list of skill names

  const navigate = useNavigate();

  const handleClick = () => {
    if (job.jobId) {
      // Ensure jobId is correctly passed
      navigate(`/job-details/${job.jobId}`);
    } else {
      console.error("Job ID is missing or undefined");
    }
  };

  return (
    <Card
      sx={{
        cursor: "pointer",
        marginBottom: 3,
        boxShadow: 3,
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 6,
        },
        borderRadius: "12px",
      }}
      onClick={handleClick}
    >
      <CardContent>
        <Grid container spacing={2}>
          {/* Job Title, Company Name, and Logo */}
          <Grid item xs={9}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#275df5" }}>
              {job.jobTitle}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {recruiter.companyName || "Unknown Company"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {recruiter.companyLocation || "Unknown Location"}
            </Typography>
          </Grid>

          <Grid item xs={3}>
            {recruiter.companyLogoUrl ? (
              <Box
                component="img"
                src={`http://localhost:8080/onlinejobportal/${recruiter.companyLogoUrl}`}
                alt={recruiter.companyName || "Company Logo"}
                sx={{
                  width: 100,
                  height: 50,
                  borderRadius: "8px",
                  objectFit: "contain",
                  border: "1px solid #ddd",
                  backgroundColor: "#f0f0f0",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 100,
                  height: 50,
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  backgroundColor: "gray",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
              >
                No Logo
              </Box>
            )}
          </Grid>

          {/* Experience, Salary, and Location */}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: "500" }}>
              Experience: {job.minExperience} - {job.maxExperience} Yrs
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "500" }}>
              Salary: ₹{job.minSalary} - ₹{job.maxSalary} PA
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "500" }}>
              Location:{" "}
              {jobLocations.length > 0
                ? jobLocations.join(", ")
                : "Location not specified"}
            </Typography>
          </Grid>

          {/* Core Competency */}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Core Competency:{" "}
              {`${job.qualificationName || "N/A"}, ${job.courseName || "N/A"}, ${job.specializationName || "N/A"}`}
            </Typography>
          </Grid>

          {/* Skills */}
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "500", mb: 1 }}>
              Skills:
            </Typography>
            {keySkills.length > 0 ? (
              keySkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  sx={{ marginRight: "5px", marginBottom: "5px", backgroundColor: "#f0f0f0" }}
                />
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No skills specified
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default JobCard;
