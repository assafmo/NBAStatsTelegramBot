const Twitter = require("twit");
const path = require("path");

const config = require(path.join(__dirname, "config_test.json"));
const isNBARelated = require(path.join(__dirname, "main.js")).isNBARelated;

const tests = {
  "942967289875443712": true,
  "942947504986972160": true,
  "942915469257986049": true,
  "942409148938911745": true,
  "914644850833809408": false,
  "928464438339895297": true,
  "928476855358824449": true,
  "928630758599561216": true,
  "928645865270661125": true,
  "934823312181596162": true,
  "934972949324619776": false,
  "935871219303198722": true,
  "937540795531513857": false,
  "938252289587990528": true,
  "938434111198416896": true,
  "939365056428560384": true,
  "940429812753199104": true,
  "942953958263402496": true,
  "937078943907221505": true,
  "938252350585745408": true,
  "940434956907577349": true,
  "941101813113204736": true
};

const ocrSpaceApiKey = config.ocr_space_api_key;
const twitterClient = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

for (let tweetID of Object.keys(tests)) {
  test(`https://twitter.com/ESPNStatsInfo/status/${tweetID}`, async () => {
    expect.assertions(1);

    const result = await twitterClient.get("statuses/show/:id", {
      id: tweetID,
      tweet_mode: "extended"
    });
    const tweet = result.data;

    const [nbaRelated, foundKeywords, foundBlacklist] = await isNBARelated(
      tweet,
      ocrSpaceApiKey
    );

    expect(nbaRelated).toBe(tests[tweetID]);
  });
}
