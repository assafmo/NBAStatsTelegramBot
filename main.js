const path = require('path');
const request = require('request');
const Twitter = require('twitter');

const debug = process.argv[2] === 'debug';
let config;
if (debug) {
    config = require(path.join(__dirname, `config_debug.json`));
}
else {
    config = require(path.join(__dirname, `config.json`));
}

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

twitterClient.stream('statuses/filter', { follow: twitterAccountIDToFollow }, function (stream) {
    console.log('ok.');

    stream.on('data', handleTweet);

    stream.on('error', function (error) {
        console.error(JSON.stringify(error, null, 4));
        process.exit(1);
    });
});

function handleTweet(tweet) {
    if (!tweet.user)
        return;
    if (tweet.user.id != twitterAccountIDToFollow)
        return;

    const tweetPromise = tweet.truncated ?
        new Promise(resolve =>
            twitterClient.get(`https://api.twitter.com/1.1/statuses/show/${tweet.id_str}`, { tweet_mode: 'extended' }, (err, extendedTweet) => {
                extendedTweet.text = extendedTweet.full_text;
                resolve(extendedTweet);
            })) : Promise.resolve(tweet);

    Promise.all([tweetPromise, keywordsPromise])
        .then(tweetAndkeywordsLower => {
            const [tweet, keywordsLower] = tweetAndkeywordsLower;

            const tweetTextLower = tweet.text.toLowerCase().replace(/\n/g, '');
            let isNbaRelated = false;
            for (let keyword of keywordsLower) {
                if (tweetTextLower.includes(keyword)) {
                    isNbaRelated = true;
                    console.log(tweet.id_str, "keyword:", keyword);
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
            console.log(tweet.id_str, "text:", tweet.text);
        });
}

if (debug) {
    twitterClient.get('https://api.twitter.com/1.1/statuses/show/840679980883308544', (err, tweet) => {
        handleTweet(tweet);
    });
}