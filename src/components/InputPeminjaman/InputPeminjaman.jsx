import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';

import './InputPeminjaman.css';
import InputPeminjamanDetail from './InputPeminjamanDetail/InputPeminjamanDetail';
import { useFormik } from 'formik';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import Divider from '@mui/material/Divider';
import { LoadingButton } from '@mui/lab';
import { Alert, Snackbar } from '@mui/material';

const url = process.env.REACT_APP_URL + '/api/buku?idBuku=';
const urlNim = process.env.REACT_APP_URL + '/api/mahasiswa?nim=';
const urlPinjam = process.env.REACT_APP_URL + '/api/peminjaman';

var fortnightAway = new Date(Date.now() + 12096e5);

const InputPeminjaman = () => {
  const [buku, setBuku] = useState([]);
  const [isInputId, setIsInputId] = useState(false);
  const [mahasiswa, setMahasiswa] = useState({ nama: 'tidak ditemukan' });
  const [isLoading, setIsLoading] = useState(false);
  const [afterSave, setAfterSave] = useState(false);

  const revertState = () => {
    setBuku([]);
    setIsInputId(false);
    setMahasiswa({ nama: 'tidak ditemukan' });
    formik.setValues(initialValues);
  };

  const initialValues = {
    idPeminjaman: '',
    nimPeminjam: '',
    tenggatPengembalian: fortnightAway.toDateString(),
    arrayBuku: [
      {
        idBuku: '',
      },
    ],
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      setIsLoading(true);
      handleSubmit(values);

      setIsLoading(false);
      setAfterSave(true);
    },
  });

  useEffect(() => {
    if (afterSave) {
      setTimeout(() => {
        setAfterSave(false);
      }, 3000);
    }
  }, [afterSave]);

  const handleSubmit = (values) => {
    const nim = values.nimPeminjam;
    const idBuku = values.arrayBuku.map((item) => +item.idBuku);

    const data = { nim, id_buku: idBuku };

    console.log(data);
    fetch(urlPinjam, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    revertState();
  };

  const handleAddBuku = (e) => {
    const data = [...formik.values.arrayBuku];
    data.push({ idBuku: '' });

    formik.setValues({ ...formik.values, arrayBuku: data });
  };

  const handleRemoveBuku = (index) => {
    console.log(index);
    console.log(`REMOVE BUKU ${index}`);

    const data = [...formik.values.arrayBuku];
    data.splice(index, 1);

    const dataBuku = [...buku];
    dataBuku.splice(index, 1);

    setBuku(dataBuku);
    formik.setValues({ ...formik.values, arrayBuku: data });
  };

  const handleGetDetailBuku = (idBuku, index) => {
    const formattedUrl = url + idBuku;
    fetch(formattedUrl)
      .then((res) => {
        if (res.status === 404) {
          throw new Error('No judul found with the given ID');
        }
        return res.json();
      })
      .then((res) => {
        if (res.status != 404) {
          let temp = [];
          temp = { ...res };
          let tempArr = [...buku];
          tempArr.push(temp);
          setBuku(tempArr);
        }
      })
      .catch((err) => {
        console.log(err);
        let tempArr = [...buku];
        console.log(tempArr);
        if (tempArr.length > 0) {
          tempArr.splice(index, 1);
          setBuku(tempArr);
        }
      });
  };

  const handleGetDataMahasiswa = (e) => {
    formik.handleChange(e);
    if (e.currentTarget.value.length === 15) {
      const populatedUrl = urlNim + e.currentTarget.value;
      fetch(populatedUrl)
        .then((res) => res.json())
        .then((res) => {
          let data = {};
          data = { ...res.data };
          setMahasiswa(data);
        })
        .catch((err) => console.log(err));
    } else {
      let data = { nama: 'Data mahasiswa tidak ditemukan' };
      setMahasiswa(data);
    }
  };

  return (
    <React.Fragment>
      <Container
        sx={{ width: '90%', justifyContent: 'space-between', display: 'flex' }}
        maxWidth={false}
        className="input-peminjaman"
      >
        {/* START FORM */}
        <div className="input-peminjaman__form">
          <Typography variant="h5" component="div">
            Buat Peminjaman Baru
          </Typography>
          <Divider sx={{ mt: 1, mb: 3 }} />
          <TextField
            label="ID Peminjaman"
            className="input-peminjaman__field"
            name="idPeminjaman"
            value={formik.values.idPeminjaman}
            onChange={formik.handleChange}
            disabled={!isInputId}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  <IconButton onClick={() => setIsInputId(!isInputId)}>
                    {isInputId ? (
                      <CheckBoxIcon />
                    ) : (
                      <CheckBoxOutlineBlankIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Divider sx={{ mt: 3, mb: 5 }} />
          <TextField
            label="NIM Peminjam"
            className="input-peminjaman__field"
            name="nimPeminjam"
            disabled={isInputId}
            value={formik.values.nimPeminjam}
            onChange={(e) => handleGetDataMahasiswa(e)}
          />
          <TextField
            label="Tenggat Pengembalian"
            className="input-peminjaman__field"
            name="tenggatPengembalian"
            disabled
            value={formik.values.tenggatPengembalian}
            onChange={formik.handleChange}
          />
          {formik.values.arrayBuku.map((buku, idx) => (
            <React.Fragment>
              <TextField
                label={`ID Buku #${idx + 1}`}
                className="input-peminjaman__field"
                name={`arrayBuku[${idx}].idBuku`}
                disabled={isInputId}
                value={formik.values.arrayBuku[idx].idBuku}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleGetDetailBuku(e.currentTarget.value, idx);
                }}
                InputProps={
                  formik.values.arrayBuku.length > 1
                    ? {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => handleRemoveBuku(idx)}>
                              <DeleteIcon sx={{ color: 'red' }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }
                    : null
                }
              />
            </React.Fragment>
          ))}
          <Button onClick={(e) => handleAddBuku(e)} variant="outlined">
            Add Buku
          </Button>
          <LoadingButton
            onClick={formik.handleSubmit}
            sx={{ mt: 1 }}
            variant="contained"
            loading={isLoading}
          >
            Submit
          </LoadingButton>
        </div>

        {/* START DETAIL */}
        <InputPeminjamanDetail data={buku} mahasiswa={mahasiswa} />
        <Snackbar
          open={afterSave}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity="success">Peminjaman berhasil diinput</Alert>
        </Snackbar>
      </Container>
    </React.Fragment>
  );
};

export default InputPeminjaman;
