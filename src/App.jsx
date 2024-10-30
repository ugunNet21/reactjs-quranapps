import './App.css';

import React, {
  useEffect,
  useState,
} from 'react';

const API_BASE_URL = 'https://api.quran.gading.dev';

export function App() {
  const [allSurah, setAllSurah] = useState([]);
  const [currentSurah, setCurrentSurah] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSurahList();
  }, []);

  const fetchSurahList = async () => {
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
    }
  };

  const fetchSurah = async (surahNumber) => {
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
    }
  };

  const filteredSurah = allSurah.filter(surah =>
    surah.name.transliteration.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.name.translation.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App bg-gray-100 text-gray-900">
      <header className="bg-green-600 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Al-Quran Digital</h1>
          <input
            type="text"
            id="search-input" // Ensure this ID matches the CSS
            placeholder="Cari surat..."
            className="p-2 rounded w-full max-w-xs bg-transparent text-white"
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="container mx-auto my-8 p-4">
        <div className="flex flex-col lg:flex-row">
          <aside className="w-full lg:w-1/4 bg-white shadow-lg p-4 rounded mb-4 lg:mb-0 lg:mr-4">
            <h2 className="text-lg font-semibold mb-4">Daftar Surat</h2>
            <ul className="space-y-2">
              {filteredSurah.map(surah => (
                <li
                  key={surah.number}
                  className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                  onClick={() => fetchSurah(surah.number)}
                >
                  {surah.number}. {surah.name.transliteration.id}
                </li>
              ))}
            </ul>
          </aside>
          <section className="w-full lg:w-3/4 bg-white shadow-lg p-4 rounded">
            <h2 className="text-lg font-semibold">
              {currentSurah ? `${currentSurah.name.transliteration.id} - ${currentSurah.name.translation.id}` : 'Pilih Surat untuk melihat isinya'}
            </h2>
            {currentSurah && (
              <div className="space-y-4">
                {currentSurah.verses.map(ayah => (
                  <div key={ayah.number.inSurah} className="p-4 bg-gray-100 rounded shadow-sm mb-2">
                    <p className="text-right font-semibold text-xl mb-2">{ayah.number.inSurah}. {ayah.text.arab}</p>
                    <p className="text-sm text-gray-600">{ayah.translation.id}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white w-11/12 max-w-2xl rounded-lg shadow-lg overflow-y-auto p-6">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">Ayat Al-Quran</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
            </div>
            <div className="mt-4 space-y-4">
              {currentSurah?.verses.map(ayah => (
                <div key={ayah.number.inSurah} className="p-4 bg-gray-100 rounded shadow-sm mb-2">
                  <p className="text-right font-semibold text-xl mb-2">{ayah.number.inSurah}. {ayah.text.arab}</p>
                  <p className="text-sm text-gray-600">{ayah.translation.id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <footer className="bg-gray-200 p-4 text-center">
        <p className="text-sm">Sumber API dari <a href="https://github.com/gadingnst/quran-api" className="text-blue-600" target="_blank" rel="noopener noreferrer">Gading Dev</a></p>
      </footer>
    </div>
  );
}

export default App;
