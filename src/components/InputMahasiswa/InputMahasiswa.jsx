import {
  Button,
  Container,
  Snackbar,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useState, useEffect, useContext } from 'react';
import * as Yup from 'yup';
import { ThemeCustomContext } from './../../util/theme-context';

const InputMahasiswa = () => {
  const [afterSave, setAfterSave] = useState(false);
  const [error, setError] = useState({
    isError: false,
    error: '',
  });
  const initialValues = {
    nim: '',
    nama: '',
    nomor_telp: '',
    email: '',
    angkatan:'',
  };

  const themeCustom = useContext(ThemeCustomContext);
  useEffect(() => {
    themeCustom.changeShowImage(false);
  }, []);

  const mahasiswaSchema = Yup.object().shape({
    nim: Yup.number().required('NIM tidak boleh kosong'),
    nama: Yup.string().required('Nama tidak boleh kosong'),
    angkatan: Yup.number('Angkatan harus dalam format angka').required(
      'Angkatan tidak boleh kosong'
    ),
  });

  const formik = useFormik({
    validationSchema: mahasiswaSchema,
    initialValues: initialValues,
    onSubmit: (values) => {
      if (!formik.isValid) {
        return;
      }
      handleSubmit(values);
    },
    // validationSchema: bukuSchema,
  });

  const handleSubmit = (e) => {
    const url = process.env.REACT_APP_URL + '/api/mahasiswa';
    let body = JSON.stringify({
      nim: e.nim,
      nama: e.nama,
      nomor_telp: e.nomor_telp,
      email: e.email,
      angkatan: parseInt(e.angkatan),
      
    });

    fetch(url, {
      body: body,
      method: 'POST',
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.errors !== null && res?.errors?.length > 0) {
          throw new Error(res.errors[0]);
        }
        setAfterSave(true);
        formik.handleReset();
      })
      .catch((err) => {
        setError({ isError: true, error: err.toString() });
      });
  };

  const checkExistingMahasiswa = (nim) => {
    let url = process.env.REACT_APP_URL + '/api/mahasiswa?nim=' + nim;
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.data !== '') {
          throw new Error('Nomor induk yang diinput sudah ada');
        }
        console.log('HERE');
        formik.setStatus({ ...formik.status, nim: null });
      })
      .catch((err) => {
        formik.setStatus({ nim: err.toString(), ...formik.status });
        // formik.setFieldError('nim', err.toString());
      });
  };

  console.log(formik.status);
  console.log(formik.errors);

  return (
    <Container>
      <Typography variant="h5" style={{ marginBottom: '1rem' }}>
        Input Data Mahasiswa
      </Typography>
      <form className="form-buku">
        <TextField
          className="form-input__field"
          value={formik.values?.nim}
          label="NIM"
          name="nim"
          onChange={formik.handleChange}
          onBlur={(e) => {
            formik.handleBlur(e);
            checkExistingMahasiswa(e.target.value);
          }}
          error={
            (formik.status?.nim && formik.touched?.nim) ||
            (formik.errors?.nim && formik.touched?.nim)
          }
          helperText={
            (formik.status?.nim && formik.touched?.nim) || formik.errors?.nim
              ? formik.status?.nim
              : null
          }
        />
        <TextField
          className="form-input__field"
          value={formik.values?.nama}
          label="Nama"
          name="nama"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors?.nama && formik.touched?.nama}
          helperText={
            formik.errors?.nama && formik.touched?.nama
              ? formik.errors?.nama
              : null
          }
        />
        <TextField
          className="form-input__field"
          value={formik.values?.nomor_telp}
          label="Nomor Telepon"
          name="nomor_telp"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors?.nomor_telp && formik.touched?.nomor_telp}
          helperText={
            formik.errors?.nomor_telp && formik.touched?.nomor_telp
              ? formik.errors?.nomor_telp
              : null
          }
        />
        <TextField
          className="form-input__field"
          value={formik.values?.email}
          label="Email"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors?.email && formik.touched?.email}
          helperText={
            formik.errors?.email && formik.touched?.email
              ? formik.errors?.email
              : null
          }
        />
        <TextField
          className="form-input__field"
          value={formik.values?.angkatan}
          label="Angkatan"
          name="angkatan"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors?.angkatan && formik.touched?.angkatan}
          helperText={
            formik.errors?.angkatan && formik.touched?.angkatan
              ? formik.errors?.angkatan
              : null
          }
        />
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={afterSave}
          autoHideDuration={3000}
        >
          <Alert severity="success">Data mahasiswa berhasil disimpan</Alert>
        </Snackbar>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={error.isError}
          autoHideDuration={2000}
        >
          <Alert severity="error">{`Gagal menyimpan data mahasiswa ${error.error}`}</Alert>
        </Snackbar>
        <Button
          variant="contained"
          onClick={formik.handleSubmit}
          disabled={!formik.isValid || formik.status?.nim !== null}
        >
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default InputMahasiswa;
