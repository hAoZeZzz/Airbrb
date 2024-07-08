import React, { useEffect, useState, useRef } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { useNavigate } from 'react-router-dom';
import DateRange from './DateRange';
import BedroomProperty from './BedroomProperty';
import Button from '@mui/material/Button';
import BarChart from './BarChart';

const Host = (props) => {
  const token = localStorage.getItem('token');
  const Navigate = useNavigate();
  const [titleValue, setTitleValue] = useState('');
  const [addressValue, setAddressValue] = useState('');
  const [priceValue, setPriceValue] = useState('');
  const [thumbnailValue, setThumbnailValue] = useState('');
  const [propertyTypeValue, setPropertyTypeValue] = useState('');
  const [bathroomNumberValue, setBathroomNumberValue] = useState('0');
  const [propertyAmenitiesValue, setPropertyAmenitiesValue] = useState('');
  const [successTip, setSuccessTip] = useState('none');
  const [showOverLay, setShowOverlay] = useState('none');
  const [showAvailableDateOverLay, setShowAvailableDateOverlay] =
    useState('none');
  const [itemList, setItemList] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [parentBoxID, setParentBoxID] = useState('');
  const [clickNum, setClickNum] = useState([]);
  const [deleteDates, setDeleteDates] = useState([]);
  const [allDates, setAllDates] = useState([]);
  const [bedroomNumber, setBedroomNumber] = useState(0);
  const [eachRoomProperties, setEachRoomProperties] = useState([]);
  const checkBookingFunc = async (e) => {
    const listingId = e.target.parentNode.parentNode.parentNode.parentNode.id;
    Navigate(`/${listingId}/bookingDetail`);
  };

  const overLayStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: showOverLay,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    backdropFilter: 'blur(20px)',
    zIndex: 3
  };
  const AvailableDateOverLayStyle = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: showAvailableDateOverLay,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    backdropFilter: 'blur(20px)',
    zIndex: 2
  };
  const scrollBox = {
    height: '50vh',
    width: '60vw',
    overflow: 'scroll',
    backgroundColor: '#2076cd',
    borderRadius: '15px',
    padding: '15px'
  };
  //   return the number of review
  const getObjectLength = (obj) => {
    if (obj === undefined) {
      return 0;
    } else {
      return Object.keys(obj).length;
    }
  };
  const unpublishFunc = async (e) => {
    const listingId = e.target.parentNode.parentNode.parentNode.parentNode.id;
    const res = await fetch(
      `http://localhost:5005/listings/unpublish/${listingId}`,
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
      alert('Unpublish successfully');
      getListing();
    }
  };
  useEffect(() => {
    if (!token) {
      Navigate('/login');
    } else {
      getListing();
    }
  }, []);

  const addListing = () => {
    setShowOverlay('flex');
  };
  // function to submit the add listing form
  const submitList = async (e) => {
    let res;
    e.preventDefault();
    let sumBeds = 0;
    for (let i = 0; i < eachRoomProperties.length; i++) {
      sumBeds += parseInt(eachRoomProperties[i].beds);
    }
    if (!isEdit) {
      console.log({
        1: titleValue,
        2: addressValue,
        3: priceValue,
        4: thumbnailValue
      });
      console.log(localStorage.getItem('token'));
      res = await fetch('http://localhost:5005/listings/new', {
        method: 'POST',
        body: JSON.stringify({
          title: titleValue,
          address: addressValue,
          price: priceValue,
          thumbnail: thumbnailValue,
          metadata: {
            numBeds: sumBeds,
            propertyType: propertyTypeValue,
            bathroomNumber: bathroomNumberValue,
            propertyBedrooms: eachRoomProperties,
            propertyAmenities: propertyAmenitiesValue
          }
        }),
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-type': 'application/json'
        }
      });
    } else {
      res = await fetch(`http://localhost:5005/listings/${parentBoxID}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          title: titleValue,
          address: addressValue,
          price: priceValue,
          thumbnail: thumbnailValue,
          metadata: {
            numBeds: sumBeds,
            propertyType: propertyTypeValue,
            bathroomNumber: bathroomNumberValue,
            propertyBedrooms: eachRoomProperties,
            propertyAmenities: propertyAmenitiesValue
          }
        })
      });
      setIsEdit(false);
    }
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      setSuccessTip('block');
      setTitleValue('');
      setAddressValue('');
      setPriceValue('');
      setThumbnailValue('');
      setPropertyTypeValue('');
      setBathroomNumberValue('');
      setPropertyAmenitiesValue('');
    }
  };
  const closeForm = (e) => {
    e.preventDefault();
    setSuccessTip('none');
    setShowOverlay('none');
    setTitleValue('');
    setAddressValue('');
    setPriceValue('');
    setThumbnailValue('');
    setPropertyTypeValue('');
    setBathroomNumberValue('');
    setPropertyAmenitiesValue('');
    setIsEdit(false);
    getListing();
    setEachRoomProperties([]);
    setBedroomNumber(0);
  };

  const deleteListing = async (e) => {
    const listingId = e.target.parentNode.parentNode.parentNode.parentNode.id;
    const res = await fetch(`http://localhost:5005/listings/${listingId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-type': 'application/json'
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      getListing();
    }
  };
  const editListing = async (e) => {
    setIsEdit(true);
    const listingId = e.target.parentNode.parentNode.parentNode.parentNode.id;
    const res = await fetch(`http://localhost:5005/listings/${listingId}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await res.json();
    setParentBoxID(listingId);
    setTitleValue(data.listing.title);
    setAddressValue(data.listing.address);
    setPriceValue(data.listing.price);
    setThumbnailValue(data.listing.thumbnail);
    setPropertyTypeValue(data.listing.metadata.propertyType);
    setBathroomNumberValue(data.listing.metadata.bathroomNumber);
    setPropertyAmenitiesValue(data.listing.metadata.propertyAmenities);
    addListing();
  };
  const getListing = async () => {
    const res = await fetch('http://localhost:5005/listings', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      }
    });
    const data = await res.json();
    const generatedList = await Promise.all(
      data.listings.map(async (item, index) => {
        if (item.owner === localStorage.getItem('email')) {
          const res = await fetch(`http://localhost:5005/listings/${item.id}`, {
            method: 'GET',
            headers: {
              'Content-type': 'application/json'
            }
          });
          const data = await res.json();
          let SVG = 0;
          if (data.listing.reviews.length !== 0) {
            data.listing.reviews.forEach((ele, i) => {
              SVG += parseInt(ele[1]);
            });
            SVG = SVG / data.listing.reviews.length;
          }
          return (
            <ImageListItem key={index} id={item.id}>
              <img
                srcSet={`${item.thumbnail}`}
                src={`${item.thumbnail}`}
                alt={item.title}
                loading="lazy"
              />
              <ImageListItemBar
                title={`Title: ${item.title}`}
                subtitle={
                  <>
                    <p>property type: {data.listing.metadata.propertyType}</p>
                    <p>number of beds: {data.listing.metadata.numBeds}</p>
                    <p>
                      Number of bathrooms:{' '}
                      {data.listing.metadata.bathroomNumber}
                    </p>
                    {data.listing.reviews.length !== 0
                      ? (
                      <>
                        <p>SVG: {SVG}</p>
                      </>
                        )
                      : (
                      <>
                        <p>NO SVG</p>
                      </>
                        )}
                    <p>SVG rating of the listing</p>
                    <p>
                      Number of total reviews:{' '}
                      {getObjectLength(data.listing.reviews)}
                    </p>
                    <p>Price: ${item.price} per night</p>
                    <Button onClick={editListing} variant="contained" id='edit-button'>
                      Edit
                    </Button>
                    <Button onClick={deleteListing} variant="contained">
                      Delete
                    </Button>
                    <br />
                    {data.listing.availability.length === 0
                      ? (
                      <>
                        <Button
                          id={`add-avail-date-button-${item.title}`}
                          disabled={false}
                          variant="contained"
                          onClick={addAvailableDate}
                        >
                          Add available date
                        </Button>
                        <br />
                        <Button
                          id={`unpublish-button${index}`}
                          disabled={true}
                          variant="contained"
                          onClick={unpublishFunc}
                        >
                          Unpublish
                        </Button>
                      </>
                        )
                      : (
                      <>
                        <Button
                          disabled={true}
                          variant="contained"
                          onClick={addAvailableDate}
                        >
                          Add available date
                        </Button>
                        <br />
                        <Button
                          id={`unpublish-button${index}`}
                          disabled={false}
                          variant="contained"
                          onClick={unpublishFunc}
                        >
                          Unpublish
                        </Button>
                      </>
                        )}

                    <br />
                    <Button
                      disabled={false}
                      variant="contained"
                      onClick={checkBookingFunc}
                    >
                      Check booking
                    </Button>
                  </>
                }
                position="below"
              />
            </ImageListItem>
          );
        } else {
          return null;
        }
      })
    );
    setItemList(generatedList);
  };
  const handleSelectChange = (e) => {
    e.preventDefault();
    setBathroomNumberValue(e.target.value);
  };
  const addAvailableDate = (e) => {
    setShowAvailableDateOverlay('flex');
    const listingId = e.target.parentNode.parentNode.parentNode.parentNode.id;
    setParentBoxID(listingId);
  };
  const addDateRange = () => {
    const newClickNum = [...clickNum, clickNum.length + 1];
    setClickNum(newClickNum);
  };
  const closeAddAvailableDate = (e) => {
    setShowAvailableDateOverlay('none');
    setClickNum([]);
    setDeleteDates([]);
    setAllDates([]);
  };
  const submitAddDateRange = async (e) => {
    let ifPush = true;
    const allAvailDate = [];
    allDates.forEach((ele, i) => {
      if (ele.startDate > ele.endDate) {
        ifPush = false;
        alert('please check your start date and end date!');
      } else {
        if (!deleteDates.includes(String(ele.index))) {
          allAvailDate.push({ start: ele.startDate, end: ele.endDate });
        }
      }
    });
    if (ifPush) {
      const res = await fetch(
        `http://localhost:5005/listings/publish/${parentBoxID}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            availability: allAvailDate
          })
        }
      );
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        alert('submit successfully');
        getListing();
      }
    }
  };
  const deleteDate = (e) => {
    const newDelete = [...deleteDates, e.target.parentNode.id];
    setDeleteDates(newDelete);
  };
  const addBedroomFunc = (e) => {
    e.preventDefault();
    setBedroomNumber(bedroomNumber + 1);
  };
  const fileInputRef = useRef(null);

  return (
    <>
      <div>Monthly income histogram chart</div>
      <BarChart />
      <div style={AvailableDateOverLayStyle}>
        <div>
          <div style={scrollBox}>
            {clickNum.map((ele, idx) => {
              if (!deleteDates.includes(String(idx))) {
                return (
                  <div key={idx} id={idx}>
                    <DateRange
                      id={idx}
                      setAllDates={setAllDates}
                      allDates={allDates}
                    />
                    <button onClick={deleteDate}>Delete</button>
                    <hr />
                  </div>
                );
              }
              return null;
            })}
          </div>
          <button id="add-avail-range-button" onClick={addDateRange}>
            Add Available Range
          </button>
          <br />
          <button id="submit-date-button" onClick={submitAddDateRange}>
            Submit
          </button>
          <button id="close-date-button" onClick={closeAddAvailableDate}>
            Close
          </button>
        </div>
      </div>

      <div style={overLayStyle}>
        <form action="" onSubmit={submitList}>
          Title:
          <input
            type="text"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            required
            id="title"
            placeholder='Your property name'
          ></input>
          <br />
          Address:
          <input
            type="text"
            value={addressValue}
            onChange={(e) => setAddressValue(e.target.value)}
            id="address"
            placeholder='Your property address'
          ></input>
          <br />
          Price:
          <input
            type="number"
            value={priceValue}
            onChange={(e) => setPriceValue(e.target.value)}
            required
            id="price"
            placeholder='Price per night'
          ></input>
          <br />
          Thumbnail:
          <button
            id="upload-image-button"
            onClick={(e) => {
              e.preventDefault();
              fileInputRef.current.click();
            }}
          >
            Upload Image
          </button>
          <input
            id="upload-image-input"
            name="fileInput"
            style={{ display: 'none' }}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              const reader = new FileReader();
              const loadFileAsDataURL = () => {
                return new Promise((resolve, reject) => {
                  reader.onload = function () {
                    const base64String = reader.result.split(',')[1];
                    const dataURI =
                      'data:' + selectedFile.type + ';base64,' + base64String;
                    resolve(dataURI);
                  };
                  reader.onerror = function (error) {
                    reject(error);
                  };
                  reader.readAsDataURL(selectedFile);
                });
              };

              loadFileAsDataURL()
                .then((dataURI) => {
                  setThumbnailValue(dataURI);
                })
                .catch((error) => {
                  alert('Error reading file:', error);
                });
            }}
          ></input>
          <br />
          Property Type:
          <input
            id="property-type-input"
            type="text"
            value={propertyTypeValue}
            onChange={(e) => setPropertyTypeValue(e.target.value)}
            placeholder='Your property type'
          ></input>
          <br />
          Number of bathrooms on the property:
          <select
            id="Num-of-bathroom-select"
            value={bathroomNumberValue}
            onChange={handleSelectChange}
          >
            <option value="0">no bathroom</option>
            <option value="1">1 bathroom</option>
            <option value="2">2 bathrooms</option>
            <option value="3">3 bathrooms</option>
            <option value="4">More than 4 bathrooms</option>
          </select>
          <br />
          Property bedrooms:
          <button onClick={addBedroomFunc} id="add-bedroom-button">
            add bedroom
          </button>
          <BedroomProperty
            bedroomNumber={bedroomNumber}
            eachRoomProperties={eachRoomProperties}
            setEachRoomProperties={setEachRoomProperties}
          />
          <br />
          Property amenities:
          <input
            id="propertyAmenities-input"
            type="text"
            value={propertyAmenitiesValue}
            onChange={(e) => setPropertyAmenitiesValue(e.target.value)}
            placeholder='Your property amenities'
          ></input>
          <br />
          <button
            id="host-submit-button"
            type="submit"
            onClick={(e) => {
              if (
                titleValue === '' ||
                priceValue === '' ||
                thumbnailValue === ''
              ) {
                alert(
                  'Please make sure title, price and thumbnail are not empty.'
                );
              } else {
                submitList(e);
              }
            }}
          >
            submit
          </button>
          <button id="close-button" type="submit" onClick={closeForm}>
            close
          </button>
          <div style={{ display: successTip }}>
            You submit listing successfully! ✅
          </div>
        </form>
      </div>
      <h1>Manage your listings</h1>
      <ImageList sx={{ width: '100%', height: 'auto' }}>{itemList}</ImageList>
      <button onClick={addListing} id="add-a-list-button">
        Add a listing
      </button>
    </>
  );
};
export default Host;
