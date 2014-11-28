/*jshint -W098*/
'use strict';

/**
 * Represents an agent.
 * @interface
 */
function IAgent() {
  throw new Error('Not implemented.');
}

/**
 * Adds a page from a HTTP resource.
 * @param {string} address
 * @param {number=} number
 * @param {function(Error, ?boolean)} done
 */
IAgent.add = function(address, number, done) {
  throw new Error('Not implemented.');
};

/**
 * Populates the resource from a HTTP resource.
 * @param {!{address: ?string}} resource
 * @param {string} encoding
 * @param {function(Error)} done
 */
IAgent.populate = function(resource, encoding, done) {
  throw new Error('Not implemented.');
};

/**
 * Publishes the mediated result.
 * @param {function(Error)} done
 */
IAgent.publish = function(done) {
  throw new Error('Not implemented.');
};

module.exports = IAgent;
