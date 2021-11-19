import React, { useEffect, useState } from 'react';
import { TextField, Button, Container, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import './InputBuku.css';
import Divider from '@mui/material/Divider';

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

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => {
      handleSubmitEnd(values);
    },
  });

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
    // console.log(data);
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

  const dataToMap = [...kategoriData];
  return (
    <React.Fragment>
      <Container className="form-buku__container">
        <h2 style={{ marginBottom: '10px' }}>Input buku baru</h2>
        <Divider />
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
            name="judul.jenis"
            onChange={formik.handleChange}
          />
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

          <Button variant="contained" onClick={formik.handleSubmit}>
            Submit
          </Button>
        </form>
      </Container>
    </React.Fragment>
  );
};

export default InputBuku;
