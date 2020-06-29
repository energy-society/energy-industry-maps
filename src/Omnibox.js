import React from 'react';
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
    padding: 7,
  },
  searchInputContainer: {
    position: 'absolute',
    left: 42,
    'flex-grow': 1,
  },
  searchInput: {
    height: 40,
    width: 318,
    padding: 1,
    margin: '0px 2px',
  },
}));


export default function Omnibox(props) {
  const classes = useStyles();

  let companies = (props.companies || []).map(f => f.properties.company);

  function handleResultSelection(event, value) {
    if (value && companies.includes(value)) {
      props.onSelectCompany(value);
    }
  }

  return (
    <div className={classes.root}>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        className={classes.menuButton}
        onClick={props.onOpenSettingsPane}>
        <MenuIcon style={{fontSize: '1.8rem'}} />
      </IconButton>
      <Autocomplete
        freeSolo
        selectOnFocus
        handleHomeEndKeys
        onChange={handleResultSelection}
        options={companies}
        renderInput={(params) => (
          <TextField {...params}
            placeholder="Search..."
            className={classes.searchInput}
            margin="dense"
            variant="outlined" />
        )}
      />
    </div>);
}
