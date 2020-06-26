import React from 'react';
import Menu from 'react-burger-menu/lib/menus/slide'
import { TAXONOMY_COLORS, DISPLAY_CATEGORIES } from './taxonomy-colors.js';
import { normalizeCategory } from './common.js';


class SettingsPane extends React.Component {
  constructor(props) {
    super(props);
    this.onToggleOpen = this.onToggleOpen.bind(this);
    this.handleSelectCategory = this.handleSelectCategory.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.deselectAll = this.deselectAll.bind(this);
  }

  onToggleOpen(state) { this.props.onToggleOpen(state.isOpen); }

  handleSelectCategory(e) { this.props.onToggleCategory(e); }

  selectAll() { this.props.onSelectAllCategories(); }

  deselectAll() { this.props.onDeselectAllCategories(); }

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
      <div>
        <Menu
          isOpen={this.props.settingsPaneOpen}
          onStateChange={this.onToggleOpen}
          styles={{ sidebar: { background: "white" } }}>
          <div className="map-settings-pane">
            <div className="map-settings-pane-section-header">
              <span>Filter by Category</span>
              <div className="bm-cross-button"></div>
            </div>
            <div className="map-settings-pane-content">
              <button id="select-all" className="select-all" onClick={this.selectAll}>Select all</button>
              <button id="select-none" className="select-all" onClick={this.deselectAll}>Clear all</button>
              <table id="categories"><tbody>{tableRows}</tbody></table>
            </div>
          </div>
        </Menu>
      </div>
    );
  }
}

export default SettingsPane;
