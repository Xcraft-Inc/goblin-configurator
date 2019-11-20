import {ColorManipulator} from 'electrum-theme';

/******************************************************************************/

export const propNames = ['active'];

export default function styles(theme, props) {
  const {active} = props;

  const color = active
    ? theme.palette.configuratorActiveBackground
    : theme.palette.configuratorBackground;

  const appIcon = {
    'position': 'relative',
    'display': 'flex',
    'justifyContent': 'flex-start',
    'alignItems': 'center',
    'flexGrow': '1',
    'minWidth': '100px',
    'maxWidth': '300px',
    'height': '70px',
    'margin': '10px 10px 0px 0px',
    'padding': '0px 10px 0px 20px',
    'borderRadius': '5px',
    'color': '#ddd',
    'backgroundColor': color,
    'userSelect': 'none',
    'cursor': 'pointer',
    'transition': '0.2s ease-out',
    ':hover': {
      color: 'white',
      backgroundColor: ColorManipulator.lighten(color, 0.2),
    },
  };

  const glyph = {
    fontSize: '200%',
  };

  const text = {
    marginLeft: '20px',
    fontSize: '120%',
    textTransform: 'uppercase',
  };

  const closeBox = {
    'position': 'absolute',
    'top': '4px',
    'right': '4px',
    'width': '30px',
    'height': '30px',
    'display': 'flex',
    'flexDirection': 'row',
    'justifyContent': 'center',
    'alignItems': 'center',
    'fontSize': '200%',
    'borderRadius': '2px',
    'transition': '0.2s ease-out',
    ':hover': {
      color: 'white',
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
  };

  return {appIcon, glyph, text, closeBox};
}

/******************************************************************************/
