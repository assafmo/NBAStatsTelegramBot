const request = require("request-promise");
const Twitter = require("twit");

// Keywords
const playersKeywords = (async () => {
  const json = await request.get({
    url: "http://www.nba.com/players/active_players.json",
    json: true
  });

  return json.map(x => [x.firstName, x.lastName].filter(x => x).join(" "));
})();
const coachesKeywords = Promise.resolve([
  "Lloyd Pierce",
  "Brad Stevens",
  "Kenny Atkinson",
  "James Borrego",
  "Jim Boylen",
  "John Beilein",
  "Rick Carlisle",
  "Michael Malone",
  "Dwane Casey",
  "Steve Kerr",
  "Mike D'Antoni",
  "Mike DAntoni",
  "Nate McMillan",
  "Doc Rivers",
  "Frank Vogel",
  "Taylor Jenkins",
  "Erik Spoelstra",
  "Mike Budenholze",
  "Ryan Saunders",
  "Alvin Gentry",
  "David Fizdale",
  "Billy Donovan",
  "Steve Clifford",
  "Brett Brown",
  "Monty Williams",
  "Terry Stotts",
  "Luke Walton",
  "Gregg Popovich",
  "Nick Nurse",
  "Quin Snyder",
  "Scott Brooks"
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
  "NBA",
  "Steph Curry",
  "LeBron",
  "J.R. Smith",
  "J.R Smith",
  "JR Smith",
  "Kareem Abdul Jabbar",
  "Lew Alcindor",
  "Manu Ginóbili",
  "King James",
  "Shaq",
  "MJ",
  "Melo",
  "Boogie",
  "The Brow",
  "Splash Brothers",
  "Splash Bros",
  "Big O",
  "Giannis",
  "Greek Freak",
  "Kawhi",
  // Doubles
  "Triple-double",
  "Triple Double",
  "Quadruple-double",
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
  "K.C Jones",
  "KC Jones",
  "Larry Brown",
  "Lenny Wilkens",
  "Pat Riley",
  "Phil Jackson",
  "Red Auerbach",
  "Rick Adelman",
  "Tom Heinsohn"
]);
const draftKeywords = Promise.resolve([
  "Admiral Schofield",
  "Amir Coffey",
  "Aubrey Dawkins",
  "Bol Bol",
  "Brandon Clarke",
  "Bruno Fernando",
  "Cam Reddish",
  "Cameron Johnson",
  "Carsen Edwards",
  "Charles Matthews",
  "Charlie Brown",
  "Chris Clemons",
  "Chuma Okeke",
  "Coby White",
  "Cody Martin",
  "DaQuan Jeffries",
  "Daniel Gafford",
  "Darius Garland",
  "De'Andre Hunter",
  "Dean Wade",
  "Dedric Lawson",
  "Dewan Hernandez",
  "Donta Hall",
  "Dylan Windler",
  "Eric Paschall",
  "Ethan Happ",
  "Garrison Mathews",
  "Goga Bitadze",
  "Grant Williams",
  "Ignas Brazdeikis",
  "Isaiah Roby",
  "Ja Morant",
  "Jalen McDaniels",
  "James Palmer Jr.",
  "Jared Harper",
  "Jarrett Culver",
  "Jarrey Foster",
  "Jaxson Hayes",
  "Jaylen Hands",
  "Jaylen Hoard",
  "Jaylen Nowell",
  "John Konchar",
  "Jontay Porter",
  "Jordan Bone",
  "Jordan Caroline",
  "Jordan Poole",
  "Josh Reaves",
  "Justin James",
  "Justin Robinson",
  "Justin Wright-Foreman",
  "KZ Okpala",
  "Keldon Johnson",
  "Kenny Wooten",
  "Kerwin Roach II",
  "Kevin Porter Jr.",
  "Kris Wilkes",
  "Ky Bowman",
  "Kyle Guy",
  "Lindell Wigginton",
  "Louis King",
  "Luguentz Dort",
  "Matisse Thybulle",
  "Max Strus",
  "Mfiondu Kabengele",
  "Miye Oni",
  "Moses Brown",
  "Nassir Little",
  "Naz Reid",
  "Nickeil Alexander-Walker",
  "Nicolas Claxton",
  "Oshae Brissett",
  "PJ Washington",
  "Quinndary Weatherspoon",
  "RJ Barrett",
  "Rayjon Tucker",
  "Robert Franks",
  "Romeo Langford",
  "Rui Hachimura",
  "Sagaba Konate",
  "Shamorie Ponds",
  "Simi Shittu",
  "Tacko Fall",
  "Talen Horton-Tucker",
  "Terance Mann",
  "Terence Davis",
  "Tremont Waters",
  "Ty Jerome",
  "Tyler Cook",
  "Tyler Herro",
  "Tyus Battle",
  "Zach Norvell Jr.",
  "Zion Williamson",
  "Zylan Cheatham"
]);

