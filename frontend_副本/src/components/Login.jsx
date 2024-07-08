import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const Login = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const Navigate = useNavigate();
  const login = async (e) => {
    const response = await fetch('http://localhost:5005/user/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
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
      props.setToken(data.token);
      Navigate('/dashboard');
    }
  };
  useEffect(() => {
    if (props.token) {
      Navigate('/dashboard');
    }
  }, [props.token]);
  return (
    <>
      <Typography variant="h4">Login</Typography>
      <br />
      <TextField
        label="E-mail"
        type="text"
        value={email}
        id='login-email'
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <Button variant="contained" onClick={login}>
        login
      </Button>
    </>
  );
};

export default Login;
