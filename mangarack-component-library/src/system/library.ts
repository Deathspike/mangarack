'use strict';
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
  create: function(): mio.ILibraryHandler<(seriesAddress: string) => mio.IOptionPromise<number>> {
    return mio.createHandler((seriesAddress: string) => {
      return mio.taskService.enqueue(mio.PriorityType.High, async () => {
        let coreProvider = mio.openProvider(seriesAddress);
        let context = await mio.contextService.getContextAsync();
        let contextProvider = context.providers[coreProvider.name] || (context.providers[coreProvider.name] = {series: {}});
        if (contextProvider.series[seriesAddress]) {
          return mio.option(contextProvider.series[seriesAddress].id);
        } else {
          let coreSeries = await coreProvider.seriesAsync(seriesAddress);
          let coreSeriesImage = await coreSeries.imageAsync();
          let contextSeries = mio.createContextSeries(context, coreSeries);
          await fileService().writeBlobAsync(`${contextSeries.id}/previewImage.mrx`, coreSeriesImage);
          contextProvider.series[seriesAddress] = contextSeries;
          mio.contextService.saveChanges();
          return mio.option(contextSeries.id);
        }
      });
    });
  },

  /**
   * Promises to delete the series/chapter.
   * @param seriesId The series identifier.
   * @param chapterId= The chapter= identifier.
   * @return The promise to delete the series/chapter.
   */
  deleteAsync: async function(seriesId: number, chapterId?: number): Promise<boolean> {
    let context = await mio.contextService.getContextAsync();
    if (chapterId == null) {
      let seriesResult = mio.findContextSeries(context, seriesId);
      if (seriesResult.hasValue) {
        await fileService().deleteFolderAsync(`${seriesId}`);
        delete seriesResult.value.provider.series[seriesResult.value.seriesAddress];
        mio.contextService.saveChanges();
        return true;
      }
    } else {
      let chapterResult = mio.findContextChapter(context, seriesId, chapterId);
      if (chapterResult.hasValue) {
        if (chapterResult.value.chapter.deletedAt.hasValue) {
          await fileService().deleteFolderAsync(`${seriesId}/${chapterId}`);
          delete chapterResult.value.series.chapters[chapterResult.value.chapterMetadataDerivedKey];
          mio.contextService.saveChanges();
          return true;
        } else {
          await fileService().deleteFolderAsync(`${seriesId}/${chapterId}`);
          chapterResult.value.chapter.downloadedAt = mio.option<number>();
          mio.contextService.saveChanges();
          return true;
        }
      }
    }
    return false;
  },

  /**
   * Promises to download each `series metadata/the series metadata/the chapter`.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to download each `series metadata/the series metadata/the chapter`.
   */
  download: function(seriesId?: number, chapterId?: number): mio.ILibraryHandler<any> {
    if (seriesId == null && chapterId == null) {
      return mio.createHandler((existingChapters: boolean, newChapters: boolean) => {
        return mio.taskService.enqueue(mio.PriorityType.Normal, () => downloadAsync(existingChapters, newChapters));
      });
    } else if (chapterId == null) {
      return mio.createHandler((existingChapters: boolean, newChapters: boolean) => {
        return mio.taskService.enqueue(mio.PriorityType.High, () => downloadSeriesAsync(seriesId, existingChapters, newChapters));
      });
    } else {
      return mio.createHandler(() => {
        return mio.taskService.enqueue(mio.PriorityType.High, () => downloadChapterAsync(seriesId, chapterId));
      });
    }
  },

  /**
   * Promises the series/page image.
   * @param seriesId The series identifier.
   * @param chapterId= The chapter identifier.
   * @param pageNumber= The page number.
   * @return The promise for the series/page image.
   */
  imageAsync: function(seriesId: number, chapterId?: number, pageNumber?: number): mio.IOptionPromise<mio.IBlob> {
    if (chapterId == null || pageNumber == null) {
      return fileService().readBlobAsync(`${seriesId}/previewImage.mrx`);
    } else {
      return fileService().readBlobAsync(`${seriesId}/${chapterId}/${pageNumber}.mrx`);
    }
  },

  /**
   * Promises the list of series/chapters.
   * @param seriesId The series identifier.
   * @return The promise for the list of series/chapters.
   */
  listAsync: async function(seriesId?: number): Promise<any> {
    let context = await mio.contextService.getContextAsync();
    if (seriesId == null) {
      return listSeries(context);
    } else {
      let seriesResult = mio.findContextSeries(context, seriesId);
      if (seriesResult.hasValue) {
        return mio.option(listChapters(seriesResult.value.series));
      } else {
        return mio.option<mio.ILibraryChapter[]>();
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
      context.password = mio.option(password);
      mio.contextService.saveChanges();
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
      let chapterResult = mio.findContextChapter(context, seriesId, chapterId);
      if (chapterResult.hasValue) {
        let numberOfPages = chapterResult.value.chapter.numberOfPages;
        if (numberOfReadPages === 0 || (numberOfPages.hasValue && numberOfReadPages >= 0 && numberOfReadPages <= numberOfPages.value)) {
          let chapter = chapterResult.value.chapter;
          chapter.lastReadAt = mio.option(Date.now());
          chapter.numberOfReadPages = numberOfReadPages;
          mio.contextService.saveChanges();
          return true;
        }
      }
      return false;
    });
  }
};

