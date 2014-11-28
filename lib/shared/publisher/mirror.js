'use strict';
var async = require('async');

/**
 * Mirrors the chapter.
 * @param {!IAgent} agent
 * @param {!ISeries} series The populated series.
 * @param {!IChapter} chapter The populated chapter.
 * @param {function(Error)} done
 */
module.exports = function(agent, series, chapter, done) {
  publish(agent, {imageAddress: series.imageAddress}, function(err) {
    if (err) return done(err);
    async.eachSeries(chapter.children, function(page, next) {
      agent.populate(page, 'utf8', function(err) {
        if (err) return done(err);
        publish(agent, page, next);
      });
    }, done);
  });
};

/**
 * Publishes the item.
 * @param {!IAgent} agent
 * @param {!{imageAddress: (?string|Array.<string>), number: ?number}} item
 * @param {function(Error)} done
 */
function publish(agent, item, done) {
  if (!item.imageAddress) return async.nextTick(done);
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
    // TODO: Usually, the control flow would exit sooner. Apparently, all the
    // image addresses have been exhausted and the image has not been created.
    // Implement a signal in the agent contract for future repair purposes.
    done();
  });
}
