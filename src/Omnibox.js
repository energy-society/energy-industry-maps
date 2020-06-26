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
        <div className="omnibox-burger-menu" onClick={this.props.onOpenSettingsPane}>
          <span>
            <span className="omnibox-burger-bar omnibox-burger-bar-top" />
            <span className="omnibox-burger-bar omnibox-burger-bar-middle" />
            <span className="omnibox-burger-bar omnibox-burger-bar-bottom" />
          </span>
          <button>Menu</button>
        </div>
        <div className="place-search">
          <input type="text" className="omnibox-search-input" placeholder="Search..." />
        </div>
        <div className="omnibox-search-button-container">
          <button id="omnibox-search-button">&#9906;</button>
        </div>
      </div>);
  }
}

export default Omnibox;
