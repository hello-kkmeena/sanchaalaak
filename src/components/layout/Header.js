import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { UserProfile } from '../user/UserProfile';
import { StoreSelector } from '../store/StoreSelector';

export const Header = ({ selectedStore, onStoreChange, userInfo = {} }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Text style={styles.title}>Sanchaalaak</Text>
        <StoreSelector 
          selectedStore={selectedStore} 
          onStoreChange={onStoreChange}
          stores={userInfo?.stores || []}
        />
      </View>
      <UserProfile user={userInfo} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
}); 