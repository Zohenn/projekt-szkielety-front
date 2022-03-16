import create from 'zustand';

interface CartStore {
  items: number[];
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
}));
