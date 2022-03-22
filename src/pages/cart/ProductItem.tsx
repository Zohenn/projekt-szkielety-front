import formatCurrency from '../../utils/formatCurrency';

interface ProductItemProps {
  product: Product;
  index: number;
  addDivider: boolean;
  onRemove: () => void;
}

export function ProductItem({ product, index, addDivider, onRemove }: ProductItemProps) {
  return (
    <div className={`d-flex align-items-center py-2 ${addDivider ? 'border-bottom' : ''}`}
         style={{ borderColor: 'var(--bs-orange)!important' }}>
      <div className='ms-2 ms-sm-3' style={{ minWidth: '16px' }}>{index + 1}</div>
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
      <button className='btn btn-sm d-inline-flex flex-center bg-transparent border-0 p-0 ms-1 text-danger cart-remove-btn'
              onClick={onRemove}>
        <span className='material-icons fs-5'>close</span>
      </button>
    </div>
  )
}
