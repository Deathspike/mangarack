'use strict';
var async = require('async');

/**
 * Mirrors the chapter.
 * @param {!Agent} agent
 * @param {!Series} series The populated series.
 * @param {!Chapter} chapter The populated chapter.
 * @param {function(Error)} done
 */
module.exports = function (agent, series, chapter, done) {
    publish(agent, {imageAddress: series.imageAddress}, function (err) {
        if (err) return done(err);
        async.eachSeries(chapter.children, function (page, next) {
            agent.populate(page, 'utf8', function (err) {
                if (err) return next(err);
                publish(agent, page, next);
            });
        }, done);
    });
};

/**
 * Publishes the item.
 * @param {!Agent} agent
 * @param {!{imageAddress: (?string|Array.<string>), number: ?number}} item
 * @param {function(Error)} done
 */
function publish(agent, item, done) {
    if (!item.imageAddress) return async.nextTick(done);
    var imageAddresses = [].concat(item.imageAddress);
    async.eachSeries(imageAddresses, function (imageAddress, next) {
        agent.add(imageAddress, item.number, function (err) {
            if (err) return next();
            done();
        });
    }, done);
}
