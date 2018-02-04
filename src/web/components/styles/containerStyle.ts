import * as mio from '../../';

export const containerStyle = {
  container: mio.createStyle({
    bottom: 0,
    left: 0,
    overflowY: 'scroll',
    position: 'absolute',
    right: 0,
    top: 64 // TODO: 64 is not entirely correct with different screensizes
  }),
  header: mio.createStyle({
    flex: 1
  })
};
