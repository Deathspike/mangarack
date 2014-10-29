'use strict';
var affix = require('../shared').common.affix;
var archiver = require('archiver');
var cofs = require('co-fs');
var fs = require('fs');
var path = require('path');
var request = require('./request');
var suffix = '.mrtmp';

// TODO: co and co-fs have introduced some nasty double-references, and,
// hacks.. to accomplish something that is supposed to be quite simple. Find a
// better/simpler solution; look into using Bluebird and promises.

/**
 * Represents an agent.
 * @class
 * @param {string} alias
 */
function Agent(alias) {
    this._alias = alias;
    this._archive = archiver.create('zip', {store: true});
    this._initialized = false;
    this._path = path.dirname(this._alias);
}

/**
 * Adds a page from a HTTP resource.
 * @param {string} address
 * @param {number=} number
 * @return {boolean}
 */
Agent.prototype.add = function *(address, number) {
    var image = yield request(address, 'binary');
    if (image) {
        var buffer = new Buffer(image, 'binary');
        var extension = format(buffer);
        if (extension) {
            var name = String(number || 0);
            if (!this._initialized) {
                yield initialize(this);
            }
            this._archive.append(buffer, {name: affix(name, 3) + extension});
            return true;
        }
    }
    return false;
};

/**
 * Populates the resource from a HTTP resource.
 * @param {!{address: ?string}} resource
 * @param {string=} encoding
 * @return !{address: ?string}
 */
Agent.prototype.populate = function *(resource, encoding) {
    return yield request(resource, encoding);
};

/**
 * Publishes the mediated result.
 * @return {boolean}
 */
Agent.prototype.publish = function *() {
    if (this._initialized) {
        this._archive.finalize();
        yield cofs.rename(this._alias + suffix, this._alias);
        return true;
    }
    return false;
};

/**
 * Retrieves the image format.
 * @param {!Buffer} data
 * @return {?string}
 */
function format(data) {
    if (data[0] === 66 && data[1] === 77) {
        return 'bmp';
    }
    if (data[0] === 71 && data[2] === 73 && data[3] === 70) {
        return 'gif';
    }
    if (data[0] === 255 && data[1] === 216) {
        return 'jpg';
    }
    if (data[0] === 137 && data[1] === 80 && data[1] === 78 && data[2] === 71) {
        return 'png';
    }
    return undefined;
}

/**
 * Initializes the agent.
 * @param {!Agent} agent
 * @return {boolean}
 */
function *initialize(agent) {
    if (agent._initialized) {
        return;
    }
    if (!(yield cofs.exists(agent._path))) {
        yield cofs.mkdir(agent._path);
    }
    agent._archive.pipe(fs.createWriteStream(agent._alias + suffix));
    agent._initialized = true;
}

if (typeof module !== 'undefined') {
    module.exports = Agent;
}
