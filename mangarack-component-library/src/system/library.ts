import * as mio from './module';
let fileService = mio.dependency.get<mio.IFileService>('IFileService');

/**
 * Represents the library.
 */
export let library: mio.ILibrary = {
  /**
   * Promises to create the series.
   * @return The promise to create the series.
   */
  create: function(): mio.ILibraryHandler<(seriesAddress: string) => Promise<mio.IOption<number>>> {
    return mio.createHandler((seriesAddress: string) => {
      return mio.taskService.enqueue(mio.PriorityType.High, async () => {
        if (isValid(seriesAddress)) {
          let context = await mio.contextService.getContextAsync();
          let provider = mio.openProvider(seriesAddress);
          let providerContext = context.providers[provider.name] || (context.providers[provider.name] = {series: {}});
          if (providerContext.series[seriesAddress]) {
            return providerContext.series[seriesAddress].id;
          } else {
            let series = await provider.seriesAsync(seriesAddress);
            let seriesContext = mio.createSeriesContext(context, series);
            let seriesImage = await series.imageAsync();
            await fileService().writeBlobAsync(`${provider.name}/${seriesContext.id}/previewImage`, seriesImage);
            providerContext.series[seriesAddress] = seriesContext;
            mio.contextService.saveChanges();
            return seriesContext.id;
          }
        } else {
          return undefined;
        }
      });
    });
  },

  /**
   * Promises to delete the series/chapter.
   * @param seriesId The series identifier.
   * @param chapterId= The chapter identifier.
   * @return The promise to delete the series/chapter.
   */
  delete: function(seriesId: number, chapterId?: number): any {
    if (!chapterId) {
      return mio.createHandler(async (removeMetadata: boolean) => {
        let context = await mio.contextService.getContextAsync();
        let seriesMatch = mio.findSeriesContext(context, seriesId);
        if (seriesMatch) {
          if (removeMetadata) {
            await fileService().deleteFolderAsync(`${seriesMatch.providerName}/${seriesId}`);
            delete seriesMatch.provider.series[seriesMatch.seriesAddress];
          } else {
            let series = seriesMatch.provider.series[seriesMatch.seriesAddress];
            for (let chapterMetadataDerivedKey in series.chapters) {
              if (series.chapters.hasOwnProperty(chapterMetadataDerivedKey)) {
                let chapter = series.chapters[chapterMetadataDerivedKey];
                await deleteAsync(seriesMatch.providerName, series, chapter, chapterMetadataDerivedKey);
              }
            }
          }
          mio.contextService.saveChanges();
          return true;
        } else {
          return false;
        }
      });
    } else {
      let narrowChapterId = chapterId;
      return mio.createHandler(async () => {
        let context = await mio.contextService.getContextAsync();
        let chapterMatch = mio.findChapterContext(context, seriesId, narrowChapterId);
        if (chapterMatch) {
          await deleteAsync(chapterMatch.providerName, chapterMatch.series, chapterMatch.chapter, chapterMatch.chapterMetadataDerivedKey);
          mio.contextService.saveChanges();
          return true;
        } else {
          return false;
        }
      });
    }
  },

  /**
   * Promises to download each `series metadata/the series metadata/the chapter`.
   * @param seriesId= The series identifier.
   * @param chapterId= The chapter identifier.
   * @return The promise to download each `series metadata/the series metadata/the chapter`.
   */
  download: function(seriesId?: number, chapterId?: number): mio.ILibraryHandler<any> {
    if (!seriesId) {
      return mio.createHandler((existingChapters: boolean, newChapters: boolean) => {
        return mio.taskService.enqueue(mio.PriorityType.Normal, () => downloadAsync(existingChapters, newChapters));
      });
    } else {
      let narrowSeriesId = seriesId;
      if (!chapterId) {
        return mio.createHandler((existingChapters: boolean, newChapters: boolean) => {
          return mio.taskService.enqueue(mio.PriorityType.High, () => downloadSeriesAsync(narrowSeriesId, existingChapters, newChapters));
        });
      } else {
        let narrowChapterId = chapterId;
        return mio.createHandler(() => {
          return mio.taskService.enqueue(mio.PriorityType.High, () => downloadChapterAsync(narrowSeriesId, narrowChapterId));
        });
      }
    }
  },

  /**
   * Promises the series/page image.
   * @param seriesId The series identifier.
   * @param chapterId= The chapter identifier.
   * @param pageNumber= The page number.
   * @return The promise for the series/page image.
   */
  imageAsync: async function(seriesId: number, chapterId?: number, pageNumber?: number): Promise<mio.IOption<mio.IBlob>> {
    let context = await mio.contextService.getContextAsync();
    let seriesMatch = mio.findSeriesContext(context, seriesId);
    if (seriesMatch) {
      if (!chapterId || !pageNumber) {
        return fileService().readBlobAsync(`${seriesMatch.providerName}/${seriesId}/previewImage`);
      } else {
        return fileService().readBlobAsync(`${seriesMatch.providerName}/${seriesId}/${chapterId}/${pageNumber}`);
      }
    } else {
      return undefined;
    }
  },

  /**
   * Promises the list of series/chapters.
   * @param seriesId= The series identifier.
   * @return The promise for the list of series/chapters.
   */
  listAsync: async function(seriesId?: number): Promise<any> {
    let context = await mio.contextService.getContextAsync();
    if (!seriesId) {
      return listSeries(context);
    } else {
      let seriesMatch = mio.findSeriesContext(context, seriesId);
      if (seriesMatch) {
        return listChapters(seriesMatch.series);
      } else {
        return undefined;
      }
    }
  },

  /**
   * Promises to set the password.
   * @return The promise to set the password.
   */
  password: function(): mio.ILibraryHandler<(password: string) => Promise<void>> {
    return mio.createHandler(async (password: string) => {
      let context = await mio.contextService.getContextAsync();
      context.password = password;
      mio.contextService.saveChanges();
    });
  },

  /**
   * Promises to propagate and archive the setting.
   * @param settings The settings.
   * @return The promise to propagate and archive the setting.
   */
  setting(): mio.ILibraryHandler<(key: string, value: string) => Promise<void>> {
    return mio.createHandler(async (key: string, value: string) => {
      let context = await mio.contextService.getContextAsync();
      context.settings[key] = value;
      mio.contextService.saveChanges();
      mio.settingService.set(key, value);
    });
  },

  /**
   * Promises to set the number of read pages status.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to set the number of read pages status.
   */
  status: function(seriesId: number, chapterId: number): mio.ILibraryHandler<(numberOfReadPages: number) => Promise<boolean>> {
    return mio.createHandler(async (numberOfReadPages: number) => {
      let context = await mio.contextService.getContextAsync();
      let chapterMatch = mio.findChapterContext(context, seriesId, chapterId);
      if (chapterMatch) {
        let numberOfPages = chapterMatch.chapter.numberOfPages;
        if (numberOfReadPages === 0 || (numberOfReadPages >= 0 && numberOfReadPages <= numberOfPages)) {
          let chapter = chapterMatch.chapter;
          chapter.lastReadAt = Date.now();
          chapter.numberOfReadPages = numberOfReadPages;
          mio.contextService.saveChanges();
          return true;
        }
      }
      return false;
    });
  },

  /**
   * Promises the version.
   * @return The promise for the version.
   */
  versionAsync: function(): Promise<{api: number}> {
    return Promise.resolve({api: mio.version});
  }
};

