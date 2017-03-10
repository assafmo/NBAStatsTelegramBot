const path = require('path');
const request = require('request');
const Twitter = require('twitter');

const config = require(path.join(__dirname, 'config.json'));

const TwitterAccountIDToFollow = config.twitter.account_id_to_follow;
const telegramBotUrl = `https://api.telegram.org/bot${config.telegram.bot_key}`;
const telegramChatID = config.telegram.chat_id;

const twitterClient = new Twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

const keywords = Promise.all(require('fs')
    .readdirSync(path.join(__dirname, '/keywords'))
    .map(f => require(path.join(__dirname, '/keywords', f)))
)
    .then(keywordsArrays => keywordsArrays
        .reduce((x, y) => x.concat(y), [])
        .map(keyword => keyword.toLowerCase()));

twitterClient.stream('statuses/filter', { follow: TwitterAccountIDToFollow }, function (stream) {
    stream.on('data', function (tweet) {
        if (!tweet.user || tweet.user.id != TwitterAccountIDToFollow)
            return;

        keywords.then(keywords => {
            const lowerTweetText = tweet.text.toLowerCase().replace(/\n/g, '');
            for (let keyword of keywords) {
                if (lowerTweetText.includes(keyword)) {
                    const photo = tweet.entities &&
                        tweet.entities.media &&
                        tweet.entities.media.filter(m => m.type == 'photo')[0];
                    const url = `${telegramBotUrl}/${photo ? 'sendPhoto' : 'sendMessage'}`;
                    const form = Object.assign(
                        { chat_id: telegramChatID },
                        photo ? { photo: photo.media_url_https, caption: tweet.text } : { text: tweet.text }
                    );

                    request.post({ url: url, form: form });
                    console.log(tweet.text);
                    return;
                }
            }
        });
    });

    stream.on('error', function (error) {
        console.error(error);
        process.exit(1);
    });
});