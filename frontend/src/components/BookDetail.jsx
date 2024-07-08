import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const BookingDetail = (props) => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [currentTime] = useState(new Date());
  const [canDisplay, setCanDisplay] = useState('block');
  const backToBookingFunc = () => {
    navigate('../host');
  };
  const acceptFunc = async (e) => {
    const res = await fetch(
      `http://localhost:5005/bookings/accept/${e.target.parentNode.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-type': 'application/json'
        }
      }
    );
    const data = await res.json();
    if (data.error) {
      alert(data.error)
    } else {
      setCanDisplay('none');
      alert('Accept booking successfully');
    }
  };

  const declineFunc = async (e) => {
    const res = await fetch(
      `http://localhost:5005/bookings/decline/${e.target.parentNode.id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-type': 'application/json'
        }
      }
    );
    const data = await res.json();
    if (data.error) {
      alert(data.error)
    } else {
      setCanDisplay('none');
      alert('Decline booking successfully');
    }
  };
  const getDetail = async () => {
    const listingId = props.id;
    const res = await fetch(`http://localhost:5005/listings/${listingId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    });
    let listingDetail = await res.json();

    if (listingDetail.error) {
      alert(listingDetail.error);
    }
    listingDetail = listingDetail.listing;
    listingDetail.id = listingId;

    const res1 = await fetch('http://localhost:5005/bookings', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json'
      }
    });
    let allBookings = await res1.json();
    if (allBookings.error) {
      alert(allBookings.error);
    }
    allBookings = allBookings.bookings;
    const timeDifference = currentTime - new Date(listingDetail.postedOn);
    const thisYear = currentTime.toLocaleDateString().split('/')[0];
    let thisYearAllDays = 0;
    allBookings.forEach((ele, i) => {
      if (parseInt(ele.listingId) === parseInt(listingId)) {
        if (
          ele.dateRange[0].split('-')[0] === thisYear &&
          ele.status === 'accepted'
        ) {
          thisYearAllDays += Math.floor(
            (new Date(ele.dateRange[1]) - new Date(ele.dateRange[0])) /
              (1000 * 3600 * 24)
          );
        }
      }
    });

    const thisYearAllIncome = thisYearAllDays * parseInt(listingDetail.price);
    setContent(
      <>
        <img
          style={{ maxHeight: '50vh' }}
          src={listingDetail.thumbnail}
          alt="Listing image"
        />
        <p>Title: {listingDetail.title}</p>
        {listingDetail.postedOn
          ? (
          <>
            <p>
              Post time: {new Date(listingDetail.postedOn).toLocaleString()}
            </p>
            <p>
              Has been posted: {Math.floor(timeDifference / (1000 * 3600 * 24))}
              day{'(s) '}
              {Math.floor(
                (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
              )}
              hour{'(s) '}
              {Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))}
              minute{'(s) '}
            </p>
          </>
            )
          : (
          <p>Not posted yet</p>
            )}

        <>
          {allBookings.map((ele, index) => {
            setCanDisplay('block');
            return parseInt(ele.listingId) === listingId
              ? (
              <div key={index} id={ele.id}>
                <hr />
                <p>Status: {ele.status}</p>
                <p>Applicant: {ele.owner}</p>
                <p>Total price: ${ele.totalPrice}</p>
                <p>
                  Booking days: From {ele.dateRange[0]} to {ele.dateRange[1]}
                </p>
                {ele.status === 'pending'
                  ? (
                  <>
                    <Button
                      variant="contained"
                      onClick={acceptFunc}
                      style={{ display: { canDisplay } }}
                    >
                      ACCEPT
                    </Button>
                    <Button
                      variant="contained"
                      onClick={declineFunc}
                      style={{ display: { canDisplay } }}
                    >
                      DECLINE
                    </Button>
                  </>
                    )
                  : null}
              </div>
                )
              : null;
          })}
          <hr />
          <p>
            All days of this listing has been booked in this year:{' '}
            {thisYearAllDays} day(s)
          </p>
          <p>All income in this year: ${thisYearAllIncome}</p>
          <p></p>
        </>
      </>
    );
  };
  useEffect(() => {
    getDetail();
  }, [canDisplay]);

  return (
    <>
      <Button variant="contained" onClick={backToBookingFunc}>
        Back to booking
      </Button>
      <br />
      {content}
    </>
  );
};
export default BookingDetail;
