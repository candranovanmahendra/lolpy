const { Telegraf } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Ganti dengan token bot kamu dari BotFather
const BOT_TOKEN = '7666486780:AAHFXF-elXqS_-25F8tw9RAXSXSU2NdBl2A';
const bot = new Telegraf(BOT_TOKEN);

// Server URL (Vercel domain kamu)
const SERVER_URL = 'https://tme-telegram.vercel.app'; // Ganti dengan URL Vercel kamu

// Data untuk menyimpan link pengguna (seharusnya diganti dengan database untuk skala besar)
const users = {};

// Perintah /start
bot.start((ctx) => {
  const chatId = ctx.chat.id;

  // Generate link unik untuk pengguna
  const uniqueId = crypto.randomBytes(8).toString('hex');
  const userLink = `${SERVER_URL}/upload/${uniqueId}`;
  users[uniqueId] = { chatId };

  // Kirim link ke pengguna
  ctx.reply(`Halo, klik link ini untuk mengunggah foto dari webcam:\n${userLink}`);
});

// Jalankan bot
bot.launch();
console.log('Bot Telegram berjalan...');

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
