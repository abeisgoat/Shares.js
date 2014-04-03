var shares = require('./index');

shares.get('http://i.imgur.com/i9vsfn8.jpg').then(function (counts) {
    console.log(counts);
});