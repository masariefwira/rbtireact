import React, { useState, useEffect, useContext } from 'react';
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
import Button from '@mui/material/Button';
import { LoadingButton } from '@mui/lab';
import { Alert, Snackbar } from '@mui/material';
import LoadingSpinner from '../../helper/LoadingSpinner';
import { ThemeCustomContext } from './../../util/theme-context';

const initialValues = {
  nim: '',
};

const PengembalianBuku = () => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [totalDenda, setTotalDenda] = useState('');
  const [idBukuKembali, setIdBukuKembali] = useState([]);
  const [mahasiswa, setMahasiswa] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [afterSave, setAfterSave] = useState(false);

  const [loadingModal, setLoadingModal] = useState(false);
  const [error, setError] = useState({
    isError: false,
    error: '',
  });

  const formik = useFormik({
    initialValues,
    onSubmit: (e) => {
      handleGetData(e);
    },
  });

  const url = process.env.REACT_APP_URL + '/api/peminjaman/nim';
  const submitUrl = process.env.REACT_APP_URL + '/api/peminjaman';
  const urlNim = process.env.REACT_APP_URL + '/api/mahasiswa?nim=';

  const themeCustom = useContext(ThemeCustomContext);
  useEffect(() => {
    themeCustom.changeShowImage(false);
  }, []);

  useEffect(() => {
    if (afterSave) {
      setTimeout(() => {
        setAfterSave(false);
      }, 3000);
    }
  }, [afterSave]);

  const handleGetData = (value) => {
    setLoadingModal(true);
    setMahasiswa('');
    setPeminjaman([]);
    setIdBukuKembali([]);

    fetch(urlNim + value.nim)
      .then((res) => res.json())
      .then((res) => {
        if (res?.errors !== null && res.errors?.length > 0) {
          throw new Error(res.errors[0]);
        }
        setMahasiswa(res?.data);
      })
      .catch((err) =>
        setError({
          isError: true,
          error: err.toString(),
        })
      );

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(value),
    })
      .then((res) => res.json())
      .then((res) => {
        let data = [];
        if (res.peminjaman?.length > 0) {
          data = [...res.peminjaman];
        }
        console.log(data);
        for (let x of data) {
          console.log(x);
          let formattedDate = new Date(x.tanggal_peminjaman);
          x.tanggal_peminjaman = formattedDate.toDateString();
        }
        setPeminjaman(data);
        setTotalDenda(res.total_denda);
        setLoadingModal(false);
      })
      .catch((err) => {
        setLoadingModal(false);
        setError({
          isError: true,
          error: err.toString(),
        });
        console.log(err);
      });
  };

  const handleSubmit = () => {
    setIsLoading(true);

    let data = { data: idBukuKembali };
    fetch(submitUrl, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => setIsLoading(false))
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });

    setAfterSave(true);

    setMahasiswa('');
    setPeminjaman([]);
    setTotalDenda('');
    setIdBukuKembali([]);
  };

  const handleCheckbox = (e, idBuku, idPeminjaman) => {
    let data = [...idBukuKembali];

    // check if id peminjaman exist
    for (let i = 0; i < data.length; i++) {
      // case if there are id peminjaman
      if ('id_peminjaman' in data[i]) {
        // check if the current index is the same id peminjaman
        if (data[i]['id_peminjaman'] === idPeminjaman) {
          let listBuku = [...data[i].id_buku];

          // delete if already exist
          if (listBuku.includes(idBuku)) {
            let index = listBuku.indexOf(idBuku);
            listBuku.splice(index, 1);
            if (listBuku.length === 0) {
              data.splice(i, 1);
              setIdBukuKembali([...data]);
              return;
            }
            // add buku to list if there are no existing
          } else {
            listBuku.push(idBuku);
          }
          data[i]['id_buku'] = listBuku;
          // if there are idPeminjaman but not the correct one
        } else {
          // check if its the end of the list
          if (i === data.length - 1) {
            let temp = {};
            temp['id_peminjaman'] = idPeminjaman;
            temp['id_buku'] = [idBuku];

            data.push(temp);
            break;
            // continue if its not, looping the process
          } else {
            continue;
          }
        }
      }
    }

    if (data.length === 0) {
      data[0] = {};
      data[0]['id_peminjaman'] = idPeminjaman;
      data[0]['id_buku'] = [idBuku];
    }

    setIdBukuKembali([...data]);
    console.log(data);
  };

  return (
    <Container
      sx={{
        maxWidth: '90%',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        mb: 10,
      }}
      className="pengembalian-buku"
    >
      <LoadingSpinner open={loadingModal} />
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
        {mahasiswa !== '' ? (
          <Box sx={{ alignSelf: 'flex-start' }}>
            <Typography>{mahasiswa.nama}</Typography>
            <Typography>{`NIM ${mahasiswa.nim}`}</Typography>
          </Box>
        ) : null}
        {totalDenda !== '' ? (
          <Typography sx={{ alignSelf: 'center', marginLeft: 'auto' }}>
            {`Total Denda Rp. ${totalDenda}`}
          </Typography>
        ) : null}
      </Box>
      {peminjaman.length > 0 ? (
        peminjaman.map((pinjam) => (
          <TabelBuku peminjaman={pinjam} checkboxHandler={handleCheckbox} />
        ))
      ) : (
        <Typography variant="h6" sx={{ alignSelf: 'center' }}>
          Tidak ada peminjaman aktif untuk nomor induk tersebut
        </Typography>
      )}
      {peminjaman.length > 0 ? (
        <LoadingButton
          sx={{ mb: 10 }}
          onClick={handleSubmit}
          variant="contained"
        >
          Submit
        </LoadingButton>
      ) : null}
      <Snackbar
        open={afterSave}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success">Peminjaman berhasil diinput</Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={error.isError}
        autoHideDuration={2000}
      >
        <Alert severity="error">{`Gagal menyimpan pengembalian buku ${error.error}`}</Alert>
      </Snackbar>
    </Container>
  );
};

export default PengembalianBuku;
