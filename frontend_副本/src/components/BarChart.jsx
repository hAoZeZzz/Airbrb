/* eslint-disable no-unmodified-loop-condition */
import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const BarChart = () => {
  const chartRef = useRef(null);
  const [selfBookings, setSelfBookings] = useState({});
  const getBookingList = async () => {
    const res = await fetch('http://localhost:5005/bookings', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json'
      }
    });
    let data = await res.json();
    data = data.bookings;
    const allAcceptedBookings = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].status === 'accepted') {
        allAcceptedBookings.push(data[i]);
      }
    }
    const selfBooking = [];
    await Promise.all(
      allAcceptedBookings.map(async (ele, i) => {
        const res = await fetch(
          `http://localhost:5005/listings/${ele.listingId}`,
          {
            method: 'GET',
            headers: {
              'Content-type': 'application/json'
            }
          }
        );
        const data = await res.json();
        if (data.listing.owner === localStorage.getItem('email')) {
          selfBooking.push(ele);
        }
      })
    );
    setSelfBookings(selfBooking);
  };

  const getDatesBetween = (startDate, endDate) => {
    const dateArray = [];
    const currentDate = new Date(startDate);
    const finalDate = new Date(endDate);

    while (currentDate <= finalDate) {
      const currentDateStr = currentDate.toISOString().split('T')[0];
      if (currentDateStr !== endDate) {
        dateArray.push(currentDateStr);
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
  };

  useEffect(() => {
    getBookingList();
  }, []);

  useEffect(() => {
    // Initialize ECharts
    let formattedDates = [];
    let eachDaysIncomeArr = [];
    let eachDaysIncome = {};
    if (selfBookings !== null && selfBookings.length > 0) {
      eachDaysIncome = {};
      const currentDate = new Date();
      const thirtyDaysAgoDates = [];
      for (let i = 0; i < 30; i++) {
        const previousDate = new Date();
        previousDate.setDate(currentDate.getDate() - i);
        thirtyDaysAgoDates.push(previousDate);
      }
      formattedDates = (thirtyDaysAgoDates.map((date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      })).reverse();
      formattedDates.forEach((ele, i) => {
        eachDaysIncome[ele] = 0;
      });
      selfBookings.forEach((ele, index) => {
        const dataR = getDatesBetween(ele.dateRange[0], ele.dateRange[1]);
        const days = dataR.length;
        const pricePerDay = Math.round(ele.totalPrice / days);
        dataR.forEach((e, i) => {
          if (currentDate > new Date(e)) {
            eachDaysIncome[[String(e)]] += pricePerDay;
          }
        });
      });
      eachDaysIncomeArr = Object.values(eachDaysIncome);
    }
    const myChart = echarts.init(chartRef.current);

    const option = {
      xAxis: {
        type: 'category',
        data: formattedDates
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: eachDaysIncomeArr,
          type: 'bar'
        }
      ]
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [selfBookings]);

  return <div ref={chartRef} style={{ width: '100%', height: '300px' }} />;
};

export default BarChart;
