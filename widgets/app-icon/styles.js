import {ColorManipulator} from 'electrum-theme';

/******************************************************************************/

export default function styles(theme) {
  const appIcon = {
    'position': 'relative',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'width': '350px',
    'height': '100px',
    'margin': '20px',
    'borderRadius': '5px',
    'backgroundColor': theme.palette.notificationBackground,
    'userSelect': 'none',
    'cursor': 'pointer',
    'transition': theme.transitions.easeOut(),
    ':hover': {
      backgroundColor: ColorManipulator.lighten(
        theme.palette.notificationBackground,
        0.1
      ),
    },
  };

  const text = {
    textAlign: 'center',
  };

  const closeBox = {
    position: 'absolute',
    top: '32px',
    right: '10px',
  };

  return {appIcon, text, closeBox};
}

/******************************************************************************/
