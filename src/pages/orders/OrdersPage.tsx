import { useEffect, useState } from 'react';
import Pagination from '../../components/Pagination';
import OrderCard from './OrderCard';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import PromiseHandler from '../../components/PromiseHandler';
import { Helmet } from 'react-helmet-async';

export default function OrdersPage() {
  const [page, setPage] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [paginator, setPaginator] = useState<Paginator>();
  const [ordersPromise, setOrdersPromise] = useState<Promise<void>>();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchOrders = async (page: number) => {
    const searchParams = new URLSearchParams({ page: page.toString() });
    navigate({ pathname: location.pathname, search: searchParams.toString() }, { replace: true });
    const response = await axios.get<PaginationFor<Order>>('/api/orders', { params: searchParams });
    const { data, ...pagination } = response.data;
    data.forEach((order) => order.date = new Date(order.date));
    setPaginator(pagination);
    setOrders(data);
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    setOrdersPromise(fetchOrders(page));
  }, [])

  return (
    <>
      <Helmet>
        <title>Zamówienia</title>
      </Helmet>
      <h4 className='mb-3 orange-underline'>Twoje zamówienia</h4>
      <PromiseHandler promise={ordersPromise} onDone={() =>
        <div id='orders-container'>
          {
            orders.map((order) => <OrderCard key={order.id} order={order}/>)
          }
          {
            orders.length === 0 ?
              <div className='card bg-light'>
                <div className='card-body text-center'>
                  <h4 className='mb-0'>Na razie jest tutaj pusto 😶</h4>
                </div>
              </div> : null
          }
          <Pagination what='Zamówień' paginator={paginator!} onPageChanged={(_page) => {
            setPage(_page);
            setOrdersPromise(fetchOrders(_page));
          }}/>
        </div>
      }/>
    </>
  )
}
