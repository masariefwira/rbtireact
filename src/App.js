import './App.css';
import Home from './components/Homepage/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import NavigationBar from './components/NavigationBar/NavigationBar';
import InputPeminjaman from './components/InputPeminjaman/InputPeminjaman';
import PengembalianBuku from './components/PengembalianBuku/PengembalianBuku';
import SemuaPeminjaman from './components/SemuaPeminjaman/SemuaPeminjaman';
import SemuaBuku from './components/SemuaBuku/SemuaBuku';
import DetailBuku from './components/DetailBuku/DetailBuku';
import DetailLaporan from './components/DetailBuku/DetailLaporan';
import InputMenu from './components/InputBuku/InputMenu';

function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input-buku" element={<InputMenu />} />
        <Route path="/input-peminjaman" element={<InputPeminjaman />} />
        <Route path="/pengembalian-buku" element={<PengembalianBuku />} />
        <Route path="/semua-peminjaman" element={<SemuaPeminjaman />} />
        <Route path="/semua-buku" element={<SemuaBuku />} />
        <Route path="/detail-buku/:id" element={<DetailBuku />} />
        <Route path="/detail-laporan/:jenis/:id" element={<DetailLaporan />} />
      </Routes>
    </Router>
  );
}

export default App;
