
var jsdom = require('jsdom');
var q = require('q');
var _articlesCache = {
    date: new Date(2000, 1, 1), // just an arbitrary really old date
    articles: []
};

exports.getPerfArticles = function() {

    var deferred = q.defer();

    var now = new Date();
    if (daysBetween(now, _articlesCache.date) > 1) {
        jsdom.env({
            url: 'http://www.webpagetest.org',
            scripts: ['http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js'],
            done: function (errors, window) {
                var $ = window.$;
                var links = $('#feeds a');

                var newArticles = [];
                for (var i=0; i<5; i++) {
                    newArticles.push({
                        title: links[i].innerHTML,
                        link: $(links[i]).attr('href')
                    });
                }

                _articlesCache = {
                    date: new Date(),
                    articles: newArticles
                };
                deferred.resolve(_articlesCache);
            }
        });
    }
    else {
        deferred.resolve(_articlesCache);
    }

    return deferred.promise;

};

function daysBetween(first, second) {
    // Copy date parts of the timestamps, discarding the time parts.
    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

    // Do the math.
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;

    // Round down.
    return Math.floor(Math.abs(days));
}