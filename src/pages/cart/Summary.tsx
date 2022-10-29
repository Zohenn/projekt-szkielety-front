import { useCartStore } from '../../store/cartStore';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PromiseHandler from '../../components/PromiseHandler';
import formatCurrency from '../../utils/formatCurrency';
import useServices from '../../hooks/useServices';

export default function Summary({ cartValue }: { cartValue: number }) {
  const { services: cartServices, changeService } = useCartStore();
  const [services, servicesPromise] = useServices();

  const serviceValue = cartServices.reduce((sum, id) => sum + (services.find((s) => s.id === id)?.price ?? 0), 0);

  const orderValue = cartValue + serviceValue;

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
        {services.map((service) =>
          <div key={service.id} className='form-check'>
            <input className='form-check-input'
                   type='checkbox'
                   id={`service-${service.id}`}
                   checked={cartServices.includes(service.id)}
                   onChange={(e) => changeService(service.id, e.target.checked)}/>
            <label className='form-check-label fw-normal d-flex' htmlFor={`service-${service.id}`}>
              <span className='flex-grow-1'>{service.name}</span>
              <span className='ms-2 fw-500'>
                    <span className='text-muted'>{formatCurrency(service.price)}</span>
                    <span className='text-orange' style={{ paddingLeft: '2px' }}>zł</span>
                  </span>
            </label>
          </div>
        )}
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
