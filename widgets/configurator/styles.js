/******************************************************************************/

export default function styles() {
  const layout = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  };
  const left = {
    paddingTop: '20vh',
    height: '500px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: '0 auto',
  };

  const right = {
    height: '200px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: '0 auto',
  };

  return {left, right, layout};
}

/******************************************************************************/
