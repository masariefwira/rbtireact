import React, { useContext, useEffect, useState } from 'react';
import {
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  Typography,
  InputAdornment,
  Button,
} from '@mui/material';
import { useFormik } from 'formik';
import './InputBuku.css';
import { LoadingButton } from '@mui/lab';

import * as Yup from 'yup';
import { ThemeCustomContext } from './../../util/theme-context';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

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

    penulis: Yup.array().of(Yup.string()
    .min(4, 'Penulis terlalu pendek, minimal 5 huruf')
    .max(100, 'Penulis terlalu panjang, max 100 huruf')
    .required('Penulis tidak boleh kosong!')),


    bahasa: Yup.string()
      .min(4, 'Bahasa terlalu pendek, minimal 5 huruf')
      .max(50, 'Bahasa terlalu panjang, max 50 huruf')
      .required('Bahasa tidak boleh kosong!'),

    jenis: Yup.number().required('Jenis harus diisi!'),
    id_kategori: Yup.number().required('Kategori harus diisi!'),
  }),
  // jumlah: Yup.number()
  //   .required('Jumlah wajib diisi')
  //   .max(10, 'Jumlah tidak boleh lebih dari 10'),
});

const InputBuku = () => {
  const [kategoriData, setKategori] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [afterSave, setAfterSave] = useState(false);
  const [error, setError] = useState({
    isError: false,
    error: '',
  });
  const [inputIdBuku, setInputIdBuku] = useState(true);
  const [initialValues, setInitialValues] = useState({
    judul: {
      judul: '',
      tahun: '',
      penerbit: '',
      penulis: [""],
      bahasa: '',
      jenis: '',
      id_kategori: '',
    },
    jumlah: '',
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
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

  const themeCustom = useContext(ThemeCustomContext);

  useEffect(() => {
    fetch(url)
      .then((res) => {
        if (res.status >= 404) {
          throw new Error('Ada gangguan! Coba lagi lain waktu');
        }
        return res.json();
      })
      .then((res) => {
        if (res.errors !== null && res.errors?.length > 0) {
          throw new Error(res.errors[0]);
        }
        let dataMap = mapData(res);
        setKategori([...dataMap]);
      })
      .catch((err) => console.log(err));

    themeCustom.changeShowImage(false);
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
    console.log(convertedData.idBuku);
    if (!inputIdBuku) {
      let arrIdBuku = [];
      for (let id of convertedData.idBuku) {
        console.log(id);
        arrIdBuku.push(+id);
      }
      convertedData.judul.id_buku = arrIdBuku;
      delete convertedData['idBuku'];
    } else {
      convertedData.jumlah = +convertedData.jumlah;
    }
    const data = JSON.stringify(convertedData);
    setIsLoading(true);
    fetch(urlSubmit, {
      method: 'PATCH',
      body: data,
    })
      .then((res) => {
        if (res.status >= 404) {
          throw new Error('Mohon maaf ada gangguan, coba lagi lain waktu');
        }
        return res.json();
      })
      .then((res) => {
        if (res.errors !== null && res.errors?.length > 0) {
          throw new Error(res.errors[0]);
        }
        setIsLoading(false);
        setAfterSave(true);
        formik.handleReset();
      })
      .catch((err) => {
        setIsLoading(false);
        setError({ error: err, isError: true });
        setTimeout(() => {
          setError(false);
        }, 1000);
      });
  };

  const changeInputHandler = (e) => {
    let IsGenerateId = e.target.value;
    console.log(`IS GENERATE ID ${e.target.value}`);
    if (IsGenerateId) {
      let initVal = {
        judul: {
          judul: '',
          tahun: '',
          penerbit: '',
          penulis: [''],
          bahasa: '',
          jenis: '',
          id_kategori: '',
        },
        jumlah: '',
      };
      setInitialValues(initVal);
    } else {
      let initVal = {
        judul: {
          judul: '',
          tahun: '',
          penerbit: '',
          penulis: [''],
          bahasa: '',
          jenis: '',
          id_kategori: '',
        },
        idBuku: [''],
      };
      console.log(initVal);
      setInitialValues(initVal);
    }
    setInputIdBuku(IsGenerateId);
  };

  const jenis = [
    { value: 1, label: 'Bisa dipinjam' },
    { value: 2, label: 'Tidak bisa dipinjam' },
  ];

  const opsiInput = [
    { value: false, label: 'Input ID Buku (Barcode)' },
    { value: true, label: 'Generate ID Buku' },
  ];

  const handleAddBuku = (e) => {
    const data = [...formik.values.idBuku];
    data.push('');

    formik.setValues({ ...formik.values, idBuku: data });
  };

  const addPenulis = () => {
    const data = [...formik.values.judul?.penulis];

    data.push('');

    let valueJudul = { ...formik.values.judul, penulis: data };
    formik.setValues({ ...formik.values, judul: valueJudul });
  };

  const deletePenulis = (idx) => {
    const data = [...formik.values.judul?.penulis];
    data.splice(idx, 1);

    let valueJudul = { ...formik.values.judul, penulis: data };
    formik.setValues({ ...formik.values, judul: valueJudul });
  };

  const dataToMap = [...kategoriData];
  return (
    <React.Fragment>
      <form className="form-buku">
        <div className="keterangan-form-buku form-input__field">
          <Typography style={{ fontWeight: 'bold' }}>KETERANGAN</Typography>
          <Typography>
            Pilih opsi input ID Buku, apabila opsi generate dipilih maka sistem
            akan generate ID Buku berdasarkan jumlah <br></br>
            Apabila opsi input lewat barcode dipilih, silakan input ID Buku
            menggunakan barcode scanner
          </Typography>
        </div>

        <TextField
          className="form-input__field"
          select
          value={inputIdBuku}
          onChange={(e) => changeInputHandler(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment>
                <Typography style={{ marginRight: '10px' }}>
                  INPUT ID BUKU
                </Typography>
              </InputAdornment>
            ),
          }}
        >
          {opsiInput.map((opsi) => (
            <MenuItem value={opsi.value} id={opsi.value}>
              {opsi.label}
            </MenuItem>
          ))}
        </TextField>
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
        {formik.values.judul.penulis.map((field, idx) => (
          <TextField
            className="form-input__field"
            value={formik.values.judul.penulis[idx]}
            label="Penulis"
            name={`judul.penulis[${idx}]`}
            onChange={formik.handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment>
                  {idx > 0 ? (
                    <IconButton onClick={() => deletePenulis(idx)}>
                      <DeleteIcon sx={{ color: 'red' }} />
                    </IconButton>
                  ) : null}
                  {idx < 2 ? (
                    <Button onClick={addPenulis}>Add Penulis</Button>
                  ) : null}
                </InputAdornment>
              ),
            }}
            error={
              formik.errors.judul?.penulis && formik.touched.judul?.penulis
            }
            onBlur={formik.handleBlur}
            helperText={
              formik.errors.judul?.penulis && formik.touched.judul?.penulis
                ? formik.errors.judul?.penulis
                : null
            }
          />
        ))}
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
        {inputIdBuku ? (
          <TextField
            className="form-input__field"
            value={formik.values.jumlah}
            label="Jumlah"
            name="jumlah"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.jumlah && formik.touched.jumlah}
            helperText={
              formik.errors?.jumlah && formik.touched?.jumlah
                ? formik.errors?.jumlah
                : null
            }
          />
        ) : (
          formik.values?.idBuku?.map((field, index) => (
            <TextField
              className="form-input__field"
              value={formik.values?.idBuku[index]}
              label={`ID Buku #${index + 1}`}
              name={`idBuku[${index}]`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          ))
        )}
        {!inputIdBuku ? (
          <Button
            variant="contained"
            onClick={(e) => handleAddBuku(e)}
            style={{ marginBottom: '10px' }}
          >
            Add Buku
          </Button>
        ) : null}
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
        {/* <Alert severity="error">{`Gagal menyimpan buku ${error.error.toString()}`}</Alert> */}
      </Snackbar>
    </React.Fragment>
  );
};

export default InputBuku;
