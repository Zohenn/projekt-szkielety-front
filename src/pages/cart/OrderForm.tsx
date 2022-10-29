import { Field, Form, Formik } from "formik";
import * as Yup from 'yup';
import BootstrapError from '../../BootstrapError';
import { useCartStore } from '../../store/cartStore';
import axios from 'axios';
import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import React from "react";
import { useNavigate } from 'react-router-dom';

interface OrderFormProps {
  paymentTypes: PaymentType[];
}

const initialFormValues = {
  name: '',
  surname: '',
  address: '',
  postal_code: '',
  city: '',
  phone: '',
  payment_type: '',
}

const orderSchema = Yup.object().shape({
  name: Yup.string().trim().required('Pole nie może być puste').min(3, 'Wartość musi być dłuższa niż 3 znaki'),
  surname: Yup.string().trim().required('Pole nie może być puste').min(3, 'Wartość musi być dłuższa niż 3 znaki'),
  address: Yup.string().trim().required('Pole nie może być puste'),
  postal_code: Yup.string()
    .trim()
    .required('Pole nie może być puste')
    .matches(/^[0-9]{2}-[0-9]{3}$/, 'Kod pocztowy musi być postaci 12-345'),
  city: Yup.string().trim().required('Pole nie może być puste'),
  phone: Yup.string()
    .trim()
    .required('Pole nie może być puste')
    .matches(/^[0-9]{9}$/, 'Numer telefonu musi się składać z 9 cyfr'),
  payment_type: Yup.string().required('Pole nie może być puste'),
})

export default function OrderForm({ paymentTypes }: OrderFormProps) {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  return (
    <>
      <div className='bg-light border rounded px-3 py-2 mb-3'>
        <Formik initialValues={{ ...initialFormValues }}
                validationSchema={orderSchema}
                validateOnMount
                onSubmit={(values, { setSubmitting }) => {
                  const { payment_type, ...rest } = values;
                  const _values = {
                    ...rest,
                    payment_type_id: Number(values.payment_type),
                    products: [...useCartStore.getState().items],
                    services: [...useCartStore.getState().services],
                  }
                  setError('');
                  axios.post('/api/orders', _values)
                    .then(() => {
                      navigate('/zamowienia');
                      useCartStore.getState().clear();
                    })
                    .catch((e) => setError(e.response.data.message))
                    .finally(() => setSubmitting(false))
                }}>
          {({ errors, touched, isSubmitting }) =>
            <Form noValidate>
              <div className='row mb-3'>
                <div className='col-12 col-sm-6 mb-3 mb-sm-0'>
                  <label className='form-label' htmlFor='name'>Imię</label>
                  <Field type='text'
                         className={`form-control form-control-sm ${!errors.name || !touched.name || 'is-invalid'}`}
                         name='name'
                         id='name'
                         required/>
                  <BootstrapError name='name'/>
                </div>
                <div className='col-12 col-sm-6'>
                  <label className='form-label' htmlFor='surname'>Nazwisko</label>
                  <Field type='text'
                         className={`form-control form-control-sm ${!errors.surname || !touched.surname || 'is-invalid'}`}
                         name='surname'
                         id='surname'
                         required/>
                  <BootstrapError name='surname'/>
                </div>
              </div>
              <div className='row mb-3'>
                <div className='col-12 col-md-5 mb-3 mb-md-0'>
                  <label className='form-label' htmlFor='address'>Adres</label>
                  <Field type='text'
                         className={`form-control form-control-sm ${!errors.address || !touched.address || 'is-invalid'}`}
                         name='address'
                         id='address'
                         required/>
                  <BootstrapError name='address'/>
                </div>
                <div className='col-12 col-sm-6 col-md-3 mb-3 mb-md-0'>
                  <label className='form-label' htmlFor='postal_code'>Kod pocztowy</label>
                  <Field type='text'
                         className={`form-control form-control-sm ${!errors.postal_code || !touched.postal_code || 'is-invalid'}`}
                         name='postal_code'
                         id='postal_code'
                         required/>
                  <BootstrapError name='postal_code'/>
                </div>
                <div className='col-12 col-sm-6 col-md-4'>
                  <label className='form-label' htmlFor='city'>Miasto</label>
                  <Field type='text'
                         className={`form-control form-control-sm ${!errors.city || !touched.city || 'is-invalid'}`}
                         name='city'
                         id='city'
                         required/>
                  <BootstrapError name='city'/>
                </div>
              </div>
              <div className='row mb-3'>
                <div className='col-12 col-sm-6 mb-3 mb-sm-0'>
                  <label className='form-label' htmlFor='phone'>Nr telefonu</label>
                  <Field type='text'
                         className={`form-control form-control-sm ${!errors.phone || !touched.phone || 'is-invalid'}`}
                         name='phone'
                         id='phone'
                         required/>
                  <BootstrapError name='phone'/>
                </div>
                <div className='col-12 col-sm-6'>
                  <label className='form-label'>Forma płatności</label>
                  <div>
                    {
                      paymentTypes.map((paymentType, index) =>
                        <React.Fragment key={paymentType.id}>
                          <Field className={`form-check-input me-2 ${index > 0 ? 'ms-4' : ''} ${!errors.payment_type || !touched.payment_type || 'is-invalid'}`}
                                 type='radio'
                                 name='payment_type'
                                 id={`payment-type-${paymentType.id}`}
                                 value={paymentType.id.toString()}
                          />
                          <label className='form-check-label'
                                 htmlFor={`payment-type-${paymentType.id}`}>{paymentType.name}</label>
                        </React.Fragment>
                      )
                    }
                    <BootstrapError name='payment_type'/>
                  </div>
                </div>
              </div>
              <div className='d-flex justify-content-center'>
                <button className='btn btn-orange'
                        type='submit'
                        disabled={isSubmitting || Object.values(errors).some((error) => !!error)}>
                  Zamów
                </button>
              </div>
            </Form>
          }
        </Formik>
      </div>
      {
        error ? <Alert variant='danger'>{error}</Alert> : null
      }
    </>
  )
}