const keywordsPromise = Promise.all([
  playersKeywords,
  coachesKeywords,
  mvpsKeywords,
  teamsKeywords,
  draftKeywords,
  wordsKeywords
]).then(keywordsArrays =>
  keywordsArrays.reduce((x, y) => Array.from(new Set(x.concat(y))), [])
);

const blacklistPromise = Promise.resolve([
  { is_accepted_because: "Hawks", blacklist: "Black Hawks" },
  { is_accepted_because: "Hawks", blacklist: "Blackhawks" },
  { is_accepted_because: "Hawks", blacklist: "Seahawks" },
  { is_accepted_because: "Hawks", blacklist: "Jayhawks" },
  { is_accepted_because: "Kings", blacklist: "Vikings" },
  { is_accepted_because: "Kings", blacklist: "Rankings" },
  { is_accepted_because: "NBA", blacklist: "WNBA" },
  { is_accepted_because: "triple-double", blacklist: "NCAA" },
  { is_accepted_because: "triple double", blacklist: "NCAA" },
  { is_accepted_because: "triple-double", blacklist: "Division I" },
  { is_accepted_because: "triple double", blacklist: "Division I" },
  { is_accepted_because: "Blazers", blacklist: "UAB" },
  { is_accepted_because: "Bobcats", blacklist: "Ohio" },
  { is_accepted_because: "Bulls", blacklist: "South Florida" },
  { is_accepted_because: "Hawks", blacklist: "Hartford" },
  { is_accepted_because: "Heat", blacklist: "Tyrone Wheatley" },
  { is_accepted_because: "The Brow", blacklist: "The Browns" },
  { is_accepted_because: "Cavaliers", blacklist: "Virginia" },
  { is_accepted_because: "Magic", blacklist: "Magical" },
  { is_accepted_because: "Bulls", blacklist: "Buffalo" },
  { is_accepted_because: "Nets", blacklist: "Kuznetsov" },
  { is_accepted_because: "Kings", blacklist: "NHL" },
  { is_accepted_because: "Kings", blacklist: "Stanley Cup" },
  { is_accepted_because: "Nets", blacklist: "cut down the nets" },
  { is_accepted_because: "Kings", blacklist: "Blackhawks" },
  { is_accepted_because: "Kings", blacklist: "Avalanche" },
  { is_accepted_because: "Kings", blacklist: "Stars" },
  { is_accepted_because: "Kings", blacklist: "Wild" },
  { is_accepted_because: "Kings", blacklist: "Predators" },
  { is_accepted_because: "Kings", blacklist: "Blues" },
  { is_accepted_because: "Kings", blacklist: "Jets" },
  { is_accepted_because: "Kings", blacklist: "Ducks" },
  { is_accepted_because: "Kings", blacklist: "Coyotes" },
  { is_accepted_because: "Kings", blacklist: "Flames" },
  { is_accepted_because: "Kings", blacklist: "Oilers" },
  { is_accepted_because: "Kings", blacklist: "Jose Sharks" },
  { is_accepted_because: "Kings", blacklist: "Canucks" },
  { is_accepted_because: "Kings", blacklist: "Golden Knights" },
  { is_accepted_because: "Kings", blacklist: "Bruins" },
  { is_accepted_because: "Kings", blacklist: "Sabres" },
  { is_accepted_because: "Kings", blacklist: "Red Wings" },
  { is_accepted_because: "Kings", blacklist: "Panthers" },
  { is_accepted_because: "Kings", blacklist: "Canadiens" },
  { is_accepted_because: "Kings", blacklist: "Senators" },
  { is_accepted_because: "Kings", blacklist: "Lightning" },
  { is_accepted_because: "Kings", blacklist: "Maple Leafs" },
  { is_accepted_because: "Kings", blacklist: "Hurricanes" },
  { is_accepted_because: "Kings", blacklist: "Blue Jackets" },
  { is_accepted_because: "Kings", blacklist: "Devils" },
  { is_accepted_because: "Kings", blacklist: "Islanders" },
  { is_accepted_because: "Kings", blacklist: "Rangers" },
  { is_accepted_because: "Kings", blacklist: "Flyers" },
  { is_accepted_because: "Kings", blacklist: "Penguins" },
  { is_accepted_because: "Kings", blacklist: "Capitals" },
  { is_accepted_because: "Shaq", blacklist: "Shaquem Griffin" },
  { is_accepted_because: "Shaq", blacklist: "Shaquill Griffin" },
  { is_accepted_because: "Big O", blacklist: "Big One" },
  { is_accepted_because: "Nets", blacklist: "Goal" },
  { is_accepted_because: "Heat", blacklist: "Heath" },
  { is_accepted_because: "Magic", blacklist: "Fitzmagic" }
]);

