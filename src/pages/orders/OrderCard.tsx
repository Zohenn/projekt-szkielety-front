import formatCurrency from '../../utils/formatCurrency';

interface OrderStatusIcon {
  icon: string;
  color: string;
  button: string;
}

const orderStatusIcons: { [k: string]: OrderStatusIcon } = {
  '1': {
    icon: 'settings',
    color: 'text-secondary',
    button: 'btn-outline-secondary'
  },
  '2': {
    icon: 'local_shipping',
    color: 'text-primary',
    button: 'btn-outline-primary'
  },
  '3': {
    icon: 'done',
    color: 'text-success',
    button: 'btn-outline-success'
  }
}

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className='bg-light border rounded p-3 mb-4'>
      <div className='d-flex flex-wrap'>
        <span className='text-spacer'>Nr zamówienia:</span><span className='fw-500'>{order.id}</span>
      </div>
      <div className='d-flex flex-wrap justify-content-between'>
        <div className='d-flex flex-wrap me-2'>
          <span className='text-spacer'>Data:</span><span className='fw-500'>{order.date.toLocaleString('pl-PL')}</span>
        </div>
        <div className='d-flex align-items-center'>
          <span className='fw-500'>{order.order_status.name}</span>
          <span className={`material-icons ms-2 ${orderStatusIcons[order.order_status.id].color}`}
                style={{ fontSize: '1.2rem' }}>{orderStatusIcons[order.order_status.id].icon}</span>
        </div>
      </div>
      <hr className='mb-0 mt-2 text-orange opacity-100'/>
      <div>
        {
          order.details.map((detail, index) =>
            <div className={`d-flex align-items-center py-2 ${index !== order.details.length - 1 ? 'border-bottom' : ''}`}
                 style={{ borderColor: 'var(--bs-orange)!important' }}>
              <div className='ms-2 ms-sm-3' style={{ minWidth: '16px' }}>{index + 1}</div>
              <div className='d-flex align-items-center ms-1 ms-sm-2 flex-shrink-0 p-1 cart-item-image border rounded bg-white'>
                <img src={`/storage/products/${detail.product.image}`}
                     alt={detail.product.name}
                     className='w-100 h-100 object-fit-contain'/>
              </div>
              <div className='flex-grow-1 text-break ms-2 ms-sm-3'>{detail.product.name}</div>
              <div className='ms-3 fw-500'>
                <span className='text-muted'>{formatCurrency(detail.price)}</span>
                <span className='text-orange' style={{ paddingLeft: '2px' }}>zł</span>
              </div>
            </div>
          )
        }
      </div>
      <hr className='mt-0 mb-2 text-orange opacity-100'/>
      <div className='d-flex justify-content-end'>
        {
          order.assembly ?
            <span className='d-inline-flex align-items-center ms-2'>
              <span className='fw-500'>Montaż zestawu</span>
              <span className='material-icons text-success ms-2' style={{ fontSize: '20px' }}>done</span>
            </span> : null
        }
        {
          order.os_installation ?
            <>
              {order.assembly ? <span className='text-orange mx-2'>|</span> : null}
              <span className='d-inline-flex align-items-center'>
                  <span className='fw-500'>Instalacja systemu</span>
                  <span className='material-icons text-success ms-2' style={{ fontSize: '20px' }}>done</span>
              </span>
            </> : null
        }
        { (order.assembly || order.os_installation) ? <span className='text-orange mx-2'>|</span> : null}
        <span className='text-spacer fw-500'>Razem:</span>
        <span className='fw-500'>
          <span className='text-muted'>{formatCurrency(order.value)}</span>
          <span className='text-orange' style={{ paddingLeft: '2px' }}>zł</span>
        </span>
      </div>
      <button className='btn w-100 d-inline-flex justify-content-between mt-2 collapsed'
              data-bs-toggle='collapse'
              data-bs-target={`#data-${order.id}`}>
        <span className='fw-500'>Dane zamawiającego</span>
        <span className='material-icons'>expand_more</span>
      </button>
      <div className='collapse' id={`data-${order.id}`} style={{ padding: '0 0.75rem' }}>
        <div className='pb-2'>
          <div className='row'>
            <div className='col-12 col-sm-6 mb-2 mb-sm-0'>
              <div>{`${order.name} ${order.surname}`}</div>
              <div>{order.address}</div>
              <div>{`${order.postal_code} ${order.city}`}</div>
            </div>
            <div className='col-12 col-sm-6'>
              <div>Nr telefonu: {order.phone}</div>
              <div>Forma płatności: {order.payment_type.name}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
