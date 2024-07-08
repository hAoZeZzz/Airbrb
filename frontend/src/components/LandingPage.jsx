import ImageListItem from '@mui/material/ImageListItem';
import React, { useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import RangeSlider from './RangeSlider';
// import DatePickerValue from './DatePicker';
import DatePickerValue1 from './DatePicker1';
import { useNavigate } from 'react-router-dom';

const LandingPage = (props) => {
  const navigate = useNavigate();
  const [showSearchOverLay, setShowSearchOverlay] = useState('none');
  const [itemList, setItemList] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [allListings, setAllListing] = useState('');
  const [firstGeneratedResult, setFirstGeneratedResult] = useState('');
  const [canMainLayDisplay, setCanMainLayDisplay] = useState('block');
  const [allRoomDetail, setAllRoomDetail] = useState([]);
  //   const [allListingsDetail, setAllListingsDetail] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [bedroomRange, setBedroomRange] = useState([0, 10]);
  const [dateRange, setDateRange] = useState(['2023-11-08', '2023-11-09']);
  const [searchButtonUsable, setSearchButtonUsable] = useState(true);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!localStorage.getItem('token')) {
        if (getListing()) {
          setSearchButtonUsable(false);
        }
      } else {
        if (getListing()) {
          setSearchButtonUsable(false);
        }
      }
    }, 500);
    getListing();
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleClickListings = (idNumber) => (index) => {
    const id = idNumber;
    localStorage.setItem('id', id);
    navigate(`/${id}`);
    props.setListingDetailId(id);
  };
  const getListing = async () => {
    const res = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await res.json();
    setAllListing(data.listings);
    const allTitleIdDetails = [];

    await Promise.all(
      data.listings.map(async (item, index) => {
        const res = await fetch(`http://localhost:5005/listings/${item.id}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json'
          }
        });
        const data1 = await res.json();
        data1.listing.id = item.id;
        const details = {
          id: data.listings[index].id,
          title: data.listings[index].title,
          thumbnail: data.listings[index].thumbnail,
          reviewsLength: data.listings[index].reviews.length,
          address: data1.listing.address,
          availability: data1.listing.availability,
          published: data1.listing.published,
          postedOn: data1.listing.postedOn
        };

        if (!allTitleIdDetails.includes(details)) {
          allTitleIdDetails.push(details);
        }
      })
    );
    // setAllListingsDetail(...allListingsDetail, temp);
    const applyListingId = [];
    let allTitleId = [];

    if (localStorage.getItem('token')) {
      allTitleId = [];
      const res2 = await fetch('http://localhost:5005/bookings', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data2 = await res2.json();

      if (data2.error) {
        alert(data2.error);
      } else {
        if (data2.bookings) {
          data2.bookings.forEach((ele, i) => {
            if (!applyListingId.includes(ele.listingId)) {
              if (ele.owner === localStorage.getItem('email')) {
                applyListingId.push(ele.listingId);
              }
            }
          });
        }
        const arrA = [];
        const arrB = [];
        if (data.listings.length > 0) {
          data.listings.forEach((ele, index) => {
            allTitleIdDetails.forEach((e, i) => {
              if (ele.id === e.id && e.availability.length !== 0) {
                if (applyListingId.includes(`${ele.id}`)) {
                  arrA.push(
                    `${data.listings[index].title}_${data.listings[index].id}`
                  );
                } else {
                  arrB.push(
                    `${data.listings[index].title}_${data.listings[index].id}`
                  );
                }
              }
            });
          });
          arrA.sort();
          arrB.sort();
          allTitleId = arrA.concat(arrB);
        }
      }
    } else {
      allTitleId = [];
      const arrC = [];
      if (data.listings.length > 0) {
        data.listings.forEach((ele, index) => {
          allTitleIdDetails.forEach((e, i) => {
            if (ele.id === e.id && e.availability.length !== 0) {
              arrC.push(
                `${data.listings[index].title}_${data.listings[index].id}`
              );
            }
          });
        });
        arrC.sort();
        allTitleId = arrC;
      }
    }
    const generatedList = allTitleId.map((item, index) => {
      return (
        <ImageListItem key={index} id={item.split('_')[1]}>
          <img
            srcSet={`${
              allTitleIdDetails.find(
                (items) => parseInt(items.id) === parseInt(item.split('_')[1])
              ).thumbnail
            }`}
            src={`${
              allTitleIdDetails.find(
                (items) => parseInt(items.id) === parseInt(item.split('_')[1])
              ).thumbnail
            }`}
            alt={item.split('_')[0]}
            loading="lazy"
          />
          <ImageListItemBar
            title={`Title: ${
              allTitleIdDetails.find(
                (items) => parseInt(items.id) === parseInt(item.split('_')[1])
              ).title
            }`}
            subtitle={
              <>
                <p>
                  Number of total reviews:{' '}
                  {
                    allTitleIdDetails.find(
                      (items) =>
                        parseInt(items.id) === parseInt(item.split('_')[1])
                    ).reviewsLength
                  }
                </p>
                <br />
              </>
            }
            position="below"
          />
        </ImageListItem>
      );
    });
    setItemList(generatedList);
  };
  const mainLayStyle = {
    // overflow: canMainLayScroll
    display: canMainLayDisplay
  };
  const searchOverLayStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: showSearchOverLay,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'blue',
    padding: '10px',
    borderRadius: '5px',
    backdropFilter: 'blur(5px)',
    zIndex: 2,
    overflow: 'auto'
  };

  const getAllListingsDetail = async () => {
    const allIds = [];
    allListings.forEach((ele, i) => {
      allIds.push(ele.id);
    });
    const temp = await Promise.all(
      allIds.map(async (item, index) => {
        const res = await fetch(`http://localhost:5005/listings/${item}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json'
          }
        });
        const data = await res.json();
        data.listing.id = item;
        return data.listing;
      })
    );
    setAllRoomDetail(...allRoomDetail, temp);
  };
  const showSearchBox = () => {
    setShowSearchOverlay('flex');
    setCanMainLayDisplay('none');
    getAllListingsDetail();
  };
  const closeSearchBox = () => {
    setShowSearchOverlay('none');
    setCanMainLayDisplay('block');
    setAllRoomDetail([]);
  };
  const searchAddressFunc = async () => {
    props.setIsDate(null);
    const searchAddressTrim = searchAddress.trim();
    if (searchAddressTrim === '') {
      setSearchAddress('');
      alert('The search address cannot be empty');
    } else {
      const firstResult = [];
      allListings.forEach((ele, i) => {
        const longString =
          ele.title.toLowerCase() + ' ' + ele.address.toLowerCase();
        const searchString = searchAddressTrim.toLowerCase();
        const regex = new RegExp(searchString, 'g');

        while (regex.exec(longString) !== null) {
          if (!firstResult.includes(ele)) {
            firstResult.push(ele);
          }
        }
      });

      if (firstResult.length === 0) {
        alert('No results found for your search!');
      } else {
        firstResult.sort(function (a, b) {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          if (titleA < titleB) return -1;
          if (titleA > titleB) return 1;
          return 0;
        });
        const allTitleIdDetails = [];
        await Promise.all(
          firstResult.map(async (item, index) => {
            const res = await fetch(
              `http://localhost:5005/listings/${item.id}`,
              {
                method: 'GET',
                headers: {
                  'Content-type': 'application/json'
                }
              }
            );
            const data1 = await res.json();
            data1.listing.id = item.id;
            let reviewsLength = 0;
            if (data1.listing.reviews) {
              reviewsLength = data1.listing.reviews.length;
            }
            const details = {
              id: firstResult[index].id,
              title: firstResult[index].title,
              thumbnail: firstResult[index].thumbnail,
              reviewsLength,
              price: firstResult[index].price,
              address: firstResult[index].address,
              availability: data1.listing.availability,
              published: data1.listing.published,
              postedOn: data1.listing.postedOn
            };
            if (!allTitleIdDetails.includes(details)) {
              allTitleIdDetails.push(details);
            }
          })
        );
        setFirstGeneratedResult('');
        const newFirstResult = [];
        allTitleIdDetails.forEach((ele, i) => {
          if (ele.published) {
            newFirstResult.push(ele);
          }
        });
        const generatedFirstResult = newFirstResult.map((item, index) => {
          return (
            <ImageListItem
              key={index}
              id={`firstResult_${item.id}`}
              onClick={handleClickListings(item.id)}
            >
              <img
                srcSet={`${item.thumbnail}`}
                src={`${item.thumbnail}`}
                alt={item.title}
                loading="lazy"
              />
              <ImageListItemBar
                style={{ color: '#dddddd' }}
                title={`Title: ${item.title}`}
                subtitle={
                  <>
                    <p id={`address${index}`}>Address: {item.address}</p>
                    <p>Price: ${item.price} pre night</p>
                    <p>Number of total reviews: {item.reviewsLength}</p>
                    <br />
                  </>
                }
                position="below"
              />
            </ImageListItem>
          );
        });
        setFirstGeneratedResult(generatedFirstResult);
      }
    }
  };
  const [selectedOption, setSelectedOption] = useState('option1');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  // search for perferences button function
  const searchPreferencesFunc = () => {
    props.setIsDate(dateRange);
    const secondResult = [];
    allRoomDetail.forEach((ele) => {
      if (
        ele.metadata.propertyBedrooms.length >= parseInt(bedroomRange[0]) &&
        ele.metadata.propertyBedrooms.length <= parseInt(bedroomRange[1]) &&
        parseInt(ele.price) >= parseInt(priceRange[0]) &&
        parseInt(ele.price) <= parseInt(priceRange[1])
      ) {
        if (ele.availability.length !== 0) {
          ele.availability.forEach((e) => {
            if (
              new Date(e.start) <= new Date(dateRange[0]) &&
              new Date(e.end) >= new Date(dateRange[1])
            ) {
              if (!secondResult.includes(ele)) {
                secondResult.push(ele);
              }
            }
          });
        }
      }
    });
    setFirstGeneratedResult('');
    if (secondResult.length === 0) {
      alert('No results found for your search!');
    } else {
      secondResult.sort(function (a, b) {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
      });
      secondResult.forEach((ele, index) => {
        if (ele.reviews.length !== 0) {
          let sumScore = 0;
          ele.reviews.forEach((e, i) => {
            sumScore += parseInt(e[1]);
          });
          ele.averageScore = sumScore / ele.reviews.length;
        }
      });
      const hasScoreArr = [];
      const noScoreArr = [];
      secondResult.forEach((ele, index) => {
        if (ele.averageScore) {
          hasScoreArr.push([ele.id, ele.averageScore]);
        } else {
          noScoreArr.push(ele.id);
        }
      });
      hasScoreArr.sort(function (a, b) {
        if (selectedOption === 'option2') {
          return b[1] - a[1];
        } else {
          return a[1] - b[1];
        }
      });

      const sortedSecondResult = [];
      if (hasScoreArr.length !== 0) {
        hasScoreArr.forEach((ele, index) => {
          secondResult.forEach((e, i) => {
            if (parseFloat(ele[0]) === parseInt(e.id)) {
              sortedSecondResult.push(e);
            }
          });
        });
      }
      if (noScoreArr.length !== 0) {
        noScoreArr.forEach((ele, index) => {
          secondResult.forEach((e, i) => {
            if (parseInt(e.id) === parseInt(ele)) {
              sortedSecondResult.push(e);
            }
          });
        });
      }

      const generatedFirstResult = sortedSecondResult.map((item, index) => {
        return (
          <ImageListItem
            key={index}
            id={`firstResult_${item.id}`}
            onClick={handleClickListings(item.id)}
          >
            <img
              srcSet={`${item.thumbnail}`}
              src={`${item.thumbnail}`}
              alt={item.title}
              loading="lazy"
            />
            <ImageListItemBar
              style={{ color: '#dddddd' }}
              title={`Title: ${item.title}`}
              subtitle={
                <>
                  <p>Address: {item.address}</p>
                  <p>
                    Price: $
                    {Math.floor(
                      (new Date(dateRange[1]) - new Date(dateRange[0])) /
                        (1000 * 3600 * 24)
                    ) * parseFloat(item.price)}{' '}
                    per stay
                  </p>
                  <p>Number of total reviews: {item.reviews.length}</p>
                  {item.averageScore ? <p>SVG: {item.averageScore}</p> : null}
                  <br />
                </>
              }
              position="below"
            />
          </ImageListItem>
        );
      });
      setFirstGeneratedResult(generatedFirstResult);
    }
  };

  // Set a timmer to check available listing in the backend.

  return (
    <>
      <div style={searchOverLayStyle}>
        <div>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '35ch' },
              '& fieldset': {
                borderColor: 'white',
                color: 'white'
              }
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Title or Address"
              variant="outlined"
              InputProps={{
                style: { color: 'white', border: 'black' }
              }}
              placeholder="Enter the search title or address"
              onChange={(e) => {
                setSearchAddress(e.target.value);
              }}
            />
          </Box>
          <Button
            id="search-title-button"
            style={{ marginLeft: '7px' }}
            variant="contained"
            onClick={searchAddressFunc}
          >
            Search for title or address
          </Button>
          <br />
          <hr />
          Number of bedrooms
          <RangeSlider
            min={0}
            max={10}
            kinds={'bedroom'}
            setBedroomRange={setBedroomRange}
          />
          {bedroomRange[1] >= 10
            ? (
            <div>
              Bedroom range: {bedroomRange[0]} - {10}+
            </div>
              )
            : (
            <div>
              Bedroom range: {bedroomRange[0]} - {bedroomRange[1]}
            </div>
              )}
          Price Range
          <RangeSlider
            min={0}
            max={1000}
            kinds={'price'}
            setPriceRange={setPriceRange}
          />
          {priceRange[1] >= 1000
            ? (
            <div>
              Price range: {priceRange[0]} - {1000}+
            </div>
              )
            : (
            <div>
              Price range: {priceRange[0]} - {priceRange[1]}
            </div>
              )}
          Order of ratings
          <br />
          <label>
            <input
              type="radio"
              value="option1"
              checked={selectedOption === 'option1'}
              onChange={handleOptionChange}
            />
            Ascending
          </label>
          <label>
            <input
              type="radio"
              value="option2"
              checked={selectedOption === 'option2'}
              onChange={handleOptionChange}
            />
            Descending
          </label>
          <br />
          {/* <DatePickerValue setDateRange={setDateRange} dateRange={dateRange} /> */}
          <DatePickerValue1 setDateRange={setDateRange} dateRange={dateRange} />
          {new Date(dateRange[1]) > new Date(dateRange[0])
            ? (
            <>
              From {dateRange[0]} to {dateRange[1]}
              <br />
              <Button variant="contained" onClick={searchPreferencesFunc}>
                Search for preferences
              </Button>
            </>
              )
            : (
            <>
              Input Date invalid
              <br />
              <Button
                variant="contained"
                onClick={searchPreferencesFunc}
                disabled={true}
              >
                Search for preferences
              </Button>
            </>
              )}
          <Button
            variant="contained"
            onClick={closeSearchBox}
            style={{ marginLeft: '10px' }}
          >
            Close
          </Button>
          <hr />
          <br />
          <ImageList sx={{ width: '100%', height: 'auto' }}>
            {firstGeneratedResult}
          </ImageList>
        </div>
      </div>
      <div style={mainLayStyle}>
        <h1>hi, {localStorage.getItem('email')}</h1>
        <Button
          id="search-button"
          variant="outlined"
          onClick={showSearchBox}
          disabled={searchButtonUsable}
        >
          Search
        </Button>

        <ImageList
          sx={{ width: '100%', height: 'auto' }}
          style={{ overflow: canMainLayDisplay }}
        >
          {itemList}
        </ImageList>
      </div>
    </>
  );
};
export default LandingPage;
