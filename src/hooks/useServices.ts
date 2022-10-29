import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useServices(): [Service[], Promise<void> | undefined] {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesPromise, setServicesPromise] = useState<Promise<void>>();

  const fetchServices = async () => {
    const response = await axios.get<Service[]>('/api/services');
    setServices(response.data);
  }

  useEffect(() => {
    setServicesPromise(fetchServices());
  }, []);

  return [services, servicesPromise];
}
