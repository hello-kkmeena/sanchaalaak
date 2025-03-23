import React from 'react';
import { useStore } from '../../context/StoreContext';
import './InventoryTable.css';
import { inventoryApi } from '../../services/api';

export const InventoryTable = ({ store }) => {
  const { isLoading, error, updateStoreItem, refreshStoreInventory } = useStore();

  // Add debug logs
  console.log('Store prop:', store);
  console.log('Store inventory:', store?.inventory);

  const handleDeleteItem = async (itemId) => {
    try {
      if (window.confirm('Are you sure you want to delete this item?')) {
        await inventoryApi.deleteStoreItem(store.id, itemId);
        await refreshStoreInventory(store.id);
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleToggleAvailability = async (itemId, currentAvailability) => {
    try {
      const newAvailability = !currentAvailability;
      const response = await inventoryApi.updateStoreItemAvailability(store.id, itemId, newAvailability);
      
      if (response.success) {
        // Update single item locally without full refresh
        updateStoreItem(itemId, { isAvailable: newAvailability });
      } else {
        throw new Error('Failed to update availability');
      }
    } catch (err) {
      console.error('Error updating item availability:', err);
      alert('Failed to update item availability. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (!store || !store.inventory) {
    return <div>No inventory data available</div>;
  }

  console.log('Current inventory:', store.inventory);

  return (
    <div className="inventory-table">
      <div className="table-header">
        <div>Image</div>
        <div>Item Name</div>
        <div>Quantity</div>
        <div>Price</div>
        <div>Discount</div>
        <div>Status</div>
        <div>Actions</div>
      </div>
      
      {Array.isArray(store.inventory) && store.inventory.map((item, index) => (
        <div key={index} className="table-row">
          <div className="item-image">
            {item.image ? (
              <img 
                src={`data:image/jpeg;base64,${item.image}`}
                alt={item.name}
                className="inventory-image"
              />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>
          <div>{item.name || 'N/A'}</div>
          <div>{item.quantity || 0}</div>
          <div>${item.price || 0}</div>
          <div>{item.discount || 0}%</div>
          <div>{item.isSale ? 'On Sale' : 'Regular'}</div>
          <div className="actions">
            <button 
              className={`btn-availability ${item.isAvailable ? 'available' : 'unavailable'}`}
              onClick={() => handleToggleAvailability(item.id, item.isAvailable)}
            >
              {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
            </button>
            <button 
              className="btn-delete"
              onClick={() => handleDeleteItem(item.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 