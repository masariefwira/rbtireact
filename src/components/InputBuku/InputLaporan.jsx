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
  Modal,
  Box,
} from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import InputMahasiswa from '../InputMahasiswa/InputMahasiswa';
import * as Yup from 'yup';

const InputLaporan = ({ jenis: jenisBuku }) => {
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
    id_kategori: null,
    judul: '',
    nim: '',
  };

  const laporanSchema = Yup.object().shape({
    id_kategori: Yup.number().required('ID Kategori harus diisi'),
    judul: Yup.string().required('Judul harus diisi'),
    nim: Yup.number().required('NIM harus diisi'),
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
    const url = process.env.REACT_APP_URL + '/api/laporan';
    let body = JSON.stringify({
      nim: values.nim,
      id_kategori: parseInt(values.id_kategori),
      jenis: jenisBuku,
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
                Cek kembali atau input nama mahasiswa{' '}
                <span
                  style={{ cursor: 'pointer', color: '#00308F' }}
                  onClick={() => setOpenModal(true)}
                >
                  disini
                </span>
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
                    fetchDataMahasiswa(formik.values?.nim);
                  }}
                >
                  CARI
                </Button>
              </InputAdornment>
            ),
          }}
          onChange={(e) => {
            if (foundMahasiswa != 'init') {
              setFoundMahasiswa('not');
            }
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
        <ModalMahasiswa
          open={openModal}
          handleClose={() => {
            setOpenModal(false);
          }}
        />
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
          disabled={
            !formik.isValid ||
            foundMahasiswa === 'not' ||
            foundMahasiswa === 'init'
          }
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

const ModalMahasiswa = (props) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Box sx={style}>
        <InputMahasiswa></InputMahasiswa>
      </Box>
    </Modal>
  );
};

export default InputLaporan;
