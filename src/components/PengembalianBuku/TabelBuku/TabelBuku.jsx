import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';

export default function TabelBuku({ peminjaman, checkboxHandler }) {

  return (
    <React.Fragment>
      <Typography
        sx={{ mb: 1, mt: 1 }}
      >{`Peminjaman #${peminjaman.id_peminjaman}`}</Typography>
      <TableContainer component={Paper} sx={{ mb: 3, mt: 2 }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ID Buku</TableCell>
              <TableCell>Judul</TableCell>
              <TableCell align="right">Penerbit</TableCell>
              <TableCell align="right">Tahun</TableCell>
              <TableCell align="right">Tanggal Peminjaman</TableCell>
              <TableCell align="right">Denda</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {'buku_dipinjam' in peminjaman
              ? peminjaman.buku_dipinjam.map((row) => (
                  <TableRow
                    key={row.id_buku}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ width: 100 }}>
                      {row.id_buku}
                    </TableCell>
                    <TableCell component="th" scope="row" sx={{ width: 250 }}>
                      {row.judul}
                    </TableCell>
                    <TableCell align="right" sx={{ width: 150 }}>
                      {row.penerbit}
                    </TableCell>
                    <TableCell align="right" sx={{ width: 100 }}>
                      {row.tahun}
                    </TableCell>
                    <TableCell align="right" sx={{ width: 175 }}>
                      {peminjaman.tanggal_peminjaman}
                    </TableCell>
                    <TableCell align="right" sx={{ width: 150 }}>
                      {peminjaman.denda === 0 ? "-" : `Rp. ${peminjaman.denda}`}
                    </TableCell>
                    <TableCell align="right" sx={{ width: 150 }}>
                      <Checkbox 
                        onChange={(e) => {
                            checkboxHandler(e, row.id_buku, peminjaman.id_peminjaman)
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
