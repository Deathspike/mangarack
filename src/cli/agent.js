'use strict';
var affix = require('../shared').common.affix;
var archiver = require('archiver');
var fs = require('fs');
var path = require('path');
var request = require('./request');
var suffix = '.mrtmp';

/**
 * Represents an agent.
 * @class
 * @param {string} alias
 * @param {Meta=} meta
 */
function Agent(alias, meta) {
    this._alias = alias;
    this._archive = archiver.create('zip', {store: true});
    this._initialized = false;
    this._meta = meta;
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
        if (buffer) {
            return yield add(this, buffer, number);
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
        if (this._meta) {
            this._archive.append(this._meta.export(), {name: 'ComicInfo.xml'});
        }
        this._archive.finalize();
        yield fs.renameAsync(this._alias + suffix, this._alias);
        return true;
    }
    return false;
};

/**
 * Adds a page buffer to the agent.
 * @param {!Agent} agent
 * @param {!Buffer} buffer
 * @return {number=} number
 */
function *add(agent, buffer, number) {
    var extension = format(buffer);
    if (extension) {
        var key = affix(String(number || 0), 3) + '.' + extension;
        if (!agent._initialized) {
            yield initialize(agent);
        }
        if (agent._meta) {
            agent._meta.add(key, number);
        }
        agent._archive.append(buffer, {name: key});
        return true;
    }
    return false;
}

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
    if (!(yield fs.existsAsync(agent._path))) {
        yield fs.mkdirAsync(agent._path);
    }
    agent._archive.pipe(fs.createWriteStream(agent._alias + suffix));
    agent._initialized = true;
}

if (typeof module !== 'undefined') {
    module.exports = Agent;
}
