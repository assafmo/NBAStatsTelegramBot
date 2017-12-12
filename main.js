const request = require('request-promise');
const Twitter = require('twit');

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
    "Sixers",
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
    "Kareem Abdul Jabbar",
    "Lew Alcindor",
    "Manu Ginóbili",
    "King James",
    // Doubles
    "Double-double",
    "Triple-double",
    "Quadruple-double",
    "Double Double",
    "Triple Double",
    "Quadruple Double",
    // Triple doubles all time leaders
    "Oscar Robertson",
    "Magic Johnson",
    "Jason Kidd",
    "Russell Westbrook",
    "Wilt Chamberlain",
    "Larry Bird",
    "LeBron James",
    "Fat Lever",
    "Bob Cousy",
    "James Harden",
    "John Havlicek",
    "Grant Hill",
    "Rajon Rondo",
    "Michael Jordan",
    "Elgin Baylor",
    "Clyde Drexler",
    "Walt Frazier",
    "Kobe Bryant",
    "Kareem Abdul-Jabbar",
    "Micheal Ray Richardson",
    "Chris Webber",
    // Quadruple Doubles all time leaders (https://www.basketball-reference.com/leaders/quadruple-double-most-times.html)
    "Nate Thurmond",
    "David Robinson",
    "Alvin Robertson",
    "Hakeem Olajuwon",
    // Winningest coaches of all time (http://www.nba.com/history/records/victories_coaches.html)
    "Bill Fitch",
    "Billy Cunningham",
    "Dick Motta",
    "Don Nelson",
    "Gene Shue",
    "George Karl",
    "Gregg Popovich",
    "Jack Ramsay",
    "Jerry Sloan",
    "K.C. Jones",
    "Larry Brown",
    "Lenny Wilkens",
    "Pat Riley",
    "Phil Jackson",
    "Red Auerbach",
    "Rick Adelman",
    "Tom Heinsohn",
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
    { is_accepted_because: "Hawks", blacklist: "Black Hawks", },
    { is_accepted_because: "Hawks", blacklist: "Blackhawks", },
    { is_accepted_because: "Hawks", blacklist: "Seahawks", },
    { is_accepted_because: "kings", blacklist: "Vikings", },
    { is_accepted_because: "kings", blacklist: "Rankings", }
]);

async function handleTweet(tweet, telegramBotUrl, telegramChatID, ocrSpaceApiKey, cb) {
    cb = cb || (() => { });

    if (typeof tweet.retweeted_status == 'object')
        tweet = tweet.retweeted_status;

    let searchText = tweet.full_text;

    // OCR
    const photos = tweet.extended_entities &&
        tweet.extended_entities.media &&
        tweet.extended_entities.media.length &&
        tweet.extended_entities.media.filter(m => m.type == 'photo');
    if (photos && photos.length > 0) {
        for (let photo of photos) {
            const ocrResult = await request.get({
                url: `https://api.ocr.space/parse/imageurl?apikey=${ocrSpaceApiKey}&url=${photo.media_url_https}`,
                json: true
            });
            if (Array.isArray(ocrResult.ParsedResults)) {
                for (let res of ocrResult.ParsedResults) {
                    if (res.ParsedText) {
                        searchText += ' ' + res.ParsedText;
                    }
                }
            }
        }
    }

    searchText = searchText.replace(/\n/g, '').toLowerCase();

    const [keywords, blacklist] = await Promise.all([keywordsPromise, blacklistPromise]);

    let isNbaRelated = false;
    let foundKeywords = [];
    for (let keyword of keywords) {
        if (searchText.includes(keyword.toLowerCase())) {
            foundKeywords.push(keyword);
        }
    }

    foundKeywords = foundKeywords.filter(keyword => {
        for (let entry of blacklist) {
            if (entry.is_accepted_because.toLowerCase() == keyword.toLowerCase() && searchText.includes(entry.blacklist.toLowerCase())) {
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
        return cb(null, { error: 'Not NBA related' });
    }

    console.log(tweet.id_str, "keywords:", foundKeywords.join(','));

    let finalText = tweet.full_text
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
                text: finalText
            }
        });
    }

    console.log(tweet.id_str, "text:", finalText);
    cb(null, { id: tweet.id_str, text: finalText });
}

module.exports = (ctx, cb) => {
    if (!ctx.query.tweet_url) {
        return cb(null, { error: 'no querystring param tweet_url' })
    }
    const tweetUrlSplit = ctx.query.tweet_url.split('/');
    const tweetID = tweetUrlSplit[tweetUrlSplit.length - 1];

    const telegramBotUrl = `https://api.telegram.org/bot${ctx.secrets.telegram_bot_key}`;
    const telegramChatID = ctx.secrets.telegram_chat_id;

    const twitterClient = new Twitter({
        consumer_key: ctx.secrets.twitter_consumer_key,
        consumer_secret: ctx.secrets.twitter_consumer_secret,
        access_token: ctx.secrets.twitter_access_token_key,
        access_token_secret: ctx.secrets.twitter_access_token_secret
    });

    twitterClient.get(`statuses/show/:id`, { id: tweetID, tweet_mode: 'extended' }, (err, tweet) => {
        if (err) {
            return cb(null, { error: err });
        }

        handleTweet(tweet, telegramBotUrl, telegramChatID, ctx.secrets.ocr_space_api_key, cb);
    });
};


const inDebug = process && Array.isArray(process.argv) && process.argv[2] === 'debug';
if (inDebug) {
    const config = require(require('path').join(__dirname, `config_debug.json`));

    const webtaskSecrets = {
        twitter_consumer_key: config.twitter.consumer_key,
        twitter_consumer_secret: config.twitter.consumer_secret,
        twitter_access_token_key: config.twitter.access_token_key,
        twitter_access_token_secret: config.twitter.access_token_secret,
        telegram_bot_key: config.telegram.bot_key,
        telegram_chat_id: config.telegram.chat_id,
        ocr_space_api_key: config.ocr_space_api_key
    }

    const tweetsToCheck = ['940429812753199104'];
    for (let tweetID of tweetsToCheck) {
        module.exports(
            {
                query: { tweet_url: `https://twitter.com/ESPNStatsInfo/status/${tweetID}` },
                secrets: webtaskSecrets
            },
            function () { console.log('webtask callback:', ...arguments) }
        );
    }
}
