'use strict';
var affix = require('../shared').common.affix;
var archiver = require('archiver');
var async = require('async');
var fs = require('fs');
var path = require('path');
var request = require('./request');
var suffix = '.mrdownload';

/**
 * Represents an agent.
 * @class
 * @param {string} filePath
 * @param {!Array.<!Processor>} processors
 * @param {Meta=} meta
 */
function Agent(filePath, processors, meta) {
    this._filePath = filePath;
    this._initialized = false;
    this._meta = meta;
    this._processors = processors;
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
        if (err || !data) return done(err || new Error('Missing image.'));
        var buffer = new Buffer(data, 'binary');
        if (!detect(buffer)) return done(new Error('Invalid image.'));
        runProcessors(that, buffer, function (err, buffer) {
            if (err) return done(err);
            if (!detect(buffer)) return done(new Error('Invalid image.'));
            initialize(that, function () {
                var key = affix(String(number || 0), 3) + '.' + detect(buffer);
                if (that._meta) that._meta.add(key, number);
                that._zip.append(buffer, {name: key});
                done(undefined, true);
            });
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
    fs.rename(this._filePath + suffix, this._filePath, done);
};

/**
 * Creates directories.
 * @param {string} directory
 * @param {function()} done
 */
function create(directory, done) {
    var directories = [];
    var previous;
    while (previous !== directory) {
        previous = directory;
        directories.push(directory);
        directory = path.resolve(directory, '..');
    }
    async.eachSeries(directories.reverse(), function (directory, next) {
        fs.mkdir(directory, function () {
            next();
        });
    }, done);
}

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
    create(path.dirname(that._filePath), function () {
        that._zip.pipe(fs.createWriteStream(that._filePath + suffix));
        that._initialized = true;
        done();
    });
}

/**
 * Run the processors.
 * @param {!Agent} that
 * @param {!Buffer} buffer
 * @param {function(Error, Buffer)} done
 */
function runProcessors(that, buffer, done) {
    if (!that._processors.length) {
        return process.nextTick(function () {
            done(undefined, buffer);
        });
    }
    async.eachSeries(that._processors, function (processor, next) {
        processor(buffer, function (err, newBuffer) {
            if (err) return done(err);
            buffer = newBuffer;
            next();
        });
    }, function () {
        done(undefined, buffer);
    });
}

module.exports = Agent;
