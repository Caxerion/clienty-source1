# clienty

A media downloader for YouTube, TikTok, and Instagram. Paste a link, pick a format (MP4 or MP3) and quality, and clienty fetches and converts it for you.

Built as a full-stack project: React frontend, Express API, and a Python + yt-dlp/ffmpeg backend pipeline for the actual media processing.

## Features

- Download video (MP4) or audio-only (MP3) from YouTube, TikTok, and Instagram
- Quality selection (up to 1080p for video, up to 320kbps for audio)
- Clean "customs declaration" themed UI
- No database, no accounts — fully stateless, paste-link-and-go

## Tech Stack

**Frontend**
- React + Vite
- Plain CSS/CSS3 (Space Mono + Fraunces fonts)

**Backend**
- Node.js + Express
- Python 3 + [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- FFmpeg (audio/video merging and encoding)
- Deno (JS runtime yt-dlp uses to solve YouTube's PO token challenge)

## Architecture

```
React (UI) ──POST /api/download──▶ Express ──spawns──▶ Python script
                                                              │
                                                        yt-dlp + ffmpeg
                                                              │
                                                    downloads & converts file
                                                              │
                                       ◀── streams file back ─┘
```

Express doesn't do any media processing itself — it just orchestrates the Python script, waits for it to finish, finds the output file, sends it back to the client, then deletes the temp file.

> Note: `client`/`server` here refer to the folder names in this repo — earlier versions of this project used `frontend`/`backend`, but the code itself doesn't hardcode either name (all paths are relative), so the rename required no code changes.

## Requirements

Make sure these are installed and available on your system `PATH` before running:

- [Node.js](https://nodejs.org/) (v18+)
- [Python 3](https://www.python.org/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) — `pip install yt-dlp`
- [FFmpeg](https://ffmpeg.org/) — needed to merge video/audio streams and convert to MP3
- [Deno](https://deno.com/) — required by yt-dlp for YouTube extraction (JS challenge solving)

Verify each is working:
```bash
node -v
python3 --version
ffmpeg -version
deno --version
```

## Project Structure

```
clienty/
├── server/          # Express API + Python/yt-dlp processing
│   ├── server.js
│   ├── routes/
│   ├── scripts/
│   └── temp/        # temp downloads, cleaned up after each request
└── client/          # React frontend (Vite)
    └── src/
```

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/Caxerion/clienty.git
cd clienty
```

### 2. Server
```bash
cd server
npm install
pip install yt-dlp --break-system-packages   # or without the flag, depending on your setup
node server.js
```
Server runs on `http://localhost:3000`.

### 3. Client
```bash
cd client
npm install
npm run dev
```
Client runs on `http://localhost:5173`.

Open `http://localhost:5173` in your browser to use the app.

## API

### `POST /api/download`

Downloads and converts a video/audio file, returning it as a binary file response.

**Request body:**
```json
{
  "url": "https://www.youtube.com/watch?v=...",
  "format": "mp4",
  "quality": "1080p"
}
```

| Field | Type | Values |
|---|---|---|
| `url` | string | Any supported YouTube, TikTok, or Instagram link |
| `format` | string | `"mp4"` or `"mp3"` |
| `quality` | string | `"1080p"`, `"720p"`, `"480p"`, `"360p"` (mp4) or `"320 kbps"`, `"192 kbps"`, `"128 kbps"` (mp3) |

**Response:** binary file stream (`Content-Disposition: attachment`) on success, or a JSON error object on failure.

## Known Limitations

- No progress indicator during processing — the request blocks until the file is fully downloaded and converted
- No input validation for unsupported platforms yet — invalid URLs will just fail on the Python side
- Instagram content may occasionally require authentication (cookies) depending on the post
- No persistence — nothing is saved between requests; temp files are deleted immediately after being sent

## License

Personal / educational project. Not affiliated with YouTube, TikTok, Instagram, or yt-dlp.
