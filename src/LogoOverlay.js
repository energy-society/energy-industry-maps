import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    'margin-bottom': 30,
    display: 'flex',
    'flex-direction': 'column',
    pointerEvents: 'auto',
  },
  attributionContainer: {
    padding: "4px 8px",
    maxWidth: 220,
    color: "white",
    fontSize: "9pt",
  },
  aesLink: {
    color: "#77ddf2",
  },
}));


export default function LogoOverlay(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div
        className={classes.attributionContainer}
        style={{display: 'block'}} >
        Developed by <a href="https://www.energysociety.org/" className={classes.aesLink}>
        American Energy Society</a> in collaboration with Stanford University's
        Precourt Institute for Energy
      </div>
    </div>
  );
}
