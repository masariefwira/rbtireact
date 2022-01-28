import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';

import './TabelDetailBuku.css';

export default function TabelJumlahBuku({
  detailBuku: { judul: detailBuku, jumlah: jumlahBuku },
}) {
  return (
    <TableContainer sx={{}} component={Paper} style={{ marginBottom: '3rem' }}>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Judul</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Dipinjam Oleh</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {detailBuku?.detail_buku.map((buku, index) => {
            return (
              <TableRow
                style={{
                  backgroundColor: index % 2 == 0 ? 'white' : '#d3d3d3',
                }}
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {buku?.id_buku}
                </TableCell>
                <TableCell align="right">{detailBuku?.judul}</TableCell>
                <TableCell align="right">{buku?.status}</TableCell>
                <TableCell align="right">Haikal Ikhwan</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
