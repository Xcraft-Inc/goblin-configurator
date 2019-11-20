import {ColorManipulator} from 'electrum-theme';

/******************************************************************************/

export default function styles(theme) {
  const configuratorNavigator = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const boxColor = ColorManipulator.lighten(theme.palette.rootBackground, 0.5);

  const header = {
    display: 'flex',
    flexDirection: 'row',
    margin: '0px 0px 30px 0px',
    padding: '15px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '15px 15px 0px 0px',
    boxShadow: '0px 10px 50px rgba(0,0,0,0.3)',
    color: '#eee',
    fontSize: '300%',
    textTransform: 'uppercase',
    justifyContent: 'center',
    textAlign: 'center',
  };

  const content = {
    padding: '30px 70px',
    display: 'flex',
    flexDirection: 'column',
  };

  /******************************************************************************/

  const box = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: boxColor,
    boxShadow: '0px 10px 40px rgba(0,0,0,0.5)',
    borderRadius: '15px',
    color: '#444',
    fontSize: '80%',
    textAlign: 'center',
    opacity: 1,
    transform: 'scale(1)',
    transformOrigin: 'top',
    marginTop: '0px',
    transition: '0.3s ease-out',
  };

  const boxHidden = {
    ...box,
    opacity: 0,
    transform: 'scale(0.9)',
    marginTop: '-60px',
  };

  const boxTitle = {
    position: 'relative',
    height: '50px',
    display: 'flex',
    flexDirection: 'column',
    margin: '0px 0px 0px 0px',
    borderBottom: `1px solid ${ColorManipulator.lighten(
      theme.palette.rootBackground,
      0.2
    )}`,
    boxShadow: '0px 4px 50px rgba(0,0,0,0.2)',
    borderRadius: '15px 15px 0px 0px',
    color: '#111',
    fontSize: '200%',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const boxContent = {
    minHeight: '80px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '10px 10px 20px 20px',
  };

  const backButton = {
    'position': 'absolute',
    'top': '0px',
    'right': '0px',
    'width': '50px',
    'height': '50px',
    'display': 'flex',
    'flexDirection': 'row',
    'justifyContent': 'center',
    'alignItems': 'center',
    'fontSize': '120%',
    'borderRadius': '0px 15px 0px 0px',
    'color': '#333',
    'backgroundColor': 'rgba(255,255,255,0.2)',
    'cursor': 'pointer',
    'transition': '0.2s ease-out',
    ':hover': {
      color: 'black',
      backgroundColor: 'rgba(255,255,255,0.7)',
    },
  };

  /******************************************************************************/

  const arrowDown = {
    zIndex: 1,
    height: '30px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: '30px',
    transform: 'scale(1)',
    transformOrigin: 'top',
    transition: '0.3s ease-out',
  };

  const arrowDownHidden = {
    ...arrowDown,
    transform: 'scale(0)',
  };

  const triangle = {
    width: '0px',
    height: '0px',
    borderTop: `30px solid ${boxColor}`,
    borderLeft: '30px solid transparent',
    borderRight: '30px solid transparent',
    borderBottom: '30px solid transparent',
  };

  /******************************************************************************/

  return {
    configuratorNavigator,
    header,
    content,

    box,
    boxHidden,
    boxTitle,
    boxContent,
    backButton,

    arrowDown,
    arrowDownHidden,
    triangle,
  };
}

/******************************************************************************/
