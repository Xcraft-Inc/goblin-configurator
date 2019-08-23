/******************************************************************************/

export default function styles() {
  const background = {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    background:
      'linear-gradient(159deg, rgba(5,4,5,1) 0%, rgba(95,82,99,1) 70%, rgba(154,132,164,1) 100%)',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  };

  const content = {
    paddingTop: '20vh',
    height: '500px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '700px',
    margin: '0 auto',
  };

  return {background, content};
}

/******************************************************************************/
