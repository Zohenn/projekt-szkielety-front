import logo from './assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

export default function Navbar(){
  const location = useLocation();
  const { isSignedIn } = useAuthStore();
  console.log(isSignedIn());

  return (
    <nav className='navbar navbar-light justify-content-start p-0'>
      <Link className='navbar-brand' to='/'>
        <img src={logo} alt='Logo' id='logo'/>
      </Link>
      <div className='navbar flex-grow-1'>
        <ul className='navbar-nav flex-row flex-grow-1'>
          <li className='nav-item'>
            <Link className={`nav-link d-flex px-2 ${location.pathname === '/' ? 'active' : ''}`} to='/'>
              <span className='material-icons me-0 me-sm-2'>home</span>
              <span className='d-none d-sm-inline'></span>
            </Link>
          </li>
          <li className='nav-item'>
            <Link className={`nav-link d-flex px-2 ${location.pathname === '/produkty' ? 'active' : ''}`}
                  to='/produkty'>
              <span className='material-icons me-0 me-sm-2'>widgets</span>
              <span className='d-none d-sm-inline'>Produkty</span>
            </Link>
          </li>
          {
            !isSignedIn() ? <>
              <li className='nav-item ms-auto'>
                <Link className={`nav-link px-2 ${location.pathname === '/logowanie' ? 'active text-orange' : ''}`}
                      to='/logowanie'>Logowanie</Link>
              </li>
              <li className='nav-item'>
                <Link className={`nav-link px-2 ${location.pathname === '/rejestracja' ? 'active text-orange' : ''}`}
                      to='/rejestracja'>Rejestracja</Link>
              </li>
            </> : <></>
          }
        </ul>
      </div>
    </nav>
  );
}
