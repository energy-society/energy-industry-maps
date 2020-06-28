import React from 'react';
import Menu from 'react-burger-menu/lib/menus/slide';
import LocationSelector from './LocationSelector';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { TAXONOMY_COLORS, DISPLAY_CATEGORIES } from './taxonomy-colors';
import { normalizeCategory } from './common';


const useStyles = makeStyles((theme) => ({
  root: {
    margin: 2,
  },
  categoryLabel: {
    display: 'flex',
    'flex-direction': 'row',
    'verical-align': 'middle',
    'font-family': 'Open Sans',
    'font-size': '10pt',
  },
  categoryLegend: {
    content: '',
    width: 15,
    height: 15,
    margin: 4,
    padding: 0,
    'border-radius': 3,
  },
  formControl: {
    margin: theme.spacing(0.1),
  },
  selectAllNone: {
    'text-transform': 'none',
    margin: 1,
  },
}));

const LightBlueCheckbox = withStyles({
  root: {
    color: '#666',
    '&$checked': {
      color: '#50a2b2',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

export default function SettingsPane(props) {
  const classes = useStyles();

  const formControlLabels = DISPLAY_CATEGORIES.map((category, idx) => {
    const sanitizedCat = normalizeCategory(category);
    const isChecked = props.selectedCategories.has(sanitizedCat);

    return (
      <FormControlLabel
        key={idx}
        control={
          <LightBlueCheckbox
            checked={isChecked}
            onChange={props.onToggleCategory}
            name={sanitizedCat} />}
        label={
          <div className={classes.categoryLabel}>
            <span
              className={classes.categoryLegend}
              style={{background: TAXONOMY_COLORS[category]}} />
          {category}
          </div>}
      />);
  });

  return (
    <div>
      <Menu
        isOpen={props.settingsPaneOpen}
        onStateChange={state => props.onToggleOpen(state.isOpen)}
        styles={{ sidebar: { background: "white" } }}>
        <div className="map-settings-pane">
          <div className="map-settings-pane-header">
            <span>Options</span>
            <div className="bm-cross-button"></div>
          </div>
          <div className="map-settings-pane-content">
            <div className="map-settings-pane-section-header">
              <span>Select a location</span>
            </div>
            <LocationSelector
              onSelectMap={props.onSelectMap}
              selectedMapId={props.selectedMapId} />
            <div><hr className="map-settings-pane-section-divider" /></div>
            <div className="map-settings-pane-section-header">
              <span>Filter by category</span>
            </div>
            <Button
              id="select-all"
              className="select-all"
              color="primary"
              variant="contained"
              className={classes.selectAllNone}
              onClick={props.onSelectAllCategories}>Select all</Button>
            <Button
              id="select-none"
              className="select-all"
              color="primary"
              variant="contained"
              className={classes.selectAllNone}
              onClick={props.onDeselectAllCategories}>Clear all</Button>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormGroup>{formControlLabels}</FormGroup>
            </FormControl>
          </div>
        </div>
      </Menu>
    </div>
  );
}
