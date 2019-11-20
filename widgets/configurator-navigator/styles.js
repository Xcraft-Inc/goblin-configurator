/******************************************************************************/

export default function styles(theme) {
  const configuratorNavigator = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  };

  const header = {
    display: 'flex',
    flexDirection: 'row',
    margin: '0px 0px 50px 0px',
    padding: '20px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '20px 20px 0px 0px',
    boxShadow: '0px 10px 50px rgba(0,0,0,0.3)',
    color: '#eee',
    fontSize: '400%',
    textTransform: 'uppercase',
    justifyContent: 'center',
    textAlign: 'center',
  };

  const content = {
    padding: '50px 100px',
    display: 'flex',
    flexDirection: 'column',
  };

  const box = {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: '20px',
    color: '#444',
    fontSize: '120%',
    textAlign: 'center',
  };

  const boxTitle = {
    position: 'relative',
    height: '70px',
    display: 'flex',
    flexDirection: 'column',
    margin: '0px 0px 0px 0px',
    //- backgroundColor: 'rgba(255,255,255,0.8)',
    borderBottom: '1px solid #888',
    boxShadow: '0px 4px 50px rgba(0,0,0,0.2)',
    borderRadius: '20px 20px 0px 0px',
    color: '#444',
    fontSize: '150%',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const boxContent = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '20px 20px 30px 30px',
  };

  const backButton = {
    'position': 'absolute',
    'top': '5px',
    'left': '5px',
    'width': '60px',
    'height': '60px',
    'display': 'flex',
    'flexDirection': 'row',
    'justifyContent': 'center',
    'alignItems': 'center',
    'fontSize': '150%',
    'borderRadius': '16px',
    'color': '#333',
    'cursor': 'pointer',
    'transition': '0.2s ease-out',
    ':hover': {
      color: 'black',
      backgroundColor: 'rgba(255,255,255,0.7)',
    },
  };

  const arrowDown = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  };

  const triangle = {
    width: '0px',
    height: '0px',
    borderTop: '50px solid rgba(255,255,255,0.5)',
    borderLeft: '50px solid transparent',
    borderRight: '50px solid transparent',
    borderBottom: '50px solid transparent',
  };

  return {
    configuratorNavigator,
    header,
    content,
    box,
    boxTitle,
    boxContent,
    backButton,
    arrowDown,
    triangle,
  };
}

/******************************************************************************/
