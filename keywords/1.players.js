module.exports = new Promise((resolve, reject) => {
    require('request').get({ url: 'http://www.nba.com/players/active_players.json', json: true }, (err, resp, json) => {
        resolve(json.map(x => [x.firstName, x.lastName].filter(x => x).join(' ')));
    })
});