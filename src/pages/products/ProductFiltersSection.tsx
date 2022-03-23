import { Field } from "formik";

export type ProductAvailability = 'available' | 'unavailable';

export interface ProductFilters {
  category: string[];
  availability?: ProductAvailability;
}

export interface ProductFiltersSectionProps {
  categories: Category[];
}

export function ProductFiltersSection({ categories }: ProductFiltersSectionProps) {
  // const changeCategory = (category: number, value: boolean) => {
  //   let _categories;
  //   if (!value) {
  //     _categories = filters.category.filter((c) => c !== category)
  //   } else {
  //     _categories = [...filters.category];
  //     _categories.push(category);
  //   }
  //   onChange({ category: _categories, availability: filters.availability })
  // }

  return (
    <div>
      <h4 className='orange-underline'>Filtrowanie</h4>
      <div>
        <div className='text-muted'>Kategoria</div>
        <div>
          {
            categories.map((category) =>
              <div key={category.id} className='form-check'>
                <Field className='form-check-input'
                       type='checkbox'
                       value={category.id.toString()}
                       id={`category-${category.id}`}
                       name='filters.category'/>
                <label className='form-check-label' htmlFor={`category-${category.id}`}>
                  {category.name}
                </label>
              </div>
            )
          }
        </div>
        <div className='text-muted mt-4'>Dostępność</div>
        <div>
          <div className='form-check'>
            <Field className='form-check-input'
                   type='radio'
                   value='available'
                   id='availability-available'
                   name='filters.availability'/>
            <label className='form-check-label' htmlFor='availability-available'>Dostępny</label>
          </div>
          <div className='form-check'>
            <Field className='form-check-input'
                   type='radio'
                   value='unavailable'
                   id='availability-unavailable'
                   name='filters.availability'/>
            <label className='form-check-label' htmlFor='availability-unavailable'>Niedostępny</label>
          </div>
        </div>
      </div>
    </div>
  )
}
