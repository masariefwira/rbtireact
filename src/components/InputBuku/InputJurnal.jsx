import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import { MenuItem, Snackbar, Alert, Typography } from '@mui/material';

import * as Yup from 'yup';

const InputJurnal = ({ jenis: jenisBuku }) => {
  const [afterSave, setAfterSave] = useState(false);
  const [error, setError] = useState({
    isError: false,
    error: '',
  });
  const [kategoriData, setKategori] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [foundMahasiswa, setFoundMahasiswa] = useState('init');
  const [mahasiswa, setMahasiswa] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const initialValues = {
    volume: null,
    judul: '',
  };

  const laporanSchema = Yup.object().shape({
    volume: Yup.string().required('Volume harus diisi'),
    judul: Yup.string().required('Judul harus diisi'),
  });

  const url = process.env.REACT_APP_URL + '/api/kategori';

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

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      if (!formik.isValid) {
        return;
      }
      handleSubmitEnd(values);
    },
    validationSchema: laporanSchema,
  });

  const handleSubmitEnd = (values) => {
    const url = process.env.REACT_APP_URL + '/api/paper';
    let body = JSON.stringify({
      volume: values.volume,
      jenis: parseInt(jenisBuku),
      judul: values.judul,
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
      })
      .catch((err) => {
        setError({
          isError: true,
          error: err.toString(),
        });
      });
  };

  const handleSelectChange = (event) => {
    formik.setFieldValue('id_kategori', event.target.value);
  };

  const dataToMap = [...kategoriData];
  return (
    <React.Fragment>
      <form className="form-buku">
        <Typography>{`Jenis : ${jenisBuku}`}</Typography>
        <TextField
          className="form-input__field"
          value={formik.values?.judul}
          label="Judul"
          name="judul"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors?.judul && formik.touched?.judul}
          helperText={
            formik.errors?.judul && formik.touched?.judul
              ? formik.errors?.judul
              : null
          }
        ></TextField>
        <TextField
          className="form-input__field"
          value={formik.values?.volume}
          label="Volume"
          name="volume"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors?.volume && formik.touched?.volume}
          helperText={
            formik.errors?.volume && formik.touched?.volume
              ? formik.errors?.volume
              : null
          }
        ></TextField>
        <TextField
          className="form-input__field"
          value={formik.values?.tanggalRilis}
          label="Tanggal Rilis"
          name="tanggalRilis"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors?.tanggalRilis && formik.touched?.tanggalRilis}
          helperText={
            formik.errors?.tanggalRilis && formik.touched?.tanggalRilis
              ? formik.errors?.tanggalRilis
              : null
          }
        ></TextField>

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
        open={error.isError}
        autoHideDuration={2000}
      >
        <Alert severity="error">{`Gagal menyimpan buku ${error.error}`}</Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default InputJurnal;
