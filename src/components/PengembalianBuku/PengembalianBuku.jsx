import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import './PengembalianBuku.css';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { useFormik } from 'formik';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import TabelBuku from './TabelBuku/TabelBuku';
import Button from '@mui/material/Button';

const initialValues = {
  nim: '',
};

const PengembalianBuku = () => {
  const [peminjaman, setPeminjaman] = useState([]);
  const [totalDenda, setTotalDenda] = useState('');
  const [idBukuKembali, setIdBukuKembali] = useState([])
  const [mahasiswa, setMahasiswa] = useState("")

  const formik = useFormik({
    initialValues,
    onSubmit: (e) => {
      handleGetData(e);
    },
  });

  const url = process.env.REACT_APP_URL + '/api/peminjaman/nim';
  const submitUrl = process.env.REACT_APP_URL + '/api/peminjaman'
  const urlNim = process.env.REACT_APP_URL + '/api/mahasiswa?nim=';

  const handleGetData = (value) => {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(value),
    })
      .then((res) => res.json())
      .then((res) => {
        let data = [];
        data = [...res.peminjaman];
        console.log(data)
        for (let x of data) {
          console.log(x)
          let formattedDate = new Date(x.tanggal_peminjaman)
          x.tanggal_peminjaman = formattedDate.toDateString()
        }
        setPeminjaman(data);
        setTotalDenda(res.total_denda);
      })
      .catch((err) => console.log(err));

    fetch(urlNim + value.nim).then(res => res.json()).then(res => {
      console.log(res)
      setMahasiswa(res)
    }).catch(err => console.log(err))
  };

  const handleSubmit = () => {
    console.log("SUBMIT")
    let data = {data : idBukuKembali}
    fetch(submitUrl, {
      method : "PATCH",
      body : JSON.stringify(data)
    }).then(res => res.json()).then(res => console.log(res)).catch(err => console.log(err))
  }

  const handleCheckbox = (e, idBuku, idPeminjaman) => {

    let data = [...idBukuKembali]

    // check if id peminjaman exist
    for (let i = 0; i < data.length; i++) {
      // case if there are id peminjaman
      if ("id_peminjaman" in data[i]){
        // check if the current index is the same id peminjaman
        if (data[i]["id_peminjaman"] === idPeminjaman) {
          let listBuku = [...data[i].id_buku]

          // delete if already exist
          if (listBuku.includes(idBuku)) {
            let index = listBuku.indexOf(idBuku)
            listBuku.splice(index, 1)
            if (listBuku.length === 0){
              data.splice(i, 1)
              setIdBukuKembali([...data])
              return
            }
            // add buku to list if there are no existing
          } else {
            listBuku.push(idBuku)
          }
          data[i]["id_buku"] = listBuku
          // if there are idPeminjaman but not the correct one
        } else {
          // check if its the end of the list
          if (i === data.length - 1) {
         
            let temp = {}
            temp["id_peminjaman"] = idPeminjaman
            temp["id_buku"] = [idBuku]

            data.push(temp)
            break
            // continue if its not, looping the process
          } else {
           
            continue
          }
        }
      }
    }
    
    if (data.length === 0) {
      data[0] = {}
      data[0]["id_peminjaman"] = idPeminjaman
      data[0]["id_buku"] = [idBuku]
    }

    setIdBukuKembali([...data])
    console.log(data)
  }

  return (
    <Container
      sx={{
        maxWidth: '90%',
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="pengembalian-buku"
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Pengembalian Buku
      </Typography>
      <Box sx={{ width: '40%' }}>
        <TextField
          label="Input NIM"
          fullWidth
          name="nim"
          value={formik.values.nim}
          onChange={formik.handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment>
                <IconButton onClick={formik.handleSubmit}>
                  <Typography>CARI</Typography>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Typography variant="h6" sx={{ mt: 5 }}>
        Detail Peminjaman
      </Typography>
      <Divider />
      <Box sx={{ mt: 1, display: 'flex', width: '100%', flexDirection: 'row' }}>
        {mahasiswa !== "" ? <Box sx={{ alignSelf: 'flex-start' }}>
          <Typography>{mahasiswa.nama}</Typography>
          <Typography>{`NIM ${mahasiswa.nim}`}</Typography>
        </Box> : null}
        {totalDenda !== '' ? (
          <Typography sx={{ alignSelf: 'center', marginLeft: 'auto' }}>
            {`Total Denda Rp. ${totalDenda}`}
          </Typography>
        ) : null}
      </Box>
      {peminjaman.map((pinjam) => (
        <TabelBuku peminjaman={pinjam} checkboxHandler={handleCheckbox} />
      ))}
      {peminjaman.length > 0 ? <Button sx={{mb : 10}} onClick={handleSubmit}>Submit</Button> : null}
    </Container>
  );
};

export default PengembalianBuku;
