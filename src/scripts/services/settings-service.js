'use strict';
var filePath = 'MangaRack.settings';
var fs = require('fs');

/**
 * Represents the settings service.
 * @constructor
 */
function SettingsService() {
  var _ = {};
  this.load = load;
  this.save = save;

  /**
   * Loads the settings.
   */
  function load() {
    try {
      var contents = fs.readFileSync(filePath, 'utf8');
      var settings = JSON.parse(contents);
      _.settings = settings;
    } catch (e) {
      _.settings = {};
    }
  }

  /**
   * Saves the current settings.
   */
  function save() {
    fs.writeFileSync(filePath, JSON.stringify(_.settings), 'utf8');
  }
}

module.exports = SettingsService;
