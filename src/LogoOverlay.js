import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import aesLogoWhite from './img/aes-logo-white-shadow.png';
import suTreeDark from './img/su-tree-dark.png';


const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    'margin-bottom': 24,
    display: 'flex',
    'flex-direction': 'row',
  },
  aesLogo: {
    padding: 8,
    height: 50,
  },
  suLogo: {
    padding: 8,
    height: 50,
  },
}));


export default function LogoOverlay(props) {
  const classes = useStyles();

  var suLogoDisplay = 'none';
  if (props.selectedMapId === 'silicon-valley') {
    suLogoDisplay = 'block';
  }

  return (
    <div className={classes.root}>
      <div
        className={classes.suLogoContainer}
        style={{display: suLogoDisplay}} >
        <img
          src={suTreeDark}
          className={classes.suLogo}
          alt="Stanford University Logo" />
      </div>
      <div className={classes.aesLogoContainer}>
        <img
          src={aesLogoWhite}
          className={classes.aesLogo}
          alt="American Energy Society Logo" />
      </div>
    </div>
  );
}
