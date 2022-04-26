import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment, Button } from '@mui/material';
import TabelJurnal from './TabelJurnal';

const ModalInputJurnal = ({ handleClick, jenis }) => {
  const [data, setData] = useState({
    data: [],
    count: 0,
  });

  const [query, setQuery] = useState('');

  const handleSearch = async (query) => {
    console.log(query);
    let url = process.env.REACT_APP_URL + `/api/paper?query=${query}&jenis=${jenis}`;
    let resp = await fetch(url);
    let respJson = await resp.json();

    console.log(respJson);
    setData(respJson);
  };

  return (
    <React.Fragment>
      <TextField
        sx={{ marginBottom: '10px' }}
        label="Cari Jurnal / Prosiding"
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment>
              <Button
                onClick={(e) => {
                  handleSearch(query);
                }}
              >
                CARI
              </Button>
            </InputAdornment>
          ),
        }}
      />
      {data?.data?.length > 0 ? (
        <TabelJurnal
          data={data?.data}
          count={data?.count}
          handleClick={handleClick}
        />
      ) : null}
    </React.Fragment>
  );
};

export default ModalInputJurnal;
