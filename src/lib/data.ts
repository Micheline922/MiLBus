export type Product = {
  id: string;
  name: string;
  category: 'Bijoux & Accessoires';
  purchasePrice?: number;
  price: number;
  stock: number;
  sold: number;
  remaining: number;
  profit?: number;
};

export type Wig = {
  id: string;
  purchasedBundles: string;
  brand: string;
  colors: string;
  wigDetails: string;
  bundlesPrice: number;
  sellingPrice: number;
  sold: number;
  remaining: number;
};

export type Pastry = {
  id: string;
  name: 'Beignets' | 'Crêpes' | 'Gâteaux';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  expenses: number;
  sold: number;
  remaining: number;
};

export type PastryExpense = {
  id: string;
  item: string;
  cost: number;
  category: 'Beignets' | 'Crêpes' | 'Gâteaux' | 'Général';
  purchaseDate: string;
};

export type Sale = {
  id: string;
  productName: string;
  customerName: string;
  date: string;
  amount: number;
  quantity: number;
};

export type Customer = {
    id: string;
    name: string;
    contact: string;
    purchaseHistory: number;
    lastPurchase: string;
};

export type Order = {
  id: string;
  customerName: string;
  customerAddress: string;
  products: string[];
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'En attente' | 'Payée' | 'Annulée';
  date: string;
};

export type Debt = {
  id: string;
  debtorName: string;
  amount: number;
  debtDate: string;
  paymentDate: string;
  status: 'En cours' | 'Remboursée';
};

export const products: Product[] = [
  { id: 'p1', name: 'Chaînette en or', category: 'Bijoux & Accessoires', purchasePrice: 15.00, price: 25.00, stock: 15, sold: 5, remaining: 10, profit: 10.00 },
  { id: 'p2', name: 'Chouchou en satin', category: 'Bijoux & Accessoires', purchasePrice: 3.00, price: 5.50, stock: 50, sold: 20, remaining: 30, profit: 2.50 },
  { id: 'p3', name: 'Gloss "Crystal"', category: 'Bijoux & Accessoires', purchasePrice: 7.00, price: 12.00, stock: 10, sold: 7, remaining: 3, profit: 5.00 },
  { id: 'p4', name: 'Pendentif lune', category: 'Bijoux & Accessoires', purchasePrice: 10.00, price: 18.75, stock: 22, sold: 10, remaining: 12, profit: 8.75 },
  { id: 'p5', name: 'Parfum "Essence"', category: 'Bijoux & Accessoires', purchasePrice: 25.00, price: 45.00, stock: 8, sold: 2, remaining: 6, profit: 20.00 },
];

export const wigs: Wig[] = [
    { id: 'w1', purchasedBundles: '3 paquets de mèches lisses', brand: 'Brazilian Hair', colors: 'Noir naturel (1B)', wigDetails: 'Perruque Lace Frontal 18 pouces', bundlesPrice: 100.00, sellingPrice: 150.00, sold: 1, remaining: 1 },
    { id: 'w2', purchasedBundles: '4 paquets de mèches bouclées', brand: 'Peruvian Hair', colors: 'Blond miel', wigDetails: 'Perruque Full Lace 24 pouces avec baby hairs', bundlesPrice: 150.00, sellingPrice: 220.00, sold: 0, remaining: 1 },
];

export const pastries: Pastry[] = [
  { id: 'pa1', name: 'Beignets', quantity: 50, unitPrice: 0.5, totalPrice: 25, expenses: 10, sold: 40, remaining: 10 },
  { id: 'pa2', name: 'Crêpes', quantity: 30, unitPrice: 1, totalPrice: 30, expenses: 12, sold: 25, remaining: 5 },
  { id: 'pa3', name: 'Gâteaux', quantity: 10, unitPrice: 2, totalPrice: 20, expenses: 8, sold: 8, remaining: 2 },
];

