import { useEffect, useState } from 'react';
import formatCurrency from '../../utils/formatCurrency';
import { orderStatusIcons } from '../../utils/orderStatusIcons';
import axios from 'axios';
import PromiseHandler from '../../components/PromiseHandler';
import BootstrapError from '../../BootstrapError';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import disableSubmitButton from '../../utils/disableSubmitButton';
import { Link } from 'react-router-dom';

function LastOrders() {
  const [lastOrders, setLastOrders] = useState<Order[]>([]);
  const [lastOrdersPromise, setLastOrdersPromise] = useState<Promise<void>>();

  const fetchLastOrders = async () => {
    const response = await axios.get<Order[]>('/api/orders/last');
    const { data } = response;
    data.forEach((order) => order.date = new Date(order.date));
    setLastOrders(data);
  }

  useEffect(() => {
    setLastOrdersPromise(fetchLastOrders());
  }, []);

  return (
    <PromiseHandler promise={lastOrdersPromise} onDone={() =>
      <div className='table-responsive'>
        <table className='table table-hover'>
          <thead>
            <tr>
              <th scope='col'>Nr</th>
              <th scope='col'>Data</th>
              <th scope='col'>Wartość</th>
              <th scope='col'>Płatność</th>
              <th scope='col'>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              lastOrders.map((order) =>
                <tr key={order.id} className='position-relative text-nowrap'>
                  <td>{order.id}<Link to={`/zamowienia/${order.id}`} className='stretched-link'/></td>
                  <td>{order.date.toLocaleString()}</td>
                  <td>
                    <span className='text-muted me-1'>{formatCurrency(order.value)}</span>
                    <span className='text-orange'>zł</span>
                  </td>
                  <td>{order.payment_type.name}</td>
                  <td>
                      <span className='d-inline-flex align-items-center'>
                        <span>{order.order_status.name}</span>
                        <span className={`material-icons ms-2 icon-small ${orderStatusIcons[order.order_status.id].color}`}>
                          {orderStatusIcons[order.order_status.id].icon}
                        </span>
                      </span>
                  </td>
                </tr>
              )
            }
            {
              lastOrders.length === 0 ?
                <tr>
                  <td colSpan={5} className='text-center text-muted'>Brak nowych zamówień</td>
                </tr> : null
            }
          </tbody>
        </table>
      </div>
    }/>
  )
}

function UnavailableProducts() {
  const [unavailableProducts, setUnavailableProducts] = useState<Product[]>([]);
  const [unavailableProductsPromise, setUnavailableProductsPromise] = useState<Promise<void>>();

  const fetchUnavailableProducts = async () => {
    const response = await axios.get<Product[]>('/api/products/unavailable');
    setUnavailableProducts(response.data);
  }

  useEffect(() => {
    setUnavailableProductsPromise(fetchUnavailableProducts());
  }, []);

  return (
    <PromiseHandler promise={unavailableProductsPromise} onDone={() =>
      <div className='table-responsive'>
        <table className='table table-hover vertical-middle'>
          <thead>
            <tr>
              <th scope='col'/>
              <th scope='col'>Nazwa</th>
              <th scope='col'>Kategoria</th>
              <th scope='col'>Cena</th>
            </tr>
          </thead>
          <tbody>
            {
              unavailableProducts.map((product) =>
                <tr key={product.id} className='position-relative text-nowrap'>
                  <td style={{ width: '1%' }}>
                    <Link to={`/produkty/edytuj/${product.id}`} className='stretched-link'>
                      <span className='d-flex flex-center border rounded p-1 bg-white me-2'
                            style={{ width: '3rem', height: '3rem' }}>
                        <img className='w-100 h-100 object-fit-contain'
                             src={`/storage/products/${product.image}`}
                             alt={product.name}/>
                      </span>
                    </Link>
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category.name}</td>
                  <td>
                    <span className='text-muted'>{formatCurrency(product.price)}</span>
                    <span className='text-orange ms-1'>zł</span>
                  </td>
                </tr>
              )
            }
            {
              unavailableProducts.length === 0 ?
                <tr>
                  <td colSpan={4} className='text-center text-muted'>Wszystkie produkty są na stanie</td>
                </tr> : null
            }
          </tbody>
        </table>
      </div>
    }/>
  )
}

const servicesSchema = Yup.object().shape({
  assembly: Yup.number()
    .required('Pole nie może być puste')
    .moreThan(0, 'Cena musi być większa od 0')
    .lessThan(10000, 'Cena musi być mniejsza od 10000'),
  os_installation: Yup.number()
    .required('Pole nie może być puste')
    .moreThan(0, 'Cena musi być większa od 0')
    .lessThan(10000, 'Cena musi być mniejsza od 10000'),
})

function PriceList() {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesPromise, setServicesPromise] = useState<Promise<void>>();

  const initialValues = services.reduce((previousValue, service) => {
    previousValue[service.id] = service.price;
    return previousValue;
  }, {} as { [k in Services]: number });

  const fetchServices = async () => {
    const response = await axios.get<Service[]>('/api/services');
    setServices(response.data);
  }

  useEffect(() => {
    setServicesPromise(fetchServices());
  }, []);

  return (
    <PromiseHandler promise={servicesPromise} onDone={() =>
      <div className='card bg-light'>
        <div className='card-body'>
          <Formik initialValues={initialValues}
                  validationSchema={servicesSchema}
                  validateOnMount
                  onSubmit={(values, { setSubmitting }) => {
                    axios.patch('/api/services', values)
                      .then(() => console.log('jest git'))
                      .catch((e) => console.log(e))
                      .finally(() => setSubmitting(false))
                  }}>
            {({ errors, touched, isSubmitting }) =>
              <Form noValidate>
                <div className='row'>
                  {
                    services.map((service) =>
                      <div key={service.id} className='col-12 col-sm-6'>
                        <label htmlFor={service.id}>{service.name}</label>
                        <div className='input-group'>
                          <Field type='number'
                                 className={`form-control ${!errors[service.id] || !touched[service.id] || 'is-invalid'}`}
                                 name={service.id}
                                 required/>
                          <span className='input-group-text'>zł</span>
                          <BootstrapError name={service.id}/>
                        </div>
                      </div>
                    )
                  }
                </div>
                <div className='text-center mt-3'>
                  <button type='submit'
                          className='btn btn-orange'
                          disabled={disableSubmitButton(isSubmitting, errors)}>
                    Zapisz
                  </button>
                </div>
              </Form>
            }
          </Formik>
        </div>
      </div>
    }/>
  )
}

export function AdminHomePage() {
  return (
    <>
      <div className='mb-4'>
        <h4 className='orange-underline'>Ostatnie zamówienia</h4>
        <LastOrders/>
      </div>
      <div className='mb-4'>
        <h4 className='orange-underline'>Niedostępne produkty</h4>
        <UnavailableProducts/>
      </div>
      <div className='mb-4'>
        <h4 className='orange-underline'>Cennik usług</h4>
        <PriceList/>
      </div>
    </>
  )
}
