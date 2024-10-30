import './App.css';

import React, {
  useEffect,
  useState,
} from 'react';

import Spinner from './Spinner';

const API_BASE_URL = 'https://api.quran.gading.dev';

export function App() {
  const [allSurah, setAllSurah] = useState([]);
  const [currentSurah, setCurrentSurah] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurahList();
  }, []);

  const fetchSurahList = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/surah`);
      const result = await response.json();
      if (result.code === 200 && result.status === "OK.") {
        setAllSurah(result.data);
      } else {
        console.error('Error fetching Surah list:', result.message);
      }
    } catch (error) {
      console.error('Error fetching Surah list:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurah = async (surahNumber) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}`);
      const result = await response.json();
      if (result.code === 200 && result.status === "OK.") {
        setCurrentSurah(result.data);
        if (window.innerWidth <= 768) {
          setIsModalOpen(true);
        }
      } else {
        console.error('Error fetching Surah:', result.message);
      }
    } catch (error) {
      console.error('Error fetching Surah:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSurah = allSurah.filter(surah =>
    surah.name.transliteration.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.name.translation.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSurahColor = (index) => {
    const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100', 'bg-purple-100'];
    return colors[index % colors.length];
  };

  return (
    <div className="App bg-gray-100 text-gray-900">
      <header className="bg-green-600 p-4 text-white header-fixed">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Al-Quran Digital</h1>
          <input
            type="text"
            id="search-input"
            placeholder="Cari surat..."
            className="p-2 rounded w-full max-w-xs bg-transparent text-white"
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="container mx-auto my-8 p-4">
        {loading ? (
          <Spinner />
        ) : (
          <div className="flex flex-col lg:flex-row">
            <aside className="w-full lg:w-1/4 bg-white shadow-lg p-4 rounded mb-4 lg:mb-0 lg:mr-4 lg:mt-10">
              <h2 className="text-lg font-semibold mb-4 mt-10">Daftar Surat</h2>
              <ul className="space-y-2">
                {filteredSurah.map((surah, index) => (
                  <li
                    key={surah.number}
                    className={`cursor-pointer p-4 rounded-lg shadow-md ${getSurahColor(index)}`}
                    onClick={() => fetchSurah(surah.number)}
                  >
                    <p className="text-lg font-bold">{surah.number}. {surah.name.transliteration.id}</p>
                    <p className="text-sm text-gray-600">{surah.name.translation.id}</p>
                  </li>
                ))}
              </ul>
            </aside>
            <section className="w-full lg:w-3/4 bg-white shadow-lg p-4 rounded lg:mt-10">
              <h2 className="text-lg font-semibold">
                {currentSurah ? `${currentSurah.name.transliteration.id} - ${currentSurah.name.translation.id}` : 'Pilih Surat untuk melihat isinya'}
              </h2>
              {currentSurah && (
                <div className="space-y-4">
                  {currentSurah.verses.map((ayah) => (
                    <div key={ayah.number.inSurah} className="p-4 bg-gray-100 rounded shadow-sm mb-2">
                      <p className="text-right text-xl mb-2">
                        {ayah.number.inSurah}. <span className="arabic-text">{ayah.text.arab}</span>
                      </p>
                      <p className="text-sm text-gray-600">{ayah.translation.id}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white w-11/12 max-w-lg rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">Ayat Al-Quran</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <div className="max-h-80 overflow-y-auto p-4">
              {currentSurah.verses.map((ayah) => (
                <div key={ayah.number.inSurah} className="p-4 bg-gray-100 rounded shadow-sm mb-2">
                  <p className="text-right text-xl mb-2">
                    {ayah.number.inSurah}. <span className="arabic-text">{ayah.text.arab}</span>
                  </p>
                  <p className="text-sm text-gray-600">{ayah.translation.id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-200 p-6 text-center border-t">
        <p className="text-sm mb-2">
          Sumber API dari{' '}
          <a href="https://github.com/gadingnst/quran-api" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Gading Dev
          </a>
        </p>
        <div className="flex items-center justify-center space-x-2">
          <p className="text-sm font-medium text-gray-700">Dibuat oleh Gugun Gunawan, S.Kom</p>
        </div>
      </footer>

    </div>
  );
}

export default App;

