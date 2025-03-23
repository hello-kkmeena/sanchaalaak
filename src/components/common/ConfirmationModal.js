import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    minWidth: 80,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
}); 