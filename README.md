# MangaRack

MangaRack is a console line application capable of synchronizing manga series from popular manga scan and scanlation sites. Each synchronized chapter is stored on your computer as a comic book archive and, by default, contains additional embedded meta information (such as the writer and summary). The embedded meta information is compatible with the popular ComicRack application suite.

## Prerequisites

* NodeJS >= 0.10.x (http://nodejs.org/)
* NPM >= 1.4.x (usually installed alongside NodeJS)
* GraphicsMagick >= 1.3.x (http://www.graphicsmagick.org/)

## Installation/Updating

Open a `Command Prompt` (*Windows*) or `Terminal` (*Mac/Linux*) and run:

    npm install -g mangarack

To update `mangarack` to the latest version run:

    npm update -g mangarack

Once installed, `mangarack` can run. For example:

    mangarack --help

## Instructions

MangaRack is a [command line application](http://en.wikipedia.org/wiki/Command-line_interface) and does not feature a *Graphical User Interface (GUI)* at this time. To download chapters from a supported manga scan and scanlation site, a command is entered in the `Command Prompt` (*Windows*) or `Terminal` (*Mac/Linux*). Each address of a series to download should follow the `mangarack` command and *optional switches*. The supported scan and scanlation sites sites are:

* [Batoto](http://bato.to/) (Example: `mangarack http://bato.to/comic/_/comics/aoi-hana-r381`)
* [KissManga](http://kissmanga.com/) (Example: `mangarack http://kissmanga.com/Manga/Sweet-Blue-Flowers`)
* [MangaFox](http://mangafox.me/) (Example: `mangarack http://mangafox.me/manga/aoi_hana/`)

### Batch-mode

When more then one series are to be downloaded, the *batch-mode* provides an easier way to handle a larger number of series addresses. This mode is used when no addresses are provided, so running `mangarack` without additional arguments will suffice. In this mode, a file is read and each line of this file is processed as a set of command line options. The file is assumed to be named `MangaRack.txt` and should be located in the current work directory. The batch-mode source file can be changed with the `--source` switch.

### Quick Examples

Download in batch-mode:

    mangarack

Download *Aoi Hana* from MangaFox to the current work directory:

    mangarack http://mangafox.me/manga/aoi_hana/

Download *Aoi Hana* from MangaFox to `C:\Manga`:

    mangarack --output C:\Manga http://mangafox.me/manga/aoi_hana/

Download *Aoi Hana* from MangaFox to `C:\Manga` without embedded meta information:

    mangarack --meta --output C:\Manga http://mangafox.me/manga/aoi_hana/

Download *Aoi Hana* from MangaFox and *Citrus* from Batoto to the current work directory:

    mangarack http://mangafox.me/manga/aoi_hana/ http://bato.to/comic/_/comics/citrus-saburouta-r8772

### Switches

#### -a or --animation

The toggle to disable animation framing. This is the process of detecting animated pages and extracting the last frame. The feature was added to accommodate series in which pages are provided as an animation, presumably added to fool naïve synchronization implementations into synchronizing an incorrect page.

#### -c <n> or --chapter <n>

#### -d or --duplication

The toggle to disable duplication prevention. This is the process of detecting an existing archive and preventing re-synchronization. The feature was added to prevent re-synchronization of chapters that had already been synchronized, and thus to reduce bandwidth consumption and allow for incremental synchronization.

#### -e <s> or --extension <s>

#### -f or --footer

The toggle to disable footer incision. This is the process of detecting a textual footer in a page synchronized from the MangaFox provider and programmatically removing it. The feature was added to remove distracting announcements from pages, which reduce reading visibility and increase page dimensions and file size.

#### -m or --meta

The toggle to disable embedded meta-information. This is the process of creating and embedding a ComicInfo.xml file to each synchronized archive. The feature was added to give applications capable of handling meta-information (such as ComicRack) detailed information about the series and chapter.

#### -n or --normalize

#### -o <s> or --output <s>

#### -p or --persistent

The toggle to disable persistent synchronization. This is the process of generating an additional file for each series containing the names of the previously synchronized chapters. The feature was added to allow for chapters to be archived or deleted without causing re-synchronization.

#### -s <s> or --source <s>

#### -t <s> or --transform <s>

#### -v <n> or --volume <n>

#### -w <n> or --workers <n>



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
