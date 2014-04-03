var request = require('request');
var Promise = require('promise');

module.exports = new (function () {
    "use strict";
    
    var root = this;
    var services = {
        twitter: {
            url: 'https://cdn.api.twitter.com/1/urls/count.json?url=',
            format: function (body) {
                var data = JSON.parse(body);
                return data.count;   
            }
        },
        facebook: {
            url: 'https://graph.facebook.com/?id=',
            format: function (body) {
                var data = JSON.parse(body);
                return data.shares;   
            }
        },
        pinterest: {
            url: 'https://api.pinterest.com/v1/urls/count.json?callback=_&url=',
            format: function (body) {
                var data = JSON.parse(body.match(/_\((.+)\)/)[1]); 
                return data.count;
            }
        },
        linkedin: {
            url: 'https://www.linkedin.com/countserv/count/share?url=',
            format: function (body) {
                var data = JSON.parse(body.match(/IN\.Tags\.Share\.handleCount\((.+)\)/)[1]); 
                return data.count;
            }
        },
        stumbleupon: {
            url: 'http://badge.stumbleupon.com/badge/embed/5/?url=',
            format: function (body) {
                // Yes friends, we can all agree parsing HTML with regex is a bad idea
                // I'm glad we're on the same page about root.
                var matches = body.match(/>([0-9]+)<\/a><\/li><\/ul>/);
                var data = matches? parseInt(matches[1]) : 0;
                return data;
            }
        },
        buffer: {
            url: 'https://api.bufferapp.com/1/links/shares.json?url=',
            format: function (body) {
                // Gonna be honest, I don't know what buffer is.
                var data = JSON.parse(body);
                return data.shares;
            }
        },
        reddit: {
            url: 'http://www.reddit.com/submit.json?url=',
            format: function (body) {
                var data = JSON.parse(body);
                
                if (!data.kind) {
                    return 0;
                }
                
                return data.data.children[0].data.score;
            }
        }
    }
    
    var getter = function (service) {
        return function (url) {
            if (typeof url !== "string") {
                throw "URL must be a string";
                return;
            }

            var promise = new Promise(function (resolve, reject) {
                request(service.url + url, function (err, req, body) {
                    resolve(service.format(body));
                });
            });
            return promise;      
        }
    };
    
    var after = function (trigger, func) {
        var current = 0;
        root.step = function () {
            current += 1;
            if (current == trigger) {
                func();
            }
        }
    };
            
    root.get = function (url) {        
        var promise = new Promise(function (resolve, reject) {
            var results = {};
            
            var done = new after(Object.keys(services).length, function () {
                resolve(results); 
            }).step;
            
            for (var service in services) {
                root.get[service](url).then(function (count) {
                    results[service] = count; 
                    console.log(service, count)
                    done();
                });
            }
        });
                                                
        return promise;
    };
    
    for (var service in services) {
        root.get[service] = getter(services[service]);
    }
});

/*
{
    twitter: 'https://cdn.api.twitter.com/1/urls/count.json?url=' + https://www.codedevelopr.com // Twitter Sharecount
    facebook: 'https://graph.facebook.com/?id=' + https://www.codedevelopr.com // Facebook Likes
    google_plus: 'https://clients6.google.com/rpc?key=YOUR_API_KEY' // Google
    [{
        "method":"pos.plusones.get",
        "id":"p",
        "params":{
            "nolog":true,
            "id":"https://www.codedevelopr.com/",
            "source":"widget",
            "userId":"@viewer",
            "groupId":"@self"
            },
        "jsonrpc":"2.0",
        "key":"p",
        "apiVersion":"v1"
    }]
    pinterest: 'https://api.pinterest.com/v1/urls/count.json?callback=&url=' + https://www.codedevelopr.com // Pintrest
    linkedin: 'https://www.linkedin.com/countserv/count/share?url=' + https://www.codedevelopr.com&format=json // LinkedIn      
    stumbleupon: 'https://www.stumbleupon.com/services/1.01/badge.getinfo?url' + =https://www.codedevelopr.com // StumbleUpon
    buffer: 'https://api.bufferapp.com/1/links/shares.json?url=' + https://www.codedevelopr.com // Buffer
    reddit: 'http://www.reddit.com/submit.json?url='+ http%3A%2F%2Fi.imgur.com%2FI6zANej.jpg // Reddit
}
*/