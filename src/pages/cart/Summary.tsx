import { useCartStore } from '../../store/cartStore';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PromiseHandler from '../../components/PromiseHandler';
import formatCurrency from '../../utils/formatCurrency';

export default function Summary({ cartValue }: { cartValue: number }) {
  const { services: cartServices, changeService } = useCartStore();
  const [services, setServices] = useState<Service[]>([]);

  const assemblyPrice = services.find((s) => s.id === 'assembly')?.price ?? 0;
  const osInstallationPrice = services.find((s) => s.id === 'os_installation')?.price ?? 0;

  const orderValue = cartValue + (cartServices.assembly ? assemblyPrice : 0) + (cartServices.os_installation ? osInstallationPrice : 0);

  const fetchServices = async () => {
    const response = await axios.get<Service[]>('/api/service');
    setServices(response.data);
  }

  const [servicesPromise, setServicesPromise] = useState<Promise<void>>();

  useEffect(() => {
    setServicesPromise(fetchServices());
  }, []);

  return (
    <PromiseHandler promise={servicesPromise} onDone={() =>
      <div className='bg-light border rounded px-3 py-2 mb-3 fw-500'>
        <div className='d-flex'>
          <div className='flex-grow-1'>Wartość koszyka:</div>
          <div className='ms-2'>
            <span className='text-muted' id='items-value'>{formatCurrency(cartValue)}</span>
            <span className='fw-500 text-orange' style={{ paddingLeft: '2px' }}>zł</span>
          </div>
        </div>
        <hr className='my-2 text-orange opacity-100'/>
        <div>Dodatkowe usługi:</div>
        <div className='form-check'>
          <input className='form-check-input'
                 type='checkbox'
                 id='assembly-input'
                 checked={cartServices.assembly}
                 onChange={(e) => changeService('assembly', e.target.checked)}/>
          <label className='form-check-label fw-normal d-flex' htmlFor='assembly-input'>
            <span className='flex-grow-1'>Montaż zestawu</span>
            <span className='ms-2 fw-500'>
                    <span className='text-muted'>{formatCurrency(assemblyPrice)}</span>
                    <span className='text-orange' style={{ paddingLeft: '2px' }}>zł</span>
                  </span>
          </label>
        </div>
        <div className='form-check'>
          <input className='form-check-input'
                 type='checkbox'
                 id='os-installation-input'
                 checked={cartServices.os_installation}
                 onChange={(e) => changeService('os_installation', e.target.checked)}/>
          <label className='form-check-label fw-normal d-flex' htmlFor='os-installation-input'>
            <span className='flex-grow-1'>Instalacja systemu</span>
            <span className='ms-2 fw-500'>
                    <span className='text-muted'>{formatCurrency(osInstallationPrice)}</span>
                    <span className='text-orange' style={{ paddingLeft: '2px' }}>zł</span>
                  </span>
          </label>
        </div>
        <hr className='my-2 text-orange opacity-100'/>
        <div className='text-end'>
          <span className='pe-1' style={{ paddingRight: '2px' }}>Razem:</span>
          <span className='text-muted' id='cart-value'>{formatCurrency(orderValue)}</span>
          <span className='text-orange' style={{ paddingLeft: '2px' }}>zł</span>
        </div>
      </div>
    }/>
  )
}
