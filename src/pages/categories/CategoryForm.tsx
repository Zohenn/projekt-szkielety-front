import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import BootstrapError from '../../BootstrapError';
import disableSubmitButton from '../../utils/disableSubmitButton';
import axios from 'axios';

const categorySchema = Yup.object().shape({
  name: Yup.string()
    .required('Pole nie może być puste')
    .min(3, 'Minimalna długość: 3 znaki')
    .max(50, 'Maksymalna długość: 50 znaków')
})

export default function CategoryForm({ onSubmit }: { onSubmit?: (category: Category) => void }) {
  return (
    <Formik initialValues={{ name: '' }}
            validationSchema={categorySchema}
            onSubmit={(values, { setSubmitting }) => {
              axios.post<Category>('/api/categories', values)
                .then((response) => onSubmit?.(response.data))
                .finally(() => setSubmitting(false));
            }}>
      {({ errors, touched, isSubmitting }) =>
        <Form noValidate>
          <div>
            <label htmlFor='name'>Nazwa</label>
            <Field className={`form-control ${!errors.name || !touched.name || 'is-invalid'}`} name='name' id='name'/>
            <BootstrapError name='name'/>
          </div>
          <div className='text-center mt-3'>
            <button type='submit'
                    className='btn btn-orange'
                    disabled={disableSubmitButton(isSubmitting, errors)}>Zapisz
            </button>
          </div>
        </Form>
      }
    </Formik>
  )
}
