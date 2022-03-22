import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import formatCurrency from '../../utils/formatCurrency';
import ModalButton from '../../components/ModalButton';
import { Modal } from 'react-bootstrap';

export function ProductCard({ product }: { product: Product }) {
  const { isSignedIn } = useAuthStore();
  const { items: cartItems, addToCart } = useCartStore();

  return (
    <div className='card mb-4 overflow-hidden'>
      <div className='row g-0'>
        <div className='col-md-3 p-3'>
          <div className='ratio ratio-1x1'>
            <img className='img-fluid object-fit-contain'
                 src={`/storage/products/${product.image}`}
                 alt={product.name}/>
          </div>
        </div>
        <div className='col-md-9'>
          <div className='card-body h-100 d-flex flex-column flex-nowrap justify-content-between'>
            <div className='mb-3 d-flex justify-content-between'>
              <div>
                <h5 className='fw-bold mb-0'>{product.name}</h5>
                <div className='text-muted'>{product.category.name}</div>
                {product.amount > 0 ?
                  <span className='badge bg-success'
                        title={`Stan magazynowy: ${product.amount}`}>Dostępny</span> :
                  <span className='badge bg-danger'>Niedostępny</span>}
              </div>
              <div className='text-nowrap'>
                <span className='fw-500 mb-0 text-muted fs-5'>{formatCurrency(product.price)}</span>
                <span className='text-orange'> zł</span>
              </div>
            </div>
            <div className='d-flex flex-nowrap'>
              <div className='product-description flex-grow-1 flex-shrink-1'>{product.description}</div>
              <div className='ms-4 d-flex flex-column justify-content-end'>
                <button
                  className={`btn text-nowrap add-to-cart d-inline-flex flex-center ${product.amount > 0 ? 'btn-orange' : 'btn-light'}`}
                  onClick={() => addToCart(product.id)}
                  disabled={!isSignedIn() || product.amount === 0 || cartItems.includes(product.id)}
                  style={{ minWidth: '114px' }}>
                  {cartItems.includes(product.id) ? 'W koszyku' : 'Do koszyka'}
                </button>
                <ModalButton button={(onClick) =>
                  <button className='btn product-details btn-outline-orange mt-2'
                          onClick={onClick}>Szczegóły
                  </button>
                } alert={(show, hide) =>
                  <Modal onHide={hide} show={show} scrollable={true}>
                    <div className='modal-header'>
                      <img className='object-fit-contain'
                           src={`/storage/products/${product.image}`}
                           alt={product.name}
                           style={{ height: '36px' }}/>
                      <h5 className='modal-title mx-3'>{product.name}</h5>
                      <button className='btn-close' onClick={hide}/>
                    </div>
                    <div className='modal-body'>
                      <p style={{ whiteSpace: 'pre-wrap' }}>
                        {product.description}
                      </p>
                    </div>
                  </Modal>
                }/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
