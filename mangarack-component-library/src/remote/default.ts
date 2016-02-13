/*
Verb   Url                                       Status  Implementation                   Required
------ ----------------------------------------- ------- -------------------------------- ------------------
GET    /content/:seriesId                        200|404 ISeriesLibrary.previewImageAsync
GET    /content/:seriesId/:chapterId/:pageNumber 200|404 IPageLibrary.imageAsync
GET    /library                                  200     ISeriesLibrary.viewAsync
POST   /library                                  200|404 ISeriesLibrary.createAsync       seriesAddress
DELETE /library/:seriesId                        200|404 ISeriesLibrary.deleteAsync
GET    /library/:seriesId                        200|404 IChapterLibrary.viewAsync
DELETE /library/:seriesId/:chapterId             200|404 IChapterLibrary.deleteAsync
PUT    /library/:seriesId/:chapterId             200|404 IPageLibrary.statusAsync         numberOfReadPages
GET    /update                                   200     ISeriesLibrary.updateAsync       enqueueNewChapters
GET    /update/:seriesId                         200|404 IChapterLibrary.updateAsync      enqueueNewChapters
GET    /update/:seriesId/:chapterId              200|404 IPageLibrary.downloadAsync
*/

/*
TODO: `openLibraryRemoteAsync` over a `HttpService` binding.
*/
