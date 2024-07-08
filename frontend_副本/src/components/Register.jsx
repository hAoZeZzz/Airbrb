import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Register = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [conPassword, setConPassword] = React.useState('');
  const confirmPassword = () => {
    if (password !== conPassword) {
      alert('Make sure enter the same password.');
      setConPassword('');
      setPassword('');
    }
  };
  const checkEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please check the E-mail entered');
      setEmail('');
    }
  };
  const Navigate = useNavigate();
  const register = async (e) => {
    const response = await fetch('http://localhost:5005/user/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        name
      }),
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);
      Navigate('/dashboard');
      props.setToken('data.token');
    }
  };
  useEffect(() => {
    if (props.token) {
      Navigate('/dashboard');
    }
  }, [props.token]);
  return (
    <>
      <Typography variant="h4">Register</Typography>
      <br />
      <TextField
        label="Name"
        type="text"
        value={name}
        id='register-name'
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <br />
      <TextField
        label="E-mail"
        type="text"
        value={email}
        id='register-email'
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => checkEmail()}
      />
      <br />
      <br />
      <TextField
        label="Password"
        type="password"
        value={password}
        id='register-password'
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <TextField
        label="Confirm password"
        type="password"
        value={conPassword}
        id='register-conpassword'
        onChange={(e) => setConPassword(e.target.value)}
        onBlur={() => confirmPassword()}
      />
      <br />
      <br />

      <Button variant="contained" type="button" onClick={register} id='register-button'>
        Register
      </Button>
    </>
  );
};

export default Register;
