const Twitter = require("twit");
const path = require("path");

const config = require(path.join(__dirname, "config_test.json"));
const isNBARelated = require(path.join(__dirname, "main.js")).isNBARelated;

const tests = {
  "942967289875443712": true,
  "942947504986972160": true,
  "942915469257986049": true,
  "942409148938911745": false
};

const ocrSpaceApiKey = config.ocr_space_api_key;
const twitterClient = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

for (let tweetID of Object.keys(tests)) {
  test(`https://twitter.com/ESPNStatsInfo/status/${tweetID}`, () => {
    twitterClient.get(
      "statuses/show/:id",
      {
        id: tweetID,
        tweet_mode: "extended"
      },
      async (err, tweet) => {
        if (err) {
          throw err;
        }

        const [nbaRelated, foundKeywords, foundBlacklist] = await isNBARelated(
          tweet,
          ocrSpaceApiKey
        );

        expect(nbaRelated).toBe(tests[tweetID]);
      }
    );
  });
}
