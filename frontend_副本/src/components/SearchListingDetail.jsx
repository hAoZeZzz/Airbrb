import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import DatePickerValue from './DatePicker';
import DatePickerValue1 from './DatePicker1';

import { Button } from '@mui/material';

const SearchListingDetail = (props) => {
  const [dateRange, setDateRange] = useState(['2023-11-08', '2023-11-09']);
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [ratingOverlay, setRatingOverlay] = useState('');
  const [ratingDetail, setRatingDetail] = useState('');
  const [showRatingDetailOverlay, setShowRatingDetailOverlay] =
    useState('none');
  const searchOverLayStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: showRatingDetailOverlay,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    backdropFilter: 'blur(20px)',
    zIndex: 2,
    overflow: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  };
  useEffect(() => {
    const func = async () => {
      await getDetail();
    };
    func();
  }, [ratingOverlay]);
  const closeOverLayFunc = () => {
    setShowRatingDetailOverlay('none');
  };
  const clickScoreFunc = (content) => (e) => {
    const stars = parseInt(e.target.id.split('_')[1]);
    let temp = [];
    for (let i = 0; i < content.reviews.length; i++) {
      if (parseInt(content.reviews[i][1]) === stars) {
        temp = [...temp, content.reviews[i][0]];
      }
    }
    const tempArr = temp.map((ele, i) => {
      return (
        <>
          <div key={i}>
            {i + 1}: {`${ele}`}
          </div>
          <br />
        </>
      );
    });
    setRatingDetail(tempArr);
    setShowRatingDetailOverlay('block');
  };
  const hoverFunc = (content) => (e) => {
    const allScore = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (let i = 0; i < content.reviews.length; i++) {
      allScore[parseInt(content.reviews[i][1])] += 1;
    }
    let allReviewTimes = 0;
    for (let i = 0; i < 6; i++) {
      allReviewTimes += allScore[i];
    }
    let tempArr = [];
    for (let i = 0; i < 6; i++) {
      let temp = '';
      if (allScore[i]) {
        temp = `${i} star: ${allScore[i]} review ${Math.round(
          (allScore[i] / allReviewTimes) * 100
        )}%`;
      } else {
        temp = `${i} star: 0 review 0%`;
      }

      tempArr = [...tempArr, temp];
    }
    const overlay = tempArr.map((ele, i) => {
      return (
        <p key={i} onClick={clickScoreFunc(content)} id={`scores_${i}`}>
          {ele}
        </p>
      );
    });
    setRatingOverlay(overlay);
  };
  const leaveFunc = (content) => (e) => {
    setRatingOverlay('');
  };
  const getDetail = async () => {
    const res = await fetch(`http://localhost:5005/listings/${props.id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await res.json();
    setContent(data.listing);
    setMetadata(data.listing.metadata);
  };
  const submitBooingFunc = async () => {
    const totalPrice =
      Math.floor(
        (new Date(dateRange[1]) - new Date(dateRange[0])) / (1000 * 3600 * 24)
      ) * content.price;
    const res = await fetch(`http://localhost:5005/bookings/new/${props.id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        dateRange,
        totalPrice
      })
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert('Submit your booking successfully!');
    }
  };

  if (metadata) {
    let SVG = 0;
    let review = 'No review.';
    if (content.reviews.length !== 0) {
      content.reviews.forEach((ele, i) => {
        SVG += parseInt(ele[1]);
      });
      SVG /= content.reviews.length;
      review = '';
      review = content.reviews.map((ele, i) => {
        return (
          <React.Fragment key={i}>
            <br />
            {i + 1}. {ele[0]}
          </React.Fragment>
        );
      });
    }
    console.log(content);
    return (
      <>
        <div>
          <img
            src={`${content.thumbnail}`}
            style={{ maxHeight: '50vh' }}
            alt={content.title}
          ></img>
          <Box sx={{ width: '100%', maxWidth: 500 }}>
            <Typography variant="h3" gutterBottom>
              {content.title}
            </Typography>
            <Typography variant="h5" gutterBottom>
              Address: {content.address}
            </Typography>
            {props.isDate
              ? (
              <Typography variant="h5" gutterBottom>
                Total price: $
                {Math.floor(
                  (new Date(props.isDate[1]) - new Date(props.isDate[0])) /
                    (1000 * 3600 * 24)
                ) * content.price}
              </Typography>
                )
              : (
              <Typography variant="h5" gutterBottom>
                Price: ${content.price} per night
              </Typography>
                )}
            <Typography variant="h5" gutterBottom>
              Type: {metadata.propertyType}
            </Typography>
            <Typography variant="h5" gutterBottom>
              Reviews: {review}
            </Typography>
            <div
              onMouseEnter={hoverFunc(content)}
              onMouseLeave={leaveFunc(content)}
            >
              <Typography variant="h5" gutterBottom>
                Average review rating: {SVG}
              </Typography>
              {ratingOverlay}
            </div>
            <Typography variant="h5" gutterBottom>
              Number of bedrooms: {metadata.propertyBedrooms.length}
            </Typography>
            <Typography variant="h5" gutterBottom>
              Number of beds: {metadata.numBeds}
            </Typography>
            <Typography variant="h5" gutterBottom>
              Number of bathrooms: {metadata.bathroomNumber}
            </Typography>
          </Box>
          {localStorage.getItem('token')
            ? (
            <>
              <DatePickerValue1
                setDateRange={setDateRange}
                dateRange={dateRange}
              />
              {/* <DatePickerValue
                setDateRange={setDateRange}
                dateRange={dateRange}
              /> */}

              {new Date(dateRange[1]) > new Date(dateRange[0])
                ? (
                <Button
                  id="submit-button"
                  variant="contained"
                  onClick={submitBooingFunc}
                >
                  Submit booking
                </Button>
                  )
                : (
                <>
                  <Button
                    disabled={true}
                    variant="contained"
                    onClick={submitBooingFunc}
                  >
                    Submit booking
                  </Button>
                  <br />
                  <span>Date range is not valid.</span>
                </>
                  )}
            </>
              )
            : null}
        </div>
        <div style={searchOverLayStyle}>
          {ratingDetail}
          <Button onClick={closeOverLayFunc} variant="contained">
            Close
          </Button>
        </div>
      </>
    );
  } else {
    return null;
  }
};
export default SearchListingDetail;
