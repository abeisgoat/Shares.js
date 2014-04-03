var shared = require('./shared');

shared.get('http://i.imgur.com/i9vsfn8.jpg').then(function (count) {
    console.log(count);
});