/******************************************************************************/

export default function styles(theme) {
  const iconNavigator = {
    display: 'flex',
    flexDirection: 'column',
  };

  const header = {
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '20px 20px 0px 0px',
  };

  const back = {
    display: 'flex',
    flexDirection: 'row',
    padding: '20px 0px',
    fontSize: '150%',
    textTransform: 'uppercase',
    color: '#ddd',
    alignItems: 'center',
  };

  const backButton = {
    'width': '60px',
    'height': '60px',
    'display': 'flex',
    'flexDirection': 'row',
    'justifyContent': 'center',
    'alignItems': 'center',
    'fontSize': '150%',
    'borderRadius': '5px',
    'cursor': 'pointer',
    'transition': '0.2s ease-out',
    ':hover': {
      color: '#fff',
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
  };

  const backText = {
    marginLeft: '20px',
    fontSize: '120%',
  };

  const content = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  };

  return {iconNavigator, header, back, backButton, backText, content};
}

/******************************************************************************/