function getPhotos(tweet) {
  if (tweet.extended_entities && Array.isArray(tweet.extended_entities.media)) {
    return tweet.extended_entities.media.filter(m => m.type == "photo");
  } else {
    return [];
  }
}

function getOriginalTweet(tweet) {
  if (tweet.retweeted_status) {
    return tweet.retweeted_status;
  }
  return tweet;
}

async function isNBARelated(tweet, ocrSpaceApiKey) {
  tweet = getOriginalTweet(tweet);
  let searchText = tweet.full_text;
  let photos = getPhotos(tweet);

  // Quoted tweet
  if (tweet.quoted_status) {
    let quotedTweet = getOriginalTweet(tweet.quoted_status);

    if (quotedTweet.full_text) {
      searchText += " " + quotedTweet.full_text;
    }
    photos = photos.concat(getPhotos(quotedTweet));
  }

  // OCR
  for (const photo of photos) {
    try {
      const ocrResult = await request.get({
        url: `https://api.ocr.space/parse/imageurl?apikey=${ocrSpaceApiKey}&url=${
          photo.media_url_https
        }`,
        timeout: 20000,
        json: true
      });
      if (Array.isArray(ocrResult.ParsedResults)) {
        for (const res of ocrResult.ParsedResults) {
          if (res.ParsedText) {
            searchText += " " + res.ParsedText;
          }
        }
      }
    } catch (ex) {
      console.log(JSON.stringify({ "ocr.space error": ex }));
    }
  }

  for (const photo of photos) {
    searchText = searchText.replace(photo.url, "");
  }

  searchText += " ";
  searchText = searchText.toLowerCase().replace(/\bhttps?:\/\/.+?[\s]/, "");

  const [keywords, blacklist] = await Promise.all([
    keywordsPromise,
    blacklistPromise
  ]);

  let foundKeywords = [];
  for (const keyword of keywords) {
    if (searchText.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    }
  }

  const foundBlacklist = [];
  foundKeywords = foundKeywords.filter(keyword => {
    for (const entry of blacklist) {
      if (
        entry.is_accepted_because.toLowerCase() == keyword.toLowerCase() &&
        searchText.includes(entry.blacklist.toLowerCase())
      ) {
        foundBlacklist.push(entry.blacklist);
        return false;
      }
    }
    return true;
  });

  return [foundKeywords.length > 0, foundKeywords, foundBlacklist];
}

