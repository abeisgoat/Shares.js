Shares.js
=========

Get Share/Like/Upvote counts for a URL.

Example
-------
First install it...

    npm install shares

Then get require it...

    var shares = require('shares');
    
Then get some counts!

    shares.get.reddit('https://github.com/abeisgreat/Shares.js').then(function (count) {
        // Count is a number
    });
    
To get all the counts at once, just use...

    var shares = require('shares');
    
    shares.get('https://github.com/abeisgreat/Shares.js').then(function (counts) {
        /*
            counts is like...

            {
                twitter: ...,
                stumbleupon: ...,
                facebook: ...
                reddit: ...,
                linkedin: ...,
                pinterest: ...,
                buffer: ...
            }
        *
    });
    
Services
--------

* Twitter
* StumbleUpon
* Facebook
* Reddit
* LinkedIn
* Pinterest
* Buffer