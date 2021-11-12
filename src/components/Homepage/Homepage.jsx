import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// const url = 'http://45.80.181.87:8080/api/buku';
const url = 'http://localhost:8080/api/buku';

export default function HomepageTable() {
  const [buku, setBuku] = React.useState([]);

  React.useEffect(() => {
    let data = {
      limit: 8,
      offset: 0,
    };
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        let bukuData = res.data;
        console.log(bukuData);
        setBuku(bukuData);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Judul</TableCell>
            <TableCell align="right">Penerbit</TableCell>
            <TableCell align="right">Tahun</TableCell>
            <TableCell align="right">Bahasa</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {buku.map(({ judul: book }) => (
            <TableRow
              key={book.judul}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {book.judul}
              </TableCell>
              <TableCell align="right">{book.penerbit}</TableCell>
              <TableCell align="right">{book.tahun}</TableCell>
              <TableCell align="right">{book.bahasa}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
