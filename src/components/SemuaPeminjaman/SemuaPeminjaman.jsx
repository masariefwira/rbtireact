import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import React, { useState, useEffect, useContext } from 'react';
import Typography from '@mui/material/Typography';

import './SemuaPeminjaman.css';
import Divider from '@mui/material/Divider';
import { DataGrid } from '@mui/x-data-grid';
import { InputAdornment, MenuItem, TextField } from '@mui/material';
import LoadingSpinner from '../../helper/LoadingSpinner';
import { ThemeCustomContext } from './../../util/theme-context';

const SemuaPeminjaman = () => {
  const url = process.env.REACT_APP_URL + '/api/peminjaman/all';

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nim_peminjaman', headerName: 'NIM', width: 200 },
    { field: 'nama', headerName: 'Nama', width: 200 },
    {
      field: 'tanggal_peminjaman',
      headerName: 'Tanggal Peminjaman',
      width: 200,
    },
    {
      field: 'tenggat_pengembalian',
      headerName: 'Tenggat Pengembalian',
      width: 200,
    },
    { field: 'status', headerName: 'Keterangan', width: 100 },
    { field: 'keterlambatan', headerName: 'Keterlambatan', width: 150 },
  ];

  const [peminjaman, setPeminjaman] = useState([]);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(5);
  const [rowSize, setRowSize] = useState(10);
  const [filter, setFilter] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  const themeCustom = useContext(ThemeCustomContext);

  useEffect(() => {
    setIsLoading(true);
    const bodyData = {
      limit: rows,
      offset: rows * page,
    };

    if (filter !== 1) {
      if (filter !== 6) {
        bodyData['status'] = [filter];
      } else {
        bodyData['telat'] = 'true';
      }
    }

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(bodyData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.data === null) {
          setPeminjaman(null);
          setIsLoading(false);
          return;
        }

        let data = [...res.data];
        let size = data[0].count;
        for (let item of data) {
          console.log(item);
          let datePinjam = new Date(item.tanggal_peminjaman);
          let dateTenggat = new Date(item.tenggat_pengembalian);

          item.tanggal_peminjaman = datePinjam.toDateString();
          item.tenggat_pengembalian = dateTenggat.toDateString();

          if (item.keterlambatan.length > 0) {
            if (item.status !== 4) {
              item.status = 'Telat';
            }
          }

          item.status = statusTranslator(item.status);
        }
        setPeminjaman(data);
        setIsLoading(false);

        console.log(size);

        setRowSize(size);
        themeCustom.changeShowImage(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }, [rows, page, filter]);

  const options = [
    {
      value: 1,
      label: 'Semua Peminjaman',
    },
    {
      value: 2,
      label: 'Peminjaman aktif',
    },
    {
      value: 6,
      label: 'Peminjaman aktif telat dikembalikan',
    },
    {
      value: 3,
      label: 'Peminjaman sudah booking',
    },
    {
      value: 4,
      label: 'Peminjaman sudah dikembalikan',
    },
    {
      value: 5,
      label: 'Peminjaman kembali sebagian',
    },
  ];

  const statusTranslator = (status) => {
    switch (status) {
      case 2:
        return 'Aktif';
      case 3:
        return 'Booking';
      case 4:
        return 'Kembali';
      case 5:
        return 'Kembali sebagian';
      default:
        break;
    }
  };

  const handleFilterChange = (e) => {
    setPage(0);
    setFilter(e.target.value);
  };

  const ErrorMessage = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
      }}
    >
      <Typography>Tidak ada data untuk filter tersebut</Typography>
    </Box>
  );

  return (
    <React.Fragment>
      <LoadingSpinner open={isLoading}></LoadingSpinner>
      <Container className="semua-peminjaman">
        <Typography variant="h4">Data Peminjaman</Typography>
        <Divider></Divider>
        <TextField
          sx={{ mt: 3 }}
          select
          fullWidth
          value={filter}
          onChange={handleFilterChange}
          InputProps={{
            startAdornment: (
              <InputAdornment>
                <Typography sx={{ marginRight: 3 }}>
                  FILTER BERDASARKAN
                </Typography>
              </InputAdornment>
            ),
          }}
        >
          {options.map((opsi) => (
            <MenuItem key={opsi.value} value={opsi.value}>
              {opsi.label}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ width: '100%', minHeight: '400px', mt: 2 }}>
          {peminjaman !== null ? (
            <DataGrid
              rows={peminjaman}
              columns={columns}
              pageSize={rows}
              rowCount={rowSize}
              page={page}
              hideFooterSelectedRowCount={true}
              density="comfortable"
              // getCellClassName = {({id}) => id % 2 === 0 ? "cell-dark" : "cell-light"}
              rowsPerPageOptions={[10, 20]}
              paginationMode="server"
              sx={{ minHeight: '400px' }}
              onPageSizeChange={(pageSize) => setRows(pageSize)}
              onPageChange={(page) => setPage(page)}
              components={{
                ErrorOverlay: ErrorMessage,
              }}
            />
          ) : (
            <ErrorMessage />
          )}
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default SemuaPeminjaman;
