import React from 'react';

const BedroomProperty = (props) => {
  const element = [];
  const numberOfBedFunc = (i) => (e) => {
    const updatedBeds = [...props.eachRoomProperties];
    const existingRoomIndex = updatedBeds.findIndex((room) => room.i === i);
    if (existingRoomIndex !== -1) {
      updatedBeds[existingRoomIndex] = {
        ...updatedBeds[existingRoomIndex],
        beds: e.target.value
      };
    } else {
      updatedBeds.push({ i, beds: e.target.value, others: '' });
    }
    props.setEachRoomProperties(updatedBeds);
  };
  const OtherPropertiesFunc = (i) => (e) => {
    const updatedOhters = [...props.eachRoomProperties];
    const existingRoomIndex = updatedOhters.findIndex((room) => room.i === i);
    if (existingRoomIndex !== -1) {
      updatedOhters[existingRoomIndex] = {
        ...updatedOhters[existingRoomIndex],
        others: e.target.value
      };
    } else {
      updatedOhters.push({ i, others: e.target.value, beds: '' });
    }
    props.setEachRoomProperties(updatedOhters);
  };
  for (let i = 0; i < props.bedroomNumber; i++) {
    element.push(
      <div key={i}>
        <div>Bedroom:{i + 1}</div>
        Number of beds
        <input
          id={`number-of-beds-input${i}`}
          type="number"
          placeholder="Number of beds"
          onBlur={numberOfBedFunc(i)}
        ></input>
        <br />
        Other properties
        <input
          id={`other-properties-input${i}`}
          type="text"
          placeholder="Other properties"
          onBlur={OtherPropertiesFunc(i)}
        ></input>
        <hr />
      </div>
    );
  }
  return <>{element}</>;
};
export default BedroomProperty;
