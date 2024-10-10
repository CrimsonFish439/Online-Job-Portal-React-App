import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Pagination,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import CandidateDashboardHeader from "./CandidateDashboardHeader";
import CandidateSidebar from "./CandidateSidebar";
import JobCard from "./JobCard";
import axios from "axios";

function CandidateDashboard() {
  const [jobs, setJobs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [companies, setCompanies] = useState([]); // List of companies
  const [selectedCompanies, setSelectedCompanies] = useState([]); // Selected companies
  const [selectedLocation, setSelectedLocation] = useState(""); // State for selected location
  const [jobTitle, setJobTitle] = useState(""); // State for job title search
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4; // Adjust for more jobs per page

  // Fetch locations and companies for the dropdown
  useEffect(() => {
    const fetchLocationsAndCompanies = async () => {
      try {
        const [locationsResponse, companiesResponse] = await Promise.all([
          axios.get('http://localhost:8080/onlinejobportal/api/locations/getalllocations'),
          axios.get('http://localhost:8080/onlinejobportal/api/job/all-companies'),
        ]);
        setLocations(locationsResponse.data);
        setCompanies(companiesResponse.data);
      } catch (error) {
        console.error("Error fetching locations or companies", error);
      }
    };
    fetchLocationsAndCompanies();
  }, []);

  // Fetch jobs filtered by location, title, and companies
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        let params = {};

        if (selectedLocation) {
          params.location = selectedLocation;
        }
        if (jobTitle) {
          params.title = jobTitle;
        }
        if (selectedCompanies.length > 0) {
          params.companies = selectedCompanies.map(encodeURIComponent)
        }

        const response = await axios.get(
          "http://localhost:8080/onlinejobportal/api/job/all-jobs",
          { params }
        );
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs", error);
      }
    };

    fetchJobs();
  }, [selectedLocation, jobTitle, selectedCompanies, currentPage]); // Trigger when location, title, companies, or page changes

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCompanyChange = (event) => {
    const value = event.target.value;
    setSelectedCompanies(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <>
      {/* Header */}
      <CandidateDashboardHeader />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Grid container spacing={4}>
          {/* Left Sidebar */}
          <Grid item xs={12} sm={3}>
            <CandidateSidebar />
          </Grid>

          {/* Main Section */}
          <Grid item xs={12} sm={9}>
            <Box
              sx={{
                p: 3,
                boxShadow: 3,
                borderRadius: "10px",
                backgroundColor: "#fff",
                mb: 5,
              }}
            >
              {/* Recommended Jobs Section */}
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#275df5",
                  mb: 3,
                }}
              >
                Find the Best Jobs for You
              </Typography>

              {/* Location Filter */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Filter by Location</InputLabel>
                <Select
                  value={selectedLocation}
                  onChange={(e) => {
                    setCurrentPage(1); // Reset page when filter changes
                    setSelectedLocation(e.target.value);
                  }}
                  label="Filter by Location"
                  sx={{ borderRadius: "10px" }}
                >
                  <MenuItem value="">
                    <em>All Locations</em>
                  </MenuItem>
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

              {/* Job Title Search */}
              <TextField
                label="Search by Job Title"
                variant="outlined"
                fullWidth
                value={jobTitle}
                onChange={(e) => {
                  setCurrentPage(1); // Reset page when search changes
                  setJobTitle(e.target.value);
                }}
                sx={{
                  mb: 2,
                  borderRadius: "10px",
                }}
              />

              {/* Company Filter */}
              {/* <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Filter by Companies</InputLabel>
                <Select
                  multiple
                  value={selectedCompanies}
                  onChange={handleCompanyChange}
                  input={<OutlinedInput label="Filter by Companies" />}
                  renderValue={(selected) => selected.join(", ")}
                  sx={{ borderRadius: "10px" }}
                >
                  {companies.map((company) => (
                    <MenuItem key={company} value={company}>
                      <Checkbox
                        checked={selectedCompanies.indexOf(company) > -1}
                      />
                      <ListItemText primary={company} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}

              {/* Jobs List */}
              <Grid container spacing={2}>
                {currentJobs.length > 0 ? (
                  currentJobs.map((job) => (
                    <Grid item xs={12} key={job.jobId}>
                      <JobCard job={job} /> {/* Pass each job object to JobCard */}
                    </Grid>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    No jobs found.
                  </Typography>
                )}
              </Grid>

              {/* Pagination */}
              <Pagination
                count={Math.ceil(jobs.length / jobsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  mt: 4,
                  display: "flex",
                  justifyContent: "center",
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default CandidateDashboard;
