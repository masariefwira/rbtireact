import { Container, Divider, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import "./DetailBuku.css"
import TabelDetailBuku from './TabelDetailBuku';
import TabelJumlahBuku from './TabelJumlahBuku';


const DetailBuku = (props) => {
    const [detailBuku, setDetailBuku] = useState({})
    const [loading, isLoading] = useState(true)

    const url = process.env.REACT_APP_URL + "/api/buku"
    const params = useParams()
    console.log(params?.id)

    useEffect(() => {
        const requestBody = {
            "limit" : 1,
            "id_judul" : parseInt(params?.id),
            // "offset" : 0,
            // "judul" : "",
            // "penulis" : "",
            // "kategori" : [],
            // "jenis" : []
        }
        console.log(requestBody)
        fetch(url, {
            method : "POST",
            body : JSON.stringify(requestBody)
        }).then(res => res.json()).then(res => {
            let data = [...res["data"]]
            setDetailBuku(data[0]?.judul)
            isLoading(false)
        })
    }, [])
    console.log(detailBuku)
    return (
        <Container className="detail-buku">
            <Typography variant="h5">
                Detail Buku
            </Typography>
            <Divider/>
            <div className="detail-buku-content">
                <Typography variant="h4">
                    {detailBuku.judul}
                </Typography>
                <TabelDetailBuku detailBuku = {detailBuku}></TabelDetailBuku>
            </div>
            <div className="detail-buku-jumlah">
                <Typography variant="h5">
                    Jumlah Buku
                </Typography>
                <Divider/>

                {"detail_buku" in detailBuku ? <TabelJumlahBuku detailBuku={detailBuku}/> : null}
            </div>
        </Container>
    );
}
 
export default DetailBuku;