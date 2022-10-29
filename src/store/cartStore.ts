import create from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: number[];
  services: number[];
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  changeService: (id: number, value: boolean) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>(persist((set, get) => ({
  items: [],
  services: [],

  addToCart: (id) => {
    const items = get().items;
    if (!items.includes(id)) {
      set({ items: [...get().items, id] });
    }
  },

  removeFromCart: (id) => {
    set({ items: get().items.filter((item) => item !== id) });
  },

  changeService: (id, value) => {
    const services = get().services;
    set({ services: value ? [...services, id] : services.filter((item) => item !== id) });
  },

  clear: () => {
    set({ services: [], items: [] })
  }
}), { name: 'cart' }));
