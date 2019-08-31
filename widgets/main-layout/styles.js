import {ColorHelpers} from 'electrum-theme';
/******************************************************************************/

export default function styles(theme) {
  const background = {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    background: theme.palette.rootBackground, //'linear-gradient(159deg, rgba(5,4,5,1) 0%, rgba(95,82,99,1) 70%, rgba(154,132,164,1) 100%)',
  };

  const statusBar = {
    overflow: 'hidden',
    position: 'fixed',
    bottom: '0',
    paddingTop: '25px',
    paddingBottom: '25px',
    width: '100%',
    background: theme.palette.footerBackground,
  };

  const titleBar = {
    overflow: 'hidden',
    position: 'fixed',
    top: '0',
    width: '100%',
    paddingTop: '25px',
    paddingBottom: '25px',
    background: theme.palette.footerBackground,
  };

  return {background, statusBar, titleBar};
}

/******************************************************************************/
