/******************************************************************************/

export default function styles() {
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

  const content = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  };

  return {iconNavigator, header, back, content};
}

/******************************************************************************/
