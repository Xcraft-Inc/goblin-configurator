/******************************************************************************/

export default function styles(theme) {
  const configuratorNavigator = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const box = {
    display: 'flex',
    flexDirection: 'column',
    margin: '0px 0px 0px 0px',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: '20px',
    color: '#444',
    fontSize: '120%',
    textAlign: 'center',
  };

  const boxTitle = {
    display: 'flex',
    flexDirection: 'column',
    margin: '0px 0px 0px 0px',
    padding: '10px',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: '20px 20px 0px 0px',
    color: '#444',
    fontSize: '150%',
    textAlign: 'center',
  };

  const boxContent = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '0px 0px 10px 10px',
  };

  const back = {
    display: 'flex',
    flexDirection: 'row',
    padding: '0px 0px 20px 0px',
    fontSize: '150%',
    textTransform: 'uppercase',
    color: '#ddd',
    alignItems: 'center',
  };

  const backButton = {
    'width': '50px',
    'height': '50px',
    'display': 'flex',
    'flexDirection': 'row',
    'justifyContent': 'center',
    'alignItems': 'center',
    'fontSize': '150%',
    'borderRadius': '5px',
    'cursor': 'pointer',
    //- 'transition': '0.2s ease-out',
    ':hover': {
      color: '#fff',
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
  };

  const backText = {
    marginLeft: '10px',
    fontSize: '120%',
  };

  return {
    configuratorNavigator,
    box,
    boxTitle,
    boxContent,
    back,
    backButton,
    backText,
  };
}

/******************************************************************************/
