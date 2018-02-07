# mangarack 5.0

*MangaRack* has had four major versions over the years. The `4.0` version is a console line application capable of downloading manga series from popular manga scanlation sites. The upcoming `5.0` version aims to implement a *personal manga server* (*Linux*, *macOS* and *Windows*) with *desktop applications* (*macOS* and *Windows*) and *mobile applications* (*Android* and *iOS*). Think *Plex* meets *mangarack*, if that makes sense to you. This is what you will be able to do:

1. Install *mangarack-server* on your PC.
2. Install the *mangarack-app* on your favourite reading device.
3. Connect your reading device to your PC (over TCP/IP). That's it!

The `5.0` version is under development and will be released iteratively. Features are split into phases with each completed phase resulting in a **preview release**. Every feature implementation is a *minimum viable product*. You can install each *preview release* to provide feedback. All feedback is appreciated, but **issue reports** and *suggestions* are most important! This is how **everyone can help**. Of course, the occasional *"Thank you"* is appreciated too!

## Developers

You can help! I'm putting down the foundation for each component, but I won't be altering the released components until it's back on the phase schedule. You can fix issues and add features to each existing component. Please do **discuss features** prior to implementation. If your feature does not fit in the grand scope of what *mangarack* is going to be, you'd be wasting your time because I will **not accept those pull requests**. So, *discuss first*!

# Phase 01 (28-01-2018)

* File contents are stored in `{homeDirectory}/mangarack`.

## File Structure

* `/{providerName}.json`:
  * Keeps track of monitored series.
  * Identifies series title changes (not implemented in `Preview 1`).
  * Identifies series url changes (not implemented in `Preview 1`).
* `/{providerName}/{seriesName}.json`:
  * Keeps track of series metadata.
  * Keeps track of chapter metadata.
* `/{providerName}/{seriesName}/{chapterName}.cbz`:
  * Contains each page.
  * Unlike `4.x`, does **NOT** include *cover*, `ComicInfo.xml` or *any image processing*.
* `/{providerName}/{seriesName}/{chapterName}.json`:
  * Contains each page number, image dimension, and image format.

## mangarack-cli

* `mangarack-cli create <url>`:
  * Retrieves series metadata.
  * Creates or updates `/{providerName}/{seriesName}.json`.
  * Creates or updates `/{providerName}.json`.
  * Supports `mangafox`.
* `mangarack-cli download`:
  * Retrieves series metadata.
  * Updates `/{providerName}/{seriesName}.json`.
  * Downloads missing chapters.
* `mangarack-cli update <url>`:
  * Retrieves series metadata.
  * Updates `/{providerName}/{seriesName}.json`.
  
# Phase 02 (11-02-2018)

* [Server] Add `mangarack-server`:
  * `GET /` serves the user interface.
    * Supports series list.
    * Supports series details.
    * Supports clicking through pages (basic reader).  * `GET /api/library`
    * Provides a list of provider names.
    * Provides a list of series titles (reads `/{providerName}.json`).
  * `GET /api/library/{providerName}/{seriesName}`
    * Provides series and chapter metadata (reads `/{providerName}/{seriesName}.json`).
    * Provides chapter availability (iterates `/{providerName}/{seriesName}`).
  * `GET /api/library/{providerName}/{seriesName}/{chapterName}`
    * Provides page numbers, image dimensions and image formats (reads `/{providerName}/{seriesName}/{chapterName}.json`).
  * `GET /api/library/{providerName}/{seriesName}/{chapterName}/{pageNumber}`
    * Serves a page (reads `/{providerName}/{seriesName}/{chapterName}.cbz`)
    * Performs *image processing* when applicable.
    
# Phase 03 (25-02-2018)

* [App] Add `mangarack-app`:
  * Cordova application with support for *Android*.
  * Provide connection string and downloads client from `{serverUrl}/ui`.
  * Support automatic login and persist connection strings.

# Phase 04 (11-03-2018)

* [Cli] Add log file.
* [Server] Add support for progress tracking:
  * Updates `/{providerName}/{seriesName}.json` (`mangarack-cli update` now merges with status).
  * Support unread/reading/completed status and page number.
  * Uses `PATCH /api/library/{providerName}/{seriesName}/{chapterName}` with `{progress: {page, status}}`.
* [Server] Add support for PIN code security (exclude `127.0.0.1`).

# Phase 05 (25-03-2018)

* [Cli] Add support for `kissmanga`.
* [Cli] Add support for series title changes (and consider duplicate entries).
* [Cli] Add support for series url changes (and consider duplicate entries).

# Phase 06 (08-04-2018)

* [Cli] Add support for `mangarack-cli delete <url>`:
  * Remove `/{providerName/{seriesName}`}
  * Remove series entry in `/{providerName}.json`.
* [Cli] Add support for `mangarack-cli download <url>`:
  * Downloads missing chapters for specified series.
* [Cli] Add support for `mangarack-cli download <url> [-v <volume>] [-c <chapter>]`:
  * Downloads specified missing chapter for series.
* [Cli] Add support for `mangarack-cli update`:
  * Updates metadata for all series.
  
# Phase 07 (22-04-2018)

* [Server] Add support for series management:
  * Support create series
    * `POST /api/create` with `{url}`.
  * Support download series/chapter
    * `POST /api/download`.
    * `POST /api/download` with `{url}`
    * `POST /api/download` with `{url, volume?, chapter?}`
  * Support delete series.
    * `POST /api/delete` with `{url}`.
  * Support update series.
    * `POST /api/update`.
    * `POST /api/update` with `{url}`.

# Phase 08 (06-05-2018)

* [Cli] Connect to `mangarack-server` via management API.
* [App] Add `mangarack`:
  * Desktop application using `electron`.
  * Provide connection string and downloads client from `{serverUrl}/ui`.
  * Support automatic login and persist connection strings.
  * Automatically show `Local Server`.

# Phase 09 (20-05-2018)

* [Server] Add support for searching series.
  * `GET /api/search?d=`.

# Phase 10 (03-06-2018)

* [App] Add support for iOS.
* [Cli/Server] Add support for different home directory.

# Phase N (Future)

* Master feed with chapter changes across all providers?
* UI improvements?
* Schedule downloads on a recurring time?
* Update push notifications (new downloads)?
