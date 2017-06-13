# This bot lives in [@nbaespnstats](https://t.me/nbaespnstats)
This telegram bot follows a twitter account and sends tweets that match certain keywords to a specific chat.

# Usage
1. [Create a twitter app](https://apps.twitter.com)

2. [Create a telegram bot](https://core.telegram.org/bots#3-how-do-i-create-a-bot)

3. Create the file `config.json` along side `main.js`:
    ```json
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
    Get your telegram `chat_id` by messaging your bot in the desired chat and checking `https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_KEY>/getUpdates`.  

4. Keyswords go in the `./keywords` folder as a `.js` module.  
    Each keyword list is a `Promise`d array of strings.  
    Keywords are case-sensitive.

5. Blacklist entries go in the `./keywords_blacklist` folder as a `.js` module.  
    Each keyword list is a `Promise`d array of Objects.  
    Each Object is of the form `{ is_accepted_because: "Hawks",blacklist: "Black Hawks"}`.
    This means that if the bot will find `Hawks` as a keyword but also `Black Hawks`, then it won't consider `Hawks` as a keyword for this tweet. 
    Blacklist Keywords are case-sensitive.

6. Execute `node main.js` 

# Debug
1. Use `config_debug.json` instead of `config.json`
2. Execute `node main.js debug`