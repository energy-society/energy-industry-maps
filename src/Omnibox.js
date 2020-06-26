import React from 'react';

class Omnibox extends React.Component {
  state = {
    query: '',
    hasFocus: false,
    searchResults: [],
  };

  constructor(props) {
    super(props);
    this.getCompanies = this.getCompanies.bind(this);
    this.shouldDisplaySuggestions = this.shouldDisplaySuggestions.bind(this);
    this.setHasFocus = this.setHasFocus.bind(this);
    this.handleResultSelection = this.handleResultSelection.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  getCompanies() {
    if (this.props.companies) {
      return this.props.companies.map(f => f.properties.company);
    }
    return [];
  }

  shouldDisplaySuggestions() {
    return this.state.hasFocus && this.state.searchResults.length > 0;
  }

  setHasFocus(hasFocus) {
    this.setState({hasFocus: hasFocus});
  }

  handleResultSelection(value) {
    this.props.onSelectCompany(value);
    this.setState({query: value, searchResults: []});
  }

  handleInputChange() {
    const query = this.searchInput.value;
    this.setState({query: query});
    if (query.length >= 2) {
      this.setState({
        searchResults: this.getCompanies().filter(
          result => result.toLowerCase().includes(query.toLowerCase()))
      });
    } else {
      this.setState({searchResults: []});
    }
  }

  render() {
    const searchSuggestions = this.state.searchResults.map(r => (
      <li key={r} onMouseDown={() => this.handleResultSelection(r)}>{r}</li>));
    return (
      <div className="omnibox">
        <button
          className="omnibox-burger-menu"
          onClick={this.props.onOpenSettingsPane}
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
            ref={input => this.searchInput = input}
            onChange={this.handleInputChange}
            value={this.state.query}
            onFocus={() => this.setHasFocus(true)}
            onBlur={() => this.setHasFocus(false)}
            placeholder="Search..." />
        </div>
        <div
          className="omnibox-search-suggestions-container"
          style={{display: this.shouldDisplaySuggestions() ? "block" : "none"}}>
          <ul className="omnibox-search-suggestions">{searchSuggestions}</ul>
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
}

export default Omnibox;
