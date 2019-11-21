import {Unit} from 'electrum-theme';
import getAnimation from 'goblin-gadgets/widgets/animated-container/animations';

/******************************************************************************/

export const propNames = [
  'showed',
  'width',
  'height',
  'animationIn',
  'animationOut',
  'topGlyph',
];

export default function styles(theme, props) {
  const {
    showed,
    width = '600px',
    height = '450px',
    animationIn = 'zoomIn',
    animationOut = 'zoomOut',
    topGlyph,
  } = props;

  const fullScreen = {
    position: 'fixed',
    zIndex: 3,
    left: '0px',
    top: '0px',
    width: '100%',
    height: '100%',
    userSelect: 'none',
    cursor: 'default',
    backgroundColor: 'rgba(0,0,0,0.7)',
    opacity: showed ? 1 : 0,
    pointerEvents: showed ? 'auto' : 'none',
    transition: '0.3s ease-out',
  };

  const animated = {
    position: 'fixed',
    zIndex: 3,
    left: '0px',
    top: '0px',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const a = getAnimation(showed ? animationIn : animationOut, {
    posX: 30,
    posY: 30,
  });
  animated.animationName = a.name;
  animated.animationDuration = a.duration;
  animated.animationTimingFunction = a.timingFunction;
  animated.animationIterationCount = 1;
  animated.animationFillMode = 'forwards';

  /******************************************************************************/

  const popupHeight = topGlyph ? Unit.add(height, '50px') : height;
  const padding = '40px';

  const popup = {
    position: 'absolute',
    width: width,
    height: popupHeight,
    padding: topGlyph
      ? `${Unit.add(padding, '30px')} ${padding} ${padding} ${padding}`
      : padding,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#eee',
    borderRadius: '10px',
    boxShadow: '0px 40px 100px rgba(0,0,0,0.9)',
    zIndex: 2,
  };

  const header = {
    position: 'absolute',
    height: '50px',
    top: '0px',
    left: '0px',
    right: '0px',
    padding: '0px 40px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ccc',
    borderRadius: '10px 10px 0px 0px',
  };

  const headerGlyph = {
    color: '#333',
    fontSize: '25px',
  };

  const headerText = {
    color: '#555',
    marginLeft: '20px',
    textTransform: 'uppercase',
  };

  const closeButton = {
    'position': 'absolute',
    'right': '0px',
    'top': '0px',
    'width': '50px',
    'height': '50px',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'color': '#888',
    'fontSize': '25px',
    ':hover': {
      color: 'black',
    },
    'transition': '0.2s ease-out',
    'cursor': 'pointer',
  };

  /******************************************************************************/

  const footer = {
    minHeight: '70px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  };

  /******************************************************************************/

  return {
    fullScreen,
    animated,
    popup,
    header,
    headerGlyph,
    headerText,
    closeButton,
    footer,
  };
}

/******************************************************************************/
