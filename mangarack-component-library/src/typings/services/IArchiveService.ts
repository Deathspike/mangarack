import * as mio from '../../default';

/**
 * Represents a archive service.
 */
export interface IArchiveService {
  /**
   * Promises to retrieve the main archive.
   * @return The promise for the main archive.
   */
  getMainAsync: () => Promise<mio.IMainArchive>;

  /**
   * Promises to retrieve the series archive.
   * @param seriesId The series identifier.
   * @return The promise for the series archive.
   */
  getSeriesAsync: (seriesId: number) => Promise<mio.ISeriesArchive>;

  /**
   * Promises to retrieve the user archive.
   * @return The promise for the read user archive.
   */
  getUserAsync: () => Promise<mio.IUserArchive>;

  /**
   * Promises to save the main archive.
   * @param archive The main archive.
   * @return The promise for the completion of the save.
   */
  saveMainAsync: (archive: mio.IMainArchive) => Promise<void>;

  /**
   * Promises to save the series archive.
   * @param seriesId The series identifier.
   * @param archive The series archive.
   * @return The promise for the completion of the save.
   */
  saveSeriesAsync: (seriesId: number, archive: mio.ISeriesArchive) => Promise<void>;

  /**
   * Promises to save the user archive.
   * @param archive The user archive.
   * @return The promise for the completion of the save.
   */
  saveUserAsync: (archive: mio.IUserArchive) => Promise<void>;
}
