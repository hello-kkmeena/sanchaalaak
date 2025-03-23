import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export const UserProfile = ({ user }) => {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userRole}>{user.role}</Text>
      </View>
      <Image 
        source={{ uri: user.avatar }} 
        style={styles.avatar}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  userRole: {
    fontSize: 14,
    color: '#666',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
}); 