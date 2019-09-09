/******************************************************************************/

export default function styles(theme) {
  const icon = {
    'display': 'flex',
    'alignItems': 'center',
    'width': '256px',
    'height': '256px',
    'margin': '20px',
    'boxShadow':
      '0 2px 5px rgba(0, 0, 0, 0.3), 0 2px 0px rgba(255,255,255,0.4) inset, 0 -2px 0px rgba(0,0,0,0.5) inset',
    'borderRadius': '20px',
    'transformStyle': 'preserve-3d',
    'backfaceVisibility': 'hidden',
    'backgroundColor': theme.palette.notificationBackground,
    'transition': theme.transitions.easeOut(),
    ':hover': {},
  };

  const text = {
    display: 'block',
    zIndex: 1,
    textAlign: 'center',
  };

  const closeBox = {
    position: 'absolute',
    top: '32px',
    right: '10px',
  };

  return {icon, text, closeBox};
}

/******************************************************************************/
