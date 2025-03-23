export interface User {
  id: string;
  name: string;
  role: string;
  avatar: string;
  accessibleStores: Store[];
}

export interface Store {
  id: string;
  name: string;
  inventory?: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  isSale: boolean;
} 