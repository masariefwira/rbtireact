import './App.css';
import Home from './components/Homepage/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import InputBuku from './components/InputBuku/InputBuku';
import NavigationBar from './components/NavigationBar/NavigationBar';
import InputPeminjaman from './components/InputPeminjaman/InputPeminjaman';
import PengembalianBuku from './components/PengembalianBuku/PengembalianBuku';
import SemuaPeminjaman from './components/SemuaPeminjaman/SemuaPeminjaman';
import SemuaBuku from './components/SemuaBuku/SemuaBuku';
import DetailBuku from './components/DetailBuku/DetailBuku';


function App() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/input-buku" element={<InputBuku />} />
        <Route path="/input-peminjaman" element={<InputPeminjaman />} />
        <Route path="/pengembalian-buku" element={<PengembalianBuku />} />
        <Route path="/semua-peminjaman" element={<SemuaPeminjaman />} />
        <Route path="/semua-buku" element={<SemuaBuku />} />
        <Route path="/detail-buku/:id" element={<DetailBuku />} />
      </Routes>
    </Router>
  );
}

export default App;
