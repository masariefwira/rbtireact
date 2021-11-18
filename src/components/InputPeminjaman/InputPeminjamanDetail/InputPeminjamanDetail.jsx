import React from 'react';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const detailPeminjamStyle = {
  // width: '50%',
  fontFamily: 'sans-serif',
};

const InputPeminjamanDetail = ({ data, mahasiswa }) => {
  return (
    <div className="input-peminjaman__detail">
      <Paper
        elevation={2}
        sx={{
          width: '100%',
          height: '100%',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" component="div" sx={{ mb: '5px' }}>
          Detail Peminjam
        </Typography>
        <Divider />
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            mt: '8px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            mb: '16px',
          }}
        >
          <Typography variant="p" component="div" sx={detailPeminjamStyle}>
            Nama Peminjman
          </Typography>
          <Typography
            variant="p"
            component="div"
            sx={{ ...detailPeminjamStyle, alignContent: 'flex-end' }}
          >
            {mahasiswa.nama}
          </Typography>
        </Paper>
        <Typography variant="h6" component="div" sx={{ mb: '5px' }}>
          Buku yang akan dipinjam
        </Typography>
        <Divider />
        {data &&
          data.map(({ id, judul }, idx) => (
            <Paper
              elevation={0}
              sx={{
                width: '100%',
                mt: '8px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                mb: '16px',
              }}
            >
              <Typography variant="p" component="div" sx={detailPeminjamStyle}>
                Buku #{idx + 1}
              </Typography>
              <Typography
                variant="p"
                component="div"
                sx={{ ...detailPeminjamStyle, alignContent: 'flex-end' }}
              >
                {judul}
              </Typography>
            </Paper>
          ))}
      </Paper>
    </div>
  );
};

export default InputPeminjamanDetail;
