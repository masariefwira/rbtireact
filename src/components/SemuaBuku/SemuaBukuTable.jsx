import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { TableHead } from '@mui/material';
import { useNavigate } from 'react-router';
import './SemuaBukuTable.css';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function SemuaBukuTable({
  data,
  handlePageBerubah,
  handleRowPerPage,
  page,
  rowsPerPage,
  count,
  jenis,
}) {
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data[0].count) : 0;

  let link = '/detail-buku/';
  if (jenis !== 'buku') {
    link = `/detail-laporan/${jenis}/`;
  }

  let TableBuku = () => (
     <React.Fragment>
     <TableHead>
    <TableRow>
      <TableCell>ID</TableCell>
      <TableCell>Judul</TableCell>
      <TableCell>Penulis</TableCell>
      <TableCell>Penerbit</TableCell>
      <TableCell>Tahun</TableCell>
      <TableCell>Kategori</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    {data.map((row) => (
      <TableRow
        key={row.id}
        onClick={() => window.open(link + `${row.id}`, '_blank')}
        className="row-table-buku"
      >
        <TableCell style={{ width: 160 }}>{row.id}</TableCell>
        <TableCell scope="row" style={{ width: 160 }}>
          {row.judul}
        </TableCell>
        <TableCell style={{ width: 160 }}>{row.penulis}</TableCell>
        <TableCell style={{ width: 160 }}>{row.penerbit}</TableCell>
        <TableCell style={{ width: 160 }}>{row.tahun}</TableCell>
        <TableCell style={{ width: 160 }}>{row.kategori}</TableCell>
      </TableRow>
    ))}

    {emptyRows > 0 && (
      <TableRow style={{ height: 53 * emptyRows }}>
        <TableCell colSpan={6} />
      </TableRow>
    )}
  </TableBody>
  </React.Fragment>
  )

  let TableSkripsi = () => (
    <React.Fragment>
    <TableHead>
   <TableRow>
     <TableCell>Judul</TableCell>
     <TableCell>Penulis</TableCell>
     <TableCell>Tahun</TableCell>
     <TableCell>Kategori</TableCell>
   </TableRow>
 </TableHead>
 <TableBody>
   {data.map((row) => (
     <TableRow
       key={row.id}
       onClick={() => window.open(link + `${row.id}`, '_blank')}
       className="row-table-buku"
     >
       <TableCell scope="row" style={{ width: 160 }}>
         {row.judul}
       </TableCell>
       <TableCell style={{ width: 160 }}>{row.penulis}</TableCell>
       <TableCell style={{ width: 160 }}>{row.tahun}</TableCell>
       <TableCell style={{ width: 160 }}>{row.kategori}</TableCell>
     </TableRow>
   ))}

   {emptyRows > 0 && (
     <TableRow style={{ height: 53 * emptyRows }}>
       <TableCell colSpan={6} />
     </TableRow>
   )}
 </TableBody>
 </React.Fragment>
 )

 let TableArtikel = () => (
  <React.Fragment>
  <TableHead>
 <TableRow>
   <TableCell>Judul</TableCell>
   <TableCell>Bagian Dari</TableCell>
   <TableCell>Penulis</TableCell>
   <TableCell>Tahun</TableCell>
 </TableRow>
</TableHead>
<TableBody>
 {data.map((row) => (
   <TableRow
     key={row.id}
     onClick={() => window.open(link + `${row.id}`, '_blank')}
     className="row-table-buku"
   >
     <TableCell scope="row" style={{ width: 160 }}>
       {row.judul}
     </TableCell>
     <TableCell style={{ width: 160 }}>{row.judul_induk}</TableCell>
     <TableCell style={{ width: 160 }}>{row.penulis}</TableCell>
     <TableCell style={{ width: 160 }}>{row.tahun}</TableCell>
   </TableRow>
 ))}

 {emptyRows > 0 && (
   <TableRow style={{ height: 53 * emptyRows }}>
     <TableCell colSpan={6} />
   </TableRow>
 )}
</TableBody>
</React.Fragment>
)

let TablePaper = () => (
  <React.Fragment>
  <TableHead>
 <TableRow>
   <TableCell>Judul</TableCell>
   <TableCell>Volume</TableCell>
   <TableCell>Tahun</TableCell>
 </TableRow>
</TableHead>
<TableBody>
 {data.map((row) => (
   <TableRow
     key={row.id}
     onClick={() => window.open(link + `${row.id}`, '_blank')}
     className="row-table-buku"
   >
     <TableCell scope="row" style={{ width: 160 }}>
       {row.judul}
     </TableCell>
     <TableCell style={{ width: 160 }}>{row.volume}</TableCell>
     <TableCell style={{ width: 160 }}>{row.tahun}</TableCell>
   </TableRow>
 ))}

 {emptyRows > 0 && (
   <TableRow style={{ height: 53 * emptyRows }}>
     <TableCell colSpan={6} />
   </TableRow>
 )}
</TableBody>
</React.Fragment>
)

 let JenisDecider = () => {
   if (jenis === "skripsi") {
     console.log("SKRIPSI!")
     return TableSkripsi()
   }
   else if (jenis === "artikel" || jenis === "makalah") {
    return TableArtikel()
   } else if (jenis === "prosiding" || jenis === "jurnal") {
    return TablePaper()
   }
   else {
    console.log("BUKAN SKRIPSI!")
     return TableBuku()
   }
 }

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table
        sx={{ minWidth: 500, minHeight: 500, maxHeight: 500 }}
        aria-label="custom pagination table"
      >
        <JenisDecider/>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={3}
              count={count}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handlePageBerubah}
              onRowsPerPageChange={handleRowPerPage}
              ActionsComponent={TablePaginationActions}
              align="right"
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
