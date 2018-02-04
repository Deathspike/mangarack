import * as mio from '../../';

export const containerStyle = {
  container: mio.withStyle({
    bottom: 0,
    left: 0,
    overflowY: 'scroll',
    position: 'absolute',
    right: 0,
    top: 64 // TODO: 64 is not entirely correct with different screensizes
  }),
  menuIcon: mio.withStyle({
    marginLeft: -20,
    marginRight: 20,
  }),
  header: mio.withStyle({
    flex: 1
  })
};
