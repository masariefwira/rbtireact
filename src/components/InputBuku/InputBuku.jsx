import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, MenuItem, Snackbar, Alert } from '@mui/material';
import { useFormik } from 'formik';
import './InputBuku.css';
import Divider from '@mui/material/Divider';
import { LoadingButton } from '@mui/lab';

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

const InputBuku = () => {
  const [kategoriData, setKategori] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState('Testing');
  const [isLoading, setIsLoading] = useState(false)
  const [afterSave, setAfterSave] = useState(false)

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      setIsLoading(true)
      handleSubmitEnd(values);

      setIsLoading(false)
      setAfterSave(true)
      formik.setValues(initialValues)
    },
  });

  useEffect(() => {
    if (afterSave) {
      setTimeout(() => setAfterSave(false), 3000)
    }
  }, [afterSave])

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
    console.log(event.target.value);
    formik.setFieldValue('judul.id_kategori', event.target.value);
  };

  const handleSubmitEnd = (values) => {
    const convertedData = { ...values };
    convertedData.judul.tahun = +convertedData.judul.tahun;
    convertedData.judul.jenis = +convertedData.judul.jenis;
    convertedData.jumlah = +convertedData.jumlah;
    const data = JSON.stringify(convertedData);
    fetch(urlSubmit, {
      method: 'PATCH',
      body: data,
    })
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const jenis = [
    {value : 1, label : "Bisa dipinjam"},
    {value : 2, label : "Tidak bisa dipinjam"},
  ]

  const dataToMap = [...kategoriData];
  return (
    <React.Fragment>
      <Container className="form-buku__container">
        <h2 style={{ marginBottom: '10px' }}>Input buku baru</h2>
        <form className="form-buku">
          <TextField
            className="form-input__field"
            value={formik.values.judul.judul}
            label="Judul"
            name="judul.judul"
            onChange={formik.handleChange}
          />
          <TextField
            className="form-input__field"
            value={formik.values.judul.bahasa}
            label="Bahasa"
            name="judul.bahasa"
            onChange={formik.handleChange}
          />
          <TextField
            className="form-input__field"
            select
            value={formik.values.judul.id_kategori}
            label="ID Kategori"
            name="judul.id_kategori"
            onChange={(e) => handleSelectChange(e)}
          >
            {dataToMap.map((option) => (
              <MenuItem key={option.value} value={option.value}>
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
          >
            {jenis.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            className="form-input__field"
            value={formik.values.judul.penerbit}
            label="Penerbit"
            name="judul.penerbit"
            onChange={formik.handleChange}
          />
          <TextField
            className="form-input__field"
            value={formik.values.judul.penulis}
            label="Penulis"
            name="judul.penulis"
            onChange={formik.handleChange}
          />
          <TextField
            className="form-input__field"
            value={formik.values.judul.tahun}
            label="Tahun"
            name="judul.tahun"
            onChange={formik.handleChange}
          />
          <TextField
            className="form-input__field"
            value={formik.values.jumlah}
            label="Jumlah"
            name="jumlah"
            onChange={formik.handleChange}
          />

          <LoadingButton
            variant="contained"
            loading={isLoading}
            onClick={formik.handleSubmit}
          >
            Submit
          </LoadingButton>
        </form>
      </Container>
      <Snackbar
        anchorOrigin={{vertical : "bottom", horizontal : "right"}}
        open={afterSave}
        autoHideDuration={3000}
      >
        <Alert severity="success">
              Buku berhasil disimpan
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default InputBuku;
