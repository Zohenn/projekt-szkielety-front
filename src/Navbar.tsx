import logo from './assets/logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';

export default function Navbar(){
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, isAdmin, user, signOut } = useAuthStore();
  const items = useCartStore(state => state.items);

  const toLogin = () => {
    navigate({ pathname: '/logowanie' }, { state: { ref: location }})
  }

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
            <Link className={`nav-link d-flex px-2 ${location.pathname.startsWith('/produkty') ? 'active' : ''}`}
                  to='/produkty'>
              <span className='material-icons me-0 me-sm-2'>widgets</span>
              <span className='d-none d-sm-inline'>Produkty</span>
            </Link>
          </li>
          {
            !isSignedIn() ? <>
              <li className='nav-item ms-auto'>
                <a className={`nav-link px-2 ${location.pathname === '/logowanie' ? 'active text-orange' : ''}`}
                   href='/logowanie'
                    onClick={(e) => {
                      e.preventDefault();
                      toLogin();
                    }}>Logowanie</a>
              </li>
              <li className='nav-item'>
                <Link className={`nav-link px-2 ${location.pathname === '/rejestracja' ? 'active text-orange' : ''}`}
                      to='/rejestracja'>Rejestracja</Link>
              </li>
            </> : <>
              <li className='nav-item'>
                <Link className={`nav-link d-flex px-2 ${location.pathname.startsWith('/zamowienia') ? 'active' : ''}`}
                      to='/zamowienia'>
                  <span className='material-icons me-0 me-sm-2'>inventory</span>
                  <span className='d-none d-sm-inline'>Zamówienia</span>
                </Link>
              </li>
              <li className='ms-auto'></li>
              {isAdmin() ? null : <li className='nav-item'>
                <Link className={`nav-link d-flex px-2 ${location.pathname.startsWith('/koszyk') ? 'active' : ''}`}
                      to='/koszyk'>
                <span className={`rounded me-1 px-1 text-orange bg-light border d-inline-flex flex-center ${items.length === 0 ? 'invisible' : ''}`}
                      id='cart-item-count'
                      style={{ lineHeight: '1.3em', fontWeight: 500 }}>{items.length}</span>
                  <span className='material-icons'>shopping_cart</span>
                </Link>
              </li>}
              <li className='nav-item dropdown'>
                <a id='navbarDropdown' className='nav-link dropdown-toggle' href='#' role='button'
                   data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                  {user!.name}
                </a>
                <div className='dropdown-menu position-absolute'
                     aria-labelledby='navbarDropdown'
                     style={{ left: 'auto', right: '-0.75rem' }}>
                  <a className='dropdown-item' href='#'
                     onClick={(event) => {
                       event.preventDefault();
                       signOut();
                       navigate('/');
                     }}>
                    Wyloguj się
                  </a>
                </div>
              </li>
            </>
          }
        </ul>
      </div>
    </nav>
  );
}
