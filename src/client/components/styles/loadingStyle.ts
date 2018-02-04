import * as mio from '../../';

export const loadingStyle = {
  icon: mio.withStyle({
    background: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 4,
    color: '#FFFFFF',
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 1
  })
};
