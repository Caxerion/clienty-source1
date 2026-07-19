const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { randomUUID } = require('crypto');

router.post('/download', (req, res) => {
  const { url, format, quality } = req.body; // format: "mp4" | "mp3"

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  const jobId = randomUUID();
  const outputDir = path.join(__dirname, '..', 'temp');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputTemplate = path.join(outputDir, `${jobId}.%(ext)s`);

  const py = spawn('python', [
    path.join(__dirname, '..', 'scripts', 'downloader.py'),
    url,
    format || 'mp4',
    quality || 'best',
    outputTemplate
  ]);

  let stderrData = '';

  py.stderr.on('data', (data) => {
    stderrData += data.toString();
  });

  py.on('close', (code) => {
    if (code !== 0) {
      console.error(stderrData);
      return res.status(500).json({ error: 'Conversion failed' });
    }

    const files = fs.readdirSync(outputDir).filter(f => f.startsWith(jobId));

    if (files.length === 0) {
      return res.status(500).json({ error: 'Output file not found' });
    }

    const filePath = path.join(outputDir, files[0]);

    res.download(filePath, files[0], (err) => {
      if (err) console.error('Send error', err);
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error(unlinkErr);
      });
    });
  });
});

module.exports = router;