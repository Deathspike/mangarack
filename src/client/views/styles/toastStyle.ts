import * as mio from '../../';

export const toastStyle = {
  container: mio.withStyle({
    bottom: 0,
    left: 0,
    margin: 8,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0
  }),
  item: mio.withStyle({
    background: 'rgba(0, 0, 0, 0.75)',
    color: 'white',
    padding: 8,
    pointerEvents: 'none',
    marginTop: 8,
    maxWidth: 256
  })
};