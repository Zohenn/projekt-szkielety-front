import { Helmet } from 'react-helmet-async';
import { Form, Formik } from 'formik';
import OrderFiltersSection, { OrderFilters } from './OrderFiltersSection';
import OrderSortSection from './OrderSortSection';
import { useCallback, useEffect, useMemo, useState } from 'react';
import usePaymentTypes from '../../hooks/usePaymentTypes';
import PromiseHandler from '../../components/PromiseHandler';
import useOrderStatuses from '../../hooks/useOrderStatuses';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../../components/Pagination';
import formatCurrency from '../../utils/formatCurrency';
import { orderStatusIcons } from '../../utils/orderStatusIcons';
import ReactDOM from 'react-dom';

const initFilters: (searchParams?: URLSearchParams) => OrderFilters = (searchParams) => {
  return {
    order_status: searchParams?.getAll('order_status[]') ?? [],
    payment_type: searchParams?.getAll('payment_type[]') ?? [],
  }
}

export default function AdminOrdersPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URL(window.location.toString()).searchParams;
  const [page, setPage] = useState<number>(Number(searchParams.get('page') ?? 1));
  const [orderStatuses, orderStatusesPromise] = useOrderStatuses();
  const [paymentTypes, paymentTypesPromise] = usePaymentTypes();
  const [filters, setFilters] = useState<OrderFilters>(initFilters(searchParams));
  const [sort, setSort] = useState(searchParams.get('sort') ?? '');
  const [sortDirection, setSortDirection] = useState(searchParams.get('sort_dir') ?? '');
  const [paginator, setPaginator] = useState<Paginator>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersPromise, setOrdersPromise] = useState<Promise<void>>();

  const promises = useMemo(() => Promise.all([orderStatusesPromise, paymentTypesPromise]), [orderStatusesPromise, paymentTypesPromise]);

  const fetchOrders = useCallback(async () => {
    const searchParams = new URLSearchParams();
    filters.order_status.forEach((orderStatus) => searchParams.append('order_status[]', orderStatus));
    filters.payment_type.forEach((paymentType) => searchParams.append('payment_type[]', paymentType));
    if (sort) {
      searchParams.append('sort', sort);
    }
    if (sortDirection) {
      searchParams.append('sort_dir', sortDirection);
    }
    searchParams.append('page', page.toString());
    navigate({ pathname: location.pathname, search: searchParams.toString() }, { replace: true });
    const response = await axios.get<PaginationFor<Order>>('/api/orders', { params: searchParams });
    const { data, ...pagination } = response.data;
    data.forEach((order) => order.date = new Date(order.date));
    setPaginator(pagination);
    setOrders(data);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [filters, sort, sortDirection, page]);

  useEffect(() => {
    setOrdersPromise(fetchOrders());
  }, [fetchOrders])

  return (
    <div className='row'>
      <Helmet>
        <title>Zamówienia</title>
      </Helmet>
      <div className='col-3'>
        <PromiseHandler promise={promises} onDone={() =>
          <Formik initialValues={{ filters: { ...filters }, sort: sort, sort_direction: sortDirection }}
                  onReset={() => {
                    setFilters(initFilters());
                    setSort('');
                    setSortDirection('');
                    setPage(1);
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    ReactDOM.unstable_batchedUpdates(() => {
                      setFilters(values.filters);
                      setSort(values.sort);
                      setSortDirection(values.sort_direction);
                      setPage(1);
                    });
                    setSubmitting(false);
                  }}>
            {({ errors, touched, isSubmitting }) =>
              <Form noValidate>
                <h4 className='orange-underline'>Filtrowanie</h4>
                <OrderFiltersSection orderStatuses={orderStatuses} paymentTypes={paymentTypes}/>
                <hr className='text-orange' style={{ height: '2px' }}/>
                <h4 className='orange-underline'>Sortowanie</h4>
                <OrderSortSection/>
                <div className='d-grid gap-2 d-lg-flex justify-content-center gx-lg-1 text-center mt-3'>
                  <button className='btn btn-outline-orange' type='reset'>Wyczyść</button>
                  <button className='btn btn-orange' type='submit'>Zastosuj</button>
                </div>
              </Form>
            }
          </Formik>
        }/>
      </div>
      <div className='col-9'>
        <PromiseHandler promise={ordersPromise} onDone={() =>
          <div className='table-responsive'>
            <table className='table table-hover' style={{ verticalAlign: 'middle' }}>
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
                {orders.map((order) =>
                  <tr key={order.id} className='position-relative'>
                    <td>{order.id}<Link to={`/zamowienia/${order.id}`} className='stretched-link'/></td>
                    <td>{order.date.toLocaleString('pl-PL')}</td>
                    <td>
                      <span className='text-muted me-1'>{formatCurrency(order.value)}</span>
                      <span className='text-orange'>zł</span>
                    </td>
                    <td>{order.payment_type.name}</td>
                    <td>
                      <span className='d-inline-flex align-items-center'>
                        <span>{order.order_status.name}</span>
                        <span className={`material-icons ms-2 ${orderStatusIcons[order.order_status.id].color}`}
                              style={{ fontSize: '1.2rem' }}>{orderStatusIcons[order.order_status.id].icon}</span>
                      </span>
                    </td>
                  </tr>
                )}
                {orders.length === 0 ?
                  <tr>
                    <td colSpan={5} className='text-muted text-center'>Brak wyników</td>
                  </tr> : null}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={5}>
                    <Pagination what={'Zamówień'} paginator={paginator!} onPageChanged={(_page) => setPage(_page)}/>
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        }/>
      </div>
    </div>
  )
}
