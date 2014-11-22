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

## Versioning

Once release of 3.0.0 happens, we will adhere to: http://semver.org/

## Awaiting Implementation

* Persistent synchronization (may or may not be binary compatible with mr.cs).
* Repair and error tracking (may or may not be binary compatible with mr.cs).

## Basic Instructions

> npm install --production

> node ./ http://mangafox.me/manga/girl_friends/

## Grunt

> npm install

Grunt tasks are now available. To validate once, run:

> npm test

## Futher reading~

Stay tuned! I'm dedicated to making mr.js a viable alternative (and eventually, replacement) to mr.cs! More will come as time goes on ;-)
