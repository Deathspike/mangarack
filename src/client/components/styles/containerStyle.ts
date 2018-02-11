import * as mio from '../../';

export const containerStyle = {
  primaryButton: mio.withStyle({
    marginLeft: -20,
    marginRight: 20,
  }),
  typography: mio.withStyle({
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }),
  secondaryButton: mio.withStyle({
    marginRight: -20
  }),
  container: mio.withStyle({
    bottom: 0,
    left: 0,
    margin: '0 auto',
    maxWidth: 640,
    overflowY: 'scroll',
    position: 'absolute',
    right: 0,
    top: 64
  })
};
