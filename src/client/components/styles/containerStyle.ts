import * as mio from '../../';

export const containerStyle = {
  container: mio.withStyle({
    bottom: 0,
    left: 0,
    margin: '0 auto',
    maxWidth: 640,
    overflowY: 'scroll',
    position: 'absolute',
    right: 0,
    top: 64
  }),
  menuIcon: mio.withStyle({
    marginLeft: -20,
    marginRight: 20,
  }),
  header: mio.withStyle({
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  })
};
