import * as mio from '../module';
let fileService = mio.dependency.get<mio.IFileService>('IFileService');

/**
 * Represents a series section.
 */
export class SeriesSection implements mio.ISeriesLibrary {
  private _context: mio.IContext;

  /**
   * Initializes a new instance of the SeriesSection class.
   * @param context The context.
   */
  constructor(context: mio.IContext) {
    this._context = context;
  }

  /**
   * Promises the chapter library.
   * @param seriesId The series identifier.
   * @return The promise for the chapter library.
   */
  chaptersAsync(seriesId: number): Promise<mio.IOption<mio.IChapterLibrary>> {
    let match = mio.findChild(this._context.providers, provider => provider.series, series => series.id === seriesId);
    if (match.value != null) {
      return Promise.resolve(mio.option(new mio.ChapterSection(match.value[2])));
    } else {
      return Promise.resolve(mio.option<mio.IChapterLibrary>());
    }
  }

  /**
   * Promises to create the series.
   * @param seriesAddress The series address.
   * @return The promise to create the series.
   */
  async createAsync(seriesAddress: string): Promise<mio.IOption<number>> {
    return await mio.taskService.enqueue(mio.PriorityType.High, async function(): Promise<mio.IOption<number>> {
      // Initialize the provider.
      let provider = mio.openProvider(seriesAddress);

      // Create the provider when applicable.
      if (!this._context.providers[provider.name]) {
        this._context.providers[provider.name] = {series: {}};
      }

      // Create the series when applicable.
      if (this._context.providers[provider.name].series[seriesAddress]) {
        return mio.option(this._context.providers[provider.name].series[seriesAddress].id)
      } else {
        // Fetch the series.
        let id = ++this._context.lastId;
        let series = await provider.seriesAsync(seriesAddress);

        // Add the series.
        this._context.providers[provider.name].series[seriesAddress] = {
          addedAt: Date.now(),
          chapters: mio.mapObject(series.chapters, mio.adaptChapterToKey, mio.adaptChapterToContext),
          checkedAt: Date.now(),
          id: id,
          metadata: mio.copySeriesMetadata(series)
        };

        // Save the context.
        await mio.contextService.writeContext();
        return mio.option(id);
      }
    });
  }

  /**
   * Promises to delete the series.
   * @param seriesId The series identifier.
   * @return The promise to delete the series.
   */
  async deleteAsync(seriesId: number): Promise<boolean> {
    let match = mio.findChild(this._context.providers, provider => provider.series, series => series.id === seriesId);
    if (match.value != null) {
      delete this._context.providers[match.value[0]].series[match.value[1]];
      await fileService().deleteAsync(mio.pathOfSeries(seriesId));
      await mio.contextService.writeContext();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Promises to update each series.
   * @param enqueueNewChapters If true, enqueues new chapters for download.
   * @return The promise to update each series.
   */
  async updateAsync(enqueueNewChapters: boolean): Promise<void> {
    for (let providerName in this._context.providers) {
      let provider = this._context.providers[providerName];
      for (let seriesAddress in provider.series) {
        let series = provider.series[seriesAddress];
        let section = await this.chaptersAsync(series.id);
        if (section.value != null) {
          await section.value.updateAsync(enqueueNewChapters);
        }
      }
    }
  }

  /**
   * Promises the preview image.
   * @param seriesId The series identifier.
   * @return The promise for the preview image.
   */
  previewImageAsync(seriesId: number): Promise<mio.IOption<mio.IBlob>> {
    return fileService().readBlobAsync(mio.pathOfSeriesPreviewImage(seriesId));
  }

  /**
   * Promises a list of series.
   * @return The promise for the list of series.
   */
  viewAsync(): Promise<mio.ISeriesLibraryItem[]> {
    let result = mio.mapArrayChild(this._context.providers, provider => provider.series, (series, seriesAddress, providerName) => ({
      addedAt: series.addedAt,
      chapterAddedAt: 0, /* TODO: Add the query. */
      chapterLastReadAt: 0, /* TODO: Add the query. */
      checkedAt: series.checkedAt,
      id: series.id,
      metadata: series.metadata,
      numberOfChapters: Object.keys(series.chapters).length,
      numberOfReadChapters: 0, /* TODO: Add the query. */
      providerName: providerName,
      seriesAddress: seriesAddress
    }));
    return Promise.resolve(result);
  }
}
