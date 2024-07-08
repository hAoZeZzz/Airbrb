import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import Host from './Host';
import Footer from './Footer';
import SearchListingDetail from './SearchListingDetail';
import BookingManagement from './BookingManagement';
import BookingDetail from './BookDetail';

const PageList = () => {
  const [isDate, setIsDate] = useState();
  const [token, setToken] = React.useState(null);
  const [searchListingDetailId, setSearchListingDetailId] =
    React.useState(null);
  const [allIds, setAllIds] = useState(null);
  const Navigate = useNavigate();
  React.useEffect(() => {
    const checkToken = localStorage.getItem('token');
    if (checkToken) {
      setToken(checkToken);
    }
  }, []);
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    Navigate('/login');
  };
  const getListing = async () => {
    if (localStorage.getItem('token')) {
      const res = await fetch('http://localhost:5005/listings', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-type': 'application/json'
        }
      });
      const data = await res.json();
      setAllIds(data.listings);
    } else {
      const res = await fetch('http://localhost:5005/listings', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      });
      const data = await res.json();
      setAllIds(data.listings);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      getListing();
    }, 200);

    return () => {
      clearInterval(intervalId);
    };
  }, [allIds]);

  return (
    <>
      {token
        ? (
        <>
          <Link id="homepage" to="/">
            Home Page
          </Link>
          &nbsp;|&nbsp;
          <Link to="/dashboard" id="dashboard">dashboard</Link>
          &nbsp;|&nbsp;
          <a
          id='logout'
            href="#"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </a>
        </>
          )
        : (
        <>
          <Link id="homepage" to="/">
            Home Page
          </Link>
          &nbsp;|&nbsp;
          <Link to="/register" id="register">
            Register
          </Link>
          &nbsp;|&nbsp;
          <Link to="/login" id="login">
            Login
          </Link>
        </>
          )}
      <hr />
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              listingDetailId={searchListingDetailId}
              setListingDetailId={setSearchListingDetailId}
              isDate={isDate}
              setIsDate={setIsDate}
            />
          }
        />
        {allIds
          ? allIds.map((id) => (
              <Route
                key={id.id}
                path={`/${id.id}`}
                element={<SearchListingDetail id={id.id} isDate={isDate} />}
              />
          ))
          : null}
        {allIds
          ? allIds.map((id) => (
              <Route
                key={id.id}
                path={`/${id.id}/bookingDetail`}
                element={<BookingDetail id={id.id} />}
              />
          ))
          : null}
        <Route
          path="/dashboard"
          element={<Dashboard token={token} setToken={setToken} />}
        />
        <Route
          path="/bookingManagement"
          element={<BookingManagement token={token} setToken={setToken} />}
        />
        <Route
          path="/host"
          element={<Host token={token} setToken={setToken} />}
        />
        <Route
          path="/register"
          element={<Register token={token} setToken={setToken} />}
        />
        <Route
          path="/login"
          element={<Login token={token} setToken={setToken} />}
        />
      </Routes>
      <hr />
      <Footer />
    </>
  );
};

export default PageList;
