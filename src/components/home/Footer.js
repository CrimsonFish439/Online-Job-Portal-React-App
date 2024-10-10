import React from 'react';
import { Container, Grid, Typography, Link, Box } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#275df5', color: '#fff', padding: '40px 0' }}>
      <Container>
        <Grid container spacing={3}>
          {/* About Us Section */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              About Job Portal
            </Typography>
            <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
              We are a leading job platform connecting job seekers with employers across various industries.
              Our mission is to make the job search process easier, faster, and more efficient.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" underline="hover">
              Home
            </Link>
            <br />
            <Link href="/about-us" color="inherit" underline="hover">
              About Us
            </Link>
            <br />
            <Link href="/contact-us" color="inherit" underline="hover">
              Contact Us
            </Link>
            <br />
            <Link href="/privacy-policy" color="inherit" underline="hover">
              Privacy Policy
            </Link>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
              Email: support@jobportal.com
              <br />
              Phone: +123 456 7890
              <br />
              Address: 123 Job Street, JobCity, JP 45678
            </Typography>
          </Grid>
        </Grid>

        

        {/* Copyright */}
        <Box sx={{ textAlign: 'center', marginTop: '20px', color: '#e0e0e0' }}>
          <Typography variant="caption" display="block">
            © {new Date().getFullYear()} Job Portal. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
