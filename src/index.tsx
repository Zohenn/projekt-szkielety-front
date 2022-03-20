import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import { HelmetProvider } from 'react-helmet-async';
import CartPage from './pages/CartPage';

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
            <Route path='/zamowienia'/>
            <Route path='/koszyk' element={<CartPage/>}/>
            <Route path='/logowanie' element={<LoginPage/>}/>
            <Route path='/rejestracja'/>
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
