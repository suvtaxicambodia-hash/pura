export interface StockItem {
  id: string;
  code: string;
  name: string;
  buyPrice: number;       // in KHR
  sellPrice: number;      // in KHR
  dateAdded: string;
  purchaseDate: string;   // Date of Purchase
  totalStock: number;     // in kg
  remainingStock: number; // in kg
  remainingFleshStock?: number; // in kg, net processed flesh stock
  lowStockThreshold: number; // in kg, default is 10
}

export interface SaleItem {
  id: string;
  stockItemId: string;
  name: string;
  code: string;
  mode: 'fruit' | 'flesh'; // 'លក់ជាផ្លែ' / 'បកសាច់សុទ្ធ'
  fleshMeasurementType?: 'fruit' | 'flesh'; // 'ផ្លែ (គីឡូ)' / 'សាច់សុទ្ធ (គីឡូ)'
  weight: number;          // in kg
  price: number;           // in KHR
  paymentMethod: 'cash' | 'aba'; // 'លុយសុទ្ធ' / 'ABA QR'
  amountPaidKhr: number;
  amountPaidUsd: number;
  changeKhr: number;
  date: string;            // YYYY-MM-DD
}

export interface ExpenseItem {
  id: string;
  category: 'fuel' | 'gas' | 'salary' | 'other';
  description: string;
  amountKhr: number;
  date: string;            // YYYY-MM-DD
}

export interface StaffAccount {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'staff'; // admin is 'អ្នកគ្រប់គ្រង', staff is 'អ្នកតាមដាន'
  password?: string;
  avatarUrl?: string;
}
