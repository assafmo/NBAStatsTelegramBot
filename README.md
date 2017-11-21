# This bot lives in [@nbaespnstats](https://t.me/nbaespnstats)
This Telegram bot is a webtask.io function, that when given a tweet ID (via webhook e.g.) checkes that the tweet matches certain keywords and send it to a specific Telegram chat.

# Usage
1. [Create a twitter app](https://apps.twitter.com)

2. [Create a telegram bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot)

3. Copy `main.js` into a new https://webtask.io webtask.

4. Create secrets for the webtask.
 - telegram_chat_id = `<YOUR_TELEGRAM_CHAT_ID>` (get at @get_id_bot)
 - telegram_bot_key = `<YOUR_TELEGRAM_BOT_KEY>`
 - twitter_consumer_key = `GET_AT https://apps.twitter.com/app/XXXXXXXX/keys`
 - twitter_consumer_secret = `GET_AT https://apps.twitter.com/app/XXXXXXXX/keys`
 - twitter_access_token_key = `GET_AT https://apps.twitter.com/app/XXXXXXXX/keys`
 - twitter_access_token_secret = `GET_AT https://apps.twitter.com/app/XXXXXXXX/keys`

5. Keyswords go inside `main.js` as the parameters `playersKeywords`, `coachesKeywords`, `mvpsKeywords`,`teamsKeywords`, `draftKeywords` and `wordsKeywords`.  
    Each keyword list is a `Promise`d array of strings.  
    Keywords are case-sensitive.

5. Blacklist entries go inside `main.js` as the parameter `blacklistPromise`.  
    The blacklist parameter is a `Promise`d array of Objects.  
    Each Object is of the form `{ is_accepted_because: "Hawks",blacklist: "Black Hawks"}`.
    This means that if the bot will find `Hawks` as a keyword but also `Black Hawks`, then it won't consider `Hawks` as a keyword for this tweet. 
    Blacklist Keywords are case-sensitive.

6. On https://ifttt.com create an applet from https://ifttt.com/create/if-new-tweet-by-a-specific-user?sid=2 to https://ifttt.com/create/if-new-tweet-by-a-specific-user-then-make-a-web-request?sid=6.
    On the webhook url give your webtask url and append `?tweet_url={{LinkToTweet}}`

# Debug
1. Use `config_debug.json` along side `main.js`
```json
Create the file config.json along side main.js:

{
    "telegram": {
        "chat_id": "<YOUR_TELEGRAM_CHAT_ID>",
        "bot_key": "<YOUR_TELEGRAM_BOT_KEY>"
    },
    "twitter": {
        "account_id_to_follow": "GET_AT http://idfromuser.com/",
        "consumer_key": "GET_AT https://apps.twitter.com/app/XXXXXXXX/keys",
        "consumer_secret": "GET_AT https://apps.twitter.com/app/XXXXXXXX/keys",
        "access_token_key": "GET_AT https://apps.twitter.com/app/XXXXXXXX/keys",
        "access_token_secret": "GET_AT https://apps.twitter.com/app/XXXXXXXX/keys"
    }
}
```

2. Execute `node main.js debug`