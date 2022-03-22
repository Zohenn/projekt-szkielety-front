const sortOptions = {
  price: 'Cena',
  amount: 'Stan'
};

const sortDirections = {
  asc: 'Rosnąco',
  desc: 'Malejąco'
}

interface ProductSortSectionProps {
  sort: string;
  direction: string;
  onChange: (sort: string, direction: string) => void;
}

export function ProductSortSection({ sort, direction, onChange }: ProductSortSectionProps) {
  return (
    <div>
      <h4 className='orange-underline'>Sortowanie</h4>
      <div>
        <div>
          <div className='text-muted'>Pole</div>
          {
            Object.entries(sortOptions).map(([option, label]) =>
              <div key={option} className='form-check'>
                <input className='form-check-input'
                       type='radio'
                       name='sort'
                       value={option}
                       id={`sort-${option}`}
                       checked={sort === option}
                       onChange={() => onChange(option, direction)}/>
                <label className='form-check-label' htmlFor={`sort-${option}`}>{label}</label>
              </div>
            )}
        </div>
        <div className='mt-4'>
          <div className='text-muted'>Kierunek</div>
          {
            Object.entries(sortDirections).map(([option, label]) =>
              <div key={option} className='form-check'>
                <input className='form-check-input'
                       type='radio'
                       name='sort_dir'
                       value={option}
                       id={`sort_dir-${option}`}
                       checked={direction === option}
                       onChange={() => onChange(sort, option)}/>
                <label className='form-check-label' htmlFor={`sort_dir-${option}`}>{label}</label>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}