/**
 * Promises to download each series metadata.
 * @param existingChapters If true, enqueue non-downloaded existing chapters for download.
 * @param newChapters If true, enqueue new chapters for download.
 * @return The promise to download each series metadata.
 */
async function downloadAsync(existingChapters: boolean, newChapters: boolean): Promise<void> {
  let context = await mio.contextService.getContextAsync();
  for (let providerName in context.providers) {
    let provider = context.providers[providerName];
    for (let seriesAddress in provider.series) {
      let series = provider.series[seriesAddress];
      await downloadSeriesAsync(series.id, existingChapters, newChapters);
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
  let chapterResult = mio.findContextChapter(context, seriesId, chapterId);
  if (chapterResult.hasValue && chapterResult.value.chapter.downloadedAt.hasValue) {
    let coreSeries = await mio.openProvider(chapterResult.value.providerName).seriesAsync(chapterResult.value.seriesAddress);
    let coreChapters = mio.mapByChapterKey(coreSeries.chapters, chapter => chapter);
    let contextChapter = chapterResult.value.chapter;
    if (coreChapters[chapterResult.value.chapterMetadataDerivedKey]) {
      let coreChapter = coreChapters[chapterResult.value.chapterMetadataDerivedKey];
      let corePages = await coreChapter.pagesAsync();
      for (let corePage of corePages) {
        let image = await corePage.imageAsync();
        await fileService().writeBlobAsync(`${seriesId}/${chapterId}/${corePage.number}.mrx`, image);
      }
      contextChapter.downloadedAt = mio.option(Date.now());
      contextChapter.metadata = mio.copyChapterMetadata(coreChapter);
      contextChapter.numberOfPages = mio.option(corePages.length);
    } else {
      contextChapter.deletedAt = mio.option(Date.now());
    }
    mio.contextService.saveChanges();
    return true;
  } else {
    return false;
  }
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
  let seriesResult = mio.findContextSeries(context, seriesId);
  if (seriesResult.hasValue) {
    let coreSeries = await mio.openProvider(seriesResult.value.providerName).seriesAsync(seriesResult.value.seriesAddress);
    let coreSeriesImage = await coreSeries.imageAsync();
    let coreChapters = mio.mapByChapterKey(coreSeries.chapters, chapter => chapter);
    let contextSeries = seriesResult.value.series;

    // Update the series.
    await fileService().writeBlobAsync(`${seriesId}/previewImage.mrx`, coreSeriesImage);
    contextSeries.checkedAt = Date.now();
    contextSeries.metadata = mio.copySeriesMetadata(coreSeries);

    // Update the chapters and create chapters when applicable.
    for (let metadataDerivedKey in coreChapters) {
      let coreChapter = coreChapters[metadataDerivedKey];
      if (!contextSeries.chapters[metadataDerivedKey]) {
        let contextChapter = contextSeries.chapters[metadataDerivedKey] = mio.createContextChapter(context, coreChapter);
        if (newChapters) {
          mio.taskService.enqueue(mio.PriorityType.Low, () => downloadChapterAsync(seriesId, contextChapter.id));
        }
      } else {
        let contextChapter = contextSeries.chapters[metadataDerivedKey];
        contextChapter.metadata = mio.copyChapterMetadata(coreChapter);
        if (existingChapters && !contextChapter.downloadedAt.hasValue) {
          mio.taskService.enqueue(mio.PriorityType.Low, () => downloadChapterAsync(seriesId, contextChapter.id));
        }
      }
    }

    // Update the delete time of removed chapters.
    for (let metadataDerivedKey in contextSeries.chapters) {
      if (!coreChapters[metadataDerivedKey]) {
        contextSeries.chapters[metadataDerivedKey].deletedAt = mio.option(Date.now());
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
 * Promises for the list of series.
 * @param seriesId The series identifier.
 * @return The promise for the list of series.
 */
function listChapters(series: mio.IContextSeries): mio.ILibraryChapter[] {
  let result: mio.ILibraryChapter[] = [];
  for (let chapterMetadataDerivedKey in series.chapters) {
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
  return result;
}

/**
 * Promises for the list of series.
 * @param context The context.
 * @return The promise for the list of series.
 */
function listSeries(context: mio.IContext): mio.ILibrarySeries[] {
  let result: mio.ILibrarySeries[] = [];
  for (let providerName in context.providers) {
    let provider = context.providers[providerName];
    for (let seriesAddress in provider.series) {
      let series = provider.series[seriesAddress];
      result.push({
        addedAt: series.addedAt,
        chapterLastAddedAt: mio.queryMax(series.chapters, chapter => chapter.addedAt),
        chapterLastReadAt: mio.queryMaxOption(series.chapters, chapter => chapter.lastReadAt),
        checkedAt: series.checkedAt,
        id: series.id,
        metadata: series.metadata,
        numberOfChapters: Object.keys(series.chapters).length,
        numberOfReadChapters: mio.queryCount(series.chapters, listSeriesIsRead),
        providerName: providerName,
        seriesAddress: seriesAddress
      });
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
  return chapter.numberOfPages.hasValue && chapter.numberOfReadPages === chapter.numberOfPages.value;
}
