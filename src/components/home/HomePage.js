import React from 'react';
import { Container, Button, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { Link } from 'react-router-dom'; 
import '../../css/home/HomePage.css';
import Footer from './Footer';

function HomePage() {
  return (
    <>
    <div style={{ 
      backgroundImage: 'url(https://www.simplilearn.com/ice9/free_resources_article_thumb/Top_11_Highest_Salary_Jobs_in_India_to_Watch_Out_For_in_2022.jpg)',  // Replace with your image path
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      padding: '20px 0',
    }}>
      <Container maxWidth="md">
        {/* Header Section */}
        <header>
          <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0' }}>
            <div>
              <Typography variant="h4" style={{ fontWeight: 'bold', color: '#fff' }}>Job Portal</Typography> {/* White text */}
            </div>
            <div>
              <Button 
                variant="outlined" 
                component={Link} 
                to="/login"
                sx={{ borderRadius: '20px', color: '#fff', borderColor: '#fff' }} // White border and text
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{ borderRadius: '20px', marginLeft: '10px' }}
              >
                Register
              </Button>
              <Button 
                variant="outlined" 
                component={Link} 
                to="/recruiter-login"
                sx={{ borderRadius: '20px', marginLeft: '10px', color: '#fff', borderColor: '#fff' }} // White border and text
              >
                For Employers
              </Button>
              
            </div>
          </nav>
        </header>

        {/* Hero Section */}
        <Grid container spacing={3} style={{ marginTop: '50px', textAlign: 'center' }}>
          <Grid item xs={12}>
            <Typography variant="h3" style={{ fontWeight: 'bold', color: '#fff' }}>Find Your Dream Job Now</Typography>
          </Grid>
        </Grid>

        {/* Static Job Categories Section */}
        <Grid container spacing={3} style={{ marginTop: '50px', textAlign: 'center' }}>
          <Grid item xs={12}>
            <Typography variant="h5" style={{ marginBottom: '20px', fontWeight: 'bold', color: '#fff' }}>Popular Job Categories</Typography>
          </Grid>
          {['Technology', 'Healthcare', 'Finance', 'Education', 'Marketing'].map((category) => (
            <Grid item xs={12} sm={4} key={category}>
              <Card sx={{ borderRadius: '20px' }}>  {/* Rounded corners for cards */}
                <CardContent>
                  <Typography variant="h6">{category}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

                {/* Why Choose Us Section */}
                <Box sx={{ padding: '40px 0', marginTop: '50px', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
          <Container>
            <Grid container spacing={3} style={{ textAlign: 'center' }}>
              <Grid item xs={12}>
                <Typography variant="h5" style={{ marginBottom: '20px', fontWeight: 'bold', color: 'black' }}>
                  Why Choose Us?
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" style={{ color: 'black' }}>
                  <strong>Wide Range of Jobs</strong> - Explore thousands of job listings across industries.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" style={{ color: 'black' }}>
                  <strong>Easy Application Process</strong> - Apply for jobs with a simple click.
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body1" style={{ color: 'black' }}>
                  <strong>Trusted by Top Employers</strong> - We collaborate with top companies.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Container>
    </div>
    <Footer />
    </>
  );
}

export default HomePage;
