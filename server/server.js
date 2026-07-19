const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const downloadRoute = require('./routes/download');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Downloader API is running');
});

app.use('/api', downloadRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});