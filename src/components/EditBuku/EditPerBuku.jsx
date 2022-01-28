import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useState, useEffect } from 'react';

const EditPerBuku = ({ id }) => {
  const [idBuku, setIdBuku] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: idBuku,
    enableReinitialize: true,
  });

  const url = process.env.REACT_APP_URL + '/api/buku';

  useEffect(() => {
    setIsLoading(true);
    let body = JSON.stringify({
      limit: 1,
      id_judul: id,
    });
    fetch(url, {
      method: 'POST',
      body: body,
    })
      .then((res) => res.json())
      .then((res) => {
        let idBukuArr = [];
        for (let id of res?.data[0].judul?.detail_buku) {
          idBukuArr.push(id?.id_buku);
        }
        let values = { buku: idBukuArr };
        setIdBuku(values);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, []);

  return (
    <React.Fragment>
      <form className="form-buku">
        {isLoading ? (
          <Box
            style={{
              backgroundColor: 'rgba(0,0,0,0.25)',
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              left: 0,
              top: 0,
            }}
          >
            <CircularProgress />
          </Box>
        ) : null}
        <Typography variant="h5" style={{ marginBottom: '1rem' }}>
          Edit ID Buku
        </Typography>
        {formik.values?.buku?.length > 0
          ? formik.values.buku.map((detailBuku, index) => (
              <TextField
                className="form-input__field"
                value={detailBuku}
                label={`ID Buku #${index + 1}`}
                name={`buku[${index}]`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // error={
                //   formik.errors?.buku[index] && formik.touched?.buku[index]
                // }
                // helperText={
                //   formik.errors.buku[index] && formik.touched.buku[index]
                //     ? formik.errors.buku[index]
                //     : null
                // }
              />
            ))
          : null}
        <Button variant="contained">SUBMIT</Button>
      </form>
    </React.Fragment>
  );
};

export default EditPerBuku;