//
// TODO: CONTINUE FROM HERE. ABOVE AND OTHER FILES ARE DONE!!!!! BELIEVE YOURSELF!!!! The new library structure is much better. /mangafox/1/1
//

/**
 * Promises to delete the chapter.
 * @param providerName The provider name.
 * @param series The series.
 * @param chapter The chapter.
 * @param chapterMetadataDerivedKey The chapter metadata derived key.
 * @return The promise to delete the chapter.
 */
async function deleteAsync(providerName: string, series: mio.IContextSeries, chapter: mio.IContextChapter, chapterMetadataDerivedKey: string): Promise<void> {
  if (chapter.downloadedAt) {
    await fileService().deleteFolderAsync(`${providerName}/${series.id}/${chapter.id}`);
  }
  if (chapter.deletedAt) {
    delete series.chapters[chapterMetadataDerivedKey];
  } else {
    chapter.downloadedAt = undefined;
  }
}

/**
 * Promises to download each series metadata.
 * @param existingChapters If true, enqueue non-downloaded existing chapters for download.
 * @param newChapters If true, enqueue new chapters for download.
 * @return The promise to download each series metadata.
 */
async function downloadAsync(existingChapters: boolean, newChapters: boolean): Promise<void> {
  let context = await mio.contextService.getContextAsync();
  for (let providerName in context.providers) {
    if (context.providers.hasOwnProperty(providerName)) {
      let provider = context.providers[providerName];
      for (let seriesAddress in provider.series) {
        if (provider.series.hasOwnProperty(seriesAddress)) {
          let series = provider.series[seriesAddress];
          await downloadSeriesAsync(series.id, existingChapters, newChapters);
        }
      }
    }
  }
}



