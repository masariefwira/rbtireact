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

const InputMenu = () => {
  const [jenis, setJenis] = useState('Buku');
  const option = [
    { value: 'Buku', label: 'Buku' },
    { value: 'Laporan PKL', label: 'Laporan PKL' },
    { value: 'Skripsi', label: 'Skripsi' },
    { value: 'Jurnal', label: 'Jurnal' },
  ];
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
        {jenis === 'Buku' ? (
          <InputBuku></InputBuku>
        ) : (
          <InputLaporan jenis={jenis}></InputLaporan>
        )}
      </Container>
    </React.Fragment>
  );
};

export default InputMenu;
