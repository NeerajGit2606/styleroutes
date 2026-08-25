export const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 99;

export const CATEGORIES: [string, string][] = [
  ["T-Shirt", "photo-1503944583220-79d8926ad5e2"],
  ["Shirt", "photo-1485968579580-b6d095142e6e"],
  ["Shorts", "photo-1519238263530-99bdd11df2ea"],
  ["Pants", "photo-1522771739844-6a9f6d5f14af"],
  ["Sets", "photo-1622290291468-a28f7a7dc6a8"],
  ["Dungaree", "photo-1600091166971-7f9faad6c1e2"],
];

export const money = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