/**
 * Promises to download the chapter.
 * @param seriesId The series identifier.
 * @param chapterId The chapter identifier.
 * @return The promise to download the chapter.
 */
async function downloadChapterAsync(seriesId: number, chapterId: number): Promise<boolean> {
  let context = await mio.contextService.getContextAsync();
  let chapterMatch = mio.findChapterContext(context, seriesId, chapterId);
  if (chapterMatch && !chapterMatch.chapter.deletedAt && !chapterMatch.chapter.downloadedAt) {
    let series = await mio.openProvider(chapterMatch.providerName).seriesAsync(chapterMatch.seriesAddress);
    let chapters = mio.mapChapterKey(series.chapters, chapter => chapter);
    let contextChapter = chapterMatch.chapter;
    if (chapters[chapterMatch.chapterMetadataDerivedKey]) {
      await downloadKnownChapterAsync(chapterMatch.providerName, seriesId, contextChapter, chapters[chapterMatch.chapterMetadataDerivedKey]);
    } else {
      contextChapter.deletedAt = Date.now();
      mio.contextService.saveChanges();
    }
    return true;
  } else {
    return false;
  }
}

// notice me senpai, notice me.
async function downloadKnownChapterAsync(providerName: string, seriesId: number, contextChapter: mio.IContextChapter, chapter: mio.IChapter): Promise<void> {
  let pages = await chapter.pagesAsync();
  for (let page of pages) {
    let image = await page.imageAsync();
    await fileService().writeBlobAsync(`${providerName}/${seriesId}/${contextChapter.id}/${page.number}`, image);
  }
  contextChapter.downloadedAt = Date.now();
  contextChapter.numberOfPages = pages.length;
  mio.contextService.saveChanges();
}

/**
 * Promise to download the series metadata.
 * @param seriesId The series identifier.
 * @param existingChapters If true, enqueue non-downladed existing chapters for download.
 * @param newChapters If true, enqueue new chapters for download.
 * @return The promise to download the series metadata.
 */
