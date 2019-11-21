import {ColorManipulator} from 'electrum-theme';

/******************************************************************************/

export const propNames = ['active', 'showDetail'];

export default function styles(theme, props) {
  const {active, showDetail} = props;

  const color = active
    ? theme.palette.configuratorActiveBackground
    : theme.palette.configuratorBackground;

  const appIcon = {
    'position': 'relative',
    'display': 'flex',
    'flexDirection': 'column',
    'justifyContent': 'flex-start',
    'flexGrow': '1',
    'minWidth': '100px',
    'maxWidth': '300px',
    'minHeight': '70px',
    'margin': '10px 10px 0px 0px',
    'padding': '0px 10px 0px 20px',
    'borderRadius': '5px',
    'boxShadow': active ? '0px 7px 20px 4px rgba(0,0,0,0.5)' : null,
    'transform': active ? 'translate(0px, -5px)' : null,
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

  const main = {
    height: '70px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  };

  const glyph = {
    fontSize: '350%',
  };

  const text = {
    marginLeft: '20px',
    fontSize: '120%',
    textTransform: 'uppercase',
  };

  const detail = {
    marginTop: '10px',
    height: '90px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: '0.3s ease-out',
  };

  const detailHidden = {
    ...detail,
    marginTop: '0px',
    height: '0px',
  };

  const detailRow = {
    display: 'flex',
    flexDirection: 'row',
  };

  const detailRowLabel = {
    width: '100px',
    display: 'flex',
    flexDirection: 'row',
    fontSize: '120%',
    color: '#888',
  };

  const detailRowValue = {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '120%',
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

  return {
    appIcon,
    main,
    glyph,
    text,
    detail,
    detailHidden,
    detailRow,
    detailRowLabel,
    detailRowValue,
    closeBox,
  };
}

/******************************************************************************/
