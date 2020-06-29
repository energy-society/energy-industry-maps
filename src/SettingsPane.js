import React from 'react';
import LocationSelector from './LocationSelector';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Divider from '@material-ui/core/Divider';
import { TAXONOMY_COLORS, DISPLAY_CATEGORIES } from './taxonomy-colors';
import { normalizeCategory } from './common';


const useStyles = makeStyles((theme) => ({
  settingsPane: {
    background: 'rgba(244, 244, 244, 0.93)',
    'max-width': 320,
  },
  settingsPaneHeader: {
    'background-color': '#02346d',
    color: '#ffffff',
    border: 0,
    'text-align': 'center',
    'font-size': '14pt',
    padding: 8,
  },
  settingsPaneContent: {
    padding: 4,
  },
  settingsPaneSubheader: {
    'font-family': 'Roboto',
    'font-size': '12pt',
    padding: 6,
  },
  formControlLabel: {
    padding: 1,
    'margin-left': -4,
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
  },
}));

const LightBlueCheckbox = withStyles({
  root: {
    color: '#666',
    '&$checked': {
      color: '#77ddf2',
    },
    padding: 2,
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
        className={classes.formControlLabel}
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
    <Drawer
      open={props.settingsPaneOpen}
      onClose={() => props.onToggleOpen(false)}>
      <div className={classes.settingsPane}>
        <div className={classes.settingsPaneHeader}>
          <span>Options</span>
        </div>
        <div className={classes.settingsPaneContent}>
          <div className={classes.settingsPaneSubheader}>
            <span>Select a location</span>
          </div>
          <LocationSelector
            onSelectMap={props.onSelectMap}
            selectedMapId={props.selectedMapId} />
          <Divider />
          <div className={classes.settingsPaneSubheader}>
            <span>Filter by category</span>
          </div>
          <div>
            <ButtonGroup color="primary" variant="contained">
              <Button
                id="select-all"
                className={classes.selectAllNone}
                onClick={props.onSelectAllCategories}>Select all</Button>
              <Button
                id="select-none"
                className={classes.selectAllNone}
                onClick={props.onDeselectAllCategories}>Clear all</Button>
            </ButtonGroup>
          </div>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup>{formControlLabels}</FormGroup>
          </FormControl>
        </div>
      </div>
    </Drawer>
  );
}
