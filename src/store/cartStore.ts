import create from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: number[];
  services: {
    [k in Services]: boolean;
  }
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  changeService: (name: Services, value: boolean) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>(persist((set, get) => ({
  items: [],
  services: {
    assembly: false,
    os_installation: false,
  },

  addToCart: (id) => {
    const items = get().items;
    if (!items.includes(id)) {
      set({ items: [...get().items, id] });
    }
  },

  removeFromCart: (id) => {
    set({ items: get().items.filter((item) => item !== id) });
  },

  changeService: (name, value) => {
    set({ services: { ...get().services, [name]: value } });
  },

  clear: () => {
    set({ services: { assembly: false, os_installation: false }, items: [] })
  }
}), { name: 'cart' }));
