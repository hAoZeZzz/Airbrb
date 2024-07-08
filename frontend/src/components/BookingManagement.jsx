import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

const BookingManagement = (props) => {
  let reviews = ['', '', ''];
  let rate = ['', '0'];
  const [generatedBooks, setGeneratedBooks] = useState(null);
  const [generatedYourBooks, setGeneratedYourBooks] = useState(null);
  const [banButton, setBanButton] = useState(false);
  const [allRoomDetail, setAllRoomDetail] = useState([]);
  const acceptBooking = async (e) => {
    const bookingId = e.target.parentNode.id;
    const res = await fetch(
      `http://localhost:5005/bookings/accept/${bookingId}`,
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
      alert(data.error);
    } else {
      alert('Accept booking successfully');
      setBanButton(true);
      getAllBookings();
    }
  };
  const declineBooking = async (e) => {
    const bookingId = e.target.parentNode.id;
    const res = await fetch(
      `http://localhost:5005/bookings/decline/${bookingId}`,
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
      alert(data.error);
    } else {
      alert('Decline booking successfully');
      setBanButton(true);
      getAllBookings();
    }
  };
  const deleteBooking = async (e) => {
    const bookingId = e.target.parentNode.id;
    const res = await fetch(`http://localhost:5005/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json'
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert('Decline booking successfully');
      setBanButton(true);
      getAllBookings();
    }
  };
  const submitReview = async (e) => {
    const submitButtonId = parseInt(e.target.parentNode.id);
    const bookingId = parseInt(reviews[0]);
    const reviewText = reviews[1];
    const listingId = parseInt(reviews[2]);
    const rateBookingId = parseInt(rate[0]);
    const rateValue = rate[1];
    if (reviews.length !== 0) {
      if (submitButtonId === bookingId && submitButtonId === rateBookingId) {
        const res = await fetch(
          `http://localhost:5005/listings/${listingId}/review/${bookingId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              review: [reviewText, rateValue]
            })
          }
        );
        const data = await res.json();
        if (data.error) {
          alert(data.error);
        } else {
          alert('Thank you for your comment!');
          getAllBookings();
        }
      } else {
        alert('Please input your review and rate.');
      }
    }
  };
  const getAllTitle = async (bookings) => {
    const temp = await Promise.all(
      bookings.map(async (item) => {
        const res = await fetch(
          `http://localhost:5005/listings/${item.listingId}`,
          {
            method: 'GET',
            headers: {
              'Content-type': 'application/json'
            }
          }
        );
        const data = await res.json();
        data.listing.id = item.listingId;
        return data.listing;
      })
    );
    setAllRoomDetail(...allRoomDetail, temp);
  };
  const getAllBookings = async () => {
    const res = await fetch('http://localhost:5005/bookings', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json'
      }
    });
    const data = await res.json();
    getAllTitle(data.bookings);
    const listingIdName = {};
    if (allRoomDetail.length !== 0) {
      allRoomDetail.forEach((ele, i) => {
        listingIdName[ele.id] = ele.owner;
      });
    }
    let generatedBook = null;

    if (listingIdName.length !== 0 && allRoomDetail.length !== 0) {
      generatedBook = data.bookings.map((item, index) => {
        return (
          <div key={index}>
            {localStorage.getItem('email') !== item.owner &&
            listingIdName[item.listingId] === localStorage.getItem('email')
              ? (
              <div id={item.id}>
                <div>{index}</div>
                {allRoomDetail.length !== 0
                  ? (
                  <>
                    <div>{allRoomDetail[index].title}</div>
                    <img
                      style={{ maxHeight: '30vh' }}
                      src={allRoomDetail[index].thumbnail}
                      alt={allRoomDetail[index].title}
                    />
                  </>
                    )
                  : null}
                <div> Date range: </div>
                <div>
                  From: {item.dateRange[0]} To: {item.dateRange[1]}
                </div>
                <div>Number of days:</div>
                <div>
                  {Math.floor(
                    (new Date(item.dateRange[1]) -
                      new Date(item.dateRange[0])) /
                      (1000 * 3600 * 24)
                  )}
                </div>
                <div>Total price:</div>
                <div>${item.totalPrice}</div>
                {item.status === 'pending'
                  ? (
                  <>
                    <Button
                      disabled={banButton}
                      variant="contained"
                      onClick={(e) => {
                        setBanButton(true);
                        acceptBooking(e);
                      }}
                      id={`accept_${index}`}
                    >
                      accept
                    </Button>
                    <Button
                      disabled={banButton}
                      variant="contained"
                      onClick={declineBooking}
                    >
                      Decline
                    </Button>
                  </>
                    )
                  : (
                  <>
                    <Button disabled={true} variant="contained">
                      accept
                    </Button>
                    <Button disabled={true} variant="contained">
                      Decline
                    </Button>
                  </>
                    )}
                <hr />
              </div>
                )
              : null}
          </div>
        );
      });
    }

    const generatedYourBook = data.bookings.map((item, index) => {
      let published = false;
      //   console.log(allRoomDetail);
      //   console.log(item);
      allRoomDetail.forEach((e, i) => {
        if (e.id === item.listingId) {
          if (e.published) {
            published = true;
          }
        }
      });
      return (
        <div key={index}>
          {published
            ? (
            <div key={index}>
              {localStorage.getItem('email') === item.owner
                ? (
                <>
                  <div id={item.id}>
                    {allRoomDetail.length !== 0
                      ? (
                      <>
                        <div>{allRoomDetail[index].title}</div>
                        <img
                          style={{ maxHeight: '30vh' }}
                          src={allRoomDetail[index].thumbnail}
                          alt={allRoomDetail[index].title}
                        />
                      </>
                        )
                      : null}
                    <div>{index}</div>
                    <div> Date range: </div>
                    <div>
                      From: {item.dateRange[0]} To: {item.dateRange[1]}
                    </div>
                    <div>Number of days:</div>
                    <div>
                      {Math.floor(
                        (new Date(item.dateRange[1]) -
                          new Date(item.dateRange[0])) /
                          (1000 * 3600 * 24)
                      )}
                    </div>
                    <div>Total price:</div>
                    <div>${item.totalPrice}</div>
                    {item.status === 'pending'
                      ? (
                      <>
                        <div style={{ color: 'orange' }}>
                          Waiting for the owner to process. ⏳
                        </div>
                      </>
                        )
                      : item.status === 'accepted'
                        ? (
                      <>
                        <div style={{ color: 'green' }}>
                          Your application has been accepted. ✅
                        </div>
                        <TextField
                          label="Review"
                          variant="outlined"
                          placeholder="leave your review"
                          onChange={(e) => {
                            reviews = ['', '', ''];
                            reviews = [
                              e.target.parentNode.parentNode.parentNode.id,
                              e.target.value,
                              item.listingId,
                              rate
                            ];
                          }}
                        />
                        <Rating
                          name="size-large"
                          defaultValue={0}
                          size="large"
                          onChange={(e) => {
                            rate = ['', '0'];

                            rate = [
                              e.target.parentNode.parentNode.id,
                              e.target.value
                            ];
                            // console.log(rate);
                          }}
                        />
                        <br />
                        <Button variant="contained" onClick={submitReview}>
                          Submit Review
                        </Button>
                        <br />
                      </>
                          )
                        : item.status === 'declined'
                          ? (
                      <>
                        <div style={{ color: 'red' }}>
                          Your application has been rejected. ❌
                        </div>
                      </>
                            )
                          : null}
                    <Button variant="contained" onClick={deleteBooking} id={`delete-${index}`}>
                      DELETE
                    </Button>
                  </div>
                  <hr />
                </>
                  )
                : null}
            </div>
              )
            : null}
        </div>
      );
    });
    setGeneratedBooks(generatedBook);
    setGeneratedYourBooks(generatedYourBook);
  };

  useEffect(() => {
    if (getAllTitle.length > 0) {
      getAllBookings();
    }
  }, []);
  useEffect(() => {
    if (allRoomDetail.length > 0) {
      getAllBookings();
    }
  }, [allRoomDetail]);
  return (
    <>
      <div>
        <Typography variant="h4" gutterBottom>
          Accepting or Declining:
        </Typography>
        {generatedBooks}
        <hr />
        <Typography variant="h4" gutterBottom>
          My application:
        </Typography>
        {generatedYourBooks}
      </div>
    </>
  );
};
export default BookingManagement;
