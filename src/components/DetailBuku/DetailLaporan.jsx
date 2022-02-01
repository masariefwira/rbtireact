import { Container, Divider, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './DetailBuku.css';
import TabelDetailBuku from './TabelDetailBuku';
import TabelJumlahBuku from './TabelJumlahBuku';
import TabelDetailLaporan from './TabelDetailLaporan';
import ModalContainer from '../Modal/ModalContainer';

const DetailLaporan = (props) => {
  const [detailBuku, setDetailBuku] = useState({});
  const [loading, isLoading] = useState(true);
  const [openDelete, setOpenDelete] = useState(false);
  const [error, setError] = useState({
    isError: false,
    error: '',
  });

  const url = process.env.REACT_APP_URL + '/api/buku/judul';
  const params = useParams();

  const handleDelete = async () => {
    const urlDelete = process.env.REACT_APP_URL + '/api/buku';
    const body = JSON.stringify({
      id: +params?.id,
      jenis: params?.jenis.toLowerCase(),
    });

    try {
      let response = await fetch(urlDelete, {
        method: 'DELETE',
        body: body,
      });

      let resJson = await response.json();
      console.log('SAMPEK SINI');
      if (resJson.errors.null !== null && resJson.errors?.length > 0) {
        console.log('THROW ERROR ?');
        console.log(resJson.errors);
        throw new Error(resJson.errors[0]);
      }
      console.log('SAMPEK SINI');
      window.location.replace('/semua-buku');
      console.log('SAMPEK SINI JUGA');
    } catch (err) {
      setError({ isError: true, error: err.toString() });
    }
  };

  useEffect(() => {
    const requestBody = {
      limit: 1,
      id: parseInt(params?.id),
      jenis: params?.jenis.toLowerCase(),
    };
    console.log(requestBody);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((res) => {
        let data = { ...res.data };
        setDetailBuku(data);
        isLoading(false);
      });
  }, []);
  console.log(detailBuku);
  return (
    <Container className="detail-buku">
      <Divider />
      <div className="header-detail-buku">
        <Typography variant="h5">{`${detailBuku?.tipe} - ${detailBuku?.kategori}`}</Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => setOpenDelete(true)}
        >
          DELETE
        </Button>
      </div>
      <div className="detail-buku-content">
        <Typography variant="h6" style={{ marginBottom: '1rem' }}>
          {detailBuku?.judul}
        </Typography>

        <TabelDetailLaporan detailBuku={detailBuku} />
      </div>
      <ModalContainer
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
      >
        <div className="container-delete-confirm">
          <Typography variant="h6">
            {`Apakah ingin delete buku ${detailBuku.judul} ?`}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            fullWidth
          >
            KONFIRMASI
          </Button>
        </div>
      </ModalContainer>
    </Container>
  );
};

export default DetailLaporan;
