'use client';

import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const ITEM_HEIGHT = 100;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 'fit',
      marginLeft: '0px',
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
    multiple && data.length > 0 && (selected ?? []).length === data.length;

  const handleChange = (event) => {
    const value = event.target.value;

    if (multiple) {
      if (value.includes('Hamısı')) {
        if (isAllSelected) {
          setSelected([]);
        } else {
          setSelected(data.map((d) => d.id));
        }
      } else {
        setSelected(value);
      }
    } else {
      setSelected(value);
    }
  };

  const getNameById = (id) => {
    return data.find((item) => item.id === id)?.name || '';
  };

  return (
    <div className='w-[200px] p-3'>
      <FormControl sx={{ m: 0, width: 200 }}>
        <InputLabel id='custom-select-label'>{placeholder}</InputLabel>
        <Select
          labelId='custom-select-label'
          id='custom-select'
          multiple={multiple}
          value={multiple ? selected : selected ?? ''}
          onChange={handleChange}
          input={<OutlinedInput label={placeholder} />}
          renderValue={
            multiple
              ? (selected) => selected.map(getNameById).join(', ')
              : (selected) => getNameById(selected)
          }
          MenuProps={MenuProps}
          sx={{ height: 50 }}
          disabled={disabled}
        >
          {multiple && (
            <MenuItem value='Hamısı'>
              <Checkbox
                checked={isAllSelected}
                indeterminate={
                  selected.length > 0 && selected.length < data.length
                }
              />
              <ListItemText primary='Hamısı' />
            </MenuItem>
          )}

          {data.map((item) => (
            <MenuItem key={item.id ?? item.name} value={item.id}>
              {multiple ? (
                <>
                  <Checkbox checked={selected?.includes(item.id)} />
                  <ListItemText primary={item.name} />
                </>
              ) : (
                <ListItemText primary={item.name} />
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
