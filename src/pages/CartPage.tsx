import { useCartStore } from '../store/cartStore';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PromiseHandler from '../components/PromiseHandler';
import formatCurrency from '../utils/formatCurrency';
import { Link } from 'react-router-dom';

function Summary({ cartValue }: { cartValue: number }) {
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

export default function CartPage() {
  const { items, removeFromCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);

  const cartValue = products.reduce((value, product) => value + product.price, 0);

  const fetchCartProducts = async () => {
    if (items.length > 0) {
      const searchParams = new URLSearchParams();
      items.forEach((item) => searchParams.append('id[]', item.toString()));
      const response = await axios.get('/api/product', { params: searchParams });
      setProducts(response.data);
    }
  }

  const fetchPaymentTypes = async () => {
    const response = await axios.get<PaymentType[]>('/api/paymentType');
    setPaymentTypes(response.data);
  }

  const [productsPromise, setProductsPromise] = useState<Promise<void>>();
  const [paymentTypesPromise, setPaymentTypesPromise] = useState<Promise<void>>();

  useEffect(() => {
    setProductsPromise(fetchCartProducts());
    setPaymentTypesPromise(fetchPaymentTypes());
  }, []);

  return (
    <>
      <Helmet>
        <title>Koszyk</title>
      </Helmet>
      <PromiseHandler promise={productsPromise} onDone={() =>
        <>
          <div className='row'>
            <div className='col-12 col-md-8'>
              <h4 className='mb-3 orange-underline'>Twój koszyk</h4>
              <div className='bg-light border rounded px-3 py-1 mb-3'>
                <div id='cart-container'>
                  {
                    products.map((product, index) =>
                      <div key={product.id}
                           className={`d-flex align-items-center py-2 ${index !== products.length - 1 ? 'border-bottom' : ''}`}
                           style={{ borderColor: 'var(--bs-orange)!important' }}>
                        <div className='ms-2 ms-sm-3'>{index + 1}{index < 9 ? <>&nbsp;&nbsp;</> : ''}</div>
                        <div className='d-flex align-items-center ms-1 ms-sm-2 flex-shrink-0 cart-item-image border rounded p-1 bg-white'>
                          <img src={`/storage/products/${product.image}`}
                               alt={product.name}
                               className='w-100 h-100 object-fit-contain'/>
                        </div>
                        <div className='flex-grow-1 text-break ms-2 ms-sm-3'>{product.name}</div>
                        <div className='ms-3 fw-500'>
                          <span className='text-muted'>{formatCurrency(product.price)}</span>
                          <span className='text-orange' style={{ paddingLeft: '2px' }}>zł</span>
                        </div>
                        <button className='btn btn-sm d-inline-flex flex-center bg-transparent border-0 p-0 ms-1 text-danger cart-remove-btn'
                                onClick={() => {
                                  removeFromCart(product.id);
                                  setProducts(products.filter((p) => p.id !== product.id));
                                }}>
                          <span className='material-icons fs-5'>close</span>
                        </button>
                      </div>
                    )
                  }
                </div>
                {
                  products.length === 0 ?
                    <div id='cart-empty-message' className='text-center py-1'>
                      <h4>Na razie jest tutaj pusto 😶</h4>
                      <div>
                        Przejdź <Link to='/produkty'>tutaj</Link>, aby zobaczyć nasze produkty i napełnić nimi koszyk
                        😉.
                      </div>
                    </div> : null
                }
              </div>
            </div>
            <div className='col-12 col-md-4'>
              <h4 className='mb-3 orange-underline'>Podsumowanie</h4>
              <Summary cartValue={cartValue}/>
            </div>
          </div>
          {
            products.length > 0 ?
              <div id='order-form-container'>
                <h4 className='mb-3 orange-underline'>Twoje dane</h4>
                <div className='bg-light border rounded px-3 py-2 mb-3'>
                  <form method='post' id='order-form'>
                    <div className='row mb-3'>
                      <div className='col-12 col-sm-6 mb-3 mb-sm-0'>
                        <label className='form-label' htmlFor='name'>Imię</label>
                        <input type='text'
                               className='form-control form-control-sm'
                               name='name'
                               id='name'
                               required/>
                      </div>
                      <div className='col-12 col-sm-6'>
                        <label className='form-label' htmlFor='surname'>Nazwisko</label>
                        <input type='text'
                               className='form-control form-control-sm'
                               name='surname'
                               id='surname'
                               required/>
                      </div>
                    </div>
                    <div className='row mb-3'>
                      <div className='col-12 col-md-5 mb-3 mb-md-0'>
                        <label className='form-label' htmlFor='address'>Adres</label>
                        <input type='text'
                               className='form-control form-control-sm'
                               name='address'
                               id='address'
                               required/>
                      </div>
                      <div className='col-12 col-sm-6 col-md-3 mb-3 mb-md-0'>
                        <label className='form-label' htmlFor='postal_code'>Kod pocztowy</label>
                        <input type='text'
                               className='form-control form-control-sm'
                               name='postal_code'
                               id='postal_code'
                               required/>
                      </div>
                      <div className='col-12 col-sm-6 col-md-4'>
                        <label className='form-label' htmlFor='city'>Miasto</label>
                        <input type='text'
                               className='form-control form-control-sm'
                               name='city'
                               id='city'
                               required/>
                      </div>
                    </div>
                    <div className='row mb-3'>
                      <div className='col-12 col-sm-6 mb-3 mb-sm-0'>
                        <label className='form-label' htmlFor='phone'>Nr telefonu</label>
                        <input type='text'
                               className='form-control form-control-sm'
                               name='phone'
                               id='phone'
                               required/>
                      </div>
                      <div className='col-12 col-sm-6'>
                        <label className='form-label'>Forma płatności</label>
                        <div>
                          {
                            paymentTypes.map((paymentType, index) =>
                              <span key={paymentType.id}>
                                <input className={`form-check-input me-2 ${index > 0 ? 'ms-4' : ''}`}
                                       type='radio'
                                       name='payment_type_id'
                                       id={`payment-type-${paymentType.id}`}
                                       value={paymentType.id}
                                       required/>
                                <label className='form-check-label'
                                       htmlFor='payment-type-{{ $paymentType->id }}'>{paymentType.name}</label>
                              </span>
                            )
                          }
                        </div>
                      </div>
                    </div>
                    <div className='d-flex justify-content-center'>
                      <button className='btn btn-orange' type='submit'>Zamów</button>
                    </div>
                  </form>
                </div>
              </div> : null
          }
        </>
      }/>
    </>
  )
}
