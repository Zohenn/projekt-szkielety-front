import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import BootstrapError from '../BootstrapError';
import { useAuthStore } from '../store/authStore';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Nieprawidłowy adres email').required('Wartość nie może być pusta'),
  password: Yup.string().required('Wartość nie może być pusta')
})

export default function LoginPage(){
  const signIn = useAuthStore(state => state.signIn);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className='container'>
      <Helmet>
        <title>Logowanie</title>
      </Helmet>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card'>
            <div className='card-header'>Logowanie</div>
            <div className='card-body'>
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={(values, { setSubmitting }) => {
                  signIn(values.email, values.password)
                    .then(() => {
                      const ref = new URL(window.location.toString()).searchParams.get('ref');
                      navigate(ref ?? '/');
                    })
                    .finally(() => setSubmitting(false));
                }}>
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className='mb-3'>
                      <label htmlFor='email'>Adres email</label>
                      <Field type='email'
                             name='email'
                             id='email'
                             className={`form-control ${!errors.email || !touched.email || 'is-invalid'}`}
                             required
                             autoComplete='email'
                             autoFocus/>
                      <BootstrapError name='email'/>
                    </div>
                    <div className='mb-3'>
                      <label htmlFor='password'>Hasło</label>
                      <Field type='password'
                             name='password'
                             id='password'
                             className={`form-control ${!errors.password || !touched.password || 'is-invalid'}`}
                             required
                             autoComplete='current-password'/>
                      <BootstrapError name='password'/>
                    </div>
                    <div className='text-center'>
                      <button type='submit'
                              className='btn btn-orange'
                              disabled={isSubmitting || Object.values(errors).some((error) => !!error)}>
                        Zaloguj się
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