export const pastryExpenses: PastryExpense[] = [
  { id: 'pe1', item: 'Farine', cost: 5.00, category: 'Général', purchaseDate: '2023-10-20' },
  { id: 'pe2', item: 'Sucre', cost: 3.00, category: 'Général', purchaseDate: '2023-10-20' },
  { id: 'pe3', item: 'Oeufs', cost: 4.00, category: 'Gâteaux', purchaseDate: '2023-10-21' },
  { id: 'pe4', item: 'Huile de friture', cost: 7.00, category: 'Beignets', purchaseDate: '2023-10-22' },
  { id: 'pe5', item: 'Lait', cost: 2.50, category: 'Crêpes', purchaseDate: '2023-10-22' },
];

export const sales: Sale[] = [
  { id: 's1', productName: 'Perruque "Lisse 18 pouces"', customerName: 'Marie Claire', date: '2023-10-26', amount: 150.00, quantity: 1 },
  { id: 's2', productName: 'Chouchou en satin', customerName: 'Amina Diallo', date: '2023-10-25', amount: 11.00, quantity: 2 },
  { id: 's3', productName: 'Gloss "Crystal"', customerName: 'Sophie Dubois', date: '2023-10-25', amount: 12.00, quantity: 1 },
  { id: 's4', productName: 'Chaînette en or', customerName: 'Marie Claire', date: '2023-10-24', amount: 25.00, quantity: 1 },
  { id: 's5', productName: 'Parfum "Essence"', customerName: 'Léa Martin', date: '2023-10-23', amount: 45.00, quantity: 1 },
];

export const customers: Customer[] = [
    { id: 'c1', name: 'Marie Claire', contact: '+243 XXX XX XX XX', purchaseHistory: 2, lastPurchase: '2023-10-26' },
    { id: 'c2', name: 'Amina Diallo', contact: '+243 XXX XX XX XX', purchaseHistory: 1, lastPurchase: '203-10-25' },
    { id: 'c3', name: 'Sophie Dubois', contact: '+243 XXX XX XX XX', purchaseHistory: 5, lastPurchase: '2023-10-25' },
    { id: 'c4', name: 'Léa Martin', contact: '+243 XXX XX XX XX', purchaseHistory: 3, lastPurchase: '2023-10-23' },
    { id: 'c5', name: 'Fatou Ndiaye', contact: '+243 XXX XX XX XX', purchaseHistory: 1, lastPurchase: '2023-09-12' },
];

export const orders: Order[] = [
  { id: 'o1', customerName: 'Sophie Dubois', customerAddress: '123 Rue de la Paix, Paris', products: ['Gloss "Crystal"', 'Pendentif lune'], totalAmount: 30.75, paidAmount: 20.00, remainingAmount: 10.75, status: 'En attente', date: '2023-10-28'},
  { id: 'o2', customerName: 'Marie Claire', customerAddress: '45 Avenue des Champs, Lyon', products: ['Chaînette en or'], totalAmount: 25.00, paidAmount: 25.00, remainingAmount: 0.00, status: 'Payée', date: '2023-10-27'},
  { id: 'o3', customerName: 'Amina Diallo', customerAddress: '78 Boulevard Voltaire, Marseille', products: ['Chouchou en satin'], totalAmount: 5.50, paidAmount: 0.00, remainingAmount: 5.50, status: 'En attente', date: '2023-10-26'},
];

export const debts: Debt[] = [
  { id: 'd1', debtorName: 'Jean Dupont', amount: 50.00, debtDate: '2023-10-15', paymentDate: '2023-11-15', status: 'En cours' },
  { id: 'd2', debtorName: 'Elodie Martin', amount: 120.50, debtDate: '2023-09-01', paymentDate: '2023-10-01', status: 'Remboursée' },
  { id: 'd3', debtorName: 'Lucas Bernard', amount: 75.00, debtDate: '2023-10-20', paymentDate: '2023-11-20', status: 'En cours' },
];
