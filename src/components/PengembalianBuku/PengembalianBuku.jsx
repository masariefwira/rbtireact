import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import './PengembalianBuku.css';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useFormik } from 'formik';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import TabelBuku from './TabelBuku/TabelBuku';

const initialValues = {
  nim: '',
};

const PengembalianBuku = () => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [totalDenda, setTotalDenda] = useState('');

  const formik = useFormik({
    initialValues,
    onSubmit: (e) => {
      handleGetData(e);
    },
  });

  const url = 'http://localhost:8080/api/peminjaman/nim';

  const handleGetData = (value) => {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(value),
    })
      .then((res) => res.json())
      .then((res) => {
        let data = [];
        data = [...res.peminjaman];
        setPeminjaman(data);
        setTotalDenda(res.total_denda);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Container
      sx={{
        maxWidth: '90%',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="pengembalian-buku"
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Pengembalian Buku
      </Typography>
      <Box sx={{ width: '40%' }}>
        <TextField
          label="Input NIM"
          fullWidth
          name="nim"
          value={formik.values.nim}
          onChange={formik.handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton onClick={formik.handleSubmit}>
                  <Typography>CARI</Typography>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Typography variant="h6" sx={{ mt: 5 }}>
        Detail Peminjaman
      </Typography>
      <Divider />
      <Box sx={{ mt: 1, display: 'flex', width: '100%', flexDirection: 'row' }}>
        <Box sx={{ alignSelf: 'flex-start' }}>
          <Typography>Haikal Ikhwan Kusumah</Typography>
          <Typography>NIM 185060707111004</Typography>
        </Box>
        {totalDenda !== '' ? (
          <Typography sx={{ alignSelf: 'center', marginLeft: 'auto' }}>
            {`Total Denda Rp. ${totalDenda}`}
          </Typography>
        ) : null}
      </Box>
      {peminjaman.map((pinjam) => (
        <TabelBuku peminjaman={pinjam} />
      ))}
    </Container>
  );
};

export default PengembalianBuku;
