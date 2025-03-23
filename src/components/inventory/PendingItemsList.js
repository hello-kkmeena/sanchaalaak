import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export const PendingItemsList = ({ items, onRemoveItem }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pending Items ({items.length})</Text>
      <ScrollView style={styles.list}>
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                Qty: {item.quantityPerPacking} | Price: ${item.price} | Discount: {item.discount}%
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => onRemoveItem(index)}
            >
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  list: {
    maxHeight: 300,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontSize: 20,
    color: '#ff4444',
  },
}); 