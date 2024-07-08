import React from 'react';
import dayjs from 'dayjs';

export default function DatePickerValue1 (props) {
  const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');

  return (
    <div>
      <input
        type="date"
        value={formatDate(props.dateRange[0])}
        onChange={(e) => {
          const newDate = e.target.value;
          props.setDateRange([newDate, props.dateRange[1]]);
        }}
      />
      <input
        type="date"
        value={formatDate(props.dateRange[1])}
        onChange={(e) => {
          const newDate = e.target.value;
          props.setDateRange([props.dateRange[0], newDate]);
        }}
      />
    </div>
  );
}
