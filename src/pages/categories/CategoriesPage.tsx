import './CategoriesPage.scss';
import CategoryForm, { categorySchema } from './CategoryForm';
import { useEffect, useState } from 'react';
import axios from 'axios';
import PromiseHandler from '../../components/PromiseHandler';
import { Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ModalButton from '../../components/ModalButton';
import { Formik, Form, Field } from 'formik';
import BootstrapError from '../../BootstrapError';
import disableSubmitButton from '../../utils/disableSubmitButton';
import useToasts from '../../hooks/useToasts';
import Toasts from '../../components/Toasts';
import { Helmet } from 'react-helmet-async';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesPromise, setCategoriesPromise] = useState<Promise<void>>();
  const { toasts, addToast, removeToast } = useToasts();

  const fetchCategories = async () => {
    const response = await axios.get<Category[]>('/api/categories?with_exists=true');
    setCategories(response.data);
  }

  useEffect(() => {
    setCategoriesPromise(fetchCategories());
  }, []);

  return (
    <div className='row gy-3'>
      <Helmet>
        <title>Kategorie</title>
      </Helmet>
      <div className='col-12 col-sm-5 col-lg-3'>
        <h4 className='orange-underline'>Nowa kategoria</h4>
        <div className='card bg-light'>
          <div className='card-body'>
            <CategoryForm onSubmit={(category) => {
              addToast(`Dodano kategorię ${category.name}`);
              setCategories([...categories, category]);
            }} onError={(error) => addToast(`Błąd przy dodawaniu kategorii. ${error}`, 'danger')}/>
          </div>
        </div>
      </div>
      <div className='col-12 col-sm-7 col-lg-9'>
        <PromiseHandler promise={categoriesPromise} onDone={() =>
          <div className='table-responsive'>
            <table className='table text-nowrap' style={{ verticalAlign: 'middle' }}>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Nazwa</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) =>
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td style={{ width: '98%' }}>{category.name}</td>
                    <td className='text-nowrap'>
                      <ModalButton button={(onClick) =>
                        <button className='btn btn-icon edit-category' onClick={onClick}>
                          <span className='material-icons text-orange'>edit</span>
                        </button>
                      } modal={(show, hide) =>
                        <Modal onHide={hide} show={show} scrollable={true} centered={true}>
                          <div className='modal-content'>
                            <div className='modal-header'>
                              <h5 className='modal-title'>Edycja kategorii</h5>
                              <button type='button'
                                      className='btn-close'
                                      data-bs-dismiss='modal'
                                      aria-label='Close'
                                      onClick={hide}/>
                            </div>
                            <div className='modal-body'>
                              <Formik initialValues={{ name: category.name }}
                                      validationSchema={categorySchema}
                                      onSubmit={(values, { setSubmitting }) => {
                                        axios.patch<Category>(`/api/categories/${category.id}`, values)
                                          .then((response) => {
                                            const category = response.data;
                                            addToast('Zapisano zmiany w kategorii');
                                            setCategories(categories.map((_category) => {
                                              if (_category.id === category.id) {
                                                _category.name = category.name;
                                              }
                                              return _category;
                                            }));
                                            hide();
                                          })
                                          .catch((e) => addToast(`Błąd przy edycji kategorii. ${e.response.data.message}`))
                                          .finally(() => setSubmitting(false));
                                      }}>
                                {({ errors, touched, isSubmitting }) =>
                                  <Form noValidate>
                                    <div>
                                      <label htmlFor='name'>Nazwa</label>
                                      <Field className='form-control'
                                             name='name'
                                             id='name'/>
                                      <BootstrapError name='name'/>
                                    </div>
                                    <div className='text-end mt-3'>
                                      <button type='submit'
                                              className='btn btn-orange'
                                              disabled={disableSubmitButton(isSubmitting, errors)}>Zapisz
                                      </button>
                                    </div>
                                  </Form>
                                }
                              </Formik>
                            </div>
                          </div>
                        </Modal>
                      }/>
                      {category.products_exists ?
                        <OverlayTrigger placement='bottom' overlay={
                          <Tooltip>Kategoria musi być pusta, aby móc ją usunąć.</Tooltip>
                        }>
                          <span className='d-inline-block'>
                            <button className='btn btn-icon delete-category' disabled>
                              <span className='material-icons text-danger'>delete</span>
                            </button>
                          </span>
                        </OverlayTrigger> :
                        <ModalButton
                          button={(onClick) =>
                            <button className='btn btn-icon delete-category' onClick={onClick}>
                              <span className='material-icons text-danger'>delete</span>
                            </button>
                          } modal={(show, hide) =>
                          <Modal onHide={hide} show={show} scrollable={true} centered={true}>
                            <div className='modal-content'>
                              <div className='modal-header border-bottom-0'>
                                <h5 className='modal-title'>Usunąć kategorię?</h5>
                                <button className='btn-close' onClick={hide}/>
                              </div>
                              <div className='modal-body'>
                                <div id='category-delete-name'>{category.name}</div>
                                <div className='text-end mt-3'>
                                  <button className='btn btn-outline-orange me-1' onClick={hide}>Anuluj</button>
                                  <Formik initialValues={{}} onSubmit={(values, { setSubmitting }) => {
                                    axios.delete(`/api/categories/${category.id}`)
                                      .then(() => {
                                        setCategories(categories.filter((c) => c.id !== category.id));
                                        addToast(`Usunięto kategorię ${category.name}`);
                                      })
                                      .catch((e) => addToast(e.response.data.message, 'danger'))
                                      .finally(() => setSubmitting(false))
                                  }}>
                                    {({ isSubmitting }) =>
                                      <Form className='d-inline-block'>
                                        <button className='btn btn-danger'
                                                type='submit'
                                                disabled={isSubmitting}>Usuń
                                        </button>
                                      </Form>
                                    }
                                  </Formik>
                                </div>
                              </div>
                            </div>
                          </Modal>
                        }/>
                      }
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        }/>
      </div>
      <Toasts toasts={toasts} removeToast={removeToast}/>
    </div>
  )
}
