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
 * @param {function(Error, ?boolean)} done
 */
Agent.prototype.add = function (address, number, done) {
    var that = this;
    request(address, 'binary', function (err, data) {
        if (err || !data) return done(err || new Error('Not an image.'));
        var buffer = new Buffer(data, 'binary');
        var extension = detect(buffer);
        if (!extension) return done(new Error('Invalid image.'));
        initialize(that, function () {
            var key = affix(String(number || 0), 3) + '.' + extension;
            if (that._meta) that._meta.add(key, number);
            that._zip.append(buffer, {name: key});
            done(undefined, true);
        });
    });
};

/**
 * Populates the resource from a HTTP resource.
 * @param {!{address: ?string}} resource
 * @param {string} encoding
 * @param {function(Error}) done
 */
Agent.prototype.populate = function (resource, encoding, done) {
    request(resource, encoding, done);
};

/**
 * Publishes the mediated result.
 * @param {function(Error)} done
 */
Agent.prototype.publish = function (done) {
    if (!this._initialized) return process.nextTick(done);
    if (this._meta) this._zip.append(this._meta.xml(), {name: 'ComicInfo.xml'});
    this._zip.finalize();
    fs.rename(this._alias + suffix, this._alias, done);
};

/**
 * Detects the image format.
 * @param {!Buffer} buffer
 * @return {?string}
 */
function detect(buffer) {
    if (buffer.slice(0, 2).toString('hex') === '424d') return 'bmp';
    if (buffer.slice(0, 3).toString('hex') === '474946') return 'gif';
    if (buffer.slice(0, 2).toString('hex') === 'ffd8') return 'jpg';
    if (buffer.slice(0, 4).toString('hex') === '89504e47') return 'png';
    return undefined;
}

/**
 * Initializes the agent.
 * @param {!Agent} that
 * @param {function()} done
 */
function initialize(that, done) {
    if (that._initialized) return process.nextTick(done);
    fs.mkdir(that._path, function () {
        that._zip.pipe(fs.createWriteStream(that._alias + suffix));
        that._initialized = true;
        done();
    });
}

module.exports = Agent;
