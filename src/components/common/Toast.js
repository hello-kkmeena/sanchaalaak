import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export const Toast = ({ message, type = 'success', onHide }) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  }, []);

  return (
    <Animated.View style={[styles.container, styles[type], { opacity }]}>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  success: {
    backgroundColor: '#4caf50',
  },
  error: {
    backgroundColor: '#f44336',
  },
  message: {
    color: 'white',
    fontSize: 16,
  },
}); 