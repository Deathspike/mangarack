import * as mio from '../../';

export const containerStyle = {
  container: mio.withStyle({
    bottom: 0,
    left: 0,
    overflowY: 'scroll',
    position: 'absolute',
    right: 0,
    top: 56
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
