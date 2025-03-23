import React from 'react';
import Select from 'react-select';
import './StoreSelector.css';

export const StoreSelector = ({ selectedStore, onStoreChange, stores }) => {
  const options = (stores || []).map(store => ({
    value: store.id,
    label: store.name
  }));

  const value = selectedStore ? {
    value: selectedStore.id,
    label: selectedStore.name
  } : null;

  const handleChange = (selected) => {
    if (selected) {
      // Find the full store object from the stores array
      const selectedStoreObj = stores.find(store => store.id === selected.value);
      if(selectedStoreObj) {
        onStoreChange(selectedStoreObj);
      }else {
        onStoreChange(null);
      }
      
    } else {
      onStoreChange(null);
    }
  };

  return (
    <div className="store-selector">
      <Select
        value={value}
        onChange={handleChange}
        options={options}
        isClearable
        placeholder="Select Store..."
        className="store-select"
        classNamePrefix="store-select"
      />
    </div>
  );
}; 