var shares = require('./index');

shares.get('http://www.foxnews.com/politics/2014/04/03/hundreds-cases-potential-voter-fraud-uncovered-in-north-carolina/').then(function (counts) {
    console.log(counts);
});