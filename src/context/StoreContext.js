import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useInventory } from '../hooks/useInventory';
import { inventoryApi } from '../services/api';

// Create a context for store management
const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // State for selected store and loading/error states
  const [selectedStore, setSelectedStore] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(null);
  
  // Use the inventory hook with the selected store's ID
  const {
    inventory,
    isLoading: inventoryLoading,
    error: inventoryError,
    addItem,
    updateItem,
    deleteItem,
  } = useInventory(selectedStore?.id);

  // Create a store object that includes inventory data
  const storeWithInventory = useMemo(() => {
    if (!selectedStore) return null;
    
    // Ensure we have an inventory array
    const currentInventory = selectedStore.inventory || inventory || [];
    console.log('Current inventory in context:', currentInventory); // Debug log

    return {
      ...selectedStore,
      inventory: currentInventory
    };
  }, [selectedStore, inventory]);

  const updateStoreItem = useCallback((itemId, updatedItem) => {
    console.log('Updating store item:', itemId, 'with:', updatedItem);
    
    setSelectedStore(prevStore => {
      if (!prevStore || !prevStore.inventory) return prevStore;
      
      const updatedInventory = prevStore.inventory.map(item => 
        item.id === itemId ? { ...item, ...updatedItem } : item
      );

      console.log('Updated inventory:', updatedInventory);
      
      return {
        ...prevStore,
        inventory: updatedInventory
      };
    });
  }, []);

  // Debug log for provider value
  console.log('Provider value:', {
    selectedStore: storeWithInventory,
    isLoading: inventoryLoading || isRefreshing,
    error: inventoryError || refreshError
  });

  const refreshStoreInventory = async (storeId) => {
    try {
      setIsRefreshing(true);
      setRefreshError(null);
      const updatedInventory = await inventoryApi.getStoreInventory(storeId);
      setSelectedStore(prevStore => {
        if (!prevStore) return null;
        return {
          ...prevStore,
          inventory: updatedInventory || []
        };
      });
    } catch (err) {
      setRefreshError('Failed to refresh inventory');
      console.error('Error refreshing inventory:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <StoreContext.Provider value={{ 
      selectedStore: storeWithInventory,
      setSelectedStore,
      isLoading: inventoryLoading || isRefreshing,
      error: inventoryError || refreshError,
      addItem,
      updateItem,
      deleteItem,
      refreshStoreInventory,
      updateStoreItem
    }}>
      {children}
    </StoreContext.Provider>
  );
};

// Custom hook to use store context
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}; 