var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');

const token = '618131689:AAHZfHfbFHCNIMawY0Au5CZfDPTOf1tL720';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1]; 
  bot.sendMessage(chatId, resp);
});
 

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log(msg.text);

  request('https://www.imdb.com/chart/moviemeter', function(err, res, body){
    if (err)console.log('Erro: '+ err);

    var $ = cheerio.load(body);

    $('.lister-list tr').each(function(){
        var title = $(this).find('.titleColumn a').text().trim();
        var rating = $(this).find('.imdbRating strong').text().trim();

        //console.log('Titulo: '+ title + ' | Nota: '+ rating);
        bot.sendMessage(chatId, 'Titulo: '+ title + ' | Nota: '+ rating);

        if (!fs.existsSync('imdb.txt')) { console.log('Found file'); }

        fs.appendFile('imdb.txt', ' -- Titulo: '+ title + ' | Nota: '+ rating +'\r\n', (err) => {
            if (err) throw err;
        });
    });

});
 
  bot.sendMessage(chatId, 'Received your message');
});

