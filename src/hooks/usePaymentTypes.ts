import { useEffect, useState } from 'react';
import axios from 'axios';

export default function usePaymentTypes(): [PaymentType[], Promise<void> | undefined] {
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);
  const [paymentTypesPromise, setPaymentTypesPromise] = useState<Promise<void>>();

  const fetchPaymentTypes = async () => {
    const response = await axios.get<PaymentType[]>('/api/paymentTypes');
    setPaymentTypes(response.data);
  }

  useEffect(() => {
    setPaymentTypesPromise(fetchPaymentTypes());
  }, []);

  return [paymentTypes, paymentTypesPromise];
}
