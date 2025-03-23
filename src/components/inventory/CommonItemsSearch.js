import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../../services/api';
import debounce from 'lodash/debounce';

export const CommonItemsSearch = ({ storeId,onItemSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length >= 1) {
        refetch();
      }
    }, 300),
    []
  );

  const { data: searchResults, isLoading, error, refetch } = useQuery({
    queryKey: ['commonItems', searchQuery],
    queryFn: () => inventoryApi.searchCommonItems(searchQuery,storeId),
    enabled: false,
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <Text style={styles.title}>Search Common Items</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.searchResults}>
        {isLoading && (
          <Text style={styles.loadingText}>Loading...</Text>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load items. Please try again.</Text>
            <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {searchResults?.map(item => (
          <TouchableOpacity 
            key={item.id}
            style={styles.resultItem}
            onPress={() => onItemSelect(item)}
          >
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <View style={styles.descriptionContainer}>
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={styles.itemImageContainer}>
              <Image 
                source={{uri: `data:image/jpeg;base64,${item.image}`}}
                style={styles.itemImage}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        ))}

        {searchResults?.length === 0 && searchQuery && (
          <Text style={styles.noResults}>
            No items found matching "{searchQuery}"
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchHeader: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  searchResults: {
    marginTop: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#ff4444',
    marginBottom: 8,
  },
  retryButton: {
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
  },
  resultItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemDetails: {
    flex: 2,
  },
  descriptionContainer: {
    flex: 3,
    paddingHorizontal: 10,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  itemImageContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemCategory: {
    fontSize: 14,
    color: '#666',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    marginTop: 16,
  },
}); 