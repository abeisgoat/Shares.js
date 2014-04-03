var shares = require('./index');

shares.get('https://github.com/abeisgreat/Shares.js').then(function (counts) {
    console.log(counts);
});