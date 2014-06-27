# MangaRack

MangaRack.js is an application/package capable of synchronizing manga series from popular online manga scan and scanlation sites. Each synchronized chapter is stored on your computer as a comic book archive, with additional embedded information (such as the writer and summary). The embedded information is compatible with the popular ComicRack application suite.

## Development

MangaRack.js is in development, and is based on https://github.com/Deathspike/mangarack. Why in JavaScript?

* C#.NET is tied into Visual Studio/Windows; mono tooling is poor and cumbersome.
* JavaScript is simple, simple to maintain, read, write and contribute to.
* JavaScript is powerful; tasks is simplified due to the enormous ecosystem.
* JavaScript is cross-platform; browser, desktop, phone, server, code can run anywhere.
* JavaScript allows us to leverage HTML5/CSS for GUIs on phones, services and desktop clients.
* JavaScript is cool.

If you want to get involved, leave me an e-mail and we can discuss contact/things to do!

## Recommended Environment

If you do not have a preference for an editor, I recommend [brackets.io](http://brackets.io/) with:

* [Column Ruler](https://github.com/lkcampbell/brackets-ruler) - For character limit visualization.
* [CSSLint](https://github.com/cfjedimaster/brackets-csslint) - For CSS validation.
* [Epic Linter](https://github.com/fdecampredon/brackets-epic-linter) - For active in-editor validation.
* [HTMLHint](https://github.com/cfjedimaster/brackets-htmlhint) - For HTML validation.
* [JSCS](https://github.com/globexdesigns/brackets-jscs) - For code style validation.
* [JSHint](https://github.com/cfjedimaster/brackets-jshint) - For JavaScript validation.
* [Whitespace Normalizer](https://github.com/dsbonev/whitespace-normalizer) - For whitespace normalization.

## Requirements

You need to have git installed and:

> npm install -g grunt-cli

To run grunt tasks.

## Basic Instructions

> npm install

> node --harmony src/cli http://mangafox.me/manga/girl_friends/

Test mode currently writes one comic archive without additional checks.
