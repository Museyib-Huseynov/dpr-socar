import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

const DynamicTable = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const headers = Object.keys(data[0]);

  return (
    <TableContainer component={Paper}>
      <Typography variant='h6' sx={{ padding: 2 }}>
        Dynamic Data Table
      </Typography>
      <Table size='small'>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {headers.map((key) => (
                <TableCell key={key}>
                  {key === 'report_date'
                    ? new Date(row[key]).toLocaleDateString()
                    : row[key] !== null
                    ? row[key].toString()
                    : ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DynamicTable;
