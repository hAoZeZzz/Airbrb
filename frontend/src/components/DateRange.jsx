import React, { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';

const DateRange = (props) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 7));
  useEffect(() => {
    const temp = [...props.allDates, { index: props.id, startDate: format(new Date(startDate), 'yyyy-MM-dd'), endDate: format(new Date(endDate), 'yyyy-MM-dd') }]
    props.setAllDates(temp)
  }, []);
  const handleStartDateChange = (e) => {
    setStartDate(new Date(e.target.value));
    const newStartDate = [...props.allDates];
    const existingIndex = newStartDate.findIndex(
      (item) => item.index === props.id
    );
    if (existingIndex !== -1) {
      newStartDate[existingIndex].startDate = format(
        new Date(e.target.value),
        'yyyy-MM-dd'
      );
    } else {
      newStartDate.push({
        index: props.id,
        startDate: format(new Date(e.target.value), 'yyyy-MM-dd')
      });
    }
    props.setAllDates(newStartDate);
  };

  const handleEndDateChange = (e) => {
    setEndDate(new Date(e.target.value));
    const newEndDate = [...props.allDates];
    const existingIndex = newEndDate.findIndex(
      (item) => item.index === props.id
    );
    if (existingIndex !== -1) {
      newEndDate[existingIndex].endDate = format(
        new Date(e.target.value),
        'yyyy-MM-dd'
      );
    } else {
      newEndDate.push({
        index: props.id,
        endDate: format(new Date(e.target.value), 'yyyy-MM-dd')
      });
    }
    props.setAllDates(newEndDate);
  };
  return (
    <>
      <div id={`childBox_${props.id}`}>
        <label htmlFor="startDate">Start Date: </label>
        <input
          type="date"
          id="startDate"
          value={format(startDate, 'yyyy-MM-dd')}
          onChange={handleStartDateChange}
        />
      </div>
      <div>
        <label htmlFor="endDate">End Date: </label>
        <input
          type="date"
          id="endDate"
          value={format(endDate, 'yyyy-MM-dd')}
          onChange={handleEndDateChange}
        />
      </div>
      <div>
        <p>
          Selected Date Range: {format(startDate, 'yyyy-MM-dd')} to{' '}
          {format(endDate, 'yyyy-MM-dd')}
        </p>
      </div>
    </>
  );
};

export default DateRange;
