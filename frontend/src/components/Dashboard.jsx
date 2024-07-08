import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const Dashboard = (props) => {
  const token = localStorage.getItem('token');
  const Navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      Navigate('/login');
    }
  }, [token]);
  return (
    <>
      <h1>dashboard</h1>
      <Button variant="contained" type="button" id='go-to-host-button'>
        <Link style={{ color: 'white', textDecoration: 'none' }} to="/Host">
          Go to Host
        </Link>
      </Button>
      <br />
      <Button variant="contained" type="button" id='Booking-request-management'>
        <Link style={{ color: 'white', textDecoration: 'none' }} to="/BookingManagement">
        Booking request management
        </Link>
      </Button>
    </>
  );
};
export default Dashboard;
