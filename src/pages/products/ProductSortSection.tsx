import { Field } from "formik";

const sortOptions = {
  price: 'Cena',
  amount: 'Stan'
};

const sortDirections = {
  asc: 'Rosnąco',
  desc: 'Malejąco'
}

export function ProductSortSection() {
  return (
    <div>
      <h4 className='orange-underline'>Sortowanie</h4>
      <div>
        <div>
          <div className='text-muted'>Pole</div>
          {
            Object.entries(sortOptions).map(([option, label]) =>
              <div key={option} className='form-check'>
                <Field className='form-check-input'
                       type='radio'
                       name='sort'
                       value={option}
                       id={`sort-${option}`}/>
                <label className='form-check-label' htmlFor={`sort-${option}`}>{label}</label>
              </div>
            )}
        </div>
        <div className='mt-4'>
          <div className='text-muted'>Kolejność</div>
          {
            Object.entries(sortDirections).map(([option, label]) =>
              <div key={option} className='form-check'>
                <Field className='form-check-input'
                       type='radio'
                       name='sortDirection'
                       value={option}
                       id={`sortDirection-${option}`}/>
                <label className='form-check-label' htmlFor={`sortDirection-${option}`}>{label}</label>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
