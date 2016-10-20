import * as mio from '../default';

/**
 * Represents the helper service.
 */
 export let helperService: mio.IHelperService = {
   /**
    * Retrieves the content type for the image.
    * @param image The image.
    * @return The content type.
    */
   getContentType: function(image: mio.IBlob): string {
     switch (getImageType(image)) {
       case mio.ImageType.Jpg:
         return 'image/jpeg';
       case mio.ImageType.Gif:
         return 'image/gif';
       case mio.ImageType.Png:
         return 'image/png';
       default:
         return 'application/octet-stream';
     }
   },

   /**
    * Parses the value to a boolean.
    * @param value The value.
    * @return The boolean.
    */
   parseBoolean: function(value: any): {hasValue: boolean, value: boolean} {
     if (value) {
       return {hasValue: true, value: /^on|true|yes|1$/.test(value)};
     } else {
       return {hasValue: false, value: false};
     }
   }
 };

 /**
  * Retrieves the image type.
  * @param image The image.
  * @return The image type.
  */
 function getImageType(image: mio.IBlob): mio.ImageType {
   let buffer = image as Buffer;
   if (buffer.slice(0, 3).toString('hex') === '474946') {
     return mio.ImageType.Gif;
   } else if (buffer.slice(0, 2).toString('hex') === 'ffd8') {
     return mio.ImageType.Jpg;
   } else if (buffer.slice(0, 4).toString('hex') === '89504e47') {
     return mio.ImageType.Png;
   } else {
     return mio.ImageType.Unknown;
   }
 }
