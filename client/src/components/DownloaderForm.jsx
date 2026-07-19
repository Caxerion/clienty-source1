import { useState, useEffect } from 'react';
import { useDownloader } from '../hooks/useDownloader';

const qualities = {
  mp4: ['1080p', '720p', '480p', '360p'],
  mp3: ['320 kbps', '192 kbps', '128 kbps'],
};

function detectSource(url) {
  const u = url.toLowerCase();
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'YouTube';
  if (u.includes('tiktok.com')) return 'TikTok';
  if (u.includes('instagram.com')) return 'Instagram';
  if (u.trim() === '') return '';
  return 'Unrecognized';
}

export default function DownloaderForm() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('1080p');
  const [validationError, setValidationError] = useState('');
  const [refNumber, setRefNumber] = useState(() => Math.floor(100000 + Math.random() * 899999));

  const { handleDownload, loading, error, result } = useDownloader();

  const source = detectSource(url);

  // Generate a new stub number ONCE per new result, not on every render
  useEffect(() => {
    if (result) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRefNumber(Math.floor(100000 + Math.random() * 899999));
    }
  }, [result]);

  function handleFormatChange(fmt) {
    setFormat(fmt);
    setQuality(qualities[fmt][0]);
  }

  function onSubmit() {
    setValidationError('');
    if (!url.trim()) {
      setValidationError('Enter a URL before submitting a declaration.');
      return;
    }
    try {
      new URL(url);
    } catch {
      setValidationError("That doesn't look like a valid URL.");
      return;
    }
    handleDownload(url, format, quality);
  }

  return (
    <div className="form-card">
      <label className="field-label" htmlFor="url-input">Source URL</label>
      <div className="url-row">
        <input
          id="url-input"
          type="text"
          placeholder="eg. https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />
        <div className={`src-tag ${source ? 'show' : ''}`}>{source || '—'}</div>
      </div>

      <div className="row">
        <div className="col">
          <label className="field-label">Format</label>
          <div className="toggle-pair" role="group" aria-label="Output format">
            <button
              type="button"
              className={`fmt-btn ${format === 'mp4' ? 'active' : ''}`}
              onClick={() => handleFormatChange('mp4')}
            >
              MP4 · Video
            </button>
            <button
              type="button"
              className={`fmt-btn ${format === 'mp3' ? 'active' : ''}`}
              onClick={() => handleFormatChange('mp3')}
            >
              MP3 · Audio
            </button>
          </div>
        </div>
        <div className="col">
          <label className="field-label" htmlFor="quality-select">Quality</label>
          <select
            id="quality-select"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          >
            {qualities[format].map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>
      </div>

      <button className="process-btn" onClick={onSubmit} disabled={loading}>
        {loading ? 'Processing…' : 'Process declaration →'}
      </button>

      {(validationError || error) && (
        <div className="error-msg">{validationError || error}</div>
      )}

      {loading && (
        <div className="processing show">
          <div className="stamp-spin"></div>
          <span>Inspecting link…</span>
        </div>
      )}

      {result && !loading && (
        <div className="stub-wrap show">
          <div className="stub">
            <div className="stub-top">
              <div className="stub-eyebrow">
                <span>Source: {source}</span>
                <span>#{refNumber}</span>
              </div>
              <h2 className="stub-title">{result.filename}</h2>
              <div className="stub-meta">
                <div><span className="k">Format</span><span className="v">{result.format.toUpperCase()}</span></div>
                <div><span className="k">Quality</span><span className="v">{result.quality}</span></div>
              </div>
            </div>
            <div className="perforation"></div>
            <div className="stub-bottom">
              <a className="download-btn" href={result.downloadUrl} download={result.filename}>
                Download again
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}