import * as mio from '../../';

export const containerStyle = {
  container: mio.createStyle({
    bottom: 0,
    left: 0,
    overflowY: 'scroll',
    position: 'absolute',
    right: 0,
    top: 64
  }),
  header: mio.createStyle({
    flex: 1
  })
};
