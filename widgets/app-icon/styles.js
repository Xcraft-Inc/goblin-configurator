/******************************************************************************/

export default function styles() {
  const icon = {
    'display': 'flex',
    'alignItems': 'center',
    'width': '128px',
    'height': '128px',
    'margin': '20px',
    'boxShadow':
      '0 2px 5px rgba(0, 0, 0, 0.3), 0 2px 0px rgba(255,255,255,0.4) inset, 0 -2px 0px rgba(0,0,0,0.5) inset',
    'borderRadius': '20px',
    'transformStyle': 'preserve-3d',
    'backfaceVisibility': 'hidden',
    'background':
      'linear-gradient(135deg, rgba(252,35,40,1) 0%, rgba(162,38,51,1) 61%)',
    ':hover': {},
  };

  const text = {
    display: 'block',
    zIndex: 1,
    width: '128px',
    textAlign: 'center',
    color: 'white',
    fontSize: '1em',
    textShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)',
  };

  return {icon, text};
}

/******************************************************************************/
