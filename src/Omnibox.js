import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    'background-color': '#fff',
    border: '1px solid #ccc',
    'border-radius': 5,
    'max-width': 364,
    position: 'relative',
    'padding-right': 4,
  },
  menuButton: {
    margin: 0,
    padding: 8,
  },
  verticalDivider: {
    display: 'block',
    width: 1,
    height: 24,
    'margin-top': 8,
    backgroundColor: '#ccc',
    content: '',
  },
  searchInputContainer: {
    position: 'absolute',
    left: 48,
    'flex-grow': 1,
  },
}));


export default function Omnibox(props) {
  const [query, setQuery] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const classes = useStyles();

  function getCompanies() {
    if (props.companies) {
      return props.companies.map(f => f.properties.company);
    }
    return [];
  }

  const shouldDisplaySuggestions = () => hasFocus && searchResults.length > 0;

  function handleResultSelection(value) {
    props.onSelectCompany(value);
    setQuery(value);
    setSearchResults([]);
  }

  function handleInputChange(e) {
    let query = e.target.value;
    setQuery(query);
    if (query.length >= 2) {
      setSearchResults(getCompanies().filter(
          result => result.toLowerCase().includes(query.toLowerCase())));
    } else {
      setSearchResults([]);
    }
  }

  const searchSuggestions = searchResults.map(r => (
    <li
      key={r}
      tabIndex="-1"
      onMouseDown={() => handleResultSelection(r)}>
      {r}
    </li>));

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
      <div className={classes.searchInputContainer}>
        <input
          type="text"
          id="omnibox-search-input"
          className="omnibox-search-input"
          onChange={handleInputChange}
          tabIndex="0"
          value={query}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          placeholder="Search..." />
      </div>
      <div
        className="omnibox-search-suggestions-container"
        tabIndex="-1"
        style={{display: shouldDisplaySuggestions() ? "block" : "none"}}>
        <ul className="omnibox-search-suggestions" tabIndex="-1">{searchSuggestions}</ul>
      </div>
      <button
        className="omnibox-search-button"
        title="Search"
        aria-label="Search"
        onClick={() => document.getElementById("omnibox-search-input").focus()}>
        <div className="magnifying-glass" aria-hidden="true">&#9906;</div>
      </button>
    </div>);
}
