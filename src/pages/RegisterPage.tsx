import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import BootstrapError from '../BootstrapError';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Podaj nazwę użytkownika').max(255, 'Nazwa użytkownika jest za długa'),
  email: Yup.string()
    .required('Podaj adres email')
    .email('Nieprawidłowy adres email')
    .max(255, 'Adres email jest za długa'),
  password: Yup.string().required('Podaj hasło').min(8, 'Hasło musi mieć minimum 8 znaków'),
  password_confirmation: Yup.string().required('Powtórz hasło').oneOf([Yup.ref('password'), null], 'Hasła muszą się zgadzać')
})

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className='container'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card'>
            <div className='card-header'>Rejestracja</div>
            <div className='card-body'>
              <Formik initialValues={{ name: '', email: '', password: '', password_confirmation: '' }}
                      validationSchema={registerSchema}
                      validateOnMount
                      onSubmit={(values, { setSubmitting, setFieldError }) => {
                        axios.post('/api/register', values)
                          .then(() => navigate('/'))
                          .catch((e) => {
                            const { data } = e.response;
                            Object.entries<string[]>(data.errors).forEach(([field, errors]) => {
                              setFieldError(field, errors[0]);
                            })
                          })
                          .finally(() => setSubmitting(false))
                      }}>
                {({ errors, touched, isSubmitting }) =>
                  <Form noValidate>
                    <div className='mb-3'>
                      <label htmlFor='name'>Nazwa użytkownika</label>
                      <Field id='name'
                             type='text'
                             className={`form-control ${!errors.name || !touched.name || 'is-invalid'}`}
                             name='name'
                             required
                             autoComplete='name'
                             autoFocus/>
                      <BootstrapError name='name'/>
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='email'>Adres email</label>
                      <Field id='email'
                             type='email'
                             className={`form-control ${!errors.email || !touched.email || 'is-invalid'}`}
                             name='email'
                             required
                             autoComplete='email'/>
                      <BootstrapError name='email'/>
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='password'>Hasło</label>
                      <Field id='password'
                             type='password'
                             className={`form-control ${!errors.password || !touched.password || 'is-invalid'}`}
                             name='password'
                             required
                             autoComplete='new-password'/>
                      <BootstrapError name='password'/>
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='password-confirm'>Powtórz hasło</label>
                      <Field id='password-confirm'
                             type='password'
                             className={`form-control ${!errors.password_confirmation || !touched.password_confirmation || 'is-invalid'}`}
                             name='password_confirmation'
                             required
                             autoComplete='new-password'/>
                      <BootstrapError name='password_confirmation'/>
                    </div>
                    <div className='text-center'>
                      <button type='submit'
                              className='btn btn-orange'
                              disabled={isSubmitting || Object.values(errors).some((error) => !!error)}>
                        Zarejestruj się
                      </button>
                    </div>
                  </Form>
                }
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
