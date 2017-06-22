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

const keywordsFiles = require('fs').readdirSync(path.join(__dirname, 'keywords'));
const keywordsPromieses = keywordsFiles.map(f => require(path.join(__dirname, 'keywords', f)));
const keywordsPromise = Promise.all(keywordsPromieses)
    .then(keywordsArrays =>
        keywordsArrays
            .reduce((x, y) => x.concat(y), []));

const blacklistFiles = require('fs').readdirSync(path.join(__dirname, 'keywords_blacklist'));
const blacklistPromieses = blacklistFiles.map(f => require(path.join(__dirname, 'keywords_blacklist', f)));
const blacklistPromise = Promise.all(blacklistPromieses)
    .then(blacklistArrays =>
        blacklistArrays
            .reduce((x, y) => x.concat(y), []));

twitterClient.stream('statuses/filter', { follow: twitterAccountIDToFollow }, function (stream) {
    console.log('ok.');

    stream.on('data', handleTweet);

    stream.on('error', function (error) {
        console.log(error);
        process.exit(1);
    });
});

let lastTweetId;
function handleTweet(tweet) {
    if (!tweet.user)
        return;
    if (tweet.user.id != twitterAccountIDToFollow)
        return;

    if (typeof tweet.retweeted_status == 'object')
        tweet = tweet.retweeted_status;

    const tweetPromise = new Promise(resolve =>
        twitterClient.get(`https://api.twitter.com/1.1/statuses/show/${tweet.id_str}`, { tweet_mode: 'extended' }, (err, extendedTweet) => {
            extendedTweet.text = extendedTweet.full_text;
            resolve(extendedTweet);
        }));

    Promise.all([tweetPromise, keywordsPromise, blacklistPromise])
        .then(tweetKeywordsBlacklist => {
            const [tweet, keywords, blacklist] = tweetKeywordsBlacklist;

            const tweetText = tweet.text.replace(/\n/g, '');
            let isNbaRelated = false;
            let foundKeywords = [];
            for (let keyword of keywords) {
                if (tweetText.includes(keyword)) {
                    foundKeywords.push(keyword);
                }
            }

            foundKeywords = foundKeywords.filter(keyword => {
                for (let entry of blacklist) {
                    if (entry.is_accepted_because == keyword && tweetText.includes(entry.blacklist)) {
                        console.log(tweet.id_str, "blacklist found:", entry.blacklist);
                        return false;
                    }
                }
                return true;
            });

            if (foundKeywords.length > 0)
                isNbaRelated = true;

            if (!isNbaRelated)
                return;
            if (tweet.id_str == lastTweetId) {
                console.log(tweet.id_str, "DUPLICATED!");
                return;
            }
            lastTweetId = tweet.id_str;

            console.log(tweet.id_str, "keywords:", foundKeywords.join(','));

            const photos = tweet.extended_entities &&
                tweet.extended_entities.media &&
                tweet.extended_entities.media.length &&
                tweet.extended_entities.media.filter(m => m.type == 'photo');

            let finalText = tweet.text
                .replace(/&amp;/g, `&`)
                .replace(/&gt;/g, `>`)
                .replace(/&lt;/g, `<`)
                .replace(/&quot;/g, `"`)
                .replace(/&apos;/g, `'`)
                .replace(/&cent;/g, `¢`)
                .replace(/&pound;/g, `£`)
                .replace(/&yen;/g, `¥`)
                .replace(/&euro;/g, `€`)
                .replace(/&copy;/g, `©`)
                .replace(/&reg;/g, `®`);

            let telegramMessageUrl, telegranMessageData;
            if (photos && photos.length > 0) {
                telegramMessageUrl = `${telegramBotUrl}/sendPhoto`;


                for (let photo of photos) {
                    finalText = finalText.replace(photo.url, '');
                    telegranMessageData = {
                        chat_id: telegramChatID,
                        photo: photo.media_url_https || photo.display_url || photo.media_url,
                        caption: finalText
                    };

                    request.post({
                        url: telegramMessageUrl,
                        form: telegranMessageData
                    });
                }
            }
            else {
                telegramMessageUrl = `${telegramBotUrl}/sendMessage`;
                telegranMessageData = {
                    chat_id: telegramChatID,
                    text: finalText,
                    disable_web_page_preview: true
                };

                request.post({
                    url: telegramMessageUrl,
                    form: telegranMessageData
                });
            }

            console.log(tweet.id_str, "text:", finalText);
        });
}

if (debug) {
    twitterClient.get('https://api.twitter.com/1.1/statuses/show/877336518267813888', (err, tweet) => {
        handleTweet(tweet);
        handleTweet(tweet);
    });
}