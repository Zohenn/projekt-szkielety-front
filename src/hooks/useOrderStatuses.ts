import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useOrderStatuses(): [OrderStatus[], Promise<void> | undefined] {
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [orderStatusesPromise, setOrderStatusesPromise] = useState<Promise<void>>();

  const fetchOrderStatuses = async () => {
    const response = await axios.get<OrderStatus[]>('/api/orderStatuses');
    setOrderStatuses(response.data);
  }

  useEffect(() => {
    setOrderStatusesPromise(fetchOrderStatuses());
  }, []);

  return [orderStatuses, orderStatusesPromise];
}
