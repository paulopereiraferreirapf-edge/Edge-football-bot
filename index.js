const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.TELEGRAM_TOKEN;
const apiKey = process.env.API_FOOTBALL_KEY;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/scan/, async (msg) => {
    const chatId = msg.chat.id;

    try {
        const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
            headers: {
                'x-apisports-key': apiKey
            },
            params: {
                date: new Date().toISOString().split('T')[0],
                timezone: 'Europe/Lisbon',
                status: 'NS'
            }
        });

        const games = response.data.response;

        if (games.length === 0) {
            bot.sendMessage(chatId, "🔴 DIA VERMELHO — Sem jogos válidos hoje.");
            return;
        }

        bot.sendMessage(chatId, `🟢 Jogos encontrados hoje: ${games.length}`);
    } catch (error) {
        bot.sendMessage(chatId, "❌ Erro ao ligar à API.");
        console.log(error.response?.data || error.message);
    }
});
