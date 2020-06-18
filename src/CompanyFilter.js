import React from 'react';
import { TAXONOMY_COLORS, DISPLAY_CATEGORIES } from './taxonomy-colors.js';
import { normalizeCategory } from './common.js';

class CompanyFilter extends React.Component {
  state = {
    displayCategories: true,
  };

  constructor(props) {
    super(props);
    this.handleSelectCategory = this.handleSelectCategory.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
    this.toggleDisplayCategoryList = this.toggleDisplayCategoryList.bind(this);
  }

  selectAll() { this.props.onSelectAllCategories(); }

  deselectAll() { this.props.onDeselectAllCategories(); }

  handleSelectCategory(e) { this.props.onToggleCategory(e); }

  toggleDisplayCategoryList() {
    const displayCategories = this.state.displayCategories;
    this.setState({displayCategories: !displayCategories});
  }

  render() {
    const tableRows = DISPLAY_CATEGORIES.map(category => {
      const sanitizedCat = normalizeCategory(category);
      const checkboxId = `${sanitizedCat}-checkbox`;
      const isChecked = this.props.selectedCategories.has(sanitizedCat);
      return (
        <tr key={sanitizedCat}>
          <td>
            <input
              type="checkbox"
              id={checkboxId}
              name={sanitizedCat}
              checked={isChecked}
              className='category-filter-checkbox'
              onChange={this.handleSelectCategory} />
          </td>
          <td>
            <i className="category-legend"
            style={{background: TAXONOMY_COLORS[category]}}></i>
          </td>
          <td><label htmlFor={checkboxId}>{category}</label></td>
        </tr>);
    });

    return (
      <div id="company-filter" className={this.state.displayCategories ? null : "hidden"}>
        <button id="filter-toggle" onClick={this.toggleDisplayCategoryList}>
          <div className="flex-row">
            <div className="flex-grow"><span className="header">Filter by category</span></div>
            <div className="hamburger-menu"><div></div><div></div><div></div></div>
          </div>
        </button>
        <div className="content">
          <div>
            <button id="select-all" className="select-all" onClick={this.selectAll}>Select all</button>
            <button id="select-none" className="select-all" onClick={this.deselectAll}>Clear all</button>
            <table id="categories"><tbody>{tableRows}</tbody></table>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyFilter;
