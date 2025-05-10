'use client';

import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
      marginLeft: '-16px',
    },
  },
};

export default function MultipleSelectCheckmarks({
  placeholder,
  data,
  selected,
  setSelected,
  disabled = false,
  multiple = true,
}) {
  const isAllSelected =
    multiple && data.length > 0 && selected.length === data.length;

  const handleChange = (event) => {
    const value = event.target.value;

    if (multiple) {
      if (value.includes('All')) {
        if (isAllSelected) {
          setSelected([]);
        } else {
          setSelected(data);
        }
      } else {
        setSelected(value);
      }
    } else {
      setSelected(value);
    }
  };

  return (
    <div className='w-[200px] h-[50px]'>
      <FormControl sx={{ m: 0, width: 200 }}>
        <InputLabel id='custom-select-label'>{placeholder}</InputLabel>
        <Select
          labelId='custom-select-label'
          id='custom-select'
          multiple={multiple}
          value={multiple ? selected : data.includes(selected) ? selected : ''}
          onChange={handleChange}
          input={<OutlinedInput label={placeholder} />}
          renderValue={multiple ? (selected) => selected.join(', ') : undefined}
          MenuProps={MenuProps}
          sx={{ height: 50 }}
          disabled={disabled}
        >
          {multiple && (
            <MenuItem value='All'>
              <Checkbox
                checked={isAllSelected}
                indeterminate={
                  selected.length > 0 && selected.length < data.length
                }
              />
              <ListItemText primary='All' />
            </MenuItem>
          )}

          {data.map((name) => (
            <MenuItem key={name} value={name}>
              {multiple ? (
                <>
                  <Checkbox checked={selected.includes(name)} />
                  <ListItemText primary={name} />
                </>
              ) : (
                <ListItemText primary={name} />
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
