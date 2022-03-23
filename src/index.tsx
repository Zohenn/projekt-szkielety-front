import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import HomePage from './pages/home/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import { HelmetProvider } from 'react-helmet-async';
import CartPage from './pages/cart/CartPage';
import ProtectedRoute from './components/ProtectedRoute';
import OrdersPage from './pages/orders/OrdersPage';
import RegisterPage from './pages/RegisterPage';

window.bootstrap = bootstrap;

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
// if(process.env.NODE_ENV !== 'production'){
//   axios.defaults.baseURL = 'http://localhost:8000';
// }

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App/>}>
            <Route index element={<HomePage/>}/>
            <Route path='/produkty' element={<ProductsPage/>}/>
            <Route path='/zamowienia' element={
              <ProtectedRoute>
                <OrdersPage/>
              </ProtectedRoute>
            }/>
            <Route path='/koszyk' element={
              <ProtectedRoute>
                <CartPage/>
              </ProtectedRoute>
            }/>
            <Route path='/logowanie' element={<LoginPage/>}/>
            <Route path='/rejestracja' element={<RegisterPage/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
