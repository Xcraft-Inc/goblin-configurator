/******************************************************************************/

export default function styles() {
  const iconNavigator = {
    //? flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    margin: '20px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
  };

  const header = {
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '20px 20px 0px 0px',
  };

  const content = {
    display: 'flex',
  };

  return {iconNavigator, header, content};
}

/******************************************************************************/
