const request = require('request');
const Twitter = require('twitter');

// Keywords
const playersKeywords = new Promise((resolve, reject) => {
    require('request').get({ url: 'http://www.nba.com/players/active_players.json', json: true }, (err, resp, json) => {
        resolve(json.map(x => [x.firstName, x.lastName].filter(x => x).join(' ')));
    });
});
const coachesKeywords = Promise.resolve([
    "Brad Stevens",
    "Kenny Atkinson",
    "Jeff Hornacek",
    "Brett Brown",
    "Dwane Casey",
    "Fred Hoiberg",
    "Tyronn Lue",
    "Stan Van Gundy",
    "Nate McMillan",
    "Jason Kidd",
    "Mike Budenholzer",
    "Steve Clifford",
    "Erik Spoelstra",
    "Frank Vogel",
    "Scott Brooks",
    "Rick Carlisle",
    "Mike D'Antoni",
    "Mike DAntoni",
    "David Fizdale",
    "Alvin Gentry",
    "Gregg Popovich",
    "Michael Malone",
    "Tom Thibodeau",
    "Billy Donovan",
    "Terry Stotts",
    "Quin Snyder",
    "Steve Kerr",
    "Doc Rivers",
    "Luke Walton",
    "Earl Watson",
    "Dave Joerger"
]);
const mvpsKeywords = Promise.resolve([
    "Allen Iverson",
    "Bill Russell",
    "Bill Walton",
    "Bob Cousy",
    "Bob McAdoo",
    "Bob Pettit",
    "Charles Barkley",
    "Dave Cowens",
    "David Robinson",
    "Derrick Rose",
    "Dirk Nowitzki",
    "Hakeem Olajuwon",
    "Julius Erving",
    "Kareem Abdul-Jabbar",
    "Karl Malone",
    "Kevin Durant",
    "Kevin Garnett",
    "Kobe Bryant",
    "Larry Bird",
    "LeBron James",
    "Magic Johnson",
    "Michael Jordan",
    "Moses Malone",
    "Oscar Robertson",
    "Shaquille O'Neal",
    "Stephen Curry",
    "Steve Nash",
    "Tim Duncan",
    "Wes Unseld",
    "Willis Reed",
    "Wilt Chamberlain",
    "Russell Westbrook"
]);
const teamsKeywords = Promise.resolve([
    "Boston Celtics",
    "Celtics",
    "Brooklyn Nets",
    "Nets",
    "New York Knicks",
    "Knicks",
    "Philadelphia 76ers",
    "76ers",
    "Toronto Raptors",
    "Raptors",
    "Golden State Warriors",
    "Warriors",
    "Los Angeles Clippers",
    "LA Clippers ",
    "Clippers",
    "Los Angeles Lakers",
    "LA Lakers",
    "Lakers",
    "Phoenix Suns",
    "Suns",
    "Chicago Bulls",
    "Bulls",
    "Cleveland Cavaliers",
    "Cavaliers",
    "Cavs",
    "Detroit Pistons",
    "Pistons",
    "Indiana Pacers",
    "Pacers",
    "Milwaukee Bucks",
    "Bucks",
    "Dallas Mavericks",
    "Mavericks",
    "Mavs",
    "Houston Rockets",
    "Rockets",
    "Memphis Grizzlies",
    "Grizzlies",
    "New Orleans Pelicans",
    "Pelicans",
    "San Antonio Spurs",
    "Spurs",
    "Atlanta Hawks",
    "Hawks",
    "Charlotte Hornets",
    "Hornets",
    "Miami Heat",
    "Heat",
    "Orlando Magic",
    "Magic",
    "Washington Wizards",
    "Wizards",
    "Denver Nuggets",
    "Nuggets",
    "Minnesota Timberwolves",
    "Timberwolves",
    "Oklahoma City Thunder",
    "Thunder",
    "Portland Trail Blazers",
    "Trail Blazers",
    "Blazers",
    "Utah Jazz",
    "Jazz",
    "Sacramento Kings",
    "Kings"
]);
const wordsKeywords = Promise.resolve([
    " NBA",
    "#NBA",
    "Steph Curry",
    "LeBron",
    "J.R. Smith",
    "King James"
]);
const draftKeywords = Promise.resolve([/*TODO - get next draft*/]);

