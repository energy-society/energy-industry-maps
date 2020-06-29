import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    'background-color': '#fff',
    border: '1px solid #ccc',
    'border-radius': 5,
    'max-width': 364,
    position: 'relative',
    'padding-right': 4,
    height: 42,
  },
  menuButton: {
    margin: 0,
    padding: 8,
  },
  verticalDivider: {
    display: 'block',
    width: 1,
    height: 28,
    'margin-top': 7,
    backgroundColor: '#ccc',
    content: '',
  },
  searchInputContainer: {
    position: 'absolute',
    left: 48,
    'flex-grow': 1,
  },
  searchInput: {
    height: 40,
    width: 268,
    padding: 1,
    margin: '0px 8px',
  },
  searchButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    background: 'transparent',
    cursor: 'pointer',
    display: 'block',
    height: 42,
    width: 42,
    padding: 0,
    border: 0,
    cursor: 'pointer',
    'font-size': '18pt',
  },
}));


export default function Omnibox(props) {
  const classes = useStyles();

  function getCompanies() {
    if (props.companies) {
      return props.companies.map(f => f.properties.company);
    }
    return [];
  }

  function handleResultSelection(value) {
    if (value) {
      props.onSelectCompany(value);
    }
  }

  // TODO: Get the clear button (x) to work! (Take away disableClearable.)
  // TODO: Allow searching by hitting <Enter>.
  return (
    <div className={classes.root}>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        className={classes.menuButton}
        onClick={props.onOpenSettingsPane}>
        <MenuIcon />
      </IconButton>
      <span className={classes.verticalDivider} />
      <Autocomplete
        id="omnibox-search-input"
        freeSolo
        selectOnFocus
        handleHomeEndKeys
        disableClearable
        onChange={e => handleResultSelection(e.target.textContent)}
        options={getCompanies()}
        renderInput={(params) => (
          <TextField {...params}
            placeholder="Search"
            className={classes.searchInput}
            margin="dense"
            variant="outlined" />
        )}
      />
      <button
        className={classes.searchButton}
        title="Search"
        aria-label="Search"
        onClick={() => document.getElementById("omnibox-search-input").focus()}>
        <div
          style={{transform: 'rotate(-45deg)'}}
          aria-hidden="true">&#9906;</div>
      </button>
    </div>);
}
