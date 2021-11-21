import { Chip, Container, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, {useState, useEffect} from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import SemuaBukuTable from './SemuaBukuTable';


const SemuaBuku = () => {
    const [kategori, setKategori] = useState([])
    const [selectedKategori, setSelectedKategori] = useState("")
    const [filterKategori, setFilterKategori] = useState([])
    const [buku, setBuku] = useState([])

    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const [searchQuery, setSearchQuery] = useState("")

    const urlKategori = process.env.REACT_APP_URL + "/api/kategori"
    const urlFilter = process.env.REACT_APP_URL + "/api/buku"

    useEffect(() => {
        fetch(urlKategori).then(res => res.json()).then(res => {
            let data = [...res]
            setKategori(data)
        }).catch(err => console.log(err))
    }, [])

    const fetchBuku = (isSearch) => {
        let request = {}
        console.log(isSearch)
        if (isSearch) {
            request = {limit : rowsPerPage, offset : rowsPerPage * page, judul : searchQuery}
        } else {
            request = {limit : rowsPerPage, offset : rowsPerPage * page}
        }


        if (filterKategori.length > 0){
            request["kategori"] = filterKategori.map((item) => +item.id)
            console.log(request)
        }

        fetch(urlFilter, {
            method : "POST",
            body : JSON.stringify(request)
        }).then(res => res.json()).then(res => {
            if (res.data === null)  {
                setBuku([])
                return
            }
            let temp = [...res.data]
            let tempLoop = []

            for (let item of temp) {
                item.judul.id_kategori = translatorKategori(item.judul.id_kategori, kategori)
                tempLoop.push(item.judul)
            }
            setBuku(tempLoop)
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        fetchBuku()
    }, [page, rowsPerPage, filterKategori, kategori])

    

    const handleKategoriChange = (e) => {
        setSelectedKategori(e.target.value)

        const selectedKategori = kategori[e.target.value - 1]
        const temp = [...filterKategori]


        temp.push(selectedKategori)
        setFilterKategori(temp)
        setPage(0)
    }

    const handleDeleteChip = (e, idx) => {
        let temp = [...filterKategori]

        temp.splice(idx, 1)
        setFilterKategori(temp)
        setPage(0)
    }

    const columns = [
        {field : "judul", headerName : "Judul", width : 150},
        {field : "penulis", headerName : "Penulis", width : 100},
        {field : "penerbit", headerName : "Penerbit", width : 100},
        {field : "tahun", headerName : "Tahun", width : 100},
        {field : "id_kategori", headerName : "Kategori", width : 100},
    ]

    const translatorKategori = (id, data) => {
        try {
            return data[id - 1].kategori
        } catch (err) {
            return "-"
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = () => {
        fetchBuku(true)

        setPage(0)
    }

    return (
        <React.Fragment>
            <Container className="semua-peminjaman">
                <Typography variant="h5" sx={{mb : 3}}>
                    Data buku RBTI
                </Typography>
                <TextField
                    placeholder="Cari berdasarkan judul..."
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx = {{mb : 2}}
                    InputProps = {{
                        startAdornment : (
                            <InputAdornment sx={{mr: 2}}>
                                <SearchIcon></SearchIcon>
                            </InputAdornment>
                        ), 
                        endAdornment : (
                            <InputAdornment>
                                <IconButton
                                    onClick={handleSearch}
                                >
                                    <Typography>CARI</Typography>
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Box sx={{display : "flex", width : "100%"}}>
                    <TextField
                        value={selectedKategori}
                        sx={{width : "35%"}}
                        select
                        size= "small"
                        onChange={handleKategoriChange}
                        InputProps = {{
                            startAdornment : (
                                <InputAdornment sx={{marginRight : 2}}>
                                    <Typography>
                                        Kategori
                                    </Typography>
                                </InputAdornment>
                            ),
                        }}
                    >
                        {kategori.map((item) => (
                            <MenuItem key={item.id} value={item.id}> 
                                {item.kategori}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Stack direction="row" spacing={1} sx={{marginTop : 2}}>
                    {filterKategori.length > 0 ? filterKategori.map((item, idx) => (
                        <Chip label={item.kategori} key={item.id} value={item.id} onDelete={(e) => handleDeleteChip(e, idx)}/>
                    )) : null}
                </Stack>
                {/* <Box sx={{minHeight : 400}}>
                {buku.length > 0 ?<DataGrid
                    rows={buku}
                    columns={columns}
                    rowCount={10}
                    pageSize={5}
                    paginationMode="server"
                /> : null}
                </Box> */}
                {buku.length > 0 ? <SemuaBukuTable 
                    data={buku} 
                    handlePageBerubah = {handleChangePage} 
                    handleRowPerPage = {handleChangeRowsPerPage}
                    page = {page}
                    rowsPerPage = {rowsPerPage}
                >

                </SemuaBukuTable> : <Typography sx={{mt : 3}}>Tidak ada data untuk filter tersebut</Typography>}
            </Container>
            
        </React.Fragment>
    );
}
 
export default SemuaBuku;