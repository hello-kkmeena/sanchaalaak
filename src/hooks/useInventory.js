import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../services/api';

export const useInventory = (storeId) => {
  const queryClient = useQueryClient();

  const {
    data: inventory,
    isLoading,
    error
  } = useQuery({
    queryKey: ['inventory', storeId],
    queryFn: () => inventoryApi.getStoreInventory(storeId),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  const addItemMutation = useMutation({
    mutationFn: (item) => inventoryApi.addItemToStore(storeId, item),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory', storeId]);
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ itemId, updates }) => 
      inventoryApi.updateStoreItem(storeId, itemId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory', storeId]);
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: (itemId) => inventoryApi.deleteStoreItem(storeId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries(['inventory', storeId]);
    },
  });

  return {
    inventory,
    isLoading,
    error,
    addItem: addItemMutation.mutate,
    updateItem: updateItemMutation.mutate,
    deleteItem: deleteItemMutation.mutate,
    isAddingItem: addItemMutation.isLoading,
    isUpdatingItem: updateItemMutation.isLoading,
    isDeletingItem: deleteItemMutation.isLoading,
  };
}; 