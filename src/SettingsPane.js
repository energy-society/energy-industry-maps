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
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import LocationSelector from './LocationSelector';
import { normalizeCategory } from './common';

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  settingsPane: {
    background: 'rgba(244, 244, 244, 0.93)',
    'max-width': drawerWidth,
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    border: 0,
  },
  settingsPaneHeader: {
    backgroundColor: '#02346d',
    color: '#ffffff',
    border: 0,
    textAlign: 'center',
    padding: 8,
  },
  settingsPaneContent: {
    padding: 4,
  },
  settingsPaneSubheader: {
    padding: 6,
  },
  formControlLabel: {
    padding: 1,
    marginLeft: -4,
  },
  categoryCheckbox: {
    padding: 2,
  },
  categoryLabel: {
    display: 'flex',
    flexDirection: 'row',
    verticalAlign: 'middle',
    fontFamily: 'Open Sans',
    fontSize: '10pt',
  },
  categoryLegend: {
    content: '',
    width: 15,
    height: 15,
    margin: 4,
    padding: 0,
    borderRadius: 3,
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

  const formControlLabels = props.taxonomy.map((category, idx) => {
    const sanitizedCat = normalizeCategory(category.name);
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
              style={{background: category.color}} />
          {category.name}
          </div>}
      />);
  });

  const drawer = (
    <div className={classes.settingsPane}>
      <div className={classes.settingsPaneHeader}>
        <Typography variant="h2">Options</Typography>
        <Hidden lgUp implementation="css">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="close-menu"
            className={classes.paneCloseButton}
            onClick={closeSettingsPane}>
            <CloseIcon />
          </IconButton>
        </Hidden>
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
  );

  return (
    <div className={classes.drawer}>
      <Hidden lgUp implementation="css">
        <Drawer
          variant="temporary"
          open={props.mobileDrawerOpen}
          onClose={closeSettingsPane}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}>
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden mdDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
          onClose={closeSettingsPane}>
          {drawer}
        </Drawer>
      </Hidden>
    </div>
  );
}
