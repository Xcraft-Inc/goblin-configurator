/******************************************************************************/

export default function styles(theme) {
  const mainLayout = {
    position: 'relative',
    overflow: 'hidden',
    height: '100vh',
    width: '100vw',
    background: theme.palette.rootBackground,
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'column',
  };

  const header = {
    padding: '25px',
    background: theme.palette.footerBackground,
    display: 'flex',
    flexDirection: 'row',
    fontSize: '150%',
  };

  const content = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const footer = {
    padding: '25px',
    background: theme.palette.footerBackground,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    fontSize: '150%',
  };

  return {mainLayout, header, content, footer};
}

/******************************************************************************/
