'use strict';
var affix = require('../shared').common.affix;
var archiver = require('archiver');
var async = require('../shared').common.async;
var fs = require('fs');
var path = require('path');
var request = require('./request');
var tempSuffix = '.mrdownload';

/**
 * Represents an agent.
 * @constructor
 * @implements {IAgent}
 * @param {string} chapterPath
 * @param {!Array.<!IProcessor>} processors
 * @param {boolean} jacket
 * @param {Meta=} meta
 */
function Agent(chapterPath, processors, jacket, meta) {
  this._chapterPath = chapterPath;
  this._disposed = false;
  this._initialized = false;
  this._jacket = jacket;
  this._meta = meta;
  this._processors = processors;
  this._zip = archiver.create('zip', {store: true});
}

/**
 * Adds a page from a HTTP resource.
 * @param {string} address
 * @param {number=} number
 * @param {function(Error, boolean=)} done
 */
Agent.prototype.add = function(address, number, done) {
  var that = this;
  if (this._disposed) return done(undefined, false);
  if (!number && this._jacket) return done(undefined, false);
  request(address, 'binary', function(err, data) {
    if (err || !data) return done(err || new Error('No image: ' + address));
    var buffer = new Buffer(data, 'binary');
    var extension = _detect(buffer);
    if (!extension) return done(new Error('Invalid image: ' + address));
    _processors(that, buffer, function(err, buffer) {
      if (err || !buffer) return done(err);
      extension = _detect(buffer);
      if (!extension) return done(new Error('Unprocessed image: ' + address));
      _initialize(that, function() {
        var key = affix(String(number || 0), 3) + '.' + extension;
        if (that._meta) that._meta.add(key, number);
        that._zip.append(buffer, {name: key});
        done(undefined, true);
      });
    });
  });
};

/**
 * Marks a page as disposed.
 * @param {number} number
 * @param {function(Error, boolean=)} done
 */
Agent.prototype.dispose = function(number, done) {
  this._disposed = true;
  done(undefined);
};

/**
 * Populates the resource from a HTTP resource.
 * @param {!{address: ?string}} resource
 * @param {string} encoding
 * @param {function(Error)} done
 */
Agent.prototype.populate = function(resource, encoding, done) {
  request(resource, encoding, done);
};

/**
 * Publishes the mediated result.
 * @param {function(Error)} done
 */
Agent.prototype.publish = function(done) {
  if (!this._initialized) return done(undefined);
  if (this._meta) this._zip.append(this._meta.xml(), {name: 'ComicInfo.xml'});
  this._zip.finalize();
  if (this._disposed) return fs.unlink(this._chapterPath + tempSuffix, done);
  fs.rename(this._chapterPath + tempSuffix, this._chapterPath, done);
};

/**
 * Creates directories.
 * @private
 * @param {string} directoryPath
 * @param {function()} done
 */
function _create(directoryPath, done) {
  var directoryPaths = [];
  var currentPath = directoryPath;
  var previousPath = '';
  while (previousPath !== currentPath) {
    previousPath = currentPath;
    directoryPaths.push(currentPath);
    currentPath = path.resolve(currentPath, '..');
  }
  async.eachSeries(directoryPaths.reverse(), function(directoryPath, next) {
    fs.mkdir(directoryPath, function() {
      // IGNORE: The error is ignored. While the error can be valid (due to
      // permissions, for example), it is considered likely to be the result of
      // multiple chapters attempting to create the same folder simultaneously.
      next();
    });
  }, done);
}

/**
 * Detects the image format.
 * @private
 * @param {!Buffer} buffer
 * @returns {string|undefined}
 */
function _detect(buffer) {
  if (buffer.slice(0, 2).toString('hex') === '424d') return 'bmp';
  if (buffer.slice(0, 3).toString('hex') === '474946') return 'gif';
  if (buffer.slice(0, 2).toString('hex') === 'ffd8') return 'jpg';
  if (buffer.slice(0, 4).toString('hex') === '89504e47') return 'png';
  return undefined;
}

/**
 * Initializes the agent.
 * @private
 * @param {!Agent} that
 * @param {function()} done
 */
function _initialize(that, done) {
  if (that._initialized) return done();
  _create(path.dirname(that._chapterPath), function() {
    that._zip.pipe(fs.createWriteStream(that._chapterPath + tempSuffix));
    that._initialized = true;
    done();
  });
}

/**
 * Run the processors.
 * @private
 * @param {!Agent} that
 * @param {!Buffer} buffer
 * @param {function(Error, Buffer=)} done
 */
function _processors(that, buffer, done) {
  if (!that._processors.length) return done(undefined, buffer);
  var resultBuffer = buffer;
  async.eachSeries(that._processors, function(processor, next) {
    processor(resultBuffer, function(err, nextBuffer) {
      if (err || !nextBuffer) return done(err);
      resultBuffer = nextBuffer;
      next();
    });
  }, function() {
    done(undefined, resultBuffer);
  });
}

module.exports = Agent;
