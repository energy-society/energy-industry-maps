import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: 5,
    width: 364,
    position: 'relative',
    height: 44,
  },
  menuButton: {
    margin: 0,
    padding: 7,
  },
  autocomplete: {
    margin: 2,
    flexGrow: 1,
  },
  searchInput: {
    height: 40,
    margin: 0,
  },
}));


export default function Omnibox(props) {
  const classes = useStyles();

  let companies = (props.companies || []).map(f => f.properties);
  let companyNames = companies.map(c => c.company);

  function handleResultSelection(event, value) {
    if (value && companyNames.includes(value.company)) {
      props.onSelectCompany(value);
    }
  }

  return (
    <div className={classes.root}>
      <Hidden lgUp implementation="css">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          className={classes.menuButton}
          onClick={props.onOpenMobileDrawer}>
          <MenuIcon style={{fontSize: '1.8rem'}} />
        </IconButton>
      </Hidden>
      <Autocomplete
        freeSolo
        selectOnFocus
        handleHomeEndKeys
        onChange={handleResultSelection}
        options={companies}
        getOptionLabel={prop => prop.company}
        className={classes.autocomplete}
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
