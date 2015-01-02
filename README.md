# MangaRack

MangaRack is a console line application capable of downloading manga series from popular manga scanlation sites. Each downloaded chapter is stored on your computer as a comic book archive and, by default, contains additional embedded meta information (such as the writer and summary). The embedded meta information is compatible with the popular ComicRack application suite.

## History/Upgrading

It has been two years since the release of MangaRack.cs, the predecessor of MangaRack.js. Managing hundreds of series, thousands of chapters and millions of pages has been an incredible learning experience. There have been major changes in MangaRack.cs going from 1.x to 2.x, and similarly, in the 3.x version. A library will not change much, but the philosophy has changed to a "*MangaRack everywhere!*"-approach. If you are upgrading, delete your persistence files, and check for decrepated command line switches.

## Prerequisites

* NodeJS >= 0.10.x (http://nodejs.org/)
* NPM >= 1.4.x (https://www.npmjs.org/)
* GraphicsMagick >= 1.3.x (http://www.graphicsmagick.org/)

## Supported Sites

* [Batoto](http://bato.to/) support is intended as an incomplete high-quality provider.
* [KissManga](http://kissmanga.com/) support is intended as a back-up provider.
* [MangaFox](http://mangafox.me/) support is intended as a complete medium-quality provider.

## Installation

Use the applicable instructions to install. Is your operating system not listed? Please ask or contribute!

### Debian (Mint, Ubuntu, etc)

1. Run in *Terminal*: `sudo apt-get install nodejs npm graphicsmagick`
2. Run in *Terminal*: `sudo ln -s /usr/bin/nodejs /usr/bin/node`
3. Run in *Terminal*: `sudo npm install -g mangarack`

### Mac OS X

1. Install *Homebrew* following the instructions at http://brew.sh/
2. Run in *Terminal*: `brew install node graphicsmagick`
3. Run in *Terminal*: `npm install -g mangarack`

### Windows

1. Install *NodeJS* following the instructions at http://nodejs.org/
2. Install *GraphicsMagick* following the instructions at http://www.graphicsmagick.org/
3. Run in *Command Prompt*: `npm install -g mangarack`

## Instructions

Use the applicable instructions for the interface of your choice (currently limited to command-line).

### Command-line Interface (`mangarack`)

The [command-line interface](http://en.wikipedia.org/wiki/Command-line_interface) does not have a graphical component and is ideal for automation purposes and headless machines. The interface can run using a sequence of series addresses (the site address containing the chapter listing), or with a batch-mode source file. The `mangarack --help` command will produce the following output:

    Usage: mangarack [options]
    
    Options:
    
      -h, --help           output usage information
      -V, --version        output the version number
      -a, --animation      Disable image animation framing.
      -d, --duplication    Disable duplication detection.
      -f, --footer         Disable image footer cropping (MangaFox-only).
      -j, --jacket         Disable the comic book jacket/cover.
      -g, --generalize     Disable image generalization.
      -m, --meta           Disable metadata.
      -p, --persistent     Disable persistent synchronization.
      -c, --chapter <n>    The chapter filter.
      -v, --volume <n>     The volume filter.
      -e, --extension <s>  The file extension. (Default: cbz)
      -k, --keep-alive     Keeps the process alive on a task error.
      -o, --output <s>     The output directory.
      -s, --source <s>     The source file. (Default: MangaRack.txt)
      -t, --transform <s>  The image transformation output.
      -w, --workers <n>    The maximum workers. (Default: # cores)

#### Batch-mode

When no sequence of series addresses is provided, the batch-mode source file will be read (which is *MangaRack.txt* in the current work directory, but can be changed with the `--source` switch). Each line in this file is processed as a seperate command-line statement. This makes it ideal to manage a large sequence of series addresses with variating command-line options or incremental chapter updates.

#### Examples

Download in batch-mode:

    mangarack

Download *Aoi Hana* from *MangaFox* to the current work directory:

    mangarack http://mangafox.me/manga/aoi_hana/

Download *Aoi Hana* from *MangaFox* to `C:\Manga`:

    mangarack --output C:\Manga http://mangafox.me/manga/aoi_hana/

Download *Aoi Hana* from *MangaFox* to `C:\Manga` without embedded meta information:

    mangarack --meta --output C:\Manga http://mangafox.me/manga/aoi_hana/

Download *Aoi Hana* from *MangaFox* and *Citrus* from *Batoto* to the current work directory:

    mangarack http://mangafox.me/manga/aoi_hana/ http://bato.to/comic/_/comics/citrus-saburouta-r8772

#### Switches

##### Disables

* `-a or --animation` disables last frame extraction of an animated image.
* `-d or --duplication` disables existing file detection and forces re-downloads.
* `-f or --footer` disables *MangaFox*-specific footer watermark removal.
* `-g or --generalize` disables image color/contrast normalization and sharpening.
* `-j or --jacket` disables the comic book jacket/cover.
* `-m or --meta` disables writing the embedded *ComicInfo.xml* meta-information file.
* `-p or --persistent` disables persistent tracking and renaming.

##### Filters

* `-c <n> or --chapter <n> ` filters chapters (positive is greater than, negative is smaller than).
* `-c <n> or --chapter <n>` filters volumes (positive is greater than, negative is smaller than).

##### Settings

* `-e <s> or --extension <s>` sets the file extension (defaults to *cbz*).
* `-k or --keep-alive` keeps the process alive on a task error.
* `-o <s> or --output <s>` sets the output directory (defaults to *current work directory*).
* `-s <s> or --source <s>` sets the batch-mode source file (defaults to *MangaRack.txt*)
* `-t <s> or --transform <s>` sets an overriding image format transformation (e.g. *jpg*).
* `-w <s> or --workers <s>` sets the maximum concurrency (defaults to the machines cores).

## Developers

More information will be added at a later point. For now:

* Contributions: [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
* Testing: `npm test`
* Versioning: http://semver.org/

Contributions welcome! Got a pinch-zoomable HTML5/JS comic viewer? Share please!
