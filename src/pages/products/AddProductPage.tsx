import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import BootstrapError from '../../BootstrapError';
import useCategories from '../../hooks/useCategories';
import PromiseHandler from '../../components/PromiseHandler';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import './AddProuctPage.scss';
import disableSubmitButton from '../../utils/disableSubmitButton';
import axios from 'axios';
import useToasts from '../../hooks/useToasts';
import Toasts from '../../components/Toasts';

const productSchema = Yup.object().shape({
  name: Yup.string()
    .required('Pole jest wymagane')
    .min(3, 'Minimalna długość: 3 znaki')
    .max(100, 'Maksymalna długość: 100 znaków'),
  category_id: Yup.string().required('Pole jest wymagane'),
  price: Yup.number()
    .required('Pole jest wymagane')
    .moreThan(0, 'Cena musi być większa od 0')
    .lessThan(1000000, 'Cena musi być mniejsza od 1000000'),
  amount: Yup.number().moreThan(-1, 'Ilość musi być większa lub równa 0'),
  description: Yup.string().required('Pole jest wymagane'),
  image: Yup.string().required('Wybierz zdjęcie'),
})

export default function AddProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product>();
  const [productPromise, setProductPromise] = useState<Promise<void> | undefined>(!id ? Promise.resolve() : undefined);
  const [categories, categoriesPromise] = useCategories();
  const [image, setImage] = useState<File>();
  const [imagePreview, setImagePreview] = useState('');
  const { toasts, addToast, removeToast } = useToasts();

  const imageUrl = useMemo(() => {
    if (imagePreview) {
      return imagePreview;
    }
    return product ? `/storage/products/${product.image}` : '';
  }, [imagePreview, product]);

  const promises = useMemo(() => Promise.all([productPromise, categoriesPromise]), [productPromise, categoriesPromise]);

  const fetchProduct = async () => {
    const response = await axios.get<Product>(`/api/products/${id}`);
    setProduct(response.data);
  }

  useEffect(() => {
    if (id) {
      setProductPromise(fetchProduct());
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>{id ? 'Edycja produktu' : 'Nowy produkt'}</title>
      </Helmet>
      <h4 className='orange-underline'>{id ? 'Edycja produktu' : 'Nowy produkt'}</h4>
      <PromiseHandler promise={promises} onDone={() =>
        <Formik initialValues={{
          image: product?.image ?? '',
          name: product?.name ?? '',
          category_id: product?.category_id.toString() ?? '',
          price: product?.price ?? '',
          amount: product?.amount ?? 0,
          description: product?.description ?? ''
        }}
                validationSchema={productSchema}
                validateOnMount
                onSubmit={async ({ image: _, ...values }, { setSubmitting, resetForm }) => {
                  try {
                    const response = await (product ? axios.patch<Product>(`/api/products/${id}`, values) : axios.post<Product>('/api/products', values));
                    const { id: productId } = response.data;
                    if (image) {
                      const formData = new FormData();
                      formData.append('image', image);
                      await axios.post(`/api/products/${productId}/image`, formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data'
                        }
                      });
                    }
                    addToast(product ? 'Zaktualizowano produkt.' : 'Zapisano produkt do bazy.');
                  } catch (e: any) {
                    addToast(e.response.data.message, 'danger');
                  } finally {
                    setSubmitting(false);
                    if (!product) {
                      resetForm();
                      setImage(undefined);
                      setImagePreview('');
                    }
                  }
                }}>
          {({ errors, touched, isSubmitting, setFieldValue }) =>
            <Form noValidate>
              <div className='card overflow-hidden'>
                <div className='row g-0'>
                  <div className='col-md-4'>
                    <label className={`bg-light w-100 h-100 d-flex flex-column flex-center p-3 ${imageUrl ? 'has-image' : ''}`}
                           role='button'
                           htmlFor='image'>
                      <span className='d-inline-flex flex-center'>
                        <span className='material-icons me-1'>add</span>
                        <span>Dodaj zdjęcie</span>
                      </span>
                      <div className={`ratio ratio-1x1 ${!imageUrl ? 'd-none' : ''}`}>
                        <img id='image-preview'
                             src={imageUrl}
                             alt='Zdjęcie nowego produktu'
                             className='w-100 h-100'/>
                      </div>
                      <input id='image'
                             name='image'
                             className={`form-control visually-hidden ${!errors.image || !touched.image || 'is-invalid'}`}
                             type='file'
                             accept='image/*'
                             onChange={(event) => {
                               const file = event.target.files?.[0];
                               let src = '';
                               if (file) {
                                 src = URL.createObjectURL(file);
                                 setImage(file);
                                 setImagePreview(src);
                                 setFieldValue('image', src);
                               }
                             }}/>
                      <BootstrapError name='image' className='w-auto'/>
                    </label>
                  </div>
                  <div className='col-md-8'>
                    <div className='card-body px-4'>
                      <div className='row gy-4'>
                        <div>
                          <label htmlFor='name'>Nazwa</label>
                          <div>
                            <Field id='name'
                                   name='name'
                                   className={`form-control ${!errors.name || !touched.name || 'is-invalid'}`}/>
                            <BootstrapError name='name'/>
                          </div>
                        </div>
                        <div>
                          <label htmlFor='category_id'>Kategoria</label>
                          <div>
                            <Field as='select'
                                   id='category_id'
                                   name='category_id'
                                   className={`form-control ${!errors.category_id || !touched.category_id || 'is-invalid'}`}>
                              <option value={''} disabled hidden>Wybierz kategorię...</option>
                              {categories.map((category) =>
                                <option key={category.id} value={category.id.toString()}>{category.name}</option>
                              )}
                            </Field>
                            <BootstrapError name='category_id'/>
                          </div>
                        </div>
                        <div>
                          <label htmlFor='price'>Cena</label>
                          <div className='input-group'>
                            <Field id='price'
                                   name='price'
                                   type='number'
                                   className={`form-control ${!errors.price || !touched.price || 'is-invalid'}`}/>
                            <span className='input-group-text'>zł</span>
                            <BootstrapError name='price'/>
                          </div>
                        </div>
                        <div>
                          <label htmlFor='amount'>Ilość</label>
                          <div>
                            <Field id='amount'
                                   name='amount'
                                   type='number'
                                   className={`form-control ${!errors.amount || !touched.amount || 'is-invalid'}`}/>
                            <BootstrapError name='amount'/>
                          </div>
                        </div>
                        <div>
                          <label htmlFor='description'>Opis</label>
                          <div>
                            <Field as='textarea'
                                   id='description'
                                   name='description'
                                   rows={4}
                                   className={`form-control ${!errors.description || !touched.description || 'is-invalid'}`}/>
                            <BootstrapError name='description'/>
                          </div>
                        </div>
                        <div className='text-end'>
                          <button type='submit'
                                  className='btn btn-orange'
                                  disabled={disableSubmitButton(isSubmitting, errors)}>Zapisz
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          }
        </Formik>
      }/>
      <Toasts toasts={toasts} removeToast={removeToast}/>
    </>
  )
}
