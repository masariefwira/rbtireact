import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import "./TabelDetailBuku.css"



export default function TabelDetailBuku({detailBuku}) {
    const rows = [
        {label : "Tahun", value : detailBuku?.tahun},
        {label : "Penulis", value : detailBuku?.penulis},
        {label : "Bahasa", value : detailBuku?.bahasa},
        {label : "Jumlah", value : detailBuku?.count},
        {label : "Jenis", value : "Buku"},
      ];
  return (
    <TableContainer sx={{}} component={Paper}>
      <Table size="medium">
        <TableBody
        >
            {rows.map((data, index) => {
                return (
                    <TableRow
                    style = {{backgroundColor : index % 2 == 0 ? "white" : "#d3d3d3"}}
                    key = {index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {data.label}
              </TableCell>
              <TableCell align="right">{data.value}</TableCell>
            </TableRow>
                )
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}