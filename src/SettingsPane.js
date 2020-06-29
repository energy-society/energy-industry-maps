import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Checkbox from '@material-ui/core/Checkbox';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LocationSelector from './LocationSelector';
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
  categoryCheckbox: {
    padding: 2,
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
  paneCloseButton: {
    position: 'absolute',
    top: 0,
    right: 8,
    padding: 7,
  },
}));

export default function SettingsPane(props) {
  const classes = useStyles();

  const closeSettingsPane = () => props.onToggleOpen(false);

  const formControlLabels = DISPLAY_CATEGORIES.map((category, idx) => {
    const sanitizedCat = normalizeCategory(category);
    const isChecked = props.selectedCategories.has(sanitizedCat);

    return (
      <FormControlLabel
        key={idx}
        className={classes.formControlLabel}
        control={
          <Checkbox
            className={classes.categoryCheckbox}
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
      onClose={closeSettingsPane}>
      <div className={classes.settingsPane}>
        <div className={classes.settingsPaneHeader}>
          <Typography variant="h2">Options</Typography>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close-menu"
            className={classes.paneCloseButton}
            onClick={closeSettingsPane}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className={classes.settingsPaneContent}>
          <div className={classes.settingsPaneSubheader}>
            <Typography variant="h3">Select a location</Typography>
          </div>
          <LocationSelector
            onSelectMap={props.onSelectMap}
            selectedMapId={props.selectedMapId} />
          <Divider style={{margin: 4}} />
          <div className={classes.settingsPaneSubheader}>
            <Typography variant="h3">Filter by category</Typography>
          </div>
          <div>
            <ButtonGroup color="primary" variant="contained">
              <Button
                id="select-all"
                onClick={props.onSelectAllCategories}>Select all</Button>
              <Button
                id="select-none"
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
