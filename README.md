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

If you do not have a preference for an editor, I recommend [http://brackets.io/](brackets.io) with:

* [https://github.com/lkcampbell/brackets-ruler](Column Ruler) - For character limit visualization.
* [https://github.com/cfjedimaster/brackets-csslint](CSSLint) - For CSS validation.
* [https://github.com/fdecampredon/brackets-epic-linter](Epic Linter) - For active in-editor validation.
* [https://github.com/cfjedimaster/brackets-htmlhint](HTMLHint) - For HTML validation.
* [https://github.com/globexdesigns/brackets-jscs](JSCS) - For code style validation.
* [https://github.com/cfjedimaster/brackets-jshint](JSHint) - For JavaScript validation.
* [https://github.com/dsbonev/whitespace-normalizer](Whitespace Normalizer) - For whitespace normalization.

## Basic Instructions

> npm install

> node --harmony src/cli http://mangafox.me/manga/girl_friends/

Test mode currently writes one comic archive without additional checks.
