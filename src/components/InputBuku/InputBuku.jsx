import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Container,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import './InputBuku.css';
import Divider from '@mui/material/Divider';
import { LoadingButton } from '@mui/lab';

import * as Yup from 'yup';

const initialValues = {
  judul: {
    judul: '',
    tahun: '',
    penerbit: '',
    penulis: '',
    bahasa: '',
    jenis: '',
    id_kategori: '',
  },
  jumlah: '',
};

const bukuSchema = Yup.object().shape({
  judul: Yup.object().shape({
    judul: Yup.string()
      .min(4, 'Judul terlalu pendek, minimal 5 huruf')
      .max(200, 'Judul terlalu panjang, max 200 huruf')
      .required('Judul tidak boleh kosong!'),

    tahun: Yup.number().required('Tahun tidak boleh kosong!'),

    penerbit: Yup.string()
      .min(4, 'Penerbit terlalu pendek, minimal 5 huruf')
      .max(100, 'Penerbit terlalu panjang, max 100 huruf')
      .required('Penerbit tidak boleh kosong!'),

    penulis: Yup.string()
      .min(4, 'Penulis terlalu pendek, minimal 5 huruf')
      .max(100, 'Penulis terlalu panjang, max 100 huruf')
      .required('Penulis tidak boleh kosong!'),

    bahasa: Yup.string()
      .min(4, 'Bahasa terlalu pendek, minimal 5 huruf')
      .max(50, 'Bahasa terlalu panjang, max 50 huruf')
      .required('Bahasa tidak boleh kosong!'),

    jenis: Yup.number().required('Jenis harus diisi!'),
    id_kategori: Yup.number().required('Kategori harus diisi!'),
  }),
  jumlah: Yup.number()
    .required('Jumlah wajib diisi')
    .max(10, 'Jumlah tidak boleh lebih dari 10'),
});

const InputBuku = () => {
  const [kategoriData, setKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('Testing');
  const [isLoading, setIsLoading] = useState(false);
  const [afterSave, setAfterSave] = useState(false);
  const [error, setError] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      if (!formik.isValid) {
        return;
      }
      handleSubmitEnd(values);
    },
    validationSchema: bukuSchema,
  });

  useEffect(() => {
    if (afterSave) {
      setTimeout(() => setAfterSave(false), 3000);
    }
  }, [afterSave]);

  const url = process.env.REACT_APP_URL + '/api/kategori';
  const urlSubmit = process.env.REACT_APP_URL + '/api/buku';

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        let dataMap = mapData(res);
        setKategori([...dataMap]);
      })
      .catch((err) => console.log(err));
  }, []);

  let mapData = (input) => {
    let data = [...input];
    const udahDiMap = data.map(({ id: value, kategori: label, ...data }) => ({
      value,
      label,
      ...data,
    }));
    return udahDiMap;
  };

  const handleSelectChange = (event) => {
    formik.setFieldValue('judul.id_kategori', event.target.value);
  };

  const handleSubmitEnd = (values) => {
    const convertedData = { ...values };
    convertedData.judul.tahun = +convertedData.judul.tahun;
    convertedData.judul.jenis = +convertedData.judul.jenis;
    convertedData.jumlah = +convertedData.jumlah;
    const data = JSON.stringify(convertedData);
    setIsLoading(true);
    fetch(urlSubmit, {
      method: 'PATCH',
      body: data,
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((res) => {
        setIsLoading(false);
        setAfterSave(true);
        formik.handleReset();
      })
      .catch((err) => {
        setIsLoading(false);
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 1000);
      });
  };

  const jenis = [
    { value: 1, label: 'Bisa dipinjam' },
    { value: 2, label: 'Tidak bisa dipinjam' },
  ];
  const dataToMap = [...kategoriData];
  return (
    <React.Fragment>
      <form className="form-buku">
        <TextField
          className="form-input__field"
          value={formik.values.judul.judul}
          label="Judul"
          name="judul.judul"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.judul?.judul && formik.touched.judul?.judul}
          helperText={
            formik.errors.judul?.judul && formik.touched.judul?.judul
              ? formik.errors.judul?.judul
              : null
          }
        />
        <TextField
          className="form-input__field"
          value={formik.values.judul.bahasa}
          label="Bahasa"
          name="judul.bahasa"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.judul?.bahasa && formik.touched.judul?.bahasa}
          helperText={
            formik.errors.judul?.bahasa && formik.touched.judul?.bahasa
              ? formik.errors.judul?.bahasa
              : null
          }
        />
        <TextField
          className="form-input__field"
          select
          value={formik.values.judul.id_kategori}
          label="ID Kategori"
          name="judul.id_kategori"
          onChange={(e) => handleSelectChange(e)}
          onBlur={formik.handleBlur}
          error={
            formik.errors.judul?.id_kategori &&
            formik.touched.judul?.id_kategori
          }
          helperText={
            formik.errors.judul?.id_kategori &&
            formik.touched.judul?.id_kategori
              ? formik.errors.judul?.id_kategori
              : null
          }
        >
          {dataToMap.map((option) => (
            <MenuItem key={option.value} value={option.value} id={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className="form-input__field"
          value={formik.values.judul.jenis}
          label="Jenis"
          select
          name="judul.jenis"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.judul?.jenis && formik.touched.judul?.jenis}
          helperText={
            formik.errors.judul?.jenis && formik.touched.judul?.jenis
              ? formik.errors.judul?.jenis
              : null
          }
        >
          {jenis.map((item) => (
            <MenuItem key={item.value} value={item.value} id={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className="form-input__field"
          value={formik.values.judul.penerbit}
          label="Penerbit"
          name="judul.penerbit"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          error={
            formik.errors.judul?.penerbit && formik.touched.judul?.penerbit
          }
          helperText={
            formik.errors.judul?.penerbit && formik.touched.judul?.penerbit
              ? formik.errors.judul?.penerbit
              : null
          }
        />
        <TextField
          className="form-input__field"
          value={formik.values.judul.penulis}
          label="Penulis"
          name="judul.penulis"
          onChange={formik.handleChange}
          error={formik.errors.judul?.penulis && formik.touched.judul?.penulis}
          onBlur={formik.handleBlur}
          helperText={
            formik.errors.judul?.penulis && formik.touched.judul?.penulis
              ? formik.errors.judul?.penulis
              : null
          }
        />
        <TextField
          className="form-input__field"
          value={formik.values.judul.tahun}
          label="Tahun"
          name="judul.tahun"
          onChange={formik.handleChange}
          error={formik.errors.judul?.tahun && formik.touched.judul?.tahun}
          onBlur={formik.handleBlur}
          helperText={
            formik.errors.judul?.tahun && formik.touched.judul?.tahun
              ? formik.errors.judul?.tahun
              : null
          }
        />
        <TextField
          className="form-input__field"
          value={formik.values.jumlah}
          label="Jumlah"
          name="jumlah"
          onChange={formik.handleChange}
          error={formik.errors.jumlah && formik.touched.jumlah}
          onBlur={formik.handleBlur}
          helperText={
            formik.errors?.jumlah && formik.touched?.jumlah
              ? formik.errors?.jumlah
              : null
          }
        />

        <LoadingButton
          variant="contained"
          loading={isLoading}
          disabled={!formik.isValid}
          onClick={formik.handleSubmit}
        >
          Submit
        </LoadingButton>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={afterSave}
        autoHideDuration={3000}
      >
        <Alert severity="success">Buku berhasil disimpan</Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={error}
        autoHideDuration={2000}
      >
        <Alert severity="error">Gagal menyimpan buku</Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default InputBuku;
