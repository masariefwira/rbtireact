import './App.css';
import Home from './components/Homepage/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeCustomContext } from './util/theme-context';
import { useThemeCustom } from './util/theme-hook';
import NavigationBar from './components/NavigationBar/NavigationBar';
import InputPeminjaman from './components/InputPeminjaman/InputPeminjaman';
import PengembalianBuku from './components/PengembalianBuku/PengembalianBuku';
import SemuaPeminjaman from './components/SemuaPeminjaman/SemuaPeminjaman';
import SemuaBuku from './components/SemuaBuku/SemuaBuku';
import DetailBuku from './components/DetailBuku/DetailBuku';
import DetailLaporan from './components/DetailBuku/DetailLaporan';
import InputMenu from './components/InputBuku/InputMenu';
import InputMahasiswa from './components/InputMahasiswa/InputMahasiswa';
import EditBuku from './components/EditBuku/EditBuku';

function App() {
  const { showImage, changeShowImage } = useThemeCustom();

  return (
    <ThemeCustomContext.Provider
      value={{
        showImage,
        changeShowImage,
      }}
    >
      <Router>
        {showImage ? (
          <div className="img-cover">
            <div className="img-cover-overlay"></div>
            <img src="https://risetcdn.jatimtimes.com/images/2020/03/14/Tanggapi-Isu-Suspect-Corona-UB-Isolasi-dan-Sterilisasi-Gedung-Teknik-Industri5461b4a973fde1c4.jpg" />
          </div>
        ) : null}
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/input-buku" element={<InputMenu />} />
          <Route path="/input-peminjaman" element={<InputPeminjaman />} />
          <Route path="/pengembalian-buku" element={<PengembalianBuku />} />
          <Route path="/semua-peminjaman" element={<SemuaPeminjaman />} />
          <Route path="/semua-buku" element={<SemuaBuku />} />
          <Route path="/detail-buku/:id" element={<DetailBuku />} />
          <Route path="/input-mahasiswa" element={<InputMahasiswa />} />
          <Route
            path="/detail-laporan/:jenis/:id"
            element={<DetailLaporan />}
          />
          <Route path="/edit-buku/:id" element={<EditBuku />} />
        </Routes>
      </Router>
    </ThemeCustomContext.Provider>
  );
}

export default App;
