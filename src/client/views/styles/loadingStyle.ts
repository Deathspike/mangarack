import * as mio from '../../';

export const loadingStyle = {
  container: mio.withStyle({
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    top: 0
  }),
  circularProgress: mio.withStyle({
    background: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 4,
    color: 'white',
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  })
};
