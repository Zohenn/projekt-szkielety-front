import { Variant } from 'react-bootstrap/types';
import { useCallback, useState } from 'react';

export interface ToastItem {
  id: number;
  message: string;
  bg: Variant;
  show: boolean;
}

export default function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (message: string, bg: Variant = 'success') => {
    const toast: ToastItem = {
      id: Date.now(),
      bg,
      message,
      show: true,
    }

    setToasts([...toasts, toast]);
  }

  const removeToast = useCallback((toast: ToastItem) => {
    setToasts(toasts.filter((t) => t.id !== toast.id));
  }, [toasts]);

  return { toasts, addToast, removeToast };
}
