import React, { useState } from 'react';
import './App.scss';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import PromiseHandler from './components/PromiseHandler';

function App(){
  const checkAuthState = useAuthStore(state => state.checkAuthState);
  const [authStatePromise] = useState<Promise<any>>(checkAuthState());
  return (
    <PromiseHandler promise={authStatePromise} onDone={() =>
      <>
        <div className='bg-white border-bottom sticky-top'>
          <div className='container'>
            <Navbar/>
          </div>
        </div>
        <main className='container bg-white flex-grow-1 p-3 p-md-4'>
          <Outlet/>
        </main>
      </>
    }/>
  );
}

export default App;
