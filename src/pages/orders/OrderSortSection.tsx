import { Field } from "formik";

const sortOptions = {
  date: 'Data',
  value: 'Wartość'
};

const sortDirections = {
  asc: 'Rosnąco',
  desc: 'Malejąco'
}

export default function OrderSortSection() {
  return (
    <div>
      <div>
        <div className='text-muted'>Pole</div>
        {Object.entries(sortOptions).map(([option, label]) =>
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
        {Object.entries(sortDirections).map(([option, label]) =>
          <div key={option} className='form-check'>
            <Field className='form-check-input'
                   type='radio'
                   name='sort_dir'
                   value={option}
                   id={`sort_dir-${option}`}/>
            <label className='form-check-label' htmlFor={`sort_dir-${option}`}>{label}</label>
          </div>
        )}
      </div>
    </div>
  )
}
