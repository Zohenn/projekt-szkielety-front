import { useCartStore } from '../../store/cartStore';
import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import PromiseHandler from '../../components/PromiseHandler';
import { Link } from 'react-router-dom';
import Summary from './Summary';
import { ProductItem } from './ProductItem';
import OrderForm from './OrderForm';

export default function CartPage() {
  const { items, removeFromCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentType[]>([]);

  const cartValue = useMemo(
    () => products.reduce((value, product) => value + product.price, 0),
    [products]
  );

  const fetchCartProducts = async () => {
    if (items.length > 0) {
      const searchParams = new URLSearchParams();
      items.forEach((item) => searchParams.append('id[]', item.toString()));
      const response = await axios.get('/api/product', { params: searchParams });
      setProducts(response.data);
    }
  }

  const fetchPaymentTypes = async () => {
    const response = await axios.get<PaymentType[]>('/api/paymentTypes');
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
                      <ProductItem key={product.id}
                                   product={product}
                                   index={index}
                                   addDivider={index !== products.length - 1}
                                   onRemove={() => {
                                     removeFromCart(product.id);
                                     setProducts(products.filter((p) => p.id !== product.id));
                                   }}/>
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
                <OrderForm paymentTypes={paymentTypes}/>
              </div> : null
          }
        </>
      }/>
    </>
  )
}
