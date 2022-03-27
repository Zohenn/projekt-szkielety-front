import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useState } from 'react';
import { orderStatusIcons } from '../../utils/orderStatusIcons';
import formatCurrency from '../../utils/formatCurrency';
import PromiseHandler from '../../components/PromiseHandler';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useOrderStatuses from '../../hooks/useOrderStatuses';
import { Form, Formik } from 'formik';
import Toasts from '../../components/Toasts';
import useToasts from '../../hooks/useToasts';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order>();
  const [orderPromise, setOrderPromise] = useState<Promise<void>>();
  const [orderStatuses, orderStatusesPromise] = useOrderStatuses();
  const { toasts, addToast, removeToast } = useToasts();

  const promises = useMemo(() => Promise.all([orderPromise, orderStatusesPromise]), [orderPromise, orderStatusesPromise]);
  const otherOrderStatuses = useMemo(() => orderStatuses.filter((orderStatus) => orderStatus.id !== order?.order_status.id), [order, orderStatuses]);

  const fetchOrder = async () => {
    const response = await axios.get<Order>(`/api/orders/${id}`);
    response.data.date = new Date(response.data.date);
    setOrder(response.data);
  }

  useEffect(() => {
    setOrderPromise(fetchOrder());
  }, []);

  const _order = order!;

  return (
    <>
      <Helmet>
        <title>Szczegóły zamówienia</title>
      </Helmet>
      <PromiseHandler promise={promises} onDone={() =>
        <>
          <h4 className='orange-underline'>Szczegóły zamówienia</h4>
          <div className='bg-light border rounded p-3 mb-4'>
            <div className='d-flex flex-wrap'>
              <span className='text-spacer'>Nr zamówienia:</span><span className='fw-500'>{_order.id}</span>
            </div>
            <div className='d-flex flex-wrap justify-content-between'>
              <div className='d-flex flex-wrap me-2'>
                <span className='text-spacer'>Data:</span><span className='fw-500'>{_order.date.toLocaleString()}</span>
              </div>
              <div className='d-flex align-items-center'>
                <span className='fw-500'>{_order.order_status.name}</span>
                <span className={`material-icons ms-2 ${orderStatusIcons[_order.order_status.id].color}`}
                      style={{ fontSize: '1.2rem' }}>{orderStatusIcons[_order.order_status.id].icon}</span>
              </div>
            </div>
            <hr className='mb-0 mt-2 text-orange opacity-100'/>
            <div>
              {_order.details.map((detail, index) =>
                <div key={detail.id}
                     className={`d-flex align-items-center py-2 ${index !== _order.details.length - 1 ? 'border-bottom' : ''}`}>
                  <div className='ms-2 ms-sm-3' style={{ minWidth: '16px' }}>{index + 1}</div>
                  <div className='d-flex align-items-center ms-1 ms-sm-2 flex-shrink-0 p-1 cart-item-image border rounded bg-white'>
                    <img src={`/storage/products/${detail.product.image}`} alt={detail.product.name}
                         className='w-100 h-100 object-fit-contain'/>
                  </div>
                  <div className='flex-grow-1 text-break ms-2 ms-sm-3'>{detail.product.name}</div>
                  <div className='ms-3 fw-500'>
                    <span className='text-muted'>{formatCurrency(detail.price)}</span>
                    <span className='text-orange ps-1'>zł</span>
                  </div>
                </div>
              )}
            </div>
            <hr className='mt-0 mb-2 text-orange opacity-100'/>
            <div className='d-flex justify-content-end'>
              {
                _order.assembly ?
                  <span className='d-inline-flex align-items-center ms-2'>
                    <span className='fw-500'>Montaż zestawu</span>
                    <span className='material-icons text-success ms-2' style={{ fontSize: '20px' }}>done</span>
                  </span> : null
              }
              {
                _order.os_installation ?
                  <>
                    {_order.assembly ? <span className='text-orange mx-2'>|</span> : null}
                    <span className='d-inline-flex align-items-center'>
                      <span className='fw-500'>Instalacja systemu</span>
                      <span className='material-icons text-success ms-2' style={{ fontSize: '20px' }}>done</span>
                    </span>
                  </> : null
              }
              {(_order.assembly || _order.os_installation) ? <span className='text-orange mx-2'>|</span> : null}
              <span className='text-spacer fw-500'>Razem:</span>
              <span className='fw-500'>
                <span className='text-muted'>{formatCurrency(_order.value)}</span>
                <span className='text-orange ps-1'>zł</span>
              </span>
            </div>
            <div className='fw-500 mt-4 mb-2'>Dane zamawiającego</div>
            <div>
              <div className='pb-2'>
                <div className='row'>
                  <div className='col-12 col-sm-6 mb-2 mb-sm-0'>
                    <div>{`${_order.name} ${_order.surname}`}</div>
                    <div>{_order.address}</div>
                    <div>{`${_order.postal_code} ${_order.city}`}</div>
                  </div>
                  <div className='col-12 col-sm-6'>
                    <div>Nr telefonu: {_order.phone}</div>
                    <div>Forma płatności: {_order.payment_type.name}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className='row justify-content-sm-end justify-content-center g-2'>
              {otherOrderStatuses.map((orderStatus) =>
                <Formik key={orderStatus.id} initialValues={{}} onSubmit={(values, { setSubmitting }) => {
                  axios.patch<Order>(`/api/orders/${_order.id}/changeStatus`, { status: orderStatus.id })
                    .then((order) => {
                      setOrder(order.data);
                      addToast('Zmieniono status zamówienia.');
                    })
                    .catch((e) => addToast('Błąd przy zmianie statusu zamówienia.', 'danger'))
                    .finally(() => setSubmitting(false));
                }}>
                  {({ isSubmitting }) =>
                    <Form className='col-auto'>
                      <button className={`btn ${orderStatusIcons[orderStatus.id].button} d-inline-flex align-items-center`}
                              type='submit'
                              disabled={isSubmitting}>
                        <span>{orderStatus.name}</span>
                        <span className='material-icons ms-2'>{orderStatusIcons[orderStatus.id].icon}</span>
                      </button>
                    </Form>
                  }
                </Formik>
              )}
            </div>
          </div>
        </>
      } onError={(e) =>
        <span>{e.response?.status === 404 ? "Zamówienie o podanym id nie istnieje." : "W trakcie ładowania wystąpił błąd."}</span>
      }/>
      <Toasts toasts={toasts} removeToast={removeToast}/>
    </>
  )
}
