import {
  Container,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  Divider,
} from '@mui/material';
import React, { useState } from 'react';
import InputBuku from './InputBuku';
import InputLaporan from './InputLaporan';
import InputJurnal from './InputJurnal';
import InputArtikel from './InputArtikel';

const InputMenu = () => {
  const [jenis, setJenis] = useState('Buku');
  const option = [
    { value: 'Buku', label: 'Buku' },
    { value: 'Laporan PKL', label: 'Laporan PKL' },
    { value: 'Skripsi', label: 'Skripsi' },
    { value: 'Jurnal', label: 'Jurnal' },
    { value: 'Artikel', label: 'Artikel' },
    { value: 'Makalah', label: 'Makalah' },
    { value: 'Prosiding', label: 'Prosiding' },
  ];

  const JenisInput = () => {
    if (jenis === 'Buku') {
      return <InputBuku></InputBuku>;
    } else if (jenis === 'Artikel') {
      return <InputArtikel jenis = "1"></InputArtikel>;
    } else if (jenis === 'Makalah') {
      return <InputArtikel jenis = "2"></InputArtikel>;
    } else if (jenis === 'Prosiding') {
      return <InputJurnal jenis = "2"></InputJurnal>;
    } else if (jenis === 'Jurnal') {
      return <InputJurnal jenis = "1"></InputJurnal>;
    } 
    else {
      return <InputLaporan></InputLaporan>;
    }
  };

  return (
    <React.Fragment>
      <Container className="form-buku__container">
        <h2 style={{ marginBottom: '10px' }}>Input buku baru</h2>
        <Divider style={{ marginBottom: '1rem' }}></Divider>
        <TextField
          value={jenis}
          onChange={(e) => setJenis(e.target.value)}
          label="Jenis"
          select
          style={{ width: '100%' }}
          InputProps={{
            startAdornment: (
              <InputAdornment>
                <Typography style={{ marginRight: 10 }}>
                  JENIS BUKU DIINPUT
                </Typography>
              </InputAdornment>
            ),
          }}
        >
          {option.map((opt) => {
            return (
              <MenuItem key={opt.value} value={opt.value} id={opt.value}>
                {opt.label}
              </MenuItem>
            );
          })}
        </TextField>
        <Divider style={{ marginBottom: '1rem', marginTop: '1rem' }}></Divider>
        <JenisInput />
      </Container>
    </React.Fragment>
  );
};

export default InputMenu;