const keywordsPromise = Promise.all([
    playersKeywords,
    coachesKeywords,
    mvpsKeywords,
    teamsKeywords,
    draftKeywords,
    wordsKeywords
]).then(keywordsArrays => keywordsArrays.reduce((x, y) => x.concat(y), []));

const blacklistPromise = Promise.resolve([
    { is_accepted_because: "Hawks", blacklist: "Black Hawks", }
]);

function handleTweet(tweet, twitterClient, telegramBotUrl, telegramChatID, cb) {
    cb = cb || (() => { });

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

            if (foundKeywords.length > 0) {
                isNbaRelated = true;
            }

            if (!isNbaRelated) {
                return cb({ error: 'Not NBA related' });
            }

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

            const telegramMessageUrl = `${telegramBotUrl}/sendMessage`;
            if (photos && photos.length > 0) {
                for (let photo of photos) {
                    finalText = finalText.replace(photo.url, '');
                    request.post({
                        url: telegramMessageUrl,
                        form: {
                            chat_id: telegramChatID,
                            parse_mode: 'HTML',
                            text: `<a href="${photo.media_url_https || photo.display_url || photo.media_url}">&#8203;</a>${finalText}`
                        }
                    });
                }
            }
            else {
                request.post({
                    url: telegramMessageUrl,
                    form: {
                        chat_id: telegramChatID,
                        text: finalText,
                        disable_web_page_preview: true
                    }
                });
            }

            console.log(tweet.id_str, "text:", finalText);
            cb(null, { id: tweet.id_str, text: finalText });
        });
}

const inDebug = process && Array.isArray(process.argv) && process.argv[2] === 'debug';
if (inDebug) {
    const config = require(require('path').join(__dirname, `config_debug.json`));
    const telegramBotUrl = `https://api.telegram.org/bot${config.telegram.bot_key}`;
    const telegramChatID = config.telegram.chat_id;

    const twitterClient = new Twitter({
        consumer_key: config.twitter.consumer_key,
        consumer_secret: config.twitter.consumer_secret,
        access_token_key: config.twitter.access_token_key,
        access_token_secret: config.twitter.access_token_secret
    });

    const toSend = ['928464438339895297', '928645865270661125', '928630758599561216', '928476855358824449'];
    for (let tId of toSend) {
        twitterClient.get(`https://api.twitter.com/1.1/statuses/show/${tId}`, (err, tweet) => {
            handleTweet(tweet, twitterClient, telegramBotUrl, telegramChatID);
        });
    }
}

module.exports = (ctx, cb) => {
    const tweetUrlSplit = ctx.query.tweet_url.split('/');
    if (tweetUrlSplit.length < 1) {
        return cb({ error: `address ${ctx.query.tweet_url} from querystring param tweet_url doesn't have tweet_id` });
    }

    const telegramBotUrl = `https://api.telegram.org/bot${ctx.secrets.telegram_bot_key}`;
    const telegramChatID = ctx.secrets.telegram_chat_id;

    const twitterClient = new Twitter({
        consumer_key: ctx.secrets.twitter_consumer_key,
        consumer_secret: ctx.secrets.twitter_consumer_secret,
        access_token_key: ctx.secrets.twitter_access_token_key,
        access_token_secret: ctx.secrets.twitter_access_token_secret
    });

    const tId = tweetUrlSplit[tweetUrlSplit.length - 1];
    twitterClient.get(`https://api.twitter.com/1.1/statuses/show/${tId}`, (err, tweet) => {
        if (err) {
            return cb(err);
        }

        handleTweet(tweet, twitterClient, telegramBotUrl, telegramChatID, cb);
    });
};