async function handleTweet(
  tweet,
  telegramBotUrl,
  telegramChatID,
  ocrSpaceApiKey,
  cb
) {
  cb = cb || (() => {});

  const [nbaRelated, foundKeywords, foundBlacklist] = await isNBARelated(
    tweet,
    ocrSpaceApiKey
  );

  if (foundBlacklist.length > 0) {
    console.log(tweet.id_str, "blacklist:", foundBlacklist.join(","));
  }

  if (!nbaRelated) {
    console.log(tweet.id_str, "Not NBA related");
    return cb(null, { error: "Not NBA related" });
  }

  console.log(tweet.id_str, "keywords:", foundKeywords.join(","));

  tweet = getOriginalTweet(tweet);
  let finalText = tweet.full_text;

  const telegramMessageUrl = `${telegramBotUrl}/sendMessage`;
  const telegramPhotoUrl = `${telegramBotUrl}/sendPhoto`;
  const photos = getPhotos(tweet);
  if (photos && photos.length > 0) {
    for (const photo of photos) {
      finalText = finalText.replace(photo.url, "");
      if (finalText.trim().length == 0) {
        await request.post({
          url: telegramPhotoUrl,
          form: {
            chat_id: telegramChatID,
            photo: photo.media_url_https || photo.display_url || photo.media_url
          }
        });
      } else {
        await request.post({
          url: telegramMessageUrl,
          form: {
            chat_id: telegramChatID,
            parse_mode: "HTML",
            disable_web_page_preview: false,
            text: `<a href="${photo.media_url_https ||
              photo.display_url ||
              photo.media_url}">&#8203;</a>${finalText}`
          }
        });
      }
    }
  } else {
    finalText = finalText
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

    await request.post({
      url: telegramMessageUrl,
      form: {
        disable_web_page_preview: false,
        chat_id: telegramChatID,
        text: finalText
      }
    });
  }

  console.log(tweet.id_str, "text:", finalText);
  cb(null, { id: tweet.id_str, text: finalText });
}

async function webtask(ctx, cb) {
  if (!ctx.query.tweet_url) {
    return cb(null, { error: "no querystring param tweet_url" });
  }
  const tweetUrlSplit = ctx.query.tweet_url.split("/");
  const tweetID = tweetUrlSplit[tweetUrlSplit.length - 1];

  const telegramBotUrl = `https://api.telegram.org/bot${
    ctx.secrets.telegram_bot_key
  }`;
  const telegramChatID = ctx.secrets.telegram_chat_id;

  const twitterClient = new Twitter({
    consumer_key: ctx.secrets.twitter_consumer_key,
    consumer_secret: ctx.secrets.twitter_consumer_secret,
    access_token: ctx.secrets.twitter_access_token_key,
    access_token_secret: ctx.secrets.twitter_access_token_secret
  });

  try {
    const result = await twitterClient.get("statuses/show/:id", {
      id: tweetID,
      tweet_mode: "extended"
    });

    const tweet = result.data;
    handleTweet(
      tweet,
      telegramBotUrl,
      telegramChatID,
      ctx.secrets.ocr_space_api_key,
      cb
    );
  } catch (err) {
    if (err) {
      return cb(null, { error: err });
    }
  }
}

module.exports = webtask;
module.exports.isNBARelated = isNBARelated;

const inDebug =
  process && Array.isArray(process.argv) && process.argv[2] === "debug";
if (inDebug) {
  const config = require(require("path").join(__dirname, "config_test.json"));

  const webtaskSecrets = {
    twitter_consumer_key: config.twitter.consumer_key,
    twitter_consumer_secret: config.twitter.consumer_secret,
    twitter_access_token_key: config.twitter.access_token_key,
    twitter_access_token_secret: config.twitter.access_token_secret,
    telegram_bot_key: config.telegram.bot_key,
    telegram_chat_id: config.telegram.chat_id,
    ocr_space_api_key: config.ocr_space_api_key
  };

  const tweetsToCheck = ["1056636469870256129"];
  for (const tweetID of tweetsToCheck) {
    module.exports(
      {
        query: {
          tweet_url: `https://twitter.com/ESPNStatsInfo/status/${tweetID}`
        },
        secrets: webtaskSecrets
      },
      function() {
        console.log("webtask callback:", ...arguments);
      }
    );
  }
}
