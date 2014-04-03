Shared.js
---------

Get Share/Like/Upvote counts for a URL.

Example
-------
First install it...

    npm install shared-js

Then get some counts...

    var shared = require('shared-js');
    shared.get.reddit('https://github.com/abeisgreat/Shared.js').then(function (count) {
        // count is a number!
    });
    
To get all the counts at once, just use...

    var shared = require('shared-js');
    shared.get('https://github.com/abeisgreat/Shared.js').then(function (counts) {
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