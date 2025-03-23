import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';

export const AddItemModal = ({ item, onSubmit, onClose }) => {

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      quantityPerPacking: '1',
      price: '0',
      discount: '0',
      description: item.description || '',
    },
  });

  const onFormSubmit = (data) => {
    onSubmit({
      ...item,
      ...data,
      quantity: parseInt(data.quantityPerPacking),
      price: parseFloat(data.price),
      discount: parseInt(data.discount),
    });
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Add Item: {item.name}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer}>
          <View style={styles.itemDetails}>
            <Text style={styles.itemCategory}>{item.category}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Quantity per Packing</Text>
            <Controller
              control={control}
              name="quantityPerPacking"
              rules={{ required: 'Quantity is required' }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.quantityPerPacking && (
              <Text style={styles.errorText}>{errors.quantityPerPacking.message}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Price</Text>
            <Controller
              control={control}
              name="price"
              rules={{ 
                required: 'This field is required',
                min: { value: 0, message: 'Price cannot be negative' }
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  keyboardType="decimal-pad"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.price && (
              <Text style={styles.errorText}>{errors.price.message}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Discount (%)</Text>
            <Controller
              control={control}
              name="discount"
              rules={{ 
                min: { value: 0, message: 'Discount cannot be negative' },
                max: { value: 100, message: 'Discount cannot exceed 100%' }
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.discount && (
              <Text style={styles.errorText}>{errors.discount.message}</Text>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <Controller
              control={control}
              name="description"
              rules={{ 
                required: 'Description is required',
                minLength: { value: 10, message: 'Description must be at least 10 characters' }
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  multiline
                  numberOfLines={4}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description.message}</Text>
            )}
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.submitButton]} 
              onPress={handleSubmit(onFormSubmit)}
            >
              <Text style={styles.buttonText}>Add to List</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  modalHeader: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 4,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  itemDetails: {
    marginBottom: 20,
  },
  itemCategory: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 16,
  },
}); 