const Twitter = require("twit");
const path = require("path");

const config = require(path.join(__dirname, "config_test.json"));
const isNBARelated = require(path.join(__dirname, "main.js")).isNBARelated;

const ocrSpaceApiKey = config.ocr_space_api_key;
const twitterClient = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

const tests = require(path.join(__dirname, "tests.json"));
for (let testCase of tests) {
  test(
    `${testCase.description} | should be "${
      testCase.isNBA
    }" | https://twitter.com/ESPNStatsInfo/status/${testCase.tweetID}`,
    async () => {
      expect.assertions(1);

      const result = await twitterClient.get("statuses/show/:id", {
        id: testCase.tweetID,
        tweet_mode: "extended"
      });
      const tweet = result.data;

      const [isNBA, foundKeywords, foundBlacklist] = await isNBARelated(
        tweet,
        ocrSpaceApiKey
      );

      expect(isNBA).toBe(testCase.isNBA);
    },
    15000
  );
}
