import React from 'react';
import Select from 'react-select';

class CompanySelector extends React.Component {
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
      const companies = this.props.companies.map(f => f.properties.company);
      options = companies.map(company => {
        return {value: company, label: company};
      });
    }
    return (
      <div id="place-search">
        <Select
          options={options}
          placeholder="Search..."
          onChange={this.handleChange}
          value={this.state.option} />
      </div>);
  }
}

export default CompanySelector;
