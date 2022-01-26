import { Container, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './DetailBuku.css';
import TabelDetailBuku from './TabelDetailBuku';
import TabelJumlahBuku from './TabelJumlahBuku';
import TabelDetailLaporan from './TabelDetailLaporan';

const DetailLaporan = (props) => {
  const [detailBuku, setDetailBuku] = useState({});
  const [loading, isLoading] = useState(true);

  const url = process.env.REACT_APP_URL + '/api/buku/judul';
  const params = useParams();
  console.log(params?.id);

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
      <Typography variant="h5">{`${detailBuku?.tipe} - ${detailBuku?.kategori}`}</Typography>
      <Divider />
      <div className="detail-buku-content">
        <Typography variant="h6" style={{ marginBottom: '1rem' }}>
          {detailBuku?.judul}
        </Typography>
        <TabelDetailLaporan detailBuku={detailBuku} />
      </div>
      {/* <div className="detail-buku-jumlah">
        <Typography variant="h5">Jumlah Buku</Typography>
        <Divider />

        {'detail_buku' in detailBuku ? (
          <TabelJumlahBuku detailBuku={detailBuku} />
        ) : null}
      </div> */}
    </Container>
  );
};

export default DetailLaporan;
