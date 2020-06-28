import React, { useState  } from 'react';
import Downshift from 'downshift';
import { MAPS } from './config.js';


const asOption = mapId => ({label: MAPS[mapId].shortName, value: mapId});

export default function LocationSelector(props) {
  const [selectedMap, setSelectedMap] = useState(asOption(props.selectedMapId));

  const items = Object.keys(MAPS).map(asOption);

  return (
    <Downshift
        onChange={setSelectedMap}
        itemToString={item => (item ? item.value : "")}
      >

      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        getToggleButtonProps,
        isOpen,
        inputValue,
        highlightedIndex,
        selectedItem,
        getRootProps
      }) => (
        <div className="location-selector-container">
          <div className="location-selector">
            <button className="location-selector-button"
              {...getToggleButtonProps()}>
              <div>{selectedMap.label}</div>
              <span className="location-selector-button-divider"></span>
              <div className="location-selector-button-arrow">
                <svg>
                  <path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path>
                </svg>
              </div>
            </button>
            <ul
              className={"location-selector-list" + (!isOpen ? " hidden" : "")}
              {...getMenuProps()}>
              {isOpen &&
                items.map((item, index) => (
                  <li
                    style={
                      highlightedIndex === index ? {backgroundColor: '#bde4ff'} : {}
                    }
                    key={item.value}
                    {...getItemProps({item, index})}
                  >
                    {item.label}
                  </li>
                ))}
            </ul>
            {/* if you Tab from menu, focus goes on button, and it shouldn't. only happens here. */}
            <div tabIndex="0" />
          </div>
          <button
            className="location-selector-go"
            onClick={() => props.onSelectMap(selectedMap.value)}>
            Go
          </button>
        </div>
      )}
    </Downshift>
  );
}
