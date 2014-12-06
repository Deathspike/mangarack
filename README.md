# MangaRack

MangaRack is a console line application capable of downloading manga series from popular manga scan and scanlation sites. Each downloaded chapter is stored on your computer as a comic book archive and, by default, contains additional embedded meta information (such as the writer and summary). The embedded meta information is compatible with the popular ComicRack application suite.

## Prerequisites

* NodeJS >= 0.10.x (http://nodejs.org/)
* NPM >= 1.4.x (usually installed alongside NodeJS)
* GraphicsMagick >= 1.3.x (http://www.graphicsmagick.org/)

### Installation

Please follow the applicable instructions. Not listed? Please ask or contribute!

### Debian (Mint, Ubuntu, etc)

1. Run in *Terminal*: `sudo apt-get install nodejs npm graphicsmagick`
2. Run in *Terminal*: `sudo ln -s /usr/bin/nodejs /usr/bin/node`
3. Run in *Terminal*: `sudo npm install -g mangarack`

### Mac OS X

1. Install *Homebrew* following the instructions at http://brew.sh/
2. Run in *Terminal*: `brew install node graphicsmagick`
3. Run in *Terminal*: `npm install -g mangarack`

### Windows (with Chocolatey)

1. Install *Chocolatey* following the instructions at https://chocolatey.org/
2. Run in *Command Prompt* (as administrator): `choco install nodejs graphicsmagick`
3. Run in *Command Prompt*: `npm install -g mangarack`

### Windows (without Chocolatey)

1. Install *NodeJS* following the instructions at http://nodejs.org/
2. Install *GraphicsMagick* following the instructions at http://www.graphicsmagick.org/
3. Run in *Command Prompt*: `npm install -g mangarack`

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

The toggle to disable animation framing. This is the process of detecting animated pages and extracting the last frame. The feature was added to accommodate series in which pages are provided as an animation, presumably added to fool naïve implementations into downloading and processing an incorrect page.

#### -c or --chapter

The chapter filter. This filter influences which chapters are subject to downloading. A positive number indicates that all chapters above the provided number are to be downloaded, while a negative number indicates that all chapters below the provided absolute number are to be downloaded.

#### -d or --duplication

The toggle to disable duplication prevention. This is the process of detecting an existing archive and preventing re-downloading. The feature was added to prevent re-downloading of chapters that had already been downloaded, and thus to reduce bandwidth consumption and allow for incremental downloads.

#### -e or --extension

The file extension for each output file. Each output file is formatted with the series title, the volume number and the chapter number, followed by a file extension. The default file extension is cbz, which represents a Comic Book Archive. The configuration option was made available to allow writing a custom file extension without depending on an external tool.

#### -f or --footer

The toggle to disable footer incision. This is the process of detecting a textual footer in a page downloaded from the MangaFox provider and programmatically removing it. The feature was added to remove distracting announcements from pages, which reduce reading visibility and increase page dimensions and file size.

#### -m or --meta

The toggle to disable embedded meta-information. This is the process of creating and embedding a ComicInfo.xml file to each downloaded archive. The feature was added to give applications capable of handling meta-information (such as ComicRack) detailed information about the series and chapter.

#### -g or --generalize

The toggle to disable image generalization. This is the process of image manipulation to generalize/normalize color, contrast, and to sharpen each page. The image quality of some online resources is rather low and the normalization process can improve the overall image quality. The feature was added to improve the overall quality of downloaded pages.

#### -o or --output

The output directory. This specifies the output directory which is used when writing downloaded archives and persistent information files to the file system. The default for this is set to the current work directory. The feature was added to provide control over the output directory on the file system.

#### -p or --persistent

The toggle to disable persistent downloads. This is the process of generating an additional file for each series containing the names of the previously downloaded chapters. The feature was added to allow for chapters to be archived or deleted without causing re-downloading.

#### -s or --source

The batch-mode source file. This specifies the input file which is used when running in batch-mode. By default, this value is MangaRack.txt. This is, without source code modifications, the MangaRack.txt value. The feature was added to provide control over the batch-mode source file.

#### -t or --transform

The transformation filter. This filter influences the output image format for each downloaded page and preview image. By default, the filter will not be activated and the image format that was downloaded will be written into the comic book archive. The feature was added to enable the user to convert images to a preferred format without manual intervention.

#### -v or --volume

The volume filter. This filter influences which volumes are subject to downloading. A positive number indicates that all volumes above the provided number are to be downloaded, while a negative number indicates that all volumes below the provided absolute number are to be downloaded.

#### -w or --workers

The maximum parallel worker threads. This specified amount is used when worker threads have not been disabled to set the maximum degree of parallelism. By default, this value equals the amount of available cores in the system. The feature was added to provide control over the maximum amount of resource utilization.

## Developers

More information will be added at a later point. For now:

* Contributions: [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
* Testing: `npm test`
* Versioning: http://semver.org/
