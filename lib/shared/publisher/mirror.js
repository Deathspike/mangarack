'use strict';
var async = require('../common/async');

/**
 * Mirrors the chapter.
 * @param {!IAgent} agent
 * @param {!ISeries} series The populated series.
 * @param {!IChapter} chapter The populated chapter.
 * @param {function(Error)} done
 */
module.exports = function(agent, series, chapter, done) {
  _publish(agent, {imageAddress: series.imageAddress}, function(err) {
    if (err) return done(err);
    async.eachSeries(chapter.children, function(page, next) {
      agent.populate(page, 'utf8', function(err) {
        if (err) return done(err);
        _publish(agent, page, next);
      });
    }, done);
  });
};

/**
 * Publishes the item.
 * @private
 * @param {!IAgent} agent
 * @param {!{imageAddress: (?string|Array.<string>), number: ?number}} item
 * @param {function(Error)} done
 */
function _publish(agent, item, done) {
  if (!item.imageAddress) return done();
  var imageAddresses = [].concat(item.imageAddress);
  async.eachSeries(imageAddresses, function(imageAddress, next) {
    agent.add(imageAddress, item.number, function(err) {
      // IGNORE: The error is ignored. While the error is undoubtedly some sort
      // of network interruption, we will simply continue to the next image
      // address while positively hoping that the next one is not unavailable.
      if (err) return next();
      done();
    });
  }, function() {
    agent.dispose(item.number, done);
  });
}
