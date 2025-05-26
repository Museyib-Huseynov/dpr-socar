'use client';

import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from '@mui/material';
import dayjs from 'dayjs';

export default function MyDatePicker({
  value,
  setValue,
  placeholder,
  data_type,
  data,
  disabled = false,
}) {
  const [validDates, setValidDates] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      fetch(`/api/${data_type}/valid_dates/${data.join(',')}`)
        .then((res) => res.json())
        .then((date) => {
          const parsed = date.map((d) => dayjs(d.report_date).startOf('day'));
          setValidDates(parsed);

          if (!value && parsed.length > 0) {
            if (placeholder === 'Tarixdən') {
              setValue(parsed[0]);
            } else if (placeholder === 'Tarixə') {
              setValue(parsed[parsed.length - 1]);
            }
          }
        });
    }
  }, [data, value, setValue]);

  const shouldDisableDate = (date) => {
    const target = dayjs(date).startOf('day');
    return !validDates.some((validDate) => validDate.isSame(target, 'day'));
  };

  return (
    <div className='w-[200px] p-3'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={placeholder}
          value={value}
          onChange={(newValue) => setValue(newValue)}
          shouldDisableDate={shouldDisableDate}
          disabled={data.length === 0 || disabled}
          sx={{
            width: 200,
          }}
          slotProps={{
            textField: {
              InputProps: {
                sx: {
                  height: 50,
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
