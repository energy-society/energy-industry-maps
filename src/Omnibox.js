import React, { useState } from 'react';

export default function Omnibox(props) {
  const [query, setQuery] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

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
    <div className="omnibox">
      <button
        className="omnibox-burger-menu"
        onClick={props.onOpenSettingsPane}
        title="Menu"
        aria-label="Menu">
        <span>
          <span
            className="omnibox-burger-bar omnibox-burger-bar-top"
            aria-hidden="true" />
          <span
            className="omnibox-burger-bar omnibox-burger-bar-middle"
            aria-hidden="true" />
          <span
            className="omnibox-burger-bar omnibox-burger-bar-bottom"
            aria-hidden="true" />
        </span>
      </button>
      <div className="omnibox-search-input-container">
        <input
          type="text"
          className="omnibox-search-input"
          id="omnibox-search-input"
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
