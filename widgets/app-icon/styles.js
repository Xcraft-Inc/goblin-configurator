import {ColorManipulator} from 'electrum-theme';

/******************************************************************************/

export default function styles(theme) {
  const appIcon = {
    'position': 'relative',
    'display': 'flex',
    'justifyContent': 'flex-start',
    'alignItems': 'center',
    'flexGrow': '1',
    'minWidth': '150px',
    'maxWidth': '500px',
    'height': '100px',
    'margin': '10px 10px 0px 0px',
    'padding': '0px 10px 0px 30px',
    'borderRadius': '10px',
    'color': '#ddd',
    'backgroundColor': theme.palette.notificationBackground,
    'userSelect': 'none',
    'cursor': 'pointer',
    'transition': '0.2s ease-out',
    ':hover': {
      color: 'white',
      backgroundColor: ColorManipulator.darken(
        theme.palette.notificationBackground,
        0.2
      ),
    },
  };

  const glyph = {
    fontSize: '200%',
  };

  const text = {
    marginLeft: '30px',
    fontSize: '120%',
    textTransform: 'uppercase',
  };

  const closeBox = {
    'position': 'absolute',
    'top': '5px',
    'right': '5px',
    'width': '40px',
    'height': '40px',
    'display': 'flex',
    'flexDirection': 'row',
    'justifyContent': 'center',
    'alignItems': 'center',
    'fontSize': '150%',
    'borderRadius': '5px',
    'transition': '0.2s ease-out',
    ':hover': {
      color: 'white',
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
  };

  return {appIcon, glyph, text, closeBox};
}

/******************************************************************************/
