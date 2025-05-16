import React from 'react';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { TableVirtuoso } from 'react-virtuoso';

const VirtualizedTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant='h5' fontWeight='bold'>
          No data available
        </Typography>
      </Box>
    );
  }

  const headers = Object.keys(data[0]);

  return (
    <Paper sx={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <TableVirtuoso
        data={data}
        components={{
          Table: (props) => (
            <Table
              {...props}
              stickyHeader
              size='small'
              sx={{ tableLayout: 'auto', minWidth: 'max-content' }}
            />
          ),
          TableBody: React.forwardRef((props, ref) => (
            <TableBody {...props} ref={ref} />
          )),
        }}
        fixedHeaderContent={() => (
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={header}
                sx={{
                  backgroundColor: 'background.paper',
                  fontWeight: 'bold',
                  minWidth: 150,
                  whiteSpace: 'nowrap',
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        )}
        itemContent={(index, row) =>
          headers.map((key) => (
            <TableCell key={key} sx={{ minWidth: 150, whiteSpace: 'nowrap' }}>
              {key === 'report_date'
                ? new Date(row[key]).toLocaleDateString()
                : row[key] !== null
                ? row[key].toString()
                : ''}
            </TableCell>
          ))
        }
      />
    </Paper>
  );
};

export default VirtualizedTable;
