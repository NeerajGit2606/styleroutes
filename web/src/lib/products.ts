export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: string;
  description: string;
  sizes: string[];
};

export const photo = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Skyline Graphic Tee",
    category: "T-Shirts",
    price: 899,
    oldPrice: 1199,
    badge: "NEW",
    image: photo("photo-1503944583220-79d8926ad5e2"),
    description: "A soft, breathable cotton tee with a bold graphic print — built for playground days and easy to pair with anything in the wardrobe.",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
  },
  {
    id: 2,
    name: "Weekend Cargo Shorts",
    category: "Shorts",
    price: 1199,
    image: photo("photo-1519238263530-99bdd11df2ea"),
    description: "Durable cotton-blend cargo shorts with reinforced knees and multiple pockets — made to survive climbing, running, and everything in between.",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
  },
  {
    id: 3,
    name: "Indigo Club Overshirt",
    category: "Shirts",
    price: 1499,
    oldPrice: 1799,
    badge: "BESTSELLER",
    image: photo("photo-1485968579580-b6d095142e6e"),
    description: "A smart-casual overshirt in indigo twill — dresses up a plain tee for family outings without losing everyday comfort.",
    sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"],
  },
  {
    id: 4,
    name: "Easy Move Joggers",
    category: "Bottoms",
    price: 1299,
    image: photo("photo-1515886657613-9f3515b0c78f"),
    description: "Stretch-waist joggers in a soft brushed fabric — built for full range of motion, from the school run to the playground.",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
  },
];

export const CATEGORIES: [string, string][] = [
  ["T-Shirts", "photo-1519457431-44ccd64a579b"],
  ["Shirts", "photo-1519238263530-99bdd11df2ea"],
  ["Shorts", "photo-1519085360753-af0119f7cbe7"],
  ["Denim", "photo-1542272604-787c3835535d"],
];

export const money = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
