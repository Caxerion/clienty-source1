import { useState } from 'react'
import DownloaderForm from './components/DownloaderForm'
import './App.css'

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="sheet">
      <div className="letterhead">
        <div className="mark">
          <span>Clienty</span>
        </div>
        <div className="menu-wrap">
          <button className="option-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span></span>
            <span></span>
            <span></span> 
          </button>

          <div className={`menu-dropdown ${menuOpen ? 'open' : ''}`}>
            <button className="menu-item" onClick={() => { setMenuOpen(false); }}>
              <i class="fa-brands fa-github"></i> Repository
            </button>
            <button className="menu-item" onClick={() => { setMenuOpen(false); }}>
              Option Two
            </button>
          </div>
        </div>
      </div>

      <h1>clienty downloader,<br />declare it and fetch.</h1>
      <p className="parara">
        Paste a video URL, choose what you want out of it, clienty will fetch convert it from.
      </p>

      <DownloaderForm />

      <footer>clienty real convsersation with cli and yt-dlp</footer>
    </div>
  );
}