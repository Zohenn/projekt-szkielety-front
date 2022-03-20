import create from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore{
  items: number[];
  services: {
    assembly: boolean;
    osInstallation: boolean;
  }
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
}

export const useCartStore = create<CartStore>(persist((set, get) => ({
  items: [],
  services: {
    assembly: false,
    osInstallation: false,
  },
  addToCart: (id: number) => {
    const items = get().items;
    if(!items.includes(id)){
      set({ items: [...get().items, id] });
    }
  },
  removeFromCart: (id: number) => {
    set({ items: get().items.filter((item) => item !== id) });
  }
}), { name: 'cart' }));
