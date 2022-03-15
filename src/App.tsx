import React, { useEffect } from 'react';
import './App.scss';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

function App(){
  const checkAuthState = useAuthStore(state => state.checkAuthState);
  useEffect(() => {
    checkAuthState();
  }, []);
  return (
    <>
      <div className='bg-white border-bottom sticky-top'>
        <div className='container'>
          <Navbar/>
        </div>
      </div>
      <main className="container bg-white flex-grow-1 p-3 p-md-4">
        <Outlet/>
      </main>
    </>
  );
}

export default App;
