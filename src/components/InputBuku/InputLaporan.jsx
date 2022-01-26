import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { LoadingButton } from '@mui/lab';
import {
  MenuItem,
  Snackbar,
  Alert,
  Typography,
  InputAdornment,
} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

const InputLaporan = () => {
  const [afterSave, setAfterSave] = useState(false);
  const [error, setError] = useState(false);
  const [kategoriData, setKategori] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [foundMahasiswa, setFoundMahasiswa] = useState('init');
  const [mahasiswa, setMahasiswa] = useState({});

  const initialValues = {
    id_kategori: null,
    judul: '',
    nim: '',
  };
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
    // validationSchema: bukuSchema,
  });

  const handleSubmitEnd = (values) => {
    console.log(values);
  };

  const handleSelectChange = (event) => {
    formik.setFieldValue('id_kategori', event.target.value);
  };

  const fetchDataMahasiswa = (nim) => {
    console.log(nim);
    const url = process.env.REACT_APP_URL + '/api/mahasiswa?nim=' + nim;
    console.log(url);

    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res?.errors == null) {
          setFoundMahasiswa('found');
          setMahasiswa(res.data);
        } else {
          setFoundMahasiswa('not');
        }
      });
  };

  const cardMahasiswa = () => {
    if (foundMahasiswa === 'found') {
      return (
        <Card
          className="form-input__field"
          style={{ backgroundColor: '#AFE1AF' }}
        >
          <CardContent className="card-content-mhs">
            <CheckCircleIcon style={{ color: 'green' }}></CheckCircleIcon>
            <div className="card-detail-mhs">
              <Typography>Mahasiswa ditemukan</Typography>
              <Typography style={{ fontWeight: 'bold' }}>
                {mahasiswa.nama}
              </Typography>
            </div>
          </CardContent>
        </Card>
      );
    } else if (foundMahasiswa == 'not') {
      return (
        <Card
          className="form-input__field"
          style={{ backgroundColor: '#F88379' }}
        >
          <CardContent className="card-content-mhs">
            <CancelIcon style={{ color: 'red' }}></CancelIcon>
            <div className="card-detail-mhs">
              <Typography>
                Mahasiswa dengan NIM tersebut tidak ditemukan!
              </Typography>
              <Typography style={{ fontWeight: 'bold' }}>
                Cek kembali atau input nama mahasiswa disini
              </Typography>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      return null;
    }
  };

  const dataToMap = [...kategoriData];
  return (
    <React.Fragment>
      <form className="form-buku">
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
        {cardMahasiswa()}
        <TextField
          className="form-input__field"
          value={formik.values?.nim}
          label="NIM"
          name="nim"
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <Button
                  onClick={() => {
                    // console.log(formik.values?.nim);
                    fetchDataMahasiswa(formik.values?.nim);
                  }}
                >
                  CARI
                </Button>
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            setFoundMahasiswa('not');
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
          error={formik.errors?.nim && formik.touched?.nim}
          helperText={
            formik.errors?.nim && formik.touched?.nim
              ? formik.errors?.nim
              : null
          }
        ></TextField>
        <TextField
          className="form-input__field"
          select
          value={formik.values.id_kategori}
          label="ID Kategori"
          name="id_kategori"
          onChange={(e) => handleSelectChange(e)}
          onBlur={formik.handleBlur}
          error={formik.errors.id_kategori && formik.touched.id_kategori}
          helperText={
            formik.errors.id_kategori && formik.touched.id_kategori
              ? formik.errors.id_kategori
              : null
          }
        >
          {dataToMap.map((option) => (
            <MenuItem key={option.value} value={option.value} id={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

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

export default InputLaporan;
