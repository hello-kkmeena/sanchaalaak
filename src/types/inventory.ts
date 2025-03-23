export interface CommonItem {
  id: number;
  name: string;
  category: string;
  description: string;
  manufacturer: string;
  images: string[];
  specifications: Record<string, string>;
}

export interface StoreItem extends CommonItem {
  quantityPerPacking: number;
  price: number;
  discount: number;
  isSale: boolean;
  batchNumber: string;
  manufacturingDate: string;
  expiryDate: string;
  location: string;
  lastRestocked: string;
}

export interface Store {
  id: number;
  name: string;
  location: string;
  inventory: StoreItem[];
}

export interface User {
  id: number;
  name: string;
  role: 'Admin' | 'StoreAdmin';
  avatar: string;
  accessibleStores: number[];
} 