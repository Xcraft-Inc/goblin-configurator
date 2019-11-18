import {ColorManipulator} from 'electrum-theme';

/******************************************************************************/

export default function styles(theme) {
  const appIcon = {
    'position': 'relative',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'width': '350px',
    'height': '150px',
    'margin': '10px 10px 0px 0px',
    'borderRadius': '10px',
    'backgroundColor': theme.palette.notificationBackground,
    'userSelect': 'none',
    'cursor': 'pointer',
    'transition': theme.transitions.easeOut(),
    ':hover': {
      color: 'white',
      backgroundColor: ColorManipulator.darken(
        theme.palette.notificationBackground,
        0.2
      ),
    },
  };

  const text = {
    flexGrow: 1,
    padding: '0px 0px 0px 20px',
    fontSize: '120%',
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
