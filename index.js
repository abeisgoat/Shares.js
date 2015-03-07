var request = require('request');
var Promise = require('promise');

module.exports = (function () {
    "use strict";

    var root = {};

    var services = {
        twitter: {
            url: 'https://cdn.api.twitter.com/1/urls/count.json?url=',
            format: function (body) {
                var data = JSON.parse(body);
                return data.count;
            }
        },
        facebook: {
            url: 'https://api.facebook.com/method/links.getStats?format=json&urls=',
            format: function (body) {
                var data = JSON.parse(body)[0];
                return data.share_count || 0;
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
                // I'm glad we're on the same page about that.
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
                var data, base;
                data = JSON.parse(body);

                if (!data.kind && !data[0].kind) {
                    return 0;
                }

                base = data.length? data[0] : data;

                return base.data.children[0].data.score || base.data.children[0].data.ups - base.data.children[0].data.downs;
            }
        }
    };

    var getter = function (service) {
        return function (url) {
            if (typeof url !== "string") {
                throw "URL must be a string";
            }

            var promise = new Promise(function (resolve, reject) {
                request(service.url + url, function (err, req, body) {
                    resolve(service.format(body));
                });
            });
            return promise;
        };
    };

    var After = function (trigger, func) {
        var current = 0;
        this.step = function (data) {
            current += 1;
            if (current == trigger) {
                func(data);
            }
        };
    };

    root.get = function (url) {
        var promise = new Promise(function (resolve, reject) {
            var results = {};

            var done = new After(Object.keys(services).length, function () {
                resolve(results);
            }).step;

            Object.keys(services).forEach(function (service) {
                root.get[service](url).then(function (count) {
                    results[service] = count;
                    done(results);
                });
            });
        });

        return promise;
    };

    for (var service in services) {
        root.get[service] = getter(services[service]);
    }

    return root;
}());

/*
{
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
}
*/
