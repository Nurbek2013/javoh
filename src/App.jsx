import React, { useState, useEffect } from 'react';
import './App.css';
import { Star, MessageSquare, TrendingUp, Film, Book, Headphones } from 'lucide-react';

function App() {
  // LocalStorage'dan ma'lumotlarni yuklash
  const loadFromStorage = () => {
    const saved = localStorage.getItem('mahsulotlar');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 1,
        nomi: "Ikki Eshik Orasi",
        turi: "Kino",
        tavsif: "O'zbek kinosining eng yaxshi drammalaridan biri",
        rasm: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=300&fit=crop",
        icon: Film,
        sharhlar: [
          { id: 1, ism: "Aziza", baho: 5, matn: "Ajoyib kino! Haqiqatan ta'm oldim.", sana: "2024-11-20" },
          { id: 2, ism: "Bekzod", baho: 4, matn: "Hikoyasi juda ta'sirli, aktyorlar zo'r o'ynagan.", sana: "2024-11-19" }
        ]
      },
      {
        id: 2,
        nomi: "O'tkan Kunlar",
        turi: "Kitob",
        tavsif: "Abdulla Qodiriyning mashhur romani",
        rasm: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=300&fit=crop",
        icon: Book,
        sharhlar: [
          { id: 1, ism: "Dilnoza", baho: 5, matn: "O'zbek adabiyotining durdonasi! Har bir sahifasi qimmatli.", sana: "2024-11-18" }
        ]
      },
      {
        id: 3,
        nomi: "Sevgi Qo'shiqlari",
        turi: "Musiqa Albomi",
        tavsif: "Eng yaxshi o'zbek sevgi qo'shiqlari to'plami",
        rasm: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
        icon: Headphones,
        sharhlar: []
      }
    ];
  };

  const [mahsulotlar, setMahsulotlar] = useState(loadFromStorage);
  const [tanlanganMahsulot, setTanlanganMahsulot] = useState(null);
  const [yangiSharh, setYangiSharh] = useState({ ism: '', baho: 5, matn: '' });

  // LocalStorage'ga saqlash
  useEffect(() => {
    // Icon funksiyalarini olib tashlash (localStorage JSON formatda saqlaydi)
    const saqlashUchun = mahsulotlar.map(m => ({
      ...m,
      icon: m.turi === 'Kino' ? 'Film' : m.turi === 'Kitob' ? 'Book' : 'Headphones'
    }));
    localStorage.setItem('mahsulotlar', JSON.stringify(saqlashUchun));
  }, [mahsulotlar]);

  // Icon'larni qayta tiklash
  useEffect(() => {
    const updatedMahsulotlar = mahsulotlar.map(m => ({
      ...m,
      icon: m.turi === 'Kino' ? Film : m.turi === 'Kitob' ? Book : Headphones
    }));
    setMahsulotlar(updatedMahsulotlar);
  }, []);

  const sharhQoshish = () => {
    if (!yangiSharh.ism || !yangiSharh.matn) {
      alert("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    const yangiSharhObyekt = {
      id: Date.now(),
      ism: yangiSharh.ism,
      baho: yangiSharh.baho,
      matn: yangiSharh.matn,
      sana: new Date().toISOString().split('T')[0]
    };

    const yangilangan = mahsulotlar.map(m => 
      m.id === tanlanganMahsulot.id 
        ? { ...m, sharhlar: [...m.sharhlar, yangiSharhObyekt] }
        : m
    );

    setMahsulotlar(yangilangan);

    const yangiTanlangan = yangilangan.find(m => m.id === tanlanganMahsulot.id);
    setTanlanganMahsulot(yangiTanlangan);

    setYangiSharh({ ism: '', baho: 5, matn: '' });
  };

  const ortachaBaho = (sharhlar) => {
    if (sharhlar.length === 0) return 0;
    const jami = sharhlar.reduce((sum, s) => sum + s.baho, 0);
    return (jami / sharhlar.length).toFixed(1);
  };

  const YulduzchalarKorsatish = ({ baho, hajm = 20 }) => (
    <div className="yulduzchalar">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={hajm}
          fill={i <= baho ? "#fbbf24" : "none"}
          stroke={i <= baho ? "#fbbf24" : "#d1d5db"}
          strokeWidth={2}
        />
      ))}
    </div>
  );

  if (tanlanganMahsulot) {
    const IconComponent = tanlanganMahsulot.icon;
    return (
      <div className="container">
        <div className="header">
          <button className="orqaga-btn" onClick={() => setTanlanganMahsulot(null)}>
            ← Orqaga
          </button>
          <h1 className="sarlavha">Sharh va Baho</h1>
        </div>

        <div className="mahsulot-detali">
          <div className="mahsulot-hero">
            <img src={tanlanganMahsulot.rasm} alt={tanlanganMahsulot.nomi} className="hero-rasm" />
            <div className="hero-overlay">
              <div className="hero-content">
                <div className="turi-badge">
                  <IconComponent size={16} />
                  <span>{tanlanganMahsulot.turi}</span>
                </div>
                <h2 className="mahsulot-nomi">{tanlanganMahsulot.nomi}</h2>
                <p className="mahsulot-tavsif">{tanlanganMahsulot.tavsif}</p>
                <div className="statistika">
                  <div className="stat-item">
                    <YulduzchalarKorsatish baho={Math.round(ortachaBaho(tanlanganMahsulot.sharhlar))} hajm={24} />
                    <span className="stat-raqam">{ortachaBaho(tanlanganMahsulot.sharhlar)}</span>
                  </div>
                  <div className="stat-item">
                    <MessageSquare size={20} />
                    <span className="stat-raqam">{tanlanganMahsulot.sharhlar.length} sharh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="content-wrapper">
            <div className="sharh-forma-card">
              <h3 className="forma-sarlavha">
                <TrendingUp size={20} />
                Sizning Fikringiz
              </h3>
              <div className="sharh-forma">
                <input
                  type="text"
                  placeholder="Ismingiz"
                  value={yangiSharh.ism}
                  onChange={(e) => setYangiSharh({ ...yangiSharh, ism: e.target.value })}
                  className="input-field"
                />
                
                <div className="baho-tanlash">
                  <label className="baho-label">Baho:</label>
                  <div className="yulduzcha-tanlash">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        size={32}
                        className="yulduzcha-btn"
                        fill={i <= yangiSharh.baho ? "#fbbf24" : "none"}
                        stroke={i <= yangiSharh.baho ? "#fbbf24" : "#9ca3af"}
                        strokeWidth={2}
                        onClick={() => setYangiSharh({ ...yangiSharh, baho: i })}
                      />
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Sharhingizni yozing..."
                  value={yangiSharh.matn}
                  onChange={(e) => setYangiSharh({ ...yangiSharh, matn: e.target.value })}
                  className="textarea-field"
                  rows="4"
                />
                
                <button onClick={sharhQoshish} className="yuborish-btn">
                  Sharh Qo'shish
                </button>
              </div>
            </div>

            <div className="sharhlar-section">
              <h3 className="sharhlar-sarlavha">
                Barcha Sharhlar ({tanlanganMahsulot.sharhlar.length})
              </h3>
              {tanlanganMahsulot.sharhlar.length === 0 ? (
                <div className="bosh-sharh">
                  <MessageSquare size={48} />
                  <p>Hali sharhlar yo'q. Birinchi bo'lib sharh qoldiring!</p>
                </div>
              ) : (
                <div className="sharhlar-list">
                  {tanlanganMahsulot.sharhlar.map(sharh => (
                    <div key={sharh.id} className="sharh-card">
                      <div className="sharh-header">
                        <div className="sharh-avatar">{sharh.ism[0].toUpperCase()}</div>
                        <div className="sharh-info">
                          <h4 className="sharh-ism">{sharh.ism}</h4>
                          <p className="sharh-sana">{sharh.sana}</p>
                        </div>
                        <YulduzchalarKorsatish baho={sharh.baho} hajm={16} />
                      </div>
                      <p className="sharh-matn">{sharh.matn}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="sarlavha">Mahsulot Sharhlari</h1>
        <p className="tagline">Eng yaxshi kino, kitob va musiqa to'plamlari haqida fikr bildiring</p>
      </div>

      <div className="mahsulotlar-grid">
        {mahsulotlar.map(mahsulot => {
          const IconComponent = mahsulot.icon;
          return (
            <div
              key={mahsulot.id}
              className="mahsulot-card"
              onClick={() => setTanlanganMahsulot(mahsulot)}
            >
              <div className="card-rasm-wrapper">
                <img src={mahsulot.rasm} alt={mahsulot.nomi} className="card-rasm" />
                <div className="card-overlay">
                  <div className="turi-badge">
                    <IconComponent size={14} />
                    <span>{mahsulot.turi}</span>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <h3 className="card-nomi">{mahsulot.nomi}</h3>
                <p className="card-tavsif">{mahsulot.tavsif}</p>
                <div className="card-footer">
                  <YulduzchalarKorsatish baho={Math.round(ortachaBaho(mahsulot.sharhlar))} hajm={16} />
                  <span className="sharh-soni">
                    {mahsulot.sharhlar.length} sharh
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;