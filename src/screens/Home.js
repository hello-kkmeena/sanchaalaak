import React, { useState, useCallback } from 'react';
import { InventoryTable } from '../components/inventory/InventoryTable';
import { AddItemModal } from '../components/inventory/AddItemModal';
import { CommonItemsSearch } from '../components/inventory/CommonItemsSearch';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Toast } from '../components/common/Toast';
import { PendingItemsList } from '../components/inventory/PendingItemsList';
import { useStore } from '../context/StoreContext';
import { inventoryApi } from '../services/api';
import './Home.css';

export const Home = () => {
  const { selectedStore, isLoading: storeLoading, error, addItem } = useStore();
  const [toast, setToast] = useState(null);
  const [pendingItems, setPendingItems] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);
  const [conflictingItems, setConflictingItems] = useState([]);
  const [isAddingItems, setIsAddingItems] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  // Add new states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommonItem, setSelectedCommonItem] = useState(null);
  const [commonItems,setCommonItems] = useState([]);

  // Add search filter function
  const filteredItems = !commonItems ? [] : commonItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const filteredStores = stores.filter(store =>
  //   store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   store.location.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handleAddItem = (itemData) => {
    if (selectedStore) {
      setToast({
        message: 'Please select a store first',
        type: 'error'
      });
      return;
    }

    const conflicts = checkForConflicts(itemData);
    if (conflicts.length > 0) {
      setConflictingItems(conflicts);
      setItemToAdd(itemData);
      setShowConfirmation(true);
      return;
    }

    addItemToPending(itemData);
  };

  const addItemToPending = (itemData) => {
    setPendingItems(current => [...current, {
      ...itemData,
      storeId: selectedStore.id
    }]);
    setToast({
      message: 'Item added to pending list',
      type: 'success'
    });
  };

  const handleSubmitAll = async () => {
    if (pendingItems.length === 0) return;

    try {
      setIsAddingItems(true);
      await Promise.all(
        pendingItems.map(item => 
          addItem(item)
        )
      );
      setPendingItems([]);
      setIsAddingItems(false);
      setToast({
        message: 'All items added successfully',
        type: 'success'
      });
    } catch (error) {
      setToast({
        message: 'Failed to add items. Please try again.',
        type: 'error'
      });
    } finally {
      setIsAddingItems(false);
    }
  };

  const checkForConflicts = (itemData) => {
    // Implementation of conflict checking logic

    // itemToAdd check if item id is already in the inventory
    const conflict = commonItems.find(item => 
      item.id === itemToAdd.id 
      && item.storeId === selectedStore.id 
      && item.quantity == selectedStore.quantity
    );
    if(conflict){
      return [conflict];
    } 
    return [];
  };

  // Function to handle inventory click
  // const handleInventoryClick = (storeId, itemId) => {
  //   const store = stores.find(s => s.id === storeId);
  //   const inventory = store.inventory.find(inv => inv.itemId === itemId);
  //   const item = commonItems.find(i => i.id === itemId);
    
  //   setSelectedInventory({
  //     ...inventory,
  //     storeName: store.name,
  //     storeLocation: store.location,
  //     itemDetails: item
  //   });
  //   setIsModalOpen(true);
  // };

  const handleItemClick = (item) => {
    // Create a mock inventory item for viewing details
    const itemDetails = {
      itemDetails: {
        ...item,
        images: item.images || [],
        specifications: item.specifications || {}
      },
      quantity: 0,
      batchNumber: '-',
      manufacturingDate: new Date().toISOString(),
      expiryDate: new Date().toISOString(),
      lastRestocked: new Date().toISOString(),
      location: '-',
      storeName: 'Common Items',
      storeLocation: '-'
    };
    
    setSelectedInventory(itemDetails);
    setIsModalOpen(true);
  };

  const handleCommonItemSelect = (item) => {
    setItemToAdd(item);
    setShowAddItemModal(true);
  };

  const handleAddItemSubmit = (itemDetails) => {
    const newItem = {
      ...itemToAdd,
      ...itemDetails,
      storeId: selectedStore.id
    };

    const conflicts = checkForConflicts(newItem);
    if (conflicts.length > 0) {
      setConflictingItems(conflicts);
      setShowConfirmation(true);
      return;
    }

    addItemToPending(newItem);
    setShowAddItemModal(false);
    setItemToAdd(null);
  };

  return (
    <div className="inventory-dashboard">
      <div className="dashboard-content">
        {!selectedStore ? (
          <div className="common-items-section">
            <div className="section-header">
              <h2>Common Items</h2>
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="items-table">
              <div className="table-header">
                <div className="col-image">Image</div>
                <div className="col-name">Name</div>
                <div className="col-description">Description</div>
                <div className="col-brand">Brand</div>
                <div className="col-category">Category</div>
                <div className="col-type">Type</div>
                <div className="col-actions">Actions</div>
              </div>
              
              {filteredItems.map(item => (
                <div key={item.id} className="table-row" onClick={() => handleItemClick(item)}>
                  <div className="col-image">
                    {item.images && item.images[0] ? (
                      <img src={item.images[0]} alt={item.name} className="item-thumbnail" />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="col-name">{item.name}</div>
                  <div className="col-description">{item.description}</div>
                  <div className="col-brand">{item.brand || '-'}</div>
                  <div className="col-category">{item.category}</div>
                  <div className="col-type">{item.type || '-'}</div>
                  <div className="col-actions">
                    <button 
                      className="btn-add"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCommonItem(item);
                      }}
                    >
                      Add to Store
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {isAddingItems ? (
              <div className="add-items-section">
                <CommonItemsSearch 
                  onItemSelect={handleCommonItemSelect}
                  storeId={selectedStore.id}
                />
                
                <div className="pending-items">
                  <h3>Pending Items ({pendingItems.length})</h3>
                  {/* Show pending items list */}
                </div>
                
                <div className="actions">
                  <button onClick={() => setIsAddingItems(false)}>Cancel</button>
                  <button 
                    onClick={handleSubmitAll}
                    disabled={pendingItems.length === 0}
                  >
                    Submit All
                  </button>
                </div>
              </div>
            ) : (
              <div className="view-inventory-section">
                <div className="section-header">
                  <h2>Store Inventory</h2>
                  <button onClick={() => setIsAddingItems(true)}>
                    Add Items
                  </button>
                </div>
                <InventoryTable store={selectedStore} />
              </div>
            )}
          </>
        )}
      </div>

      {selectedCommonItem && (
        <AddItemModal
          item={selectedCommonItem}
          onSubmit={handleAddItem}
          onClose={() => setSelectedCommonItem(null)}
        />
      )}

      {showConfirmation && (
        <ConfirmationModal
          message={`There are ${conflictingItems.length} conflicting items. Do you want to proceed?`}
          onConfirm={() => {
            addItemToPending(itemToAdd);
            setShowConfirmation(false);
            setItemToAdd(null);
            setConflictingItems([]);
          }}
          onCancel={() => {
            setShowConfirmation(false);
            setItemToAdd(null);
            setConflictingItems([]);
          }}
        />
      )}

      {(storeLoading || isAddingItems) && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {toast && (
        <Toast
          {...toast}
          onHide={() => setToast(null)}
        />
      )}

      {pendingItems.length > 0 && (
        <PendingItemsList
          items={pendingItems}
          onRemoveItem={(index) => {
            setPendingItems(current => 
              current.filter((_, i) => i !== index)
            );
          }}
        />
      )}

      {/* Inventory Detail Modal */}
      {isModalOpen && selectedInventory && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>×</button>
            
            <div className="modal-header">
              <h2>{selectedInventory.itemDetails.name}</h2>
              <p className="store-label">{selectedInventory.storeName} - {selectedInventory.storeLocation}</p>
            </div>

            <div className="modal-body">
              <div className="image-gallery">
                {selectedInventory.itemDetails.images.map((img, index) => (
                  <img key={index} src={img} alt={`${selectedInventory.itemDetails.name} ${index + 1}`} />
                ))}
              </div>

              <div className="inventory-details">
                <h3>Inventory Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Quantity</label>
                    <span>{selectedInventory.quantity} units</span>
                  </div>
                  <div className="detail-item">
                    <label>Batch Number</label>
                    <span>{selectedInventory.batchNumber}</span>
                  </div>
                  <div className="detail-item">
                    <label>Manufacturing Date</label>
                    <span>{new Date(selectedInventory.manufacturingDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Expiry Date</label>
                    <span>{new Date(selectedInventory.expiryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Restocked</label>
                    <span>{new Date(selectedInventory.lastRestocked).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <label>Storage Location</label>
                    <span>{selectedInventory.location}</span>
                  </div>
                </div>

                <h3>Product Specifications</h3>
                <div className="specifications">
                  {Object.entries(selectedInventory.itemDetails.specifications).map(([key, value]) => (
                    <div key={key} className="spec-item">
                      <label>{key}</label>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>

                <div className="description">
                  <h3>Description</h3>
                  <p>{selectedInventory.itemDetails.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && itemToAdd && (
        <AddItemModal
          item={itemToAdd}
          onSubmit={handleAddItemSubmit}
          onClose={() => {
            setShowAddItemModal(false);
            setItemToAdd(null);
          }}
        />
      )}
    </div>
  );
}

export default Home;