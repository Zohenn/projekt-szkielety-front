import { useCartStore } from '../store/cartStore';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PromiseHandler from '../components/PromiseHandler';
import formatCurrency from '../utils/formatCurrency';
import { Link } from 'react-router-dom';

export default function CartPage(){
  const { items, services, removeFromCart } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);

  const cartValue = products.reduce((value, product) => value + product.price, 0);

  // todo
  const assemblyPrice = 0;
  const osInstallationPrice = 0;

  const orderValue = cartValue + (services.assembly ? assemblyPrice : 0) + (services.osInstallation ? osInstallationPrice : 0);

  const fetchCartProducts = async () => {
    const searchParams = new URLSearchParams();
    items.forEach((item) => searchParams.append('id[]', item.toString()));
    const response = await axios.get('/api/product', { params: searchParams });
    setProducts(response.data);
  }

  const [productsPromise, setProductsPromise] = useState<Promise<void>>();

  useEffect(() => {
    setProductsPromise(fetchCartProducts());
  }, []);

  // potrzebuje piwa dajcie mi piwo aaaaaaaaa
  return (
    <>
      <Helmet>
        <title>Koszyk</title>
      </Helmet>
      <PromiseHandler promise={productsPromise} onDone={() =>
        <div className='row'>
          <div className='col-12 col-md-8'>
            <h4 className='mb-3 orange-underline'>Twój koszyk</h4>
            <div className='bg-light border rounded px-3 py-1 mb-3'>
              <div id='cart-container'>
                {
                  products.map((product, index) =>
                    <div className={`d-flex align-items-center py-2 ${index !== products.length - 1 ? 'border-bottom' : ''}`}
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
                      <button className='btn btn-sm d-inline-flex flex-center bg-transparent border-0 p-0 ms-1 text-danger cart-remove-btn'>
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
                      Przejdź <Link to='/produkty'>tutaj</Link>, aby zobaczyć nasze produkty i napełnić nimi koszyk 😉.
                    </div>
                  </div> : null
              }
            </div>
          </div>
          <div className='col-12 col-md-4'>
            <h4 className='mb-3 orange-underline'>Podsumowanie</h4>
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
                <input className='form-check-input' type='checkbox' id='assembly-input' checked={services.assembly}/>
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
                       checked={services.osInstallation}/>
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
          </div>
        </div>
      }/>
      {/*<div className='row'>*/}
      {/*  <div className='col-12 col-md-8'>*/}
      {/*    <h4 className='mb-3 orange-underline'>Twój koszyk</h4>*/}
      {/*    <div className='bg-light border rounded px-3 py-1 mb-3'>*/}
      {/*      <div id='cart-container'>*/}
      {/*        {*/}
      {/*          items.map((product, index) =>*/}
      {/*            <div className='d-flex align-items-center py-2 @unless($loop->last) border-bottom @endif'*/}
      {/*                 style='border-color: var(--bs-orange)!important;'>*/}
      {/*              <div className='ms-2 ms-sm-3'>{{ $loop->index + 1}}@if($loop->index < 9)&nbsp;&nbsp;@endif</div>*/}
      {/*              <div className='d-flex align-items-center ms-1 ms-sm-2 flex-shrink-0 cart-item-image border rounded p-1 bg-white'>*/}
      {/*                <img src='{{ Storage::url(' products/' . $product->image) }}' alt='{{ $product->name}}' class='w-100*/}
      {/*                h-100'*/}
      {/*                style='object-fit: contain'>*/}
      {/*              </div>*/}
      {/*              <div className='flex-grow-1 text-break ms-2 ms-sm-3'>{{ $product->name}}</div>*/}
      {/*              <div className='ms-3' style='font-weight: 500;'>*/}
      {/*                <span className='text-muted'>{{ Str::currency($product->price) }}</span><span*/}
      {/*                style='padding-left: 2px; color: var(--bs-orange);'>zł</span>*/}
      {/*              </div>*/}
      {/*              <button*/}
      {/*                className='btn btn-sm d-inline-flex flex-center bg-transparent border-0 p-0 ms-1 text-danger cart-remove-btn'*/}
      {/*                data-id='{{ $product->id }}' data-price='{{ $product->price }}'>*/}
      {/*                <span className='material-icons fs-5'>close</span>*/}
      {/*              </button>*/}
      {/*            </div>*/}
      {/*          )*/}
      {/*        }*/}
      {/*      </div>*/}
      {/*      <div id='cart-empty-message' className='text-center py-1 @if(count($cartProducts) > 0) d-none @endif'>*/}
      {/*        <h4>Na razie jest tutaj pusto 😶</h4>*/}
      {/*        Przejdź <a href='{{ route(' product.index') }}'>tutaj</a>, aby zobaczyć nasze produkty i napełnić nimi*/}
      {/*        koszyk 😉.*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*  <div className='col-12 col-md-4'>*/}
      {/*    <h4 className='mb-3 orange-underline'>Podsumowanie</h4>*/}
      {/*    <div className='bg-light border rounded px-3 py-2 mb-3' style='font-weight: 500'>*/}
      {/*      <div className='d-flex'>*/}
      {/*        <div className='flex-grow-1'>Wartość koszyka:</div>*/}
      {/*        <div className='ms-2'>*/}
      {/*          <span className='text-muted'*/}
      {/*                id='items-value'>{{ Str::currency($cartValue) }}</span><span style='padding-left: 2px; color: var(--bs-orange);'>zł</span>*/}
      {/*        </div>*/}
      {/*      </div>*/}
      {/*      <hr className='my-2 text-orange' style='opacity: 1'>*/}
      {/*        <!-- todo -->*/}
      {/*        <div>Dodatkowe usługi:</div>*/}
      {/*        @php*/}
      {/*        $assembly = $services->find('assembly')->price;*/}
      {/*        $osInstallation = $services->find('os_installation')->price;*/}
      {/*        @endphp*/}
      {/*        <div className='form-check'>*/}
      {/*          <input className='form-check-input' type='checkbox' id='assembly-input' data-price='{{ $assembly }}'*/}
      {/*          @if(session()->get('cart.assembly')) checked @endif>*/}
      {/*          <label className='form-check-label fw-normal d-flex' htmlFor='assembly-input'>*/}
      {/*            <span className='flex-grow-1'>Montaż zestawu</span>*/}
      {/*            <span className='ms-2' style='font-weight: 500;'>*/}
      {/*                      <span className='text-muted'>{{ Str::currency($assembly) }}</span><span*/}
      {/*              style='padding-left: 2px; color: var(--bs-orange);'>zł</span>*/}
      {/*                  </span>*/}
      {/*          </label>*/}
      {/*        </div>*/}
      {/*        <div className='form-check'>*/}
      {/*          <input className='form-check-input'*/}
      {/*                 type='checkbox'*/}
      {/*                 id='os-installation-input'*/}
      {/*                 data-price='{{ $osInstallation }}'*/}
      {/*          @if(session()->get('cart.osInstallation')) checked @endif>*/}
      {/*          <label className='form-check-label fw-normal d-flex' htmlFor='os-installation-input'>*/}
      {/*            <span className='flex-grow-1'>Instalacja systemu</span>*/}
      {/*            <span className='ms-2' style='font-weight: 500;'>*/}
      {/*                      <span className='text-muted'>{{ Str::currency($osInstallation) }}</span><span*/}
      {/*              style='padding-left: 2px; color: var(--bs-orange);'>zł</span>*/}
      {/*                  </span>*/}
      {/*          </label>*/}
      {/*        </div>*/}
      {/*        <hr className='my-2 text-orange' style='opacity: 1'>*/}
      {/*          <div className='text-end'>*/}
      {/*            Razem: <span className='text-muted'*/}
      {/*                         id='cart-value'>{{ Str::currency($orderValue) }}</span><span style='padding-left: 2px; color: var(--bs-orange);'>zł</span>*/}
      {/*          </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </>
  )
}