async function downloadSeriesAsync(seriesId: number, existingChapters: boolean, newChapters: boolean): Promise<boolean> {
  let context = await mio.contextService.getContextAsync();
  let seriesMatch = mio.findSeriesContext(context, seriesId);
  if (seriesMatch) {
    let narrowSeriesMatch = seriesMatch;
    let coreSeries = await mio.openProvider(seriesMatch.providerName).seriesAsync(seriesMatch.seriesAddress);
    let coreSeriesImage = await coreSeries.imageAsync();
    let coreChapters = mio.mapChapterKey(coreSeries.chapters, chapter => chapter);
    let contextSeries = seriesMatch.series;

    // Update the series.
    await fileService().writeBlobAsync(`${seriesMatch.providerName}/${seriesId}/previewImage`, coreSeriesImage);
    contextSeries.checkedAt = Date.now();
    contextSeries.metadata = mio.copySeriesMetadata(coreSeries);

    // Check each core chapter to add new chapters and update existing ones.
    for (let metadataDerivedKey in coreChapters) {
      if (coreChapters.hasOwnProperty(metadataDerivedKey)) {
        let coreChapter = coreChapters[metadataDerivedKey];
        if (!contextSeries.chapters[metadataDerivedKey]) {
          let contextChapter = contextSeries.chapters[metadataDerivedKey] = mio.createChapterContext(contextSeries, coreChapter);
          if (newChapters) {
            mio.taskService.enqueue(mio.PriorityType.Low, () => downloadKnownChapterAsync(narrowSeriesMatch.providerName, seriesId, contextChapter, coreChapter));
          }
        } else {
          let contextChapter = contextSeries.chapters[metadataDerivedKey];
          contextChapter.deletedAt = undefined;
          contextChapter.metadata = mio.copyChapterMetadata(coreChapter);
          if (existingChapters && !contextChapter.deletedAt && !contextChapter.downloadedAt) {
            mio.taskService.enqueue(mio.PriorityType.Low, () => downloadKnownChapterAsync(narrowSeriesMatch.providerName, seriesId, contextChapter, coreChapter));
          }
        }
      }
    }

    // Check each context chapter to flag deleted chapters.
    for (let metadataDerivedKey in contextSeries.chapters) {
      if (!coreChapters[metadataDerivedKey]) {
        contextSeries.chapters[metadataDerivedKey].deletedAt = Date.now();
      }
    }

    // Save the changes.
    mio.contextService.saveChanges();
    return true;
  } else {
    return false;
  }
}

/**
 * Determines whether the series address is valid.
 * @param seriesAddress The series address.
 * @return Indicates whether the series address is valid.
 */
function isValid(seriesAddress: string): boolean {
  try {
    mio.openProvider(seriesAddress);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Promises the list of series.
 * @param seriesId The series identifier.
 * @return The promise for the list of series.
 */
function listChapters(series: mio.IContextSeries): mio.ILibraryChapter[] {
  let result: mio.ILibraryChapter[] = [];
  for (let chapterMetadataDerivedKey in series.chapters) {
    if (series.chapters.hasOwnProperty(chapterMetadataDerivedKey)) {
      let chapter = series.chapters[chapterMetadataDerivedKey];
      result.push({
        addedAt: chapter.addedAt,
        deletedAt: chapter.deletedAt,
        downloadedAt: chapter.downloadedAt,
        id: chapter.id,
        lastReadAt: chapter.lastReadAt,
        metadata: chapter.metadata,
        numberOfPages: chapter.numberOfPages,
        numberOfReadPages: chapter.numberOfReadPages
      });
    }
  }
  return result;
}

/**
 * Promises the list of series.
 * @param context The context.
 * @return The promise for the list of series.
 */
function listSeries(context: mio.IContext): mio.ILibrarySeries[] {
  let result: mio.ILibrarySeries[] = [];
  for (let providerName in context.providers) {
    if (context.providers.hasOwnProperty(providerName)) {
      let provider = context.providers[providerName];
      for (let seriesAddress in provider.series) {
        if (provider.series.hasOwnProperty(seriesAddress)) {
          let series = provider.series[seriesAddress];
          result.push({
            addedAt: series.addedAt,
            checkedAt: series.checkedAt,
            id: series.id,
            lastChapterAddedAt: mio.queryMax(series.chapters, chapter => chapter.addedAt),
            lastChapterReadAt: mio.queryMax(series.chapters, chapter => chapter.lastReadAt),
            metadata: series.metadata,
            numberOfChapters: Object.keys(series.chapters).length,
            numberOfReadChapters: mio.queryCount(series.chapters, listSeriesIsRead),
            providerName: providerName,
            seriesAddress: seriesAddress
          });
        }
      }
    }
  }
  return result;
}

/**
 * Determines whether the chapter has been read.
 * @param chapter The chapter.
 * @return Indicates whether the chapter has been read.
 */
function listSeriesIsRead(chapter: mio.IContextChapter): boolean {
  return Boolean(chapter.numberOfPages) && chapter.numberOfReadPages === chapter.numberOfPages;
}
