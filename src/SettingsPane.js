import React from 'react';
import Menu from 'react-burger-menu/lib/menus/slide';
import LocationSelector from './LocationSelector';
import { TAXONOMY_COLORS, DISPLAY_CATEGORIES } from './taxonomy-colors.js';
import { normalizeCategory } from './common.js';


class SettingsPane extends React.Component {
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
              onChange={e => this.props.onToggleCategory(e)} />
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
          onStateChange={state => this.props.onToggleOpen(state.isOpen)}
          styles={{ sidebar: { background: "white" } }}>
          <div className="map-settings-pane">
            <div className="map-settings-pane-header">
              <span>Options</span>
            </div>
            <div className="map-settings-pane-content">
              <div className="map-settings-pane-section-header">
                <span>Select a location</span>
              </div>
              <LocationSelector
                onSelectMap={this.props.onSelectMap}
                selectedMap={this.props.selectedMap} />
              <div><hr className="map-settings-pane-section-divider" /></div>
              <div className="map-settings-pane-section-header">
                <span>Filter by category</span>
                <div className="bm-cross-button"></div>
              </div>
              <button
                id="select-all"
                className="select-all"
                onClick={this.props.onSelectAllCategories}>Select all</button>
              <button
                id="select-none"
                className="select-all"
                onClick={this.props.onDeselectAllCategories}>Clear all</button>
              <table id="categories"><tbody>{tableRows}</tbody></table>
            </div>
          </div>
        </Menu>
      </div>
    );
  }
}

export default SettingsPane;
