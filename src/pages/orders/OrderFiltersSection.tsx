import { Field } from 'formik';

interface OrderFiltersSectionProps {
  orderStatuses: OrderStatus[];
  paymentTypes: PaymentType[];
}

export interface OrderFilters {
  order_status: string[];
  payment_type: string[];
}

export default function OrderFiltersSection({ orderStatuses, paymentTypes }: OrderFiltersSectionProps) {
  return (
    <>
      <div>
        <div className='text-muted'>Status</div>
        {orderStatuses.map((orderStatus) =>
          <div key={orderStatus.id} className='form-check'>
            <Field className='form-check-input' type='checkbox'
                   id={`order_status-${orderStatus.id}`}
                   name='filters.order_status'
                   value={orderStatus.id.toString()}/>
            <label className='form-check-label' htmlFor={`order_status-${orderStatus.id}`}>
              {orderStatus.name}
            </label>
          </div>
        )}
      </div>
      <div className='mt-4'>
        <div className='text-muted'>Płatność</div>
        {paymentTypes.map((paymentType) =>
          <div key={paymentType.id} className='form-check'>
            <Field className='form-check-input' type='checkbox'
                   id={`payment_type-${paymentType.id}`}
                   name='filters.payment_type'
                   value={paymentType.id.toString()}/>
            <label className='form-check-label' htmlFor={`payment_type-${paymentType.id}`}>
              {paymentType.name}
            </label>
          </div>
        )}
      </div>
    </>
  )
}
