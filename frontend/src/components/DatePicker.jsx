import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function DatePickerValue (props) {
  const formatDay = (d) => {
    if (parseInt(d) < 10) {
      d = `0${d}`;
    }
    return d;
  };
  const formatMonth = (m) => {
    if (m + 1 < 10) {
      m += 1;
      m = `0${m}`;
    } else {
      m = `${m + 1}`;
    }
    return m;
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker', 'DatePicker']}>
        <DatePicker
          name="2333"
          label="Start date (MM/DD/YYYY)"
          defaultValue={dayjs('2023-11-08')}
          onChange={(newValue) => {
            const end = props.dateRange[1];
            newValue.$D = formatDay(newValue.$D);
            newValue.$M = formatMonth(newValue.$M);
            const newDate = `${newValue.$y}-${newValue.$M}-${newValue.$D}`;
            props.setDateRange([newDate, end]);
          }}
        />
        <DatePicker
          name="23333"
          label="End date (MM/DD/YYYY)"
          defaultValue={dayjs('2023-11-09')}
          onChange={(newValue) => {
            const start = props.dateRange[0];
            newValue.$D = formatDay(newValue.$D);
            newValue.$M = formatMonth(newValue.$M);
            const newDate = `${newValue.$y}-${newValue.$M}-${newValue.$D}`;
            props.setDateRange([start, newDate]);
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
