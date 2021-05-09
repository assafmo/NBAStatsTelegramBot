# NBAStatsTelegramBot

A Telegram bot that send NBA related tweets from ESPN Stats & Info, hosted as a https://webtask.io webtask.  
When given a tweet ID (e.g. with a webhook) checkes whether the tweet or the photos matches certain keywords and sends it to a specific Telegram chat.

[![GitHub](https://github.com/assafmo/NBAStatsTelegramBot/workflows/Tests/badge.svg)](https://github.com/assafmo/NBAStatsTelegramBot/actions)

# Links

|        [![@Telegram](https://cdn.rawgit.com/aleen42/badges/master/src/telegram.svg)](https://t.me/nba_stats)        |               **[@nba_stats](https://t.me/nba_stats)**               |
| :-----------------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------: |
| [![reddit](https://cdn.rawgit.com/aleen42/badges/master/src/reddit.svg)](https://www.reddit.com/r/NBAStatsTelegram) | **[/r/NBAStatsTelegram](https://www.reddit.com/r/NBAStatsTelegram)** |

# Usage

1.  [Create a twitter app](https://apps.twitter.com)

2.  [Create a telegram bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot)

3.  Keyswords go inside `main.js` as the parameters `playersKeywords`, `coachesKeywords`, `mvpsKeywords`,`teamsKeywords`, `draftKeywords` and `wordsKeywords`.  
    Each keyword list is a `Promise`d array of strings.  
    Keywords are case-insensitive.

4.  Blacklist entries go inside `main.js` as the parameter `blacklistPromise`.  
    The blacklist parameter is a `Promise`d array of Objects.  
    Each Object is of the form `{ is_accepted_because: "Hawks",blacklist: "Black Hawks"}`.
    This means that if the bot will find `Hawks` as a keyword but also `Black Hawks`, then it won't consider `Hawks` as a keyword for this tweet.
    Blacklist Keywords are case-insensitive.

5.  Create `secrets.txt` for API keys.

```
telegram_chat_id=<YOUR_TELEGRAM_CHAT_ID (get at @get_id_bot)>
telegram_bot_key=<YOUR_TELEGRAM_BOT_KEY>
twitter_consumer_key=<get at https://apps.twitter.com/app/XXXXXXXX/keys>
twitter_consumer_secret=<get at https://apps.twitter.com/app/XXXXXXXX/keys>
twitter_access_token_key=<get at https://apps.twitter.com/app/XXXXXXXX/keys>
twitter_access_token_secret=<get at https://apps.twitter.com/app/XXXXXXXX/keys>
ocr_space_api_key=<get at https://ocr.space/ocrapi>
```

6.  Create a new https://webtask.io webtask.

```bash
wt create --name <NAME> --secrets-file secrets.txt main.js
```

(npm modules will be added automatically because of the `package.json` file.)

7.  On https://ifttt.com create an applet from https://ifttt.com/create/if-new-tweet-by-a-specific-user?sid=2 to https://ifttt.com/create/if-new-tweet-by-a-specific-user-then-make-a-web-request?sid=6.
    On the webhook url give your webtask url and append `?tweet_url={{LinkToTweet}}`

# Deploy updates

`wt update <NAME> main.js`

# Test & Debug

Create the file `config_test.json` along side `main.js`

```json
{
  "telegram": {
    "chat_id": "<YOUR_TELEGRAM_CHAT_ID (get at @get_id_bot)>",
    "bot_key": "<YOUR_TELEGRAM_BOT_KEY>"
  },
  "twitter": {
    "consumer_key": "<get at https://apps.twitter.com/app/XXXXXXXX/keys>",
    "consumer_secret": "<get at https://apps.twitter.com/app/XXXXXXXX/keys>",
    "access_token_key": "<get at https://apps.twitter.com/app/XXXXXXXX/keys>",
    "access_token_secret": "<get at https://apps.twitter.com/app/XXXXXXXX/keys>"
  },
  "ocr_space_api_key": "<get at https://ocr.space/ocrapi>"
}
```

## Test

`npm test` / `yarn test`

## Debug

`node main.js debug`

# License

[MIT](/LICENSE)
