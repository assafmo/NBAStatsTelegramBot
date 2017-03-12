const path = require('path');
const request = require('request');
const Twitter = require('twitter');

const debug = true;
const config = require(path.join(__dirname, `config${debug ? '_test' : ''}.json`));

const twitterAccountIDToFollow = config.twitter.account_id_to_follow;
const telegramBotUrl = `https://api.telegram.org/bot${config.telegram.bot_key}`;
const telegramChatID = config.telegram.chat_id;

const twitterClient = new Twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

const keywordsFiles = require('fs').readdirSync(path.join(__dirname, '/keywords'));
const keywordsPromieses = keywordsFiles.map(f => require(path.join(__dirname, '/keywords', f)));
const keywordsPromise = Promise.all(keywordsPromieses)
    .then(keywordsArrays =>
        keywordsArrays
            .reduce((x, y) => x.concat(y), [])
            .map(keyword => keyword.toLowerCase()));

const followData = debug ?
    { track: 'nba' } :
    { follow: twitterAccountIDToFollow };

twitterClient.stream('statuses/filter', followData, function (stream) {
    stream.on('data', function (tweet) {
        if (!debug) {
            if (!tweet.user)
                return;
            if (tweet.user.id != twitterAccountIDToFollow)
                return;
        }

        keywordsPromise.then(keywordsLower => {
            const tweetTextLower = tweet.text.toLowerCase().replace(/\n/g, '');
            let isNbaRelated = true;
            for (let keyword of keywordsLower) {
                if (tweetTextLower.includes(keyword)) {
                    isNbaRelated = true;
                    break;
                }
            }

            if (!isNbaRelated)
                return;

            const photo = tweet.entities &&
                tweet.entities.media &&
                tweet.entities.media.length &&
                tweet.entities.media.filter(m => m.type == 'photo')[0];

            let telegramMessageUrl, telegranMessageData;
            if (photo) {
                telegramMessageUrl = `${telegramBotUrl}/sendPhoto`;
                telegranMessageData = {
                    chat_id: telegramChatID,
                    photo: photo.display_url || photo.media_url_https || photo.media_url,
                    caption: tweet.text
                };
            }
            else {
                telegramMessageUrl = `${telegramBotUrl}/sendMessage`;
                telegranMessageData = {
                    chat_id: telegramChatID,
                    text: tweet.text,
                    disable_web_page_preview: true
                };
            }

            request.post({
                url: telegramMessageUrl,
                form: telegranMessageData
            });
            console.log(tweet.text);
        });
    });

    stream.on('error', function (error) {
        console.error(error);
        process.exit(1);
    });
});

