import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Pagination, Typography, Box } from '@mui/material';
import JobCard from './JobCard';
import RecruiterDashboardHeader from './RecruiterDashboardHeader';

const JobsListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4; // Display 4 jobs per page (2 rows)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/onlinejobportal/api/job/recruiter-jobs', {
          params: { recruiterEmail: localStorage.getItem('userEmail') }
        });
        console.log('Jobs fetched: ', response.data);
        setJobs(response.data); 
      } catch (error) {
        console.error('Error fetching jobs', error);
      }
    };
    fetchJobs();
  }, []);
  
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <RecruiterDashboardHeader /> {/* Header inclusion */}
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: '#275df5' }}>
          Jobs Posted by You
        </Typography>

        <Grid container spacing={4}>
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <Grid item xs={12} sm={6} key={job.jobId}> {/* 2 jobs per row for sm screens and larger */}
                <JobCard job={job} />
              </Grid>
            ))
          ) : (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 5 }}>
              <Typography variant="h6" color="textSecondary">
                No jobs found.
              </Typography>
            </Box>
          )}
        </Grid>

        <Pagination
          count={Math.ceil(jobs.length / jobsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
          sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}
        />
      </Container>
    </>
  );
};

export default JobsListPage;
