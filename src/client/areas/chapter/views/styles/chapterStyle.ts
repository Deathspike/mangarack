import * as mio from '../../';

export const chapterStyle = {
  imageContainer: mio.withStyle({
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    top: 0
  }),
  image: mio.withStyle({
    display: 'block',
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  })
};
