import React from 'react';

class Omnibox extends React.Component {
  state = {option: ''};

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(option) {
    this.setState({option: option});
    this.props.onSelectCompany(option.value);
  }

  render() {
    var options = [];
    if (this.props.companies) {
      options = this.props.companies.map(f => f.properties.company);
    }
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
          <input type="text" className="omnibox-search-input" placeholder="Search..." />
        </div>
        <button
          className="omnibox-search-button"
          title="Search"
          aria-label="Search">
          <div className="magnifying-glass" aria-hidden="true">&#9906;</div>
        </button>
      </div>);
  }
}

export default Omnibox;
