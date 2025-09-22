export type Product = {
  id: string;
  name: string;
  category: 'Bijoux & Accessoires' | 'Perruques';
  purchasePrice?: number;
  price: number;
  stock: number;
  profit?: number;
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

export const products: Product[] = [
  { id: 'p1', name: 'Chaînette en or', category: 'Bijoux & Accessoires', purchasePrice: 15.00, price: 25.00, stock: 15, profit: 10.00 },
  { id: 'p2', name: 'Chouchou en satin', category: 'Bijoux & Accessoires', purchasePrice: 3.00, price: 5.50, stock: 50, profit: 2.50 },
  { id: 'p3', name: 'Gloss "Crystal"', category: 'Bijoux & Accessoires', purchasePrice: 7.00, price: 12.00, stock: 3, profit: 5.00 },
  { id: 'p4', name: 'Pendentif lune', category: 'Bijoux & Accessoires', purchasePrice: 10.00, price: 18.75, stock: 22, profit: 8.75 },
  { id: 'p5', name: 'Parfum "Essence"', category: 'Bijoux & Accessoires', purchasePrice: 25.00, price: 45.00, stock: 8, profit: 20.00 },
  { id: 'p6', name: 'Perruque "Lisse 18 pouces"', category: 'Perruques', purchasePrice: 100.00, price: 150.00, stock: 5, profit: 50.00 },
  { id: 'p7', name: 'Perruque "Bouclée 24 pouces"', category: 'Perruques', purchasePrice: 150.00, price: 220.00, stock: 2, profit: 70.00 },
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
    { id: 'c2', name: 'Amina Diallo', contact: '+243 XXX XX XX XX', purchaseHistory: 1, lastPurchase: '2023-10-25' },
    { id: 'c3', name: 'Sophie Dubois', contact: '+243 XXX XX XX XX', purchaseHistory: 5, lastPurchase: '2023-10-25' },
    { id: 'c4', name: 'Léa Martin', contact: '+243 XXX XX XX XX', purchaseHistory: 3, lastPurchase: '2023-10-23' },
    { id: 'c5', name: 'Fatou Ndiaye', contact: '+243 XXX XX XX XX', purchaseHistory: 1, lastPurchase: '2023-09-12' },
];

export const orders: Order[] = [
  { id: 'o1', customerName: 'Sophie Dubois', customerAddress: '123 Rue de la Paix, Paris', products: ['Gloss "Crystal"', 'Pendentif lune'], totalAmount: 30.75, paidAmount: 20.00, remainingAmount: 10.75, status: 'En attente', date: '2023-10-28'},
  { id: 'o2', customerName: 'Marie Claire', customerAddress: '45 Avenue des Champs, Lyon', products: ['Chaînette en or'], totalAmount: 25.00, paidAmount: 25.00, remainingAmount: 0.00, status: 'Payée', date: '2023-10-27'},
  { id: 'o3', customerName: 'Amina Diallo', customerAddress: '78 Boulevard Voltaire, Marseille', products: ['Chouchou en satin'], totalAmount: 5.50, paidAmount: 0.00, remainingAmount: 5.50, status: 'En attente', date: '2023-10-26'},
];
