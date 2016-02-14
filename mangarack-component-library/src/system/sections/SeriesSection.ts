import * as mio from '../module';
let fileService = mio.dependency.get<mio.IFileService>('IFileService');

/**
 * Represents the library.
 */
export class Library implements mio.ILibrary {
  private _context: mio.IContext;

  /**
   * Initializes a new instance of the Library class.
   * @param context The context.
   */
  constructor(context: mio.IContext) {
    this._context = context;
  }

  /**
   * Promises to create the series.
   * @return The promise to create the series.
   */
  create(): mio.ILibraryHandler<(seriesAddress: string) => mio.IOptionPromise<number>> {
    return mio.createHandler(async (seriesAddress: string) => {
      return await mio.taskService.enqueue(mio.PriorityType.High, async () => {
        let coreProvider = mio.openProvider(seriesAddress);
        let contextProvider = this._context.providers[coreProvider.name] || (this._context.providers[coreProvider.name] = {series: {}});
        if (contextProvider.series[seriesAddress]) {
          return mio.option(contextProvider.series[seriesAddress].id);
        } else {
          let coreSeries = await coreProvider.seriesAsync(seriesAddress);
          let contextSeries = mio.createContextSeries(coreSeries);
          contextProvider.series[seriesAddress] = contextSeries;
          await mio.contextService.saveChangesAsync();
          return mio.option(contextSeries.id);
        }
      });
    });
  }

