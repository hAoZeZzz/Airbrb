import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

function valuetext (value) {
  return `${value}`;
}

export default function RangeSlider (props) {
  const [value, setValue] = React.useState([props.min, props.max]);

  const handleChange = (event, newValue) => {
    setValue(newValue);

    if (props.kinds === 'price') {
      if (newValue[1] === 1000) {
        props.setPriceRange([newValue[0], 99999999999]);
      } else {
        props.setPriceRange(newValue);
      }
    } else if (props.kinds === 'bedroom') {
      if (newValue[1] === 10) {
        props.setBedroomRange([newValue[0], 99999999999]);
      } else {
        props.setBedroomRange(newValue);
      }
    }
  };
  const marks = [
    {
      value: 0,
      label: '0'
    },
    {
      value: (props.max - props.min) * (1 / 5),
      label: `${(props.max - props.min) * (1 / 5)}`
    },
    {
      value: (props.max - props.min) * (2 / 5),
      label: `${(props.max - props.min) * (2 / 5)}`
    },
    {
      value: (props.max - props.min) * (3 / 5),
      label: `${(props.max - props.min) * (3 / 5)}`
    },
    {
      value: (props.max - props.min) * (4 / 5),
      label: `${(props.max - props.min) * (4 / 5)}`
    },

    {
      value: props.max,
      label: `${props.max}+`
    }
  ];

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => '12'}
        value={value}
        onChange={handleChange}
        getAriaValueText={valuetext}
        max={props.max}
        min={props.min}
        marks={marks}
      />
    </Box>
  );
}
