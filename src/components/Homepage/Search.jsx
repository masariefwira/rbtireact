import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';

import IconButton from '@mui/material/IconButton';

import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar({ inputHandler, query }) {
  return (
    <Paper
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        // width: 400,
        marginBottom: 5,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, width: '100%' }}
        placeholder="Search Judul, Penulis, Kategori..."
        inputProps={{ 'aria-label': 'search google maps' }}
        value={query}
        onChange={(e) => inputHandler(e)}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