  /**
   * Promises to delete the series/chapter.
   * @param seriesId The series identifier.
   * @param chapterId= The chapter= identifier.
   * @return The promise to delete the series/chapter.
   */
  async deleteAsync(seriesId: number, chapterId?: number): Promise<boolean> {
    if (chapterId == null) {
      let seriesResult = mio.findContextSeries(this._context, seriesId);
      if (seriesResult.value != null) {
        delete seriesResult.value.provider.series[seriesResult.value.seriesAddress];
        await fileService().deleteAsync(`${seriesId}`);
        await mio.contextService.saveChangesAsync();
        return true;
      }
    } else {
      let chapterResult = mio.findContextChapter(this._context, seriesId, chapterId);
      if (chapterResult.value != null) {
        if (chapterResult.value.chapter.deletedAt.value != null) {
          delete chapterResult.value.series.chapters[chapterResult.value.chapterMetadataDerivedKey];
          await fileService().deleteAsync(`${seriesId}/${chapterId}`);
          await mio.contextService.saveChangesAsync();
          return true;
        } else {
          chapterResult.value.chapter.downloadedAt = mio.option<number>();
          await fileService().deleteAsync(`${seriesId}/${chapterId}`);
          await mio.contextService.saveChangesAsync();
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Promises to download each `series metadata/the series metadata/the chapter`.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to download each `series metadata/the series metadata/the chapter`.
   */
  download(seriesId?: number, chapterId?: number): any {
    if (seriesId == null && chapterId == null) {
      return mio.createHandler((existingChapters: boolean, newChapters: boolean) => {
        return mio.taskService.enqueue(mio.PriorityType.Normal, () => this._downloadAsync(existingChapters, newChapters));
      });
    } else if (chapterId == null) {
      return mio.createHandler((existingChapters: boolean, newChapters: boolean) => {
        return mio.taskService.enqueue(mio.PriorityType.High, () => this._downloadSeriesAsync(seriesId, existingChapters, newChapters));
      });
    } else {
      return mio.createHandler(() => {
        return mio.taskService.enqueue(mio.PriorityType.High, () => this._downloadChapterAsync(seriesId, chapterId));
      });
    }
  }

  /**
   * Promises the series/page image.
   * @param seriesId The series identifier.
   * @param chapterId= The chapter identifier.
   * @param pageNumber= The page number.
   * @return The promise for the series/page image.
   */
  imageAsync(seriesId: number, chapterId?: number, pageNumber?: number): mio.IOptionPromise<mio.IBlob> {
    if (chapterId == null || pageNumber == null) {
      return fileService().readBlobAsync(`${seriesId}/image.mrx`);
    } else {
      return fileService().readBlobAsync(`${seriesId}/${chapterId}/${pageNumber}.mrx`);
    }
  }

  /**
   * Promises the list of series/chapters.
   * @param seriesId The series identifier.
   * @return The promise for the list of series/chapters.
   */
  listAsync(seriesId?: number): any {
    if (seriesId == null) {
      return Promise.resolve(this._listSeries());
    } else {
      let seriesResult = mio.findContextSeries(this._context, seriesId);
      if (seriesResult.value != null) {
        return Promise.resolve(mio.option(this._listChapters(seriesResult.value.series)));
      } else {
        return Promise.resolve(mio.option<mio.ILibraryChapter[]>());
      }
    }
  }

  /**
   * Promises to set the password.
   * @return The promise to set the password.
   */
  password(): mio.ILibraryHandler<(password: string) => Promise<void>> {
    return mio.createHandler(async (password: string) => {
      this._context.password = mio.option(password);
      await mio.contextService.saveChangesAsync();
    });
  }

  /**
   * Promises to set the number of read pages status.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to set the number of read pages status.
   */
  status(seriesId: number, chapterId: number): mio.ILibraryHandler<(numberOfReadPages: number) => Promise<boolean>> {
    return mio.createHandler(async (numberOfReadPages: number) => {
      let chapterResult = mio.findContextChapter(this._context, seriesId, chapterId);
      if (chapterResult.value != null) {
        let numberOfPages = chapterResult.value.chapter.numberOfPages.value;
        if (numberOfReadPages === 0 || (numberOfPages != null && numberOfReadPages >= 0 && numberOfReadPages <= numberOfPages)) {
          let chapter = chapterResult.value.chapter;
          chapter.lastReadAt = mio.option(Date.now());
          chapter.numberOfReadPages = numberOfReadPages;
          await mio.contextService.saveChangesAsync();
          return true;
        }
      }
      return false;
    });
  }

  /**
   * Promises to download each series metadata.
   * @param existingChapters If true, enqueue non-downloaded existing chapters for download.
   * @param newChapters If true, enqueue new chapters for download.
   * @return The promise to download each series metadata.
   */
  private async _downloadAsync(existingChapters: boolean, newChapters: boolean): Promise<void> {
    for (let providerName in this._context.providers) {
      let provider = this._context.providers[providerName];
      for (let seriesAddress in provider.series) {
        let series = provider.series[seriesAddress];
        await this._downloadSeriesAsync(series.id, existingChapters, newChapters);
      }
    }
  }

  /**
   * Promises to download the chapter.
   * @param seriesId The series identifier.
   * @param chapterId The chapter identifier.
   * @return The promise to download the chapter.
   */
  private async _downloadChapterAsync(seriesId: number, chapterId: number): Promise<boolean> {
    let chapterResult = mio.findContextChapter(this._context, seriesId, chapterId);
    if (chapterResult.value != null && chapterResult.value.chapter.downloadedAt.value == null) {
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
      await mio.contextService.saveChangesAsync();
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
  private async _downloadSeriesAsync(seriesId: number, existingChapters: boolean, newChapters: boolean): Promise<boolean> {
    let seriesResult = mio.findContextSeries(this._context, seriesId);
    if (seriesResult.value != null) {
      let coreSeries = await mio.openProvider(seriesResult.value.providerName).seriesAsync(seriesResult.value.seriesAddress);
      let coreSeriesImage = await coreSeries.imageAsync();
      let coreChapters = mio.mapByChapterKey(coreSeries.chapters, chapter => chapter);
      let contextSeries = seriesResult.value.series;

      // Update the series.
      contextSeries.checkedAt = Date.now();
      contextSeries.metadata = mio.copySeriesMetadata(coreSeries);
      await fileService().writeBlobAsync(`${seriesId}/image.mrx`, coreSeriesImage);

      // Update the chapters and create chapters when applicable.
      for (let metadataDerivedKey in coreChapters) {
        let coreChapter = coreChapters[metadataDerivedKey];
        if (!contextSeries.chapters[metadataDerivedKey]) {
          let contextChapter = contextSeries.chapters[metadataDerivedKey] = mio.createContextChapter(coreChapter);
          if (newChapters) {
            mio.taskService.enqueue(mio.PriorityType.Low, () => this._downloadChapterAsync(seriesId, contextChapter.id));
          }
        } else {
          let contextChapter = contextSeries.chapters[metadataDerivedKey];
          contextChapter.metadata = mio.copyChapterMetadata(coreChapter);
          if (existingChapters && contextChapter.downloadedAt.value == null) {
            mio.taskService.enqueue(mio.PriorityType.Low, () => this._downloadChapterAsync(seriesId, contextChapter.id));
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
      await mio.contextService.saveChangesAsync();
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
  private _listChapters(series: mio.IContextSeries): mio.ILibraryChapter[] {
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
   * @return The promise for the list of series.
   */
  private _listSeries(): mio.ILibrarySeries[] {
    let result: mio.ILibrarySeries[] = [];
    for (let providerName in this._context.providers) {
      let provider = this._context.providers[providerName];
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
          numberOfReadChapters: mio.queryCount(series.chapters, chapter => chapter.numberOfReadPages === chapter.numberOfPages.value),
          providerName: providerName,
          seriesAddress: seriesAddress
        });
      }
    }
    return result;
  }
}
