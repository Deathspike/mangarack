'use strict';
var affix = require('../shared').common.affix;
var archiver = require('archiver');
var fs = require('fs');
var path = require('path');
var request = require('./request');
var suffix = '.mrdownload';

/**
 * Represents an agent.
 * @class
 * @param {string} alias
 * @param {Meta=} meta
 */
function Agent(alias, meta) {
    this._alias = alias;
    this._initialized = false;
    this._meta = meta;
    this._path = path.dirname(this._alias);
    this._zip = archiver.create('zip', {store: true});
}

/**
 * Adds a page from a HTTP resource.
 * @param {string} address
 * @param {number=} number
 * @return {boolean}
 */
Agent.prototype.add = function *(address, number) {
    var image = yield request(address, 'binary');
    if (!image) return false;
    var buffer = new Buffer(image, 'binary');
    return buffer ? yield add(this, buffer, number) : false;
};

/**
 * Populates the resource from a HTTP resource.
 * @param {!{address: ?string}} resource
 * @param {string=} encoding
 * @return {!{address: ?string}}
 */
Agent.prototype.populate = function *(resource, encoding) {
    return yield request(resource, encoding);
};

/**
 * Publishes the mediated result.
 * @return {boolean}
 */
Agent.prototype.publish = function *() {
    if (!this._initialized) return false;
    if (this._meta) this._zip.append(this._meta.xml(), {name: 'ComicInfo.xml'});
    this._zip.finalize();
    yield fs.renameAsync(this._alias + suffix, this._alias);
    return true;
};

/**
 * Adds a page buffer to the agent.
 * @param {!Agent} agent
 * @param {!Buffer} buffer
 * @return {number=} number
 */
function *add(agent, buffer, number) {
    var extension = format(buffer);
    if (!extension) return false;
    var key = affix(String(number || 0), 3) + '.' + extension;
    if (!agent._initialized) yield initialize(agent);
    if (agent._meta) agent._meta.add(key, number);
    agent._zip.append(buffer, {name: key});
    return true;
}

/**
 * Retrieves the image format.
 * @param {!Buffer} data
 * @return {?string}
 */
function format(data) {
    if (data.slice(0, 2).toString('hex') === '424d') return 'bmp';
    if (data.slice(0, 3).toString('hex') === '474946') return 'gif';
    if (data.slice(0, 2).toString('hex') === 'ffd8') return 'jpg';
    if (data.slice(0, 4).toString('hex') === '89504e47') return 'png';
    return undefined;
}

/**
 * Initializes the agent.
 * @param {!Agent} agent
 * @return {boolean}
 */
function *initialize(agent) {
    if (agent._initialized) return;
    yield tryMakeDirectory(agent._path);
    agent._zip.pipe(fs.createWriteStream(agent._alias + suffix));
    agent._initialized = true;
}

/**
 * Try to make the directory.
 * @param {string} path
 * @return {boolean}
 */
function *tryMakeDirectory(path) {
    try {
        yield fs.mkdirAsync(path);
        return true;
    } catch (ex) {
        return false;
    }
}

module.exports = Agent;